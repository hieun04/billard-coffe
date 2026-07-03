import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { getTierColor, formatCurrency } from '@/lib/utils';
import { getCustomers, searchCustomers, addPoints, createCustomer, updateCustomer, deleteCustomer } from '@/api/customers';
import { on, Events } from '@/lib/eventBus';
import { toast } from 'sonner';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const TIERS = [
  { name: 'Bronze', label: 'Đồng', min: 0, max: 1000000, color: 'amber', badgeClass: 'bg-amber-700/20 text-amber-400 border-amber-700/30', iconBg: 'bg-amber-500/20', icon: '🥉' },
  { name: 'Silver', label: 'Bạc', min: 1000000, max: 3000000, color: 'slate', badgeClass: 'bg-slate-400/20 text-slate-300 border-slate-400/30', iconBg: 'bg-slate-400/20', icon: '🥈' },
  { name: 'Gold', label: 'Vàng', min: 3000000, max: 10000000, color: 'yellow', badgeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', iconBg: 'bg-yellow-500/20', icon: '🥇' },
  { name: 'Platinum', label: 'Kim Cương', min: 10000000, max: null, color: 'purple', badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30', iconBg: 'bg-purple-500/20', icon: '💎' },
];

const TIER_VOUCHERS = { Bronze: 2, Silver: 5, Gold: 10, Platinum: 15 };

function getTier(name) {
  return TIERS.find(t => t.name === name) || TIERS[0];
}

function getNextTier(name) {
  const idx = TIERS.findIndex(t => t.name === name);
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
}

function getProgressToNextTier(totalSpent, tier) {
  const t = getTier(tier);
  if (!t.max) return 100;
  return Math.min(100, Math.round((totalSpent / t.max) * 100));
}

function formatVietnameseCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [pointsCustomer, setPointsCustomer] = useState(null);
  const [pointsValue, setPointsValue] = useState('');

  const [editCustomer, setEditCustomer] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data.customers || data || []);
    } catch { toast.error('Lỗi khi tải danh sách'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const offPayment = on(Events.PAYMENT_COMPLETED, (payload) => {
      fetchData();
    });
    return () => { offPayment(); };
  }, []);

  const handleSearch = async (q) => {
    setSearch(q);
    if (q.length < 2) { fetchData(); return; }
    try {
      const data = await searchCustomers(q);
      setCustomers(data.customers || []);
    } catch {}
  };

  const handleAddPoints = async () => {
    if (!pointsCustomer || !pointsValue) return;
    setActionLoading(true);
    try {
      await addPoints(pointsCustomer.id, { points: parseInt(pointsValue) });
      toast.success('Đã thêm điểm');
      setPointsCustomer(null);
      setPointsValue('');
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setActionLoading(false); }
  };

  const handleCreate = async () => {
    if (!newName.trim() || !newPhone.trim()) return;
    try {
      await createCustomer({ name: newName, phone: newPhone });
      toast.success('Đã thêm khách hàng');
      setShowAdd(false);
      setNewName('');
      setNewPhone('');
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  const handleEditClick = (c) => {
    setEditCustomer(c);
    setEditName(c.name);
    setEditPhone(c.phone);
  };

  const handleEditSave = async () => {
    if (!editName.trim() || !editPhone.trim()) return;
    setActionLoading(true);
    try {
      await updateCustomer(editCustomer.id, { name: editName.trim(), phone: editPhone.trim() });
      toast.success('Đã cập nhật khách hàng');
      setEditCustomer(null);
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    setActionLoading(true);
    try {
      await deleteCustomer(id);
      toast.success('Đã xóa khách hàng');
      setDeleteConfirmId(null);
      fetchData();
    } catch (e) {
      toast.error(e.message || 'Không thể xóa khách hàng');
    } finally {
      setActionLoading(false);
    }
  };

  const totalSpent = customers.reduce((sum, customer) => sum + (customer.total_spent || 0), 0);
  const platinumCount = customers.filter(c => c.tier === 'Platinum').length;
  const goldCount = customers.filter(c => c.tier === 'Gold').length;
  const silverCount = customers.filter(c => c.tier === 'Silver').length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Khách hàng</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{customers.length} khách hàng</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          Thêm khách hàng
        </Button>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">{customers.length}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Tổng KH</p>
        </div>
        <div className="rounded-2xl border border-amber-700/30 bg-amber-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{customers.filter(c => c.tier === 'Bronze').length}</p>
          <p className="text-[10px] text-muted-foreground mt-1">🥉 Đồng</p>
        </div>
        <div className="rounded-2xl border border-slate-400/30 bg-slate-400/5 p-4 text-center">
          <p className="text-2xl font-bold text-slate-300">{silverCount}</p>
          <p className="text-[10px] text-muted-foreground mt-1">🥈 Bạc</p>
        </div>
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{goldCount + platinumCount}</p>
          <p className="text-[10px] text-muted-foreground mt-1">🥇 Vàng + 💎</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalSpent)}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Tổng chi tiêu tất cả KH</p>
        </div>
        <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{platinumCount}</p>
          <p className="text-[10px] text-muted-foreground mt-1">💎 Kim Cương (≥10 triệu)</p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="Tìm theo tên hoặc SDT..."
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-52 rounded-2xl" />)}
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">Không có khách hàng nào</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {customers.map(c => {
                  const tier = getTier(c.tier);
                  const nextTier = getNextTier(c.tier);
                  const progress = getProgressToNextTier(c.total_spent || 0, c.tier);
                  const discount = TIER_VOUCHERS[c.tier] || 2;
                  const remaining = nextTier ? nextTier.min - (c.total_spent || 0) : 0;
                  return (
                    <div key={c.id} className="rounded-2xl border border-border p-4 hover:border-primary/30 transition-all card-hover">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-2xl ${tier.iconBg} flex items-center justify-center text-2xl shrink-0`}>
                          {tier.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{c.name}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            <Phone size={11} />
                            {c.phone}
                          </div>
                        </div>
                        <Badge className={tier.badgeClass}>{tier.label}</Badge>
                      </div>

                      {/* Tier Progress */}
                      <div className="mb-3">
                        {nextTier ? (
                          <>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="text-muted-foreground">
                                {formatCurrency(c.total_spent || 0)}
                              </span>
                              <span className="text-muted-foreground">
                                lên {nextTier.label}
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  tier.name === 'Bronze' ? 'bg-amber-500' :
                                  tier.name === 'Silver' ? 'bg-slate-400' :
                                  tier.name === 'Gold' ? 'bg-yellow-500' : 'bg-purple-500'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1 text-right">
                              Còn {formatCurrency(remaining)} để thăng hạng
                            </p>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 rounded-xl bg-purple-500/10 border border-purple-500/20 px-3 py-2">
                            <span className="text-lg">💎</span>
                            <div>
                              <p className="text-xs font-semibold text-purple-400">Hạng cao nhất!</p>
                              <p className="text-[10px] text-purple-400/70">Đã chi tiêu {formatCurrency(c.total_spent || 0)}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Stats + Discount */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="rounded-xl bg-muted/40 px-3 py-2 text-center">
                          <p className="text-[10px] text-muted-foreground">Chi tiêu</p>
                          <p className="text-sm font-bold text-emerald-400">{formatCurrency(c.total_spent || 0)}</p>
                        </div>
                        <div className="rounded-xl bg-muted/40 px-3 py-2 text-center">
                          <p className="text-[10px] text-muted-foreground">Lượt đến</p>
                          <p className="text-sm font-bold">{c.visit_count || 0}</p>
                        </div>
                        <div className="rounded-xl bg-muted/40 px-3 py-2 text-center">
                          <p className="text-[10px] text-muted-foreground">Điểm</p>
                          <p className="text-sm font-bold">{c.points || 0}</p>
                        </div>
                        <div className="rounded-xl bg-primary/10 px-3 py-2 text-center">
                          <p className="text-[10px] text-primary">Ưu đãi</p>
                          <p className="text-sm font-bold text-primary">-{discount}%</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <Button variant="outline" size="sm" className="w-full" onClick={() => { setPointsCustomer(c); setPointsValue(''); }}>
                        Thêm điểm
                      </Button>
                      <div className="flex gap-2 mt-2">
                        <Button variant="ghost" size="sm" className="flex-1 text-xs" onClick={() => handleEditClick(c)}>
                          Sửa
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1 text-xs text-red-400 hover:text-red-500" onClick={() => setDeleteConfirmId(c.id)}>
                          Xóa
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Customer Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Thêm khách hàng" size="sm">
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Họ và tên</label>
            <Input placeholder="Nguyễn Văn A" value={newName} onChange={e => setNewName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Số điện thoại</label>
            <Input placeholder="0901234567" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Hủy</Button>
            <Button className="flex-1" onClick={handleCreate}>Thêm</Button>
          </div>
        </div>
      </Modal>

      {/* Add Points Modal */}
      <Modal open={!!pointsCustomer} onClose={() => { setPointsCustomer(null); setPointsValue(''); }} title="Thêm điểm tích lũy" size="sm">
        <div className="p-6 space-y-4">
          {pointsCustomer && (() => {
            const tier = getTier(pointsCustomer.tier);
            const nextTier = getNextTier(pointsCustomer.tier);
            const progress = getProgressToNextTier(pointsCustomer.total_spent || 0, pointsCustomer.tier);
            const discount = TIER_VOUCHERS[pointsCustomer.tier] || 2;
            return (
              <>
                <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{tier.icon}</span>
                    <p className="font-medium">{pointsCustomer.name}</p>
                    <Badge className={`ml-auto text-[10px] ${tier.badgeClass}`}>{tier.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{pointsCustomer.phone}</p>
                </div>

                <div className="rounded-2xl bg-muted/30 p-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Chi tiêu</p>
                      <p className="text-sm font-bold text-emerald-400">{formatCurrency(pointsCustomer.total_spent || 0)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Điểm</p>
                      <p className="text-sm font-bold">{pointsCustomer.points || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Giảm</p>
                      <p className="text-sm font-bold text-primary">-{discount}%</p>
                    </div>
                  </div>
                  {nextTier && (
                    <>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            tier.name === 'Bronze' ? 'bg-amber-500' :
                            tier.name === 'Silver' ? 'bg-slate-400' :
                            tier.name === 'Gold' ? 'bg-yellow-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground text-center">
                        {progress}% — Còn {formatCurrency(nextTier.min - (pointsCustomer.total_spent || 0))} lên {nextTier.label}
                      </p>
                    </>
                  )}
                </div>
              </>
            );
          })()}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Số điểm muốn thêm</label>
            <Input type="number" min={1} placeholder="VD: 50" value={pointsValue} onChange={e => setPointsValue(e.target.value)} />
            <p className="text-[10px] text-muted-foreground mt-1">Cứ 1.000đ chi tiêu = 1 điểm tích lũy</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => { setPointsCustomer(null); setPointsValue(''); }}>Hủy</Button>
            <Button className="flex-1" onClick={handleAddPoints} loading={actionLoading} disabled={!pointsValue || parseInt(pointsValue) <= 0}>Xác nhận</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal open={!!editCustomer} onClose={() => setEditCustomer(null)} title="Sửa khách hàng" size="sm">
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Họ và tên</label>
            <Input placeholder="Nguyễn Văn A" value={editName} onChange={e => setEditName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Số điện thoại</label>
            <Input placeholder="0901234567" value={editPhone} onChange={e => setEditPhone(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setEditCustomer(null)}>Hủy</Button>
            <Button className="flex-1" onClick={handleEditSave} loading={actionLoading} disabled={!editName.trim() || !editPhone.trim()}>Lưu</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Xác nhận xóa" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>Hủy</Button>
            <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteConfirmId)} loading={actionLoading}>Xóa</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
