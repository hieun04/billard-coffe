import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Search, FileText, Package, Clock, Ticket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate, resolveImageUrl } from '@/lib/utils';
import { getOrders, getOrderDetail, cancelOrder, createInvoice, getOrderHistory } from '@/api/orders';
import { on, Events } from '@/lib/eventBus';
import { toast } from 'sonner';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const statusMap = {
  paid: { label: 'Đã thanh toán', variant: 'success' },
  pending: { label: 'Chờ thanh toán', variant: 'warning' },
  cancelled: { label: 'Đã hủy', variant: 'destructive' },
};

function OrderDetailModal({ order, open, onClose, onCancel }) {
  if (!order) return null;

  const status = statusMap[order.status] || { label: order.status || 'Không rõ', variant: 'outline' };
  const hasBilliard = order.billiard_total > 0 || order.billiardTotal > 0;

  return (
    <Modal open={open} onClose={onClose} title={`Chi tiết đơn #${order.id}`} size="md">
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Khách hàng</p>
            <p className="font-medium">{order.customer_name || 'Khách lẻ'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bàn</p>
            <p className="font-medium">{order.table_name || order.table_id || 'Không gắn bàn'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ngày tạo</p>
            <p className="font-medium">{formatDate(order.created_at)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Trạng thái</p>
            <Badge variant={status.variant} className="mt-1 text-xs">{status.label}</Badge>
          </div>
        </div>

        {/* Billiard info */}
        {hasBilliard && (
          <div className="rounded-2xl border border-border p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock size={16} className="text-primary" />
              Tiền giờ chơi
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {order.billiard_hours ? `${order.billiard_hours} giờ` : order.hours ? `${order.hours} giờ` : 'N/A'} x {formatCurrency(order.billiard_rate || order.billiardRate || 0)}
              </span>
              <span className="font-semibold">{formatCurrency(order.billiard_total || order.billiardTotal || 0)}</span>
            </div>
          </div>
        )}

        {/* Voucher info */}
        {(order.voucher_code || order.voucher_discount > 0) && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1">
            <div className="flex items-center gap-2">
              <Ticket size={16} className="text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Mã giảm giá đã áp dụng</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{order.voucher_code || '—'}</span>
              <span className="font-semibold text-emerald-400">-{formatCurrency(order.voucher_discount || 0)}</span>
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-2">Danh sách món</p>
          <div className="space-y-2">
            {(order.items || []).length === 0 ? (
              <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">Không có sản phẩm nào.</div>
            ) : (
              order.items.map((item, index) => {
                const img = item.product_image_url || item.image_url;
                const resolvedImg = resolveImageUrl(img);
                const unitPrice = item.unit_price || item.price || 0;
                const lineTotal = item.line_total || (item.quantity * unitPrice);
                return (
                  <div key={index} className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                      {resolvedImg ? (
                        <img src={resolvedImg} alt={item.product_name || item.description} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
                      ) : (
                        <Package size={16} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product_name || item.description || `Sản phẩm #${item.product_id}`}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x {formatCurrency(unitPrice)}
                        {item.category_name ? ` · ${item.category_name}` : ''}
                      </p>
                    </div>
                    <p className="text-sm font-semibold shrink-0">{formatCurrency(lineTotal)}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {(order.subtotal > 0 || order.discount > 0 || order.tax > 0) && (
          <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3 space-y-1 text-sm">
            {order.subtotal > 0 && (
              <div className="flex justify-between"><span className="text-muted-foreground">Tạm tính</span><span>{formatCurrency(order.subtotal)}</span></div>
            )}
            {(order.discount > 0 || order.tier_discount > 0) && (
              <div className="flex justify-between text-emerald-400">
                <span>Giảm giá</span>
                <span>-{formatCurrency(order.discount || order.tier_discount || 0)}</span>
              </div>
            )}
            {order.tax > 0 && (
              <div className="flex justify-between"><span className="text-muted-foreground">Thuế</span><span>{formatCurrency(order.tax)}</span></div>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tổng thanh toán</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(order.total || 0)}</span>
          </div>
          {order.payment_method && (
            <p className="text-xs text-muted-foreground mt-2">Phương thức: {order.payment_method === 'cash' ? 'Tiền mặt' : order.payment_method === 'card' ? 'Thẻ' : order.payment_method === 'transfer' ? 'Chuyển khoản' : order.payment_method}</p>
          )}
          {order.note && <p className="text-xs text-muted-foreground mt-2">Ghi chú: {order.note}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Đóng</Button>
          {order.status !== 'cancelled' && (
            <Button variant="destructive" className="flex-1" onClick={() => onCancel(order.id)}>Hủy đơn</Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOrder, setDetailOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getOrderHistory({ limit: 100 });
      setOrders(data.orders || data || []);
    } catch {
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const off = on(Events.PAYMENT_COMPLETED, () => {
      fetchData();
      if (detailOrder) {
        getOrderDetail(detailOrder.id).then(data => setDetailOrder(data.order || data)).catch(() => {});
      }
    });
    return () => { off(); };
  }, [detailOrder]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const keyword = search.toLowerCase();
      const matchSearch = !keyword
        || String(order.id).includes(keyword)
        || order.customer_name?.toLowerCase().includes(keyword)
        || String(order.table_name || order.table_id || '').toLowerCase().includes(keyword);
      const matchStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const totalRevenue = filteredOrders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + (order.total || 0), 0);

  const handleViewDetail = async (id) => {
    setDetailLoading(true);
    try {
      const orderWithItems = await getOrderDetail(id);
      setDetailOrder(orderWithItems);
    } catch (e) {
      toast.error(e.message || 'Không thể tải chi tiết đơn hàng');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCancelOrder = async (id) => {
    setActionLoading(true);
    try {
      await cancelOrder(id);
      toast.success('Đã hủy đơn hàng');
      setDetailOrder(null);
      fetchData();
    } catch (e) {
      toast.error(e.message || 'Không thể hủy đơn hàng');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportInvoice = async (id) => {
    try {
      const blob = await createInvoice(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hoa-don-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Đã tải hóa đơn');
    } catch (e) {
      toast.error(e.message || 'Không thể tải hóa đơn');
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Đơn hàng</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{filteredOrders.length} đơn hàng hiển thị</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{orders.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Tổng đơn hàng</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-muted-foreground mt-1">Doanh thu hiển thị</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{orders.filter(order => order.status === 'cancelled').length}</p>
          <p className="text-xs text-muted-foreground mt-1">Đơn đã hủy</p>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Lịch sử đơn hàng</CardTitle>
                <CardDescription>Theo dõi đơn bán hàng và hóa đơn đã tạo</CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  placeholder="Tìm theo mã đơn, khách hàng, bàn..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full sm:w-72"
                />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="pending">Chờ thanh toán</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16" />)}</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Receipt size={40} className="mx-auto mb-3 opacity-30" />
                <p>Không có đơn hàng nào phù hợp</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Mã đơn</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Ngày tạo</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Khách hàng</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Bàn</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Trạng thái</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3 pr-4">Tổng tiền</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => {
                      const status = statusMap[order.status] || { label: order.status || 'Không rõ', variant: 'outline' };
                      return (
                        <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="py-3 pr-4 font-mono text-xs">#{order.id}</td>
                          <td className="py-3 pr-4 text-xs">{formatDate(order.created_at)}</td>
                          <td className="py-3 pr-4">{order.customer_name || 'Khách lẻ'}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{order.table_name || order.table_id || '—'}</td>
                          <td className="py-3 pr-4"><Badge variant={status.variant} className="text-xs">{status.label}</Badge></td>
                          <td className="py-3 pr-4 text-right font-bold text-emerald-400">{formatCurrency(order.total || 0)}</td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button size="icon-sm" variant="ghost" onClick={() => handleViewDetail(order.id)} title="Xem chi tiết">
                                <Search size={14} />
                              </Button>
                              <Button size="icon-sm" variant="ghost" onClick={() => handleExportInvoice(order.id)} title="Tải hóa đơn">
                                <FileText size={14} />
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

      {detailLoading && !detailOrder && (
        <Modal open={true} onClose={() => setDetailOrder(null)} title="Đang tải chi tiết đơn hàng" size="sm">
          <div className="p-6 space-y-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </Modal>
      )}

      <OrderDetailModal
        order={detailOrder}
        open={!!detailOrder}
        onClose={() => setDetailOrder(null)}
        onCancel={handleCancelOrder}
      />
    </motion.div>
  );
}
