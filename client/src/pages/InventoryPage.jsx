import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, Plus, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/utils';
import { getInventory, adjustStock } from '@/api/inventory';
import { toast } from 'sonner';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustModal, setAdjustModal] = useState(null);
  const [adjustQty, setAdjustQty] = useState(0);

  const fetchData = async () => {
    try {
      const data = await getInventory();
      setProducts(data.products || data || []);
    } catch { toast.error('Lỗi khi tải kho hàng'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdjust = async () => {
    if (!adjustModal) return;
    try {
      await adjustStock(adjustModal.id, { quantity: adjustQty });
      toast.success('Đã cập nhật tồn kho');
      setAdjustModal(null);
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  const lowStock = products.filter(p => p.stock <= 5);
  const outOfStock = products.filter(p => p.stock <= 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold tracking-tight">Kho hàng</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{products.length} sản phẩm trong kho</p>
      </motion.div>

      {/* Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <motion.div variants={item} className="flex gap-4 flex-wrap">
          {outOfStock.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertTriangle size={16} />
              {outOfStock.length} sản phẩm hết hàng
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
              <TrendingDown size={16} />
              {lowStock.length} sản phẩm sắp hết
            </div>
          )}
        </motion.div>
      )}

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14" />)}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {['Sản phẩm', 'Danh mục', 'Tồn kho', 'Đơn vị', 'Giá nhập', 'Thao tác'].map(h => (
                        <th key={h} className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4 last:text-right">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <Package size={16} className="text-muted-foreground" />
                            <span className="text-sm font-medium">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4"><Badge variant="outline" className="text-xs">{p.category || 'Khác'}</Badge></td>
                        <td className="py-3 pr-4">
                          <Badge variant={p.stock <= 0 ? 'destructive' : p.stock <= 5 ? 'warning' : 'success'} className="text-xs">
                            {p.stock}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-sm text-muted-foreground">{p.unit || '-'}</td>
                        <td className="py-3 pr-4 text-sm">{formatCurrency(p.cost_price || 0)}</td>
                        <td className="py-3 text-right">
                          <Button size="sm" variant="outline" onClick={() => { setAdjustModal(p); setAdjustQty(p.stock); }}>
                            <Plus size={12} /> Điều chỉnh
                          </Button>
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

      <Modal open={!!adjustModal} onClose={() => setAdjustModal(null)} title="Điều chỉnh tồn kho" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm">Sản phẩm: <span className="font-semibold">{adjustModal?.name}</span></p>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Số lượng hiện tại</label>
            <Input type="number" value={adjustQty} onChange={e => setAdjustQty(parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setAdjustModal(null)}>Hủy</Button>
            <Button className="flex-1" onClick={handleAdjust}>Lưu</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
