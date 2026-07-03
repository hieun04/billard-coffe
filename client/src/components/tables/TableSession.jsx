import { useState, useEffect, useRef, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { getStatusColor, formatCurrency, formatDuration, cn, getTierColor, resolveImageUrl, getTableLabel } from '@/lib/utils';
import QuantityInput from '@/components/ui/QuantityInput';
import { startSession, endSession, reserveTable, cancelReserve, lookupCustomer, addDrinksToTable, getPaymentPreview, assignCustomer, checkInFromTable } from '@/api/tables';
import { createCustomer } from '@/api/customers';
import { getProducts, getCategories } from '@/api/products';
import { getEligibleVouchers } from '@/api/vouchers';
import { emit, Events } from '@/lib/eventBus';
import { toast } from 'sonner';
import { Clock, User, Coffee, AlertCircle, Plus, Minus, ShoppingCart, X, Tag, Percent, Ticket, CalendarCheck } from 'lucide-react';

const statusLabels = {
  empty: 'Trống', available: 'Trống', occupied: 'Đang chơi',
  playing: 'Đang chơi', reserved: 'Đặt trước', maintenance: 'Bảo trì',
};

const BOOKING_STATUS_LABELS = {
  held: 'Giữ chỗ',
  checked_in: 'Đã check-in',
};

const FILTER_OPTIONS = ['Đồ uống', 'Đồ ăn nhẹ', 'Khác'];

function normalizeCategoryLabel(name = '') {
  const normalized = String(name).trim().toLowerCase();
  if (['bia', 'nuoc uong', 'nước uống', 'tra', 'trà', 'ca phe', 'cà phê', 'coffee', 'drink', 'drinks', 'đồ uống'].includes(normalized)) {
    return 'Đồ uống';
  }
  if (['do an', 'đồ ăn', 'snack', 'thuc an nhe', 'thức ăn nhẹ', 'food', 'đồ ăn nhẹ'].includes(normalized)) {
    return 'Đồ ăn nhẹ';
  }
  if (['khac', 'khác', 'other'].includes(normalized)) {
    return 'Khác';
  }
  return 'Khác';
}

export default function TableSession({ table, open, onClose, onRefresh }) {
  const [step, setStep] = useState('view'); // view | start | reserve | end
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState('');
  const timerRef = useRef(null);

  // Add drink state
  const [showAddDrink, setShowAddDrink] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [orderingCart, setOrderingCart] = useState({}); // { [productId]: quantity }
  const [orderingLoading, setOrderingLoading] = useState(false);

  // Payment preview state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [eligibleVouchers, setEligibleVouchers] = useState([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [voucherInput, setVoucherInput] = useState('');
  const [skipVoucher, setSkipVoucher] = useState(false);

  // New customer form state (reset when step changes)
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [creatingCustomer, setCreatingCustomer] = useState(false);

  const isPlaying = table?.status === 'occupied' || table?.status === 'playing';
  const isReserved = table?.status === 'reserved';
  const isHeld = table?.booking_status === 'held';
  const isCheckedIn = table?.booking_status === 'checked_in';

  // Can start: only for completely empty/available tables (no booking hold)
  const canStart = (table?.status === 'empty' || table?.status === 'available') && !isHeld && !isCheckedIn;
  const canReserve = canStart;

  // Reset form when step changes
  useEffect(() => {
    setShowNewCustomer(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setSelectedCustomer(null);
    setCustomerSearch('');
    setCustomerResults([]);
  }, [step]);

  // Timer
  useEffect(() => {
    if (isPlaying && table?.current_session_start) {
      const update = () => {
        const s = formatDuration(table.current_session_start);
        setElapsed(s);
      };
      update();
      timerRef.current = setInterval(update, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [isPlaying, table?.current_session_start]);

  const searchCustomer = async (q) => {
    setCustomerSearch(q);
    if (q.length < 2) { setCustomerResults([]); return; }
    setSearchLoading(true);
    try {
      const data = await lookupCustomer(q);
      setCustomerResults(data.customers || []);
    } catch { setCustomerResults([]); }
    finally { setSearchLoading(false); }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      let customerId = selectedCustomer?.id;
      if (showNewCustomer && newCustomerName.trim() && newCustomerPhone.trim()) {
        const res = await createCustomer({ name: newCustomerName.trim(), phone: newCustomerPhone.trim() });
        customerId = res?.customer_id;
        toast.success('Đã tạo khách hàng mới!');
      }
      await startSession(table.id, { customer_id: customerId || null });
      onRefresh();
      onClose();
      toast.success(customerId ? `Bắt đầu tính giờ - ${selectedCustomer.name}!` : 'Bắt đầu tính giờ (khách lẻ)!');
    } catch (e) { toast.error(e.message || 'Không thể bắt đầu phiên'); }
    finally { setLoading(false); }
  };

  const handleReserve = async () => {
    setLoading(true);
    try {
      let customerId = selectedCustomer?.id;
      if (showNewCustomer && newCustomerName.trim() && newCustomerPhone.trim()) {
        const res = await createCustomer({ name: newCustomerName.trim(), phone: newCustomerPhone.trim() });
        customerId = res?.customer_id;
        toast.success('Đã tạo khách hàng mới!');
      }
      if (!customerId) return;
      await reserveTable(table.id, { customer_id: customerId });
      onRefresh();
      onClose();
      toast.success('Đặt trước thành công!');
    } catch (e) { toast.error(e.message || 'Không thể đặt trước'); }
    finally { setLoading(false); }
  };

  const handleEnd = async () => {
    setSelectedVoucher(null);
    setSkipVoucher(false);
    setVoucherInput('');
    setEligibleVouchers([]);
    setLoadingPayment(true);
    try {
      const data = await getPaymentPreview(table.id);
      setPaymentData(data);
      setLoadingVouchers(true);
      try {
        const eligible = await getEligibleVouchers({
          subtotal: data.subtotal,
          customer_id: data.customer?.id || null,
        });
        const list = eligible?.data?.vouchers || eligible?.vouchers || [];
        setEligibleVouchers(list);
        if (data.customer) {
          const tierMatch = list.find(v => v.tier === data.customer.tier && v.applicable_to_tier);
          if (tierMatch) setSelectedVoucher(tierMatch);
        }
      } catch (e) {
        console.error('Load vouchers failed:', e);
      } finally {
        setLoadingVouchers(false);
      }
      setShowPaymentModal(true);
    } catch (e) {
      console.error('Payment preview error:', e);
      toast.error(e.message || 'Không thể tải chi tiết thanh toán');
    } finally { setLoadingPayment(false); }
  };

  const handleConfirmPayment = async () => {
    setLoadingPayment(true);
    try {
      const result = await endSession(table.id, { voucher_id: selectedVoucher?.id || null });
      setShowPaymentModal(false);
      onRefresh();
      onClose();
      const parts = [`Kết thúc phiên!`];
      if (result.discount > 0) parts.push(`Giảm ${formatCurrency(result.discount)}`);
      parts.push(`Tổng: ${formatCurrency(result.total || 0)}`);
      toast.success(parts.join(' — '));
      emit(Events.PAYMENT_COMPLETED, {
        tableId: table.id,
        customerId: paymentData?.customer?.id,
        total: result.total,
        discount: result.discount,
        voucherId: selectedVoucher?.id || null,
      });
    } catch (e) {
      console.error('Payment confirmation error:', e);
      toast.error(e.message || 'Không thể kết thúc phiên');
    } finally { setLoadingPayment(false); }
  };

  const computeDiscountPreview = () => {
    if (!paymentData) return 0;
    const subtotal = paymentData.subtotal ?? ((paymentData.billiardTotal || 0) + (paymentData.drinksTotal || 0));
    if (!selectedVoucher) return 0;
    if (selectedVoucher.type === 'percent') {
      return Math.min(subtotal, Math.round(subtotal * (selectedVoucher.value || 0) / 100));
    }
    return Math.min(subtotal, selectedVoucher.value || 0);
  };

  const handleCancelReserve = async () => {
    setLoading(true);
    try {
      await cancelReserve(table.id);
      onRefresh();
      onClose();
      toast.success('Đã hủy đặt trước');
    } catch (e) { toast.error(e.message || 'Không thể hủy đặt'); }
    finally { setLoading(false); }
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods.products || prods || []);
      setCategories(cats.categories || cats || []);
    } catch { toast.error('Không thể tải sản phẩm'); }
    finally { setLoadingProducts(false); }
  };

  const handleAddDrinkClick = () => {
    setShowAddDrink(true);
    setOrderingCart({});
    loadProducts();
  };

  const handleAddDrink = (product) => {
    setOrderingCart(prev => {
      const current = prev[product.id] || 0;
      return { ...prev, [product.id]: current + 1 };
    });
  };

  // Set trực tiếp số lượng từ input (khi gõ số)
  const handleSetDrinkQty = (productId, qty) => {
    setOrderingCart(prev => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[productId];
      } else {
        next[productId] = qty;
      }
      return next;
    });
  };

  const handleRemoveDrink = (productId) => {
    setOrderingCart(prev => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: current - 1 };
    });
  };

  const handleRemoveFromCart = (productId) => {
    setOrderingCart(prev => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const cartProductList = useMemo(() => {
    return Object.entries(orderingCart)
      .filter(([, qty]) => qty > 0)
      .map(([productId, quantity]) => {
        const product = products.find(p => String(p.id) === String(productId));
        return { productId: Number(productId), quantity, product };
      })
      .filter(item => item.product);
  }, [orderingCart, products]);

  const cartTotal = useMemo(() => {
    return cartProductList.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);
  }, [cartProductList]);

  const handlePlaceOrder = async () => {
    if (cartProductList.length === 0) return;
    setOrderingLoading(true);
    try {
      const items = cartProductList.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
      }));
      await addDrinksToTable(table.id, items);
      toast.success(`Đã thêm ${cartProductList.length} món vào hóa đơn!`);
      setOrderingCart({});
      setShowAddDrink(false);
      onRefresh();
    } catch (e) {
      toast.error(e.message || 'Không thể thêm món');
    } finally {
      setOrderingLoading(false);
    }
  };

  const handleCloseAddDrink = () => {
    setShowAddDrink(false);
    setOrderingCart({});
  };

  const getCategoryName = (id) => categories.find(c => c.id == id)?.name || 'Khác';
  const categoryOptions = FILTER_OPTIONS;

  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === 'all' || normalizeCategoryLabel(getCategoryName(p.category_id)) === activeCategory;
    const matchSearch = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Modal open={open} onClose={onClose} title={getTableLabel(table) || 'Chi tiết bàn'} size="md">
      <div className="p-6 space-y-5">
        {/* Status */}
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(isHeld ? 'held' : isCheckedIn ? 'checked_in' : table?.status)}>
            {BOOKING_STATUS_LABELS[isHeld ? 'held' : isCheckedIn ? 'checked_in' : table?.status] || statusLabels[table?.status] || table?.status}
          </Badge>
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{formatCurrency(table?.rate_per_hour || 0)}</span>/giờ
          </div>
        </div>

        {/* Actions based on status */}
        {canStart && step === 'view' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Chọn hành động:</p>
            <Button
              onClick={() => setStep('start')}
              className="w-full h-14 text-base"
            >
              <Clock size={18} /> Bắt đầu chơi
            </Button>
            <Button
              variant="outline"
              onClick={() => setStep('reserve')}
              className="w-full h-14 text-base"
            >
              <User size={18} /> Đặt trước
            </Button>
          </div>
        )}

        {/* Start Session */}
        {canStart && step === 'start' && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setStep('view')} className="text-sm">← Quay lại</Button>

            {!showNewCustomer ? (
              <>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Tìm khách hàng</label>
                  <Input
                    placeholder="Nhập tên hoặc số điện thoại..."
                    value={customerSearch}
                    onChange={(e) => searchCustomer(e.target.value)}
                  />
                  {searchLoading && <p className="text-xs text-muted-foreground mt-1">Đang tìm...</p>}
                  {customerResults.length > 0 && (
                    <div className="mt-2 rounded-2xl border border-border overflow-hidden max-h-40 overflow-y-auto">
                      {customerResults.map(c => (
                        <button
                          key={c.id}
                          onClick={() => { setSelectedCustomer(c); setCustomerSearch(c.name); setCustomerResults([]); }}
                          className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent transition-colors border-b border-border/50 last:border-0"
                        >
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.phone}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedCustomer && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                    <User size={16} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium">{selectedCustomer.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedCustomer.phone} - {selectedCustomer.points} điểm</p>
                    </div>
                    <button
                      onClick={() => { setSelectedCustomer(null); setCustomerSearch(''); }}
                      className="ml-auto text-xs text-muted-foreground hover:text-red-400"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                )}

                {customerSearch.length >= 2 && customerResults.length === 0 && !selectedCustomer && !showNewCustomer && (
                  <p className="text-xs text-muted-foreground text-center">Không tìm thấy. Bạn có thể tạo khách hàng mới bên dưới.</p>
                )}

                <button
                  onClick={() => { setShowNewCustomer(true); setCustomerSearch(''); setCustomerResults([]); setSelectedCustomer(null); }}
                  className="w-full text-sm text-primary hover:underline text-center py-1"
                >
                  + Tạo khách hàng mới
                </button>
              </>
            ) : (
              <div className="space-y-3 p-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Thông tin khách hàng mới</p>
                  <button
                    onClick={() => { setShowNewCustomer(false); setNewCustomerName(''); setNewCustomerPhone(''); }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    ← Quay lại tìm kiếm
                  </button>
                </div>
                <Input
                  placeholder="Tên khách hàng *"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                />
                <Input
                  placeholder="Số điện thoại *"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                />
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleStart}
              loading={loading}
              disabled={showNewCustomer && (!newCustomerName.trim() || !newCustomerPhone.trim())}
            >
              Bắt đầu chơi {selectedCustomer ? `(${selectedCustomer.name})` : '(Khách lẻ)'}
            </Button>
          </div>
        )}

        {/* Reserve */}
        {canStart && step === 'reserve' && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setStep('view')} className="text-sm">← Quay lại</Button>

            {!showNewCustomer ? (
              <>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Tìm khách hàng</label>
                  <Input
                    placeholder="Nhập tên hoặc số điện thoại..."
                    value={customerSearch}
                    onChange={(e) => searchCustomer(e.target.value)}
                  />
                  {customerResults.length > 0 && (
                    <div className="mt-2 rounded-2xl border border-border overflow-hidden max-h-40 overflow-y-auto">
                      {customerResults.map(c => (
                        <button
                          key={c.id}
                          onClick={() => { setSelectedCustomer(c); setCustomerSearch(c.name); setCustomerResults([]); }}
                          className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent transition-colors border-b border-border/50 last:border-0"
                        >
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.phone}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedCustomer && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                    <User size={16} className="text-blue-400" />
                    <div>
                      <p className="text-sm font-medium">{selectedCustomer.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedCustomer.phone}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedCustomer(null); setCustomerSearch(''); }}
                      className="ml-auto text-xs text-muted-foreground hover:text-red-400"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                )}

                {customerSearch.length >= 2 && customerResults.length === 0 && !selectedCustomer && !showNewCustomer && (
                  <p className="text-xs text-muted-foreground text-center">Không tìm thấy. Bạn có thể tạo khách hàng mới bên dưới.</p>
                )}

                <button
                  onClick={() => { setShowNewCustomer(true); setCustomerSearch(''); setCustomerResults([]); setSelectedCustomer(null); }}
                  className="w-full text-sm text-primary hover:underline text-center py-1"
                >
                  + Tạo khách hàng mới
                </button>
              </>
            ) : (
              <div className="space-y-3 p-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Thông tin khách hàng mới</p>
                  <button
                    onClick={() => { setShowNewCustomer(false); setNewCustomerName(''); setNewCustomerPhone(''); }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    ← Quay lại tìm kiếm
                  </button>
                </div>
                <Input
                  placeholder="Tên khách hàng *"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                />
                <Input
                  placeholder="Số điện thoại *"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                />
              </div>
            )}

            <Button
              className="w-full"
              variant="outline"
              onClick={handleReserve}
              loading={loading}
              disabled={showNewCustomer && (!newCustomerName.trim() || !newCustomerPhone.trim())}
            >
              Xác nhận đặt trước {selectedCustomer ? `(${selectedCustomer.name})` : ''}
            </Button>
          </div>
        )}

        {/* Playing View */}
        {isPlaying && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                <Clock size={20} className="text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-orange-400 font-medium">Đang chơi</p>
                <p className="text-2xl font-bold font-mono text-orange-300">{elapsed}</p>
              </div>
            </div>

            {/* Customer Info */}
            {table.customer_name ? (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                <User size={16} className="text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{table.current_customer_name}</p>
                  {table.current_customer_phone && <p className="text-xs text-muted-foreground">{table.current_customer_phone}</p>}
                  {table.current_customer_tier && <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full ml-1">{table.current_customer_tier}</span>}
                </div>
                <button
                  onClick={() => setStep('assignCustomer')}
                  className="text-xs text-primary hover:underline shrink-0"
                >
                  Đổi KH
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-2xl border border-dashed border-primary/30">
                <User size={16} className="text-muted-foreground shrink-0" />
                <p className="text-sm text-muted-foreground flex-1">Chưa có thông tin khách hàng</p>
                <button
                  onClick={() => setStep('assignCustomer')}
                  className="text-xs text-primary hover:underline shrink-0 font-medium"
                >
                  + Thêm KH
                </button>
              </div>
            )}

            {table.drinks_total > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                <Coffee size={16} className="text-muted-foreground" />
                <div className="flex justify-between w-full">
                  <span className="text-sm">Đồ uống</span>
                  <span className="text-sm font-semibold">{formatCurrency(table.drinks_total)}</span>
                </div>
              </div>
            )}

            <Button variant="outline" className="w-full" onClick={handleAddDrinkClick}>
              <Coffee size={16} /> Thêm đồ ăn / đồ uống
            </Button>

            <Button className="w-full" variant="success" onClick={handleEnd} loading={loading}>
              Kết thúc chơi - Thanh toán
            </Button>
          </div>
        )}

        {/* Held — waiting for booked customer to arrive */}
        {isHeld && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                <CalendarCheck size={20} className="text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-amber-400 font-medium">Giữ chỗ — chờ khách đặt</p>
                <p className="text-sm font-semibold text-amber-300">
                  {table?.current_customer_name || 'Khách đặt trước'}
                </p>
                {table?.current_customer_phone && (
                  <p className="text-xs text-amber-200/60">{table.current_customer_phone}</p>
                )}
                {table?.booking_start_time && (
                  <p className="text-xs text-amber-200/60 mt-0.5">
                    Giờ đặt: {new Date(table.booking_start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1"
                variant="success"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await checkInFromTable(table.id);
                    onRefresh();
                    onClose();
                    toast.success('Đã xác nhận khách đến!');
                  } catch (e) { toast.error(e.message || 'Không thể xác nhận'); }
                  finally { setLoading(false); }
                }}
                loading={loading}
              >
                <User size={16} /> Xác nhận đến — Bắt đầu
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              Khách đến → bấm xác nhận để bắt đầu tính giờ
            </p>
          </div>
        )}

        {/* Assign Customer during playing */}
        {isPlaying && step === 'assignCustomer' && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setStep('view')} className="text-sm">← Quay lại</Button>

            {!showNewCustomer ? (
              <>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Tìm khách hàng</label>
                  <Input
                    placeholder="Nhập tên hoặc số điện thoại..."
                    value={customerSearch}
                    onChange={(e) => searchCustomer(e.target.value)}
                  />
                  {searchLoading && <p className="text-xs text-muted-foreground mt-1">Đang tìm...</p>}
                  {customerResults.length > 0 && (
                    <div className="mt-2 rounded-2xl border border-border overflow-hidden max-h-40 overflow-y-auto">
                      {customerResults.map(c => (
                        <button
                          key={c.id}
                          onClick={() => { setSelectedCustomer(c); setCustomerSearch(c.name); setCustomerResults([]); }}
                          className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent transition-colors border-b border-border/50 last:border-0"
                        >
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.phone} · {c.points || 0} điểm · {c.tier}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedCustomer && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                    <User size={16} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium">{selectedCustomer.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedCustomer.phone} · {selectedCustomer.points || 0} điểm · {selectedCustomer.tier}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedCustomer(null); setCustomerSearch(''); }}
                      className="ml-auto text-xs text-muted-foreground hover:text-red-400"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                )}

                {customerSearch.length >= 2 && customerResults.length === 0 && !selectedCustomer && !showNewCustomer && (
                  <p className="text-xs text-muted-foreground text-center">Không tìm thấy. Bạn có thể tạo khách hàng mới bên dưới.</p>
                )}

                <button
                  onClick={() => { setShowNewCustomer(true); setCustomerSearch(''); setCustomerResults([]); setSelectedCustomer(null); }}
                  className="w-full text-sm text-primary hover:underline text-center py-1"
                >
                  + Tạo khách hàng mới
                </button>
              </>
            ) : (
              <div className="space-y-3 p-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Thông tin khách hàng mới</p>
                  <button
                    onClick={() => { setShowNewCustomer(false); setNewCustomerName(''); setNewCustomerPhone(''); }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    ← Quay lại tìm kiếm
                  </button>
                </div>
                <Input
                  placeholder="Tên khách hàng *"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                />
                <Input
                  placeholder="Số điện thoại *"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-3">
              {selectedCustomer && (
                <Button
                  className="flex-1"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await assignCustomer(table.id, { customer_id: selectedCustomer.id });
                      toast.success(`Đã gắn ${selectedCustomer.name} vào phiên!`);
                      setStep('view');
                      onRefresh();
                    } catch (e) { toast.error(e.message); }
                    finally { setLoading(false); }
                  }}
                  loading={loading}
                >
                  Gắn {selectedCustomer.name}
                </Button>
              )}
              {showNewCustomer && newCustomerName.trim() && newCustomerPhone.trim() && (
                <Button
                  className="flex-1"
                  onClick={async () => {
                    setCreatingCustomer(true);
                    try {
                      const res = await createCustomer({ name: newCustomerName.trim(), phone: newCustomerPhone.trim() });
                      await assignCustomer(table.id, { customer_id: res?.customer_id });
                      toast.success('Đã tạo và gắn khách hàng mới!');
                      setStep('view');
                      setNewCustomerName('');
                      setNewCustomerPhone('');
                      setShowNewCustomer(false);
                      onRefresh();
                    } catch (e) { toast.error(e.message); }
                    finally { setCreatingCustomer(false); }
                  }}
                  loading={creatingCustomer}
                >
                  Tạo & gắn KH
                </Button>
              )}
            </div>

            {table.customer_name && (
              <Button
                variant="ghost"
                className="w-full text-xs text-muted-foreground"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await assignCustomer(table.id, { customer_id: null });
                    toast.success('Đã xóa thông tin khách hàng khỏi phiên!');
                    setStep('view');
                    onRefresh();
                  } catch (e) { toast.error(e.message); }
                  finally { setLoading(false); }
                }}
                loading={loading}
              >
                Xóa thông tin khách hàng
              </Button>
            )}
          </div>
        )}

        {/* Payment Detail Modal */}
        <Modal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Chi tiết thanh toán" size="md">
          <div className="p-6 space-y-4">
            {loadingPayment ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-12 rounded-2xl" />)}
              </div>
            ) : paymentData ? (
              <>
                {/* Customer info + Tier */}
                {paymentData.customer ? (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                    <User size={16} className="text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{paymentData.customer.name}</p>
                        <Badge className={cn('text-[10px] shrink-0', getTierColor(paymentData.customer.tier))}>
                          {paymentData.customer.tier}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{paymentData.customer.phone}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30">
                    <User size={16} className="text-muted-foreground shrink-0" />
                    <p className="text-sm text-muted-foreground">Khách lẻ</p>
                  </div>
                )}

                {/* Vouchers */}
                <div className="rounded-2xl border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ticket size={16} className="text-primary" />
                      <span className="text-sm font-medium">Mã giảm giá có thể áp dụng</span>
                    </div>
                    {paymentData.customer ? (
                      <Badge className="text-[10px]">
                        Hạng {paymentData.customer.tier}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">Khách lẻ</Badge>
                    )}
                  </div>

                  {loadingVouchers ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 rounded-xl" />
                      <Skeleton className="h-10 rounded-xl" />
                    </div>
                  ) : eligibleVouchers.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Hiện không có mã giảm giá nào khả dụng.</p>
                  ) : (
                    <div className="space-y-2 max-h-44 overflow-y-auto">
                      {eligibleVouchers.map(v => {
                        const discount = v.discount ?? (v.type === 'percent'
                          ? Math.min(paymentData.subtotal || 0, Math.round((paymentData.subtotal || 0) * (v.value || 0) / 100))
                          : Math.min(paymentData.subtotal || 0, v.value || 0));
                        const isSelected = selectedVoucher?.id === v.id;
                        const isDisabled = v.tier && paymentData.customer && !v.applicable_to_tier;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => {
                              if (isDisabled) return;
                              setSelectedVoucher(isSelected ? null : v);
                              if (isSelected) setSkipVoucher(false);
                            }}
                            disabled={!!isDisabled}
                            className={cn(
                              'w-full flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-colors',
                              isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40 hover:bg-muted/30',
                              isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{v.code}</span>
                                {v.tier && <Badge className="text-[9px]">{v.tier}</Badge>}
                                {!v.tier && <Badge variant="outline" className="text-[9px]">Chung</Badge>}
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {v.type === 'percent' ? `Giảm ${v.value}%` : `Giảm ${formatCurrency(v.value)}`}
                                {v.min_order > 0 && ` · Đơn tối thiểu ${formatCurrency(v.min_order)}`}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-bold text-emerald-400">-{formatCurrency(discount)}</p>
                              <p className="text-[10px] text-muted-foreground">còn {v.quantity} lượt</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-border/50">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={skipVoucher}
                        onChange={(e) => {
                          if (e.target.checked) { setSelectedVoucher(null); setSkipVoucher(true); }
                          else { setSkipVoucher(false); }
                        }}
                        className="w-3.5 h-3.5 accent-primary"
                      />
                      Không dùng mã
                    </label>
                    {selectedVoucher && (
                      <button onClick={() => setSelectedVoucher(null)} className="text-[11px] text-muted-foreground hover:text-destructive">
                        Bỏ chọn
                      </button>
                    )}
                  </div>
                </div>

                {/* Billiard Time */}
                <div className="rounded-2xl border border-border p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Clock size={16} className="text-primary" />
                    Tiền giờ chơi
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {paymentData.hours} giờ x {formatCurrency(paymentData.billiardRate)}
                    </span>
                    <span className="font-semibold">{formatCurrency(paymentData.billiardTotal)}</span>
                  </div>
                </div>

                {/* Drinks */}
                {paymentData.items && paymentData.items.length > 0 ? (
                  <div className="rounded-2xl border border-border p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Coffee size={16} className="text-primary" />
                      Đồ uống ({paymentData.items.length} món)
                    </div>
                    {paymentData.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {item.image_url ? (
                          <img src={resolveImageUrl(item.image_url)} alt={item.product_name || item.description} className="w-10 h-10 rounded-2xl object-cover shrink-0" onError={e => e.target.style.display = 'none'} />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                            <Coffee size={16} className="text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product_name || item.description}</p>
                          <p className="text-xs text-muted-foreground">{item.quantity} x {formatCurrency(item.unit_price)}</p>
                        </div>
                        <span className="text-sm font-semibold shrink-0">{formatCurrency(item.line_total)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                      <span className="text-muted-foreground">Tiền đồ uống</span>
                      <span className="font-semibold">{formatCurrency(paymentData.drinksTotal)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Coffee size={16} className="text-primary" />
                      Đồ uống
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Không có món nào</p>
                  </div>
                )}

                {/* Price Summary */}
                {(() => {
                  const subtotal = paymentData.subtotal ?? paymentData.billiardTotal + paymentData.drinksTotal;
                  const discount = computeDiscountPreview();
                  const finalTotal = Math.max(0, subtotal - discount);
                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span className="font-semibold">{formatCurrency(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-400">
                          <span>Giảm giá ({selectedVoucher?.code})</span>
                          <span className="font-semibold">-{formatCurrency(discount)}</span>
                        </div>
                      )}
                      <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-base">Thanh toán</span>
                          <span className="text-2xl font-bold text-primary">{formatCurrency(finalTotal)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowPaymentModal(false)}>Hủy</Button>
                  <Button className="flex-1" onClick={handleConfirmPayment} loading={loadingPayment}>
                    Xác nhận thanh toán
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </Modal>

        {/* Add Drink Modal */}
        <Modal open={showAddDrink} onClose={handleCloseAddDrink} title="Thêm đồ ăn / đồ uống" size="lg">
          <div className="flex flex-col divide-y divide-border max-h-[80vh]">
            {/* Product List */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-[50vh]">
              <Input
                placeholder="Tìm sản phẩm..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="h-10"
              />
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    activeCategory === 'all' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  Tất cả
                </button>
                {categoryOptions.map(categoryName => (
                  <button
                    key={categoryName}
                    onClick={() => setActiveCategory(categoryName)}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                      activeCategory === categoryName ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {categoryName}
                  </button>
                ))}
              </div>
              {loadingProducts ? (
                <div className="grid grid-cols-2 gap-2">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Không có sản phẩm nào</div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {filteredProducts.map(p => {
                    const qty = orderingCart[p.id] || 0;
                    return (
                      <div key={p.id} className={cn(
                        'flex items-center gap-2 p-3 rounded-2xl border transition-all',
                        qty > 0 ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/30'
                      )}>
                        {p.image_url ? (
                          <img src={resolveImageUrl(p.image_url)} alt={p.name} className="w-10 h-10 rounded-2xl object-cover shrink-0" onError={e => e.target.style.display = 'none'} />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                            <Coffee size={16} className="text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{p.name}</p>
                          <p className="text-xs text-primary font-semibold">{formatCurrency(p.price)}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <QuantityInput
                            value={qty}
                            onChange={(newQty) => handleSetDrinkQty(p.id, newQty)}
                            min={0}
                            max={999}
                            size="sm"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            <div className="p-4 space-y-3 bg-card">
              {cartProductList.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={16} className="text-primary" />
                      <span className="text-sm font-semibold">Giỏ hàng ({cartProductList.length} món)</span>
                    </div>
                    <button
                      onClick={() => setOrderingCart({})}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {cartProductList.map(item => (
                      <div key={item.productId} className="flex items-center gap-2 text-sm">
                        {item.product.image_url ? (
                          <img src={resolveImageUrl(item.product.image_url)} alt={item.product.name} className="w-8 h-8 rounded-xl object-cover shrink-0" onError={e => e.target.style.display = 'none'} />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                            <Coffee size={12} className="text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{item.product.name}</p>
                          <p className="text-[10px] text-muted-foreground">{item.quantity} x {formatCurrency(item.product.price)}</p>
                        </div>
                        <span className="text-xs font-semibold shrink-0">{formatCurrency(item.quantity * item.product.price)}</span>
                        <button
                          onClick={() => handleRemoveFromCart(item.productId)}
                          className="w-6 h-6 rounded-lg hover:bg-destructive/20 flex items-center justify-center transition-colors shrink-0"
                        >
                          <X size={10} className="text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-sm font-semibold">Tổng cộng</span>
                    <span className="text-lg font-bold text-primary">{formatCurrency(cartTotal)}</span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handlePlaceOrder}
                    loading={orderingLoading}
                    disabled={cartProductList.length === 0}
                  >
                    <ShoppingCart size={16} /> Order ({cartProductList.length} món)
                  </Button>
                </>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Coffee size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Bấm <strong>+</strong> để thêm món vào giỏ</p>
                </div>
              )}
            </div>
          </div>
        </Modal>

        {/* Reserved View */}
        {isReserved && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <AlertCircle size={20} className="text-blue-400" />
              <div>
                <p className="text-xs text-blue-400 font-medium">Đã đặt trước</p>
                {table.customer_name && <p className="text-sm font-semibold text-blue-300">{table.customer_name}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="success" onClick={handleStart} loading={loading}>
                Bắt đầu chơi
              </Button>
              <Button variant="destructive" onClick={handleCancelReserve} loading={loading}>
                Hủy đặt
              </Button>
            </div>
          </div>
        )}

        {/* Maintenance */}
        {table?.status === 'maintenance' && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Bàn này đang trong tình trạng bảo trì</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
