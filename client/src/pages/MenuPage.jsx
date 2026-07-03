import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency, resolveImageUrl } from '@/lib/utils';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, uploadImage } from '@/api/products';
import { toast } from 'sonner';

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

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', category_id: '', price: '', stock: '', unit: 'phần', cost_price: '', image_url: '' });

  const fetchData = async () => {
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods.products || prods || []);
      setCategories(cats.categories || cats || []);
    } catch { toast.error('Lỗi khi tải dữ liệu'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const getCategoryName = (id) => categories.find(c => c.id == id)?.name || 'Khác';
  const categoryOptions = FILTER_OPTIONS;

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'all'
      || normalizeCategoryLabel(getCategoryName(p.category_id)) === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleDelete = async (id) => {
    try {
      const result = await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeleteTarget(null);
      toast.success(result?.message || 'Đã xóa sản phẩm');
    } catch (e) { toast.error(e.message); }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) { toast.error('Vui lòng điền tên và giá'); return; }
    try {
      const payload = {
        name: form.name.trim(),
        ...(form.category_id ? { category_id: Number(form.category_id) } : {}),
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        unit: form.unit?.trim() || 'phần',
        cost_price: form.cost_price === '' || form.cost_price == null ? 0 : parseFloat(form.cost_price),
        ...(form.image_url?.trim() ? { image_url: form.image_url.trim() } : {}),
      };
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        toast.success('Đã cập nhật sản phẩm');
      } else {
        await createProduct(payload);
        toast.success('Đã thêm sản phẩm');
      }
      setShowModal(false);
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Thực đơn</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{products.length} sản phẩm trong thực đơn</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setForm({ name: '', category_id: '', price: '', stock: '', unit: 'phần', cost_price: '', image_url: '' }); setShowModal(true); }}>
          Thêm sản phẩm
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Input placeholder="Tìm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === 'all' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  Tất cả
                </button>
                {categoryOptions.map(categoryName => (
                  <button
                    key={categoryName}
                    onClick={() => setActiveCategory(categoryName)}
                    className={`px-3 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                      String(activeCategory) === String(categoryName) ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {categoryName}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">Không có sản phẩm nào</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Sản phẩm</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Danh mục</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3 pr-4">Giá</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3 pr-4">Tồn kho</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                              {(() => {
                                const raw = p.image_url || '';
                                if (!raw) return <Package size={18} className="text-muted-foreground" />;
                                const imgSrc = resolveImageUrl(raw);
                                return imgSrc ? (
                                  <img src={imgSrc} alt={p.name} className="w-full h-full object-cover rounded-2xl" onError={e => e.target.style.display = 'none'} />
                                ) : (
                                  <Package size={18} className="text-muted-foreground" />
                                );
                              })()}
                            </div>
                            <span className="font-medium text-sm">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant="outline" className="text-xs">{normalizeCategoryLabel(getCategoryName(p.category_id))}</Badge>
                        </td>
                        <td className="py-3 pr-4 text-right text-sm font-semibold text-primary">
                          {formatCurrency(p.price)}
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <Badge
                            variant={p.stock <= 0 ? 'destructive' : p.stock <= 5 ? 'warning' : 'success'}
                            className="text-xs"
                          >
                            {p.stock <= 0 ? 'Hết hàng' : `${p.stock} ${p.unit || ''}`}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon-sm" onClick={() => { setEditingProduct(p); setForm({ name: p.name, category_id: p.category_id || '', price: p.price, stock: p.stock, unit: p.unit || 'phần', cost_price: p.cost_price || '', image_url: p.image_url || '' }); setShowModal(true); }}>
                              <Edit2 size={14} />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(p)}>
                              <Trash2 size={14} className="text-red-400" />
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

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'} size="md">
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Tên sản phẩm</label>
            <Input placeholder="Trà đào" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Danh mục</label>
            <select
              className="w-full h-10 px-3 rounded-2xl border border-border bg-background text-sm"
              value={form.category_id}
              onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Giá bán (VND)</label>
              <Input type="number" placeholder="25000" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tồn kho</label>
              <Input type="number" placeholder="100" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Đơn vị</label>
            <Input placeholder="phần" value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Giá nhập (VND)</label>
            <Input type="number" placeholder="15000" value={form.cost_price} onChange={e => setForm(p => ({ ...p, cost_price: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium mb-1.5 block">Ảnh sản phẩm</label>
            <div className="flex items-start gap-3">
              {(() => {
                const previewRaw = form.image_url || '';
                if (!previewRaw) return null;
                const previewSrc = resolveImageUrl(previewRaw);
                return previewSrc && (
                  <img src={previewSrc} alt="Xem trước" className="w-20 h-20 rounded-2xl object-cover border border-border shrink-0" onError={e => e.target.style.display = 'none'} />
                );
              })()}
              <div className="flex flex-col gap-2 flex-1">
                <label className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-dashed border-border hover:border-primary hover:bg-muted/50 cursor-pointer text-sm text-center justify-center transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      e.target.value = '';
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error('File quá lớn. Tối đa 5MB.');
                        return;
                      }
                      if (!/^image\/(jpeg|png|webp|gif)$/i.test(file.type)) {
                        toast.error('Chỉ hỗ trợ ảnh JPG, PNG, WEBP, GIF.');
                        return;
                      }
                      try {
                        const res = await uploadImage(file);
                        const url = res?.url;
                        if (url) {
                          setForm(p => ({ ...p, image_url: url }));
                          toast.success('Tải ảnh thành công');
                        } else {
                          throw new Error('Phản hồi không hợp lệ');
                        }
                      } catch (err) {
                        const msg = err?.response?.data?.error || err?.message || 'Lỗi không xác định';
                        toast.error('Tải ảnh thất bại: ' + msg);
                      }
                    }}
                  />
                  <span className="text-muted-foreground">Chọn ảnh từ máy (tối đa 5MB)</span>
                </label>
                <Input
                  placeholder="Hoặc dán liên kết ảnh..."
                  value={form.image_url}
                  onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                />
              </div>
            </div>
          </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button className="flex-1" onClick={handleSave}>{editingProduct ? 'Lưu' : 'Thêm'}</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Xác nhận xóa sản phẩm" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Bạn có chắc chắn muốn xóa sản phẩm <span className="font-medium text-foreground">{deleteTarget?.name}</span> không?
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Hủy</Button>
            <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteTarget.id)}>Xóa</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
