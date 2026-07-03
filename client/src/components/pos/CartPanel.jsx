import { useEffect, useMemo, useState } from 'react';
import { Tag, Trash2, CreditCard, Banknote, Receipt } from 'lucide-react';
import { cn, formatCurrency, getTableLabel } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import CartItem from './CartItem';
import { searchCustomers } from '@/api/customers';
import { getVouchers } from '@/api/vouchers';
import { createOrder } from '@/api/orders';
import { emit, Events } from '@/lib/eventBus';
import { toast } from 'sonner';

function normalizeVoucherResponse(data) {
  return (data?.vouchers || data || []).filter(v => v.active && !isVoucherExpired(v) && (v.quantity || 0) > 0);
}

function isVoucherExpired(voucher) {
  return !!voucher?.expiry_date && new Date(voucher.expiry_date) < new Date();
}

function getVoucherDiscount(voucher, subtotal) {
  if (!voucher) return 0;
  if (voucher.type === 'percent') return Math.min(subtotal, Math.round(subtotal * voucher.value / 100));
  return Math.min(subtotal, Math.round(voucher.value || 0));
}

function getVoucherConditionMessage(voucher) {
  if (!voucher) return '';
  return voucher.min_order > 0
    ? `Áp dụng cho đơn từ ${formatCurrency(voucher.min_order)}`
    : 'Không yêu cầu điều kiện giá trị đơn';
}

const paymentMethods = [
  { id: 'cash', label: 'Tiền mặt', icon: Banknote },
  { id: 'transfer', label: 'Chuyển khoản', icon: Banknote },
  { id: 'card', label: 'Thẻ', icon: CreditCard },
];

export default function CartPanel({ cart, onUpdateItem, onRemoveItem, onClearCart, tableId, selectedTable, onOrderComplete }) {
  const [customerSearch, setCustomerSearch] = useState('');
  const [customer, setCustomer] = useState(null);
  const [customerResults, setCustomerResults] = useState([]);
  const [voucherInput, setVoucherInput] = useState('');
  const [voucher, setVoucher] = useState(null);
  const [voucherResults, setVoucherResults] = useState([]);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [payMethod, setPayMethod] = useState('cash');
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const voucherEligible = voucher ? subtotal >= (voucher.min_order || 0) : false;
  const discount = voucher && voucherEligible
    ? getVoucherDiscount(voucher, subtotal)
    : 0;
  const tax = Math.round((subtotal - discount) * 0.1);
  const total = subtotal - discount + tax;

  useEffect(() => {
    getVouchers()
      .then((data) => {
        setAvailableVouchers(normalizeVoucherResponse(data));
      })
      .catch(() => setAvailableVouchers([]));
  }, []);

  const suggestedVouchers = useMemo(() => {
    return availableVouchers
      .filter(v => !voucherInput || v.code.includes(voucherInput.trim().toUpperCase()))
      .sort((a, b) => {
        const aEligible = subtotal >= (a.min_order || 0);
        const bEligible = subtotal >= (b.min_order || 0);
        if (aEligible !== bEligible) return aEligible ? -1 : 1;
        return getVoucherDiscount(b, subtotal) - getVoucherDiscount(a, subtotal);
      })
      .slice(0, 20);
  }, [availableVouchers, subtotal, voucherInput]);

  const searchCustomer = async (q) => {
    setCustomerSearch(q);
    if (q.length < 2) { setCustomerResults([]); return; }
    try {
      const data = await searchCustomers(q);
      setCustomerResults(data.customers || []);
    } catch { setCustomerResults([]); }
  };

  const searchVoucher = async () => {
    if (!voucherInput.trim()) return;
    try {
      const normalizedCode = voucherInput.trim().toUpperCase();
      const vouchers = availableVouchers.length > 0
        ? availableVouchers
        : normalizeVoucherResponse(await getVouchers());
      const found = vouchers.find(v => v.code === normalizedCode);
      if (!found) {
        setVoucherResults([]);
        toast.error('Mã phiếu giảm giá không hợp lệ hoặc đã hết hạn');
        return;
      }
      if ((found.min_order || 0) > subtotal) {
        setVoucher(null);
        setVoucherResults([found]);
        toast.error(`Mã này yêu cầu đơn từ ${formatCurrency(found.min_order)}`);
        return;
      }
      setVoucher(found);
      setVoucherResults([found]);
      setVoucherInput(found.code);
      toast.success('Đã áp dụng phiếu giảm giá');
    } catch {
      toast.error('Lỗi khi áp dụng phiếu giảm giá');
    }
  };

  const handleSelectVoucher = (selectedVoucher) => {
    setVoucherInput(selectedVoucher.code);
    setVoucherResults([selectedVoucher]);
    if ((selectedVoucher.min_order || 0) > subtotal) {
      setVoucher(null);
      toast.error(`Mã này yêu cầu đơn từ ${formatCurrency(selectedVoucher.min_order)}`);
      return;
    }
    setVoucher(selectedVoucher);
    toast.success(`Đã chọn mã ${selectedVoucher.code}`);
  };

  const handlePay = async () => {
    if (voucher && !voucherEligible) {
      toast.error(`Đơn hàng chưa đủ điều kiện để dùng mã ${voucher.code}`);
      return;
    }
    setLoading(true);
    try {
      const result = await createOrder({
        ...(tableId ? { table_id: Number(tableId) } : {}),
        ...(customer?.id ? { customer_id: Number(customer.id) } : {}),
        items: cart.map(item => ({
          product_id: Number(item.id),
          quantity: Number(item.quantity),
        })),
        payment_method: payMethod === 'card' ? 'cash' : payMethod,
        ...(note.trim() ? { note: note.trim() } : {}),
        ...(voucher?.id ? { voucher_id: Number(voucher.id) } : {}),
      });
      setShowPayment(false);
      toast.success('Thanh toán thành công!');
      if (customer?.id && result?.loyalty) {
        const { earnedPoints = 0, tier, previousTier } = result.loyalty;
        if (earnedPoints > 0) {
          toast.success(`+${earnedPoints} điểm cho ${customer.name}`);
        }
        if (previousTier && tier && previousTier !== tier) {
          toast.success(`${customer.name} đã thăng hạng lên ${tier}!`);
        }
      }
      emit(Events.PAYMENT_COMPLETED, {
        order_id: result?.order_id,
        customer_id: customer?.id || null,
        loyalty: result?.loyalty || null,
      });
      onOrderComplete();
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <h3 className="font-semibold">Đơn hàng</h3>
        <p className="text-xs text-muted-foreground">{cart.length} món</p>
        {selectedTable && (
          <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2">
            <p className="text-xs text-muted-foreground">Bàn phục vụ</p>
            <p className="text-sm font-medium text-primary">{getTableLabel(selectedTable)}</p>
          </div>
        )}
      </div>

      {/* Customer search */}
      <div className="p-4 border-b border-border shrink-0 space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Tìm khách hàng..."
            value={customerSearch}
            onChange={e => searchCustomer(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
        {customerResults.length > 0 && (
          <div className="rounded-2xl border border-border overflow-hidden text-sm">
            {customerResults.map(c => (
              <button
                key={c.id}
                onClick={() => { setCustomer(c); setCustomerSearch(c.name); setCustomerResults([]); }}
                className="w-full text-left px-3 py-2 hover:bg-accent transition-colors border-b border-border/50 last:border-0"
              >
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.phone} - {c.points} điểm</p>
              </button>
            ))}
          </div>
        )}
        {customer && (
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-primary/10 border border-primary/20">
            <div>
              <p className="text-sm font-medium">{customer.name}</p>
              <p className="text-xs text-muted-foreground">{customer.tier} - {customer.points} điểm</p>
            </div>
            <button onClick={() => setCustomer(null)} className="text-muted-foreground hover:text-foreground">
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <Receipt size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Chưa có món nào</p>
            <p className="text-xs text-muted-foreground">Nhấn vào món để thêm vào đơn</p>
          </div>
        ) : (
          cart.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdate={onUpdateItem}
              onRemove={onRemoveItem}
            />
          ))
        )}
      </div>

      {/* Payment method quick select */}
      <div className="px-4 pb-3 shrink-0">
        <p className="text-xs font-medium text-muted-foreground mb-2">Phương thức thanh toán</p>
        <div className="grid grid-cols-3 gap-2">
          {paymentMethods.map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setPayMethod(m.id)}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border transition-all text-xs',
                  payMethod === m.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon size={16} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Voucher */}
      <div className="px-4 pb-2 shrink-0">
        <div className="flex gap-2">
          <Input
            placeholder="Mã phiếu giảm giá..."
            value={voucherInput}
            onChange={e => setVoucherInput(e.target.value.toUpperCase())}
            className="h-9 text-sm"
          />
          <Button size="sm" variant="outline" onClick={searchVoucher} className="h-9 shrink-0">
            Áp dụng
          </Button>
        </div>
        {suggestedVouchers.length > 0 && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-medium text-muted-foreground">Mã giảm giá hiện có</p>
              <p className="text-[11px] text-muted-foreground">{suggestedVouchers.length} mã</p>
            </div>
            <div className="max-h-44 overflow-y-auto rounded-2xl border border-border/60 p-2">
              <div className="flex flex-wrap gap-2">
                {suggestedVouchers.map(v => {
                  const eligible = subtotal >= (v.min_order || 0);
                  const active = voucher?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleSelectVoucher(v)}
                      className={cn(
                        'rounded-2xl border px-3 py-2 text-left transition-all min-w-[140px]',
                        active ? 'border-primary bg-primary/10' : eligible ? 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40' : 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40'
                      )}
                    >
                      <p className="text-xs font-semibold">{v.code}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        -{v.type === 'percent' ? `${v.value}%` : formatCurrency(v.value)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">{getVoucherConditionMessage(v)}</p>
                      <p className={cn('text-[10px] mt-1', eligible ? 'text-emerald-400' : 'text-amber-400')}>
                        {eligible ? 'Bấm để áp dụng' : `Đơn từ ${formatCurrency(v.min_order || 0)}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {suggestedVouchers.length === 0 && availableVouchers.length === 0 && (
          <div className="mt-2 rounded-2xl border border-dashed border-border px-3 py-2 text-[11px] text-muted-foreground">
            Hiện chưa có mã giảm giá nào đang hoạt động.
          </div>
        )}
        {voucher && (
          <div className="mt-2 p-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">
                  {voucher.code} · -{voucher.type === 'percent' ? `${voucher.value}%` : formatCurrency(voucher.value)}
                </span>
              </div>
              <button onClick={() => { setVoucher(null); setVoucherInput(''); setVoucherResults([]); }} className="text-muted-foreground hover:text-foreground">
                <Trash2 size={12} />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">{getVoucherConditionMessage(voucher)}</p>
            {!voucherEligible && (
              <p className="text-[11px] text-amber-400">
                Cần thêm {formatCurrency(Math.max(0, (voucher.min_order || 0) - subtotal))} để dùng mã này.
              </p>
            )}
          </div>
        )}
        {!voucher && voucherResults[0] && (
          <div className="mt-2 p-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 space-y-1">
            <div className="text-xs font-medium text-amber-400">Mã {voucherResults[0].code} chưa đủ điều kiện</div>
            <div className="text-[11px] text-muted-foreground">{getVoucherConditionMessage(voucherResults[0])}</div>
            <div className="text-[11px] text-amber-400">
              Cần đơn tối thiểu {formatCurrency(voucherResults[0].min_order || 0)}.
            </div>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="px-4 pb-2 space-y-1.5 shrink-0">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tổng phụ</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-400">
            <span>Giảm giá{voucher ? ` · ${voucher.code}` : ''}</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">VAT (10%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
          <span>Cần thanh toán</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Pay button */}
      <div className="p-4 border-t border-border shrink-0">
        <Button
          className="w-full h-12 text-base"
          disabled={cart.length === 0}
          onClick={() => setShowPayment(true)}
        >
          Thanh toán
        </Button>
        {cart.length > 0 && (
          <Button variant="ghost" className="w-full mt-2 text-sm" onClick={onClearCart}>
            Xóa đơn
          </Button>
        )}
      </div>

      {/* Payment Modal */}
      <Modal open={showPayment} onClose={() => setShowPayment(false)} title="Thanh toán" size="sm">
        <div className="p-6 space-y-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Số tiền cần thanh toán</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(total)}</p>
            {voucher && (
              <p className="text-xs text-emerald-400 mt-2">
                Đã áp dụng mã {voucher.code} · {getVoucherConditionMessage(voucher)}
              </p>
            )}
            {selectedTable && (
              <p className="text-xs text-muted-foreground mt-2">Cho bàn {selectedTable.table_number || selectedTable.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Phương thức</label>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map(m => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all text-sm',
                      payMethod === m.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Icon size={18} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ghi chú</label>
            <Input
              placeholder="Ghi chú đơn hàng..."
              value={note}
              onChange={e => setNote(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowPayment(false)}>Hủy</Button>
            <Button onClick={handlePay} loading={loading}>
              Xác nhận thanh toán
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
