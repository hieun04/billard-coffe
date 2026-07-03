import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Eye, Pencil, Package, Plus, Truck, X, Phone, MapPin, Tag, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getPurchases, createPurchase, updatePurchase, deletePurchase, getSuppliers, createSupplier, updateSupplier, deleteSupplier, getPurchaseDetail } from '@/api/inventory';
import { getProducts } from '@/api/products';
import { toast } from 'sonner';
import { SupplierModal } from '@/components/SupplierModal';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const emptyForm = {
  supplier_id: '',
  notes: '',
  items: [{ product_id: '', quantity: '', unit_price: '' }],
};

function AddPurchaseModal({ open, onClose, onSuccess, products, suppliers, onAddSupplier }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setForm(emptyForm);
  }, [open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const updateItem = (idx, k, v) => {
    setForm(f => ({
      ...f,
      items: f.items.map((it, i) => i === idx ? { ...it, [k]: v } : it),
    }));
  };

  const addItem = () => {
    setForm(f => ({
      ...f,
      items: [...f.items, { product_id: '', quantity: '', unit_price: '' }],
    }));
  };

  const removeItem = (idx) => {
    if (form.items.length <= 1) return;
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  const total = form.items.reduce((sum, it) => {
    const qty = parseFloat(it.quantity) || 0;
    const price = parseFloat(it.unit_price) || 0;
    return sum + qty * price;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validItems = form.items.filter(it => it.product_id && it.quantity > 0 && it.unit_price > 0);
    if (!form.supplier_id || validItems.length === 0) {
      toast.error('Vui lòng chọn nhà cung cấp và ít nhất 1 sản phẩm');
      return;
    }
    setLoading(true);
    try {
      const payloadItems = validItems.map(it => ({
        product_id: Number(it.product_id),
        quantity: Number(it.quantity),
        unit_cost: Number(it.unit_price),
      }));
      const selectedSupplier = suppliers.find(s => String(s.id) === String(form.supplier_id));
      await createPurchase({
        supplier: selectedSupplier?.name || '',
        supplier_id: Number(form.supplier_id),
        ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
        items: payloadItems,
      });
      toast.success('Đã tạo phiếu nhập hàng');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Tạo phiếu nhập hàng" size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Supplier + Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nhà cung cấp *</label>
            <div className="flex gap-2">
              <select
                value={form.supplier_id}
                onChange={e => set('supplier_id', e.target.value)}
                className="flex-1 h-10 px-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">-- Chọn nhà cung cấp --</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={String(supplier.id)}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              {onAddSupplier && (
                <Button type="button" size="icon" variant="outline" onClick={onAddSupplier} title="Thêm nhà cung cấp mới">
                  <Plus size={14} />
                </Button>
              )}
            </div>
            {form.supplier_id && (() => {
              const selected = suppliers.find(s => String(s.id) === String(form.supplier_id));
              if (!selected) return null;
              return (
                <div className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded-xl p-2.5 space-y-0.5">
                  {selected.phone && <p>📞 {selected.phone}</p>}
                  {selected.address && <p>📍 {selected.address}</p>}
                  {selected.category && <p>📦 {selected.category}</p>}
                </div>
              );
            })()}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Ghi chú</label>
            <Input
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="VD: Nhập hàng tháng 6"
            />
          </div>
        </div>

        {/* Items */}
        <div>
          <label className="text-sm font-medium mb-2 block">Danh sách sản phẩm</label>
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-[1fr_100px_130px_40px] gap-2 px-1 text-xs text-muted-foreground font-medium">
              <span>Sản phẩm</span>
              <span className="text-right">Số lượng</span>
              <span className="text-right">Đơn giá</span>
              <span></span>
            </div>

            {form.items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_100px_130px_40px] gap-2 items-center">
                <select
                  value={it.product_id}
                  onChange={e => updateItem(idx, 'product_id', e.target.value)}
                  className="h-10 px-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}{p.stock !== undefined ? ` · tồn ${p.stock}` : ''}</option>
                  ))}
                </select>
                <Input
                  type="number"
                  value={it.quantity}
                  onChange={e => updateItem(idx, 'quantity', e.target.value)}
                  placeholder="0"
                  min={1}
                  className="text-right"
                />
                <Input
                  type="number"
                  value={it.unit_price}
                  onChange={e => updateItem(idx, 'unit_price', e.target.value)}
                  placeholder="0"
                  min={0}
                  className="text-right"
                />
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => removeItem(idx)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={addItem}>
            Thêm sản phẩm
          </Button>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-3">
          <span className="text-sm text-muted-foreground">Tổng tiền</span>
          <span className="text-xl font-bold text-emerald-400">{formatCurrency(total)}</span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Hủy</Button>
          <Button type="submit" className="flex-1" loading={loading}>Tạo phiếu nhập</Button>
        </div>
      </form>
    </Modal>
  );
}

function PurchaseDetailModal({ purchase, open, onClose, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={`Chi tiết phiếu nhập #${purchase?.id || ''}`} size="lg">
      {loading ? (
        <div className="p-6 space-y-4">
          <div className="h-20 bg-muted/50 rounded-xl animate-pulse" />
          <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />
          <div className="h-12 bg-muted/50 rounded-xl animate-pulse" />
        </div>
      ) : purchase ? (
      <div className="p-6 space-y-5">
        {/* Header Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Supplier Info */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Truck size={16} className="text-blue-400" />
              <h4 className="font-semibold text-sm">Nhà cung cấp</h4>
            </div>
            <p className="font-bold text-lg mb-2">{purchase.supplier || 'Không xác định'}</p>
            <div className="space-y-1.5 text-sm">
              {purchase.supplier_phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone size={13} />
                  <span>{purchase.supplier_phone}</span>
                </div>
              )}
              {purchase.supplier_address && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={13} />
                  <span>{purchase.supplier_address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Purchase Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <Calendar size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Ngày nhập</p>
                <p className="font-medium text-sm">{formatDate(purchase.created_at)}</p>
              </div>
            </div>
            {purchase.notes && (
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                <FileText size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Ghi chú</p>
                  <p className="text-sm">{purchase.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        {purchase.items && purchase.items.length > 0 ? (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Package size={14} className="text-muted-foreground" />
              Sản phẩm đã nhập ({purchase.items.length} món)
            </h4>
            <div className="border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Sản phẩm</th>
                    <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">Số lượng</th>
                    <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">Đơn giá</th>
                    <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {purchase.items.map((item, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">
                        {item.product_name || `Sản phẩm #${item.product_id}`}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        {formatCurrency(item.unit_cost || item.unit_price || 0)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-emerald-400">
                        {formatCurrency(item.line_total || (item.quantity * (item.unit_cost || item.unit_price || 0)))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Package size={32} className="mx-auto mb-2 opacity-30" />
            <p>Không có sản phẩm nào</p>
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4">
          <span className="text-sm text-muted-foreground">Tổng tiền</span>
          <span className="text-2xl font-bold text-emerald-400">{formatCurrency(purchase.total || 0)}</span>
        </div>
      </div>
      ) : (
        <div className="p-6 text-center text-muted-foreground">
          <p>Không có dữ liệu</p>
        </div>
      )}
    </Modal>
  );
}

function EditPurchaseModal({ open, onClose, onSuccess, products, suppliers, purchase }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && purchase) {
      const mappedItems = (purchase.items || []).map(it => ({
        product_id: String(it.product_id ?? ''),
        quantity: String(it.quantity ?? ''),
        unit_price: String(it.unit_cost ?? it.unit_price ?? ''),
      }));
      const supplierObj = suppliers.find(s => s.name === purchase.supplier);
      setForm({
        supplier_id: supplierObj ? String(supplierObj.id) : '',
        notes: purchase.notes || '',
        items: mappedItems.length ? mappedItems : [{ ...emptyForm.items[0] }],
      });
    }
  }, [open, purchase, suppliers]);

  if (!open || !purchase) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updateItem = (idx, k, v) => {
    setForm(f => ({
      ...f,
      items: f.items.map((it, i) => i === idx ? { ...it, [k]: v } : it),
    }));
  };
  const addItem = () => {
    setForm(f => ({ ...f, items: [...f.items, { product_id: '', quantity: '', unit_price: '' }] }));
  };
  const removeItem = (idx) => {
    if (form.items.length <= 1) return;
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  const total = form.items.reduce((sum, it) => {
    const qty = parseFloat(it.quantity) || 0;
    const price = parseFloat(it.unit_price) || 0;
    return sum + qty * price;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validItems = form.items.filter(it => it.product_id && parseFloat(it.quantity) > 0 && parseFloat(it.unit_price) > 0);
    if (!form.supplier_id || validItems.length === 0) {
      toast.error('Vui lòng chọn nhà cung cấp và ít nhất 1 sản phẩm');
      return;
    }
    setLoading(true);
    try {
      const payloadItems = validItems.map(it => ({
        product_id: Number(it.product_id),
        quantity: Number(it.quantity),
        unit_cost: Number(it.unit_price),
      }));
      const selectedSupplier = suppliers.find(s => String(s.id) === String(form.supplier_id));
      await updatePurchase(purchase.id, {
        supplier: selectedSupplier?.name || '',
        supplier_id: Number(form.supplier_id),
        ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
        items: payloadItems,
      });
      toast.success('Đã cập nhật phiếu nhập');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Chỉnh sửa phiếu nhập #${purchase.id}`} size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nhà cung cấp *</label>
            <select
              value={form.supplier_id}
              onChange={e => set('supplier_id', e.target.value)}
              className="w-full h-10 px-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">-- Chọn nhà cung cấp --</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={String(supplier.id)}>
                  {supplier.name}
                </option>
              ))}
            </select>
            {form.supplier_id && (() => {
              const selected = suppliers.find(s => String(s.id) === String(form.supplier_id));
              if (!selected) return null;
              return (
                <div className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded-xl p-2.5 space-y-0.5">
                  {selected.phone && <p>📞 {selected.phone}</p>}
                  {selected.address && <p>📍 {selected.address}</p>}
                  {selected.category && <p>📦 {selected.category}</p>}
                </div>
              );
            })()}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Ghi chú</label>
            <Input
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="VD: Nhập hàng tháng 6"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Danh sách sản phẩm</label>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_100px_130px_40px] gap-2 px-1 text-xs text-muted-foreground font-medium">
              <span>Sản phẩm</span>
              <span className="text-right">Số lượng</span>
              <span className="text-right">Đơn giá</span>
              <span></span>
            </div>

            {form.items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_100px_130px_40px] gap-2 items-center">
                <select
                  value={it.product_id}
                  onChange={e => updateItem(idx, 'product_id', e.target.value)}
                  className="h-10 px-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}{p.stock !== undefined ? ` · tồn ${p.stock}` : ''}</option>
                  ))}
                </select>
                <Input
                  type="number"
                  value={it.quantity}
                  onChange={e => updateItem(idx, 'quantity', e.target.value)}
                  placeholder="0"
                  min={1}
                  className="text-right"
                />
                <Input
                  type="number"
                  value={it.unit_price}
                  onChange={e => updateItem(idx, 'unit_price', e.target.value)}
                  placeholder="0"
                  min={0}
                  className="text-right"
                />
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => removeItem(idx)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={addItem}>
            Thêm sản phẩm
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-3">
          <span className="text-sm text-muted-foreground">Tổng tiền</span>
          <span className="text-xl font-bold text-emerald-400">{formatCurrency(total)}</span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Hủy</Button>
          <Button type="submit" className="flex-1" loading={loading}>Lưu thay đổi</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailPurchase, setDetailPurchase] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editPurchase, setEditPurchase] = useState(null);
  const [deletePurchaseId, setDeletePurchaseId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Supplier management
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deleteSupplierId, setDeleteSupplierId] = useState(null);
  const [deletingSupplier, setDeletingSupplier] = useState(false);

  const fetchData = async () => {
    try {
      const [p, pr, s] = await Promise.all([
        getPurchases(),
        getProducts(),
        getSuppliers(),
      ]);
      setPurchases(p.purchases || p || []);
      setProducts(pr.products || pr || []);
      setSuppliers(s.suppliers || s || []);
    } catch { toast.error('Lỗi khi tải dữ liệu'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deletePurchaseId) return;
    setDeleting(true);
    try {
      await deletePurchase(deletePurchaseId);
      toast.success('Đã xóa phiếu nhập');
      setDeletePurchaseId(null);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!deleteSupplierId) return;
    setDeletingSupplier(true);
    try {
      await deleteSupplier(deleteSupplierId);
      toast.success('Đã xóa nhà cung cấp');
      setDeleteSupplierId(null);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingSupplier(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalSpent = purchases.reduce((s, p) => s + (p.total || 0), 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nhập hàng</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{purchases.length} phiếu nhập</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSupplierModal(true)}>
            <Truck size={16} />
            Quản lý NCC
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            Tạo phiếu nhập
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{purchases.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Tổng phiếu nhập</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{formatCurrency(totalSpent)}</p>
            <p className="text-xs text-muted-foreground mt-1">Tổng chi</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold">{suppliers.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Nhà cung cấp</p>
          </Card>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử nhập hàng</CardTitle>
            <CardDescription>Danh sách các phiếu nhập từ nhà cung cấp</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16" />)}</div>
            ) : purchases.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Package size={40} className="mx-auto mb-3 opacity-30" />
                <p>Chưa có phiếu nhập nào</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowAddModal(true)}>
                  Tạo phiếu nhập đầu tiên
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">ID</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Ngày</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Nhà cung cấp</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Sản phẩm</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3 pr-4">Tổng tiền</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map(p => (
                      <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-3 pr-4 font-mono text-xs text-muted-foreground align-top">#{p.id}</td>
                        <td className="py-3 pr-4 text-xs align-top">{formatDate(p.created_at)}</td>
                        <td className="py-3 pr-4 font-medium align-top">{p.supplier}</td>
                        <td className="py-3 pr-4 align-top">
                          {p.items && p.items.length > 0 ? (
                            <div className="space-y-1">
                              {p.items.slice(0, 3).map((item, i) => (
                                <div key={i} className="text-xs">
                                  <span className="text-muted-foreground">{item.product_name || `#${item.product_id}`}</span>
                                  <span className="text-muted-foreground ml-1">x{item.quantity}</span>
                                </div>
                              ))}
                              {p.items.length > 3 && (
                                <div className="text-xs text-muted-foreground italic">+{p.items.length - 3} món khác</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-right font-bold text-emerald-400 align-top">{formatCurrency(p.total || 0)}</td>
                        <td className="py-3 text-right align-top">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="icon-sm" variant="ghost" onClick={() => setEditPurchase(p)} title="Sửa">
                              <Pencil size={14} />
                            </Button>
                            <Button size="icon-sm" variant="ghost" onClick={() => setDeletePurchaseId(p.id)} title="Xóa">
                              <Trash2 size={14} />
                            </Button>
                            <Button size="icon-sm" variant="ghost" onClick={async () => {
                              setDetailLoading(true);
                              try {
                                const res = await getPurchaseDetail(p.id);
                                setDetailPurchase(res.purchase);
                              } catch { toast.error('Lỗi khi tải chi tiết'); }
                              finally { setDetailLoading(false); }
                            }} title="Xem">
                              <Eye size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <AddPurchaseModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchData}
        products={products}
        suppliers={suppliers}
        onAddSupplier={() => setShowSupplierModal(true)}
      />

      <PurchaseDetailModal
        purchase={detailPurchase}
        open={!!detailPurchase}
        onClose={() => setDetailPurchase(null)}
        loading={detailLoading}
      />

      {editPurchase && (
        <EditPurchaseModal
          open={!!editPurchase}
          purchase={editPurchase}
          onClose={() => setEditPurchase(null)}
          onSuccess={fetchData}
          products={products}
          suppliers={suppliers}
        />
      )}

      <Modal open={!!deletePurchaseId} onClose={() => setDeletePurchaseId(null)} title="Xác nhận xóa" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">Bạn có chắc muốn xóa phiếu nhập này không? Hành động này sẽ hoàn tồn kho về trạng thái trước khi nhập.</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeletePurchaseId(null)}>Hủy</Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete} loading={deleting}>Xóa</Button>
          </div>
        </div>
      </Modal>

      <SupplierModal
        open={showSupplierModal}
        onClose={() => { setShowSupplierModal(false); setEditingSupplier(null); }}
        onSuccess={fetchData}
        supplier={editingSupplier}
      />

      <Modal open={!!deleteSupplierId} onClose={() => setDeleteSupplierId(null)} title="Xác nhận xóa nhà cung cấp" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">Bạn có chắc muốn xóa nhà cung cấp này không?</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteSupplierId(null)}>Hủy</Button>
            <Button variant="destructive" className="flex-1" onClick={handleDeleteSupplier} loading={deletingSupplier}>Xóa</Button>
          </div>
        </div>
      </Modal>

      <div className="space-y-4">
        {/* Supplier List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Nhà cung cấp</CardTitle>
                <CardDescription>Danh sách các nhà cung cấp</CardDescription>
              </div>
              <Button size="sm" onClick={() => { setEditingSupplier(null); setShowSupplierModal(true); }}>
                <Plus size={14} /> Thêm NCC
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16" />)}</div>
            ) : suppliers.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Truck size={36} className="mx-auto mb-3 opacity-30" />
                <p>Chưa có nhà cung cấp nào</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowSupplierModal(true)}>
                  Thêm nhà cung cấp đầu tiên
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {suppliers.map(supplier => (
                  <div key={supplier.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Truck size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{supplier.name}</p>
                        <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                          {supplier.phone && <span>📞 {supplier.phone}</span>}
                          {supplier.address && <span>📍 {supplier.address}</span>}
                          {supplier.category && <span>📦 {supplier.category}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon-sm" variant="ghost" onClick={() => { setEditingSupplier(supplier); setShowSupplierModal(true); }} title="Sửa">
                        <Pencil size={14} />
                      </Button>
                      <Button size="icon-sm" variant="ghost" onClick={() => setDeleteSupplierId(supplier.id)} title="Xóa" className="text-red-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
