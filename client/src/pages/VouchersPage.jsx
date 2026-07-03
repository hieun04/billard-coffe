import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  getVouchers, createVoucher, toggleVoucher, deleteVoucher
} from '@/api/vouchers';
import { toast } from 'sonner';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const emptyForm = {
  code: '',
  type: 'percent',
  value: '',
  min_order: '',
  quantity: '',
  expiry_date: '',
};

function getVoucherConditionText(voucher) {
  return voucher.min_order > 0
    ? `Áp dụng cho đơn từ ${formatCurrency(voucher.min_order)}`
    : 'Không yêu cầu giá trị đơn tối thiểu';
}

function getStatus(v) {
  if (v.status === 'inactive') return { label: 'Đã khóa', variant: 'destructive' };
  const now = new Date();
  const expiry = v.expiry_date ? new Date(v.expiry_date) : null;
  if (expiry && expiry < now) return { label: 'Hết hạn', variant: 'warning' };
  return { label: 'Hoạt động', variant: 'success' };
}

function VoucherFormModal({ open, onClose, onSuccess, editing }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        code: editing.code || '',
        type: editing.type || 'percent',
        value: editing.value || '',
        min_order: editing.min_order || '',
        quantity: editing.quantity || '',
        expiry_date: editing.expiry_date ? editing.expiry_date.slice(0, 10) : '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [editing, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.value) {
      toast.error('Vui lòng nhập mã phiếu giảm giá và giá trị');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: parseFloat(form.value),
        min_order: parseFloat(form.min_order) || 0,
        quantity: parseInt(form.quantity) || 1,
        expiry_date: form.expiry_date || null,
      };
      if (editing) {
        await createVoucher({ ...payload, id: editing.id, _method: 'PUT' });
        toast.success('Đã cập nhật phiếu giảm giá');
      } else {
        await createVoucher(payload);
        toast.success('Đã tạo phiếu giảm giá');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    set('code', code);
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Sửa phiếu giảm giá' : 'Tạo phiếu giảm giá'} size="md">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Code + generate */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Mã phiếu giảm giá</label>
          <div className="flex gap-2">
            <Input
              value={form.code}
              onChange={e => set('code', e.target.value.toUpperCase())}
              placeholder="VD: HETHONG10"
              className="font-mono font-bold tracking-wider"
              maxLength={20}
            />
            <Button type="button" variant="outline" onClick={generateCode} className="shrink-0">
              Tạo mã
            </Button>
          </div>
        </div>

        {/* Type + Value */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Loại giảm giá</label>
            <select
              value={form.type}
              onChange={e => set('type', e.target.value)}
              className="w-full h-10 px-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Số tiền cố định (VND)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Giá trị</label>
            <Input
              type="number"
              value={form.value}
              onChange={e => set('value', e.target.value)}
              placeholder={form.type === 'percent' ? 'VD: 10' : 'VD: 10000'}
              min={1}
              max={form.type === 'percent' ? 100 : undefined}
            />
          </div>
        </div>

        {/* Min order + Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Điều kiện đơn hàng (VND)</label>
            <Input
              type="number"
              value={form.min_order}
              onChange={e => set('min_order', e.target.value)}
              placeholder="Để trống nếu không cần điều kiện"
              min={0}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Ví dụ nhập `500000` để chỉ áp dụng cho đơn từ 500.000đ. Bỏ trống nếu mã dùng cho mọi đơn.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Số lượng sử dụng</label>
            <Input
              type="number"
              value={form.quantity}
              onChange={e => set('quantity', e.target.value)}
              placeholder="VD: 100"
              min={1}
            />
          </div>
        </div>

        {/* Expiry */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Ngày hết hạn</label>
          <Input
            type="date"
            value={form.expiry_date}
            onChange={e => set('expiry_date', e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
          />
        </div>

        {/* Preview */}
        {form.code && form.value && (
          <div className="rounded-2xl bg-muted/50 border border-border p-4">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Xem trước</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Tag size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-lg font-mono tracking-wider">{form.code}</p>
                <p className="text-sm text-muted-foreground">
                  {form.type === 'percent'
                    ? `Giảm ${form.value}%`
                    : `Giảm ${formatCurrency(parseFloat(form.value) || 0)}`}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {(parseFloat(form.min_order) || 0) > 0
                    ? `Điều kiện: đơn từ ${formatCurrency(parseFloat(form.min_order) || 0)}`
                    : 'Không có điều kiện giá trị đơn hàng'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Hủy</Button>
          <Button type="submit" className="flex-1" loading={loading}>
            {editing ? 'Lưu thay đổi' : 'Tạo phiếu giảm giá'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getVouchers();
      setVouchers(data.vouchers || data || []);
    } catch { toast.error('Lỗi khi tải phiếu giảm giá'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggle = async (id) => {
    setActionLoading(true);
    try {
      await toggleVoucher(id);
      toast.success('Đã cập nhật trạng thái phiếu giảm giá');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await deleteVoucher(deleteId);
      toast.success('Đã xóa phiếu giảm giá');
      setDeleteId(null);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`Đã sao chép mã "${code}"`);
    }).catch(() => {
      toast.error('Không thể sao chép');
    });
  };

  const filteredVouchers = vouchers.filter(voucher => {
    const status = getStatus(voucher);
    const matchSearch = !search || voucher.code?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || status.label === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Phiếu giảm giá</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{vouchers.length} phiếu giảm giá</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowModal(true); }}>
          Tạo phiếu giảm giá
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Danh sách phiếu giảm giá</CardTitle>
                <CardDescription>Quản lý mã giảm giá dành cho khách hàng</CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  placeholder="Tìm theo mã phiếu..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full sm:w-56"
                />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Đã khóa">Đã khóa</option>
                  <option value="Hết hạn">Hết hạn</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16" />)}</div>
            ) : filteredVouchers.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Tag size={40} className="mx-auto mb-3 opacity-30" />
                <p>Chưa có phiếu giảm giá nào</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowModal(true)}>
                  Tạo phiếu giảm giá đầu tiên
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Mã</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Loại</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Giá trị</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Đơn tối thiểu</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Số lượng</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Hết hạn</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Trạng thái</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVouchers.map(v => {
                      const status = getStatus(v);
                      return (
                        <tr key={v.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopy(v.code)}
                                className="font-mono font-bold tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors"
                                title="Nhấn để sao chép"
                              >
                                {v.code}
                              </button>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant="outline" className="text-xs">
                              {v.type === 'percent' ? 'Phần trăm (%)' : 'Cố định (VND)'}
                            </Badge>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="font-bold text-emerald-400">
                              {v.type === 'percent' ? `${v.value}%` : formatCurrency(v.value)}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            <div className="space-y-1">
                              <div>{v.min_order > 0 ? formatCurrency(v.min_order) : 'Không yêu cầu'}</div>
                              <div className="text-xs text-muted-foreground/80">{getVoucherConditionText(v)}</div>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={v.quantity <= 5 ? 'text-red-400 font-bold' : ''}>{v.quantity}</span>
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground text-xs">
                            {v.expiry_date ? formatDate(v.expiry_date) : 'Không có'}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant={status.variant} className="text-xs">{status.label}</Badge>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => handleToggle(v.id)}
                                disabled={actionLoading}
                                title={v.status === 'active' ? 'Khóa phiếu giảm giá' : 'Mở khóa phiếu giảm giá'}
                              >
                                {v.status === 'active'
                                  ? <ToggleRight size={16} className="text-emerald-400" />
                                  : <ToggleLeft size={16} className="text-muted-foreground" />
                                }
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => { setEditing(v); setShowModal(true); }}
                                title="Sửa"
                              >
                                <Edit2 size={14} />
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => setDeleteId(v.id)}
                                title="Xóa"
                                className="text-red-400 hover:text-red-500"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Create/Edit Modal */}
      <VoucherFormModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditing(null); }}
        onSuccess={fetchData}
        editing={editing}
      />

      {/* Delete Confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Xác nhận xóa phiếu giảm giá" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Bạn có chắc chắn muốn xóa phiếu giảm giá này? Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Hủy</Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete} loading={actionLoading}>Xóa</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
