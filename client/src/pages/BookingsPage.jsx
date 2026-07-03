import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, CheckCircle, XCircle, AlertCircle, CalendarCheck, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, getTableLabel } from '@/lib/utils';
import { getBookings, createBooking, confirmBooking, cancelBooking, startFromBooking, holdBooking, updateBooking, deleteBooking } from '@/api/bookings';
import { getTables } from '@/api/tables';
import { toast } from 'sonner';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const statusConfig = {
  pending:    { label: 'Chờ xác nhận',  variant: 'warning',   icon: Clock,         color: 'text-amber-400',  bg: 'bg-amber-400/10 border-amber-400/20' },
  confirmed: { label: 'Đã xác nhận',   variant: 'info',      icon: CheckCircle,   color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  held:      { label: 'Giữ chỗ',       variant: 'warning',   icon: CalendarCheck,  color: 'text-amber-300',  bg: 'bg-amber-400/10 border-amber-400/20' },
  active:    { label: 'Đang chơi',     variant: 'success',   icon: CheckCircle,   color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  checked_in:{ label: 'Đã check-in',    variant: 'success',   icon: CheckCircle,   color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  completed: { label: 'Hoàn thành',     variant: 'default',   icon: CheckCircle,   color: 'text-slate-400',  bg: 'bg-slate-500/10 border-slate-500/20' },
  cancelled: { label: 'Đã hủy',         variant: 'destructive', icon: XCircle,     color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
  no_show:   { label: 'Không đến',     variant: 'destructive', icon: XCircle,     color: 'text-red-300',    bg: 'bg-red-500/10 border-red-500/20' },
};

function BookingRow({ booking, onConfirm, onCancel, onStart, onHold, onEdit, onDelete, isAdmin }) {
  const cfg = statusConfig[booking.status] || statusConfig.pending;
  const Icon = cfg.icon;

  return (
    <motion.div
      variants={item}
      className="rounded-2xl border bg-card overflow-hidden hover:border-indigo-500/30 transition-all"
    >
      <div className="flex items-center justify-between p-5">
        {/* Left: info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${cfg.bg}`}>
            <Icon size={20} className={cfg.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="font-semibold text-base">{booking.customer_name}</p>
              <Badge variant={cfg.variant} className="text-xs gap-1">
                <Icon size={10} />{cfg.label}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
              <span>{booking.phone}</span>
              {booking.table_id && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                  Ban {booking.table_name || booking.table_id}
                </span>
              )}
            </div>
            {booking.start_time && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <CalendarCheck size={12} />
                {formatDate(booking.start_time)}
                {booking.end_time && ` - ${formatDate(booking.end_time)}`}
              </div>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 ml-4 shrink-0">
          {booking.status === 'pending' && (
            <>
              <Button size="sm" variant="success" onClick={() => onConfirm(booking.id)} className="gap-1.5">
                <CheckCircle size={14} /> Xác nhận
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onCancel(booking.id)} className="gap-1.5">
                <XCircle size={14} /> Hủy
              </Button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <>
              <Button size="sm" onClick={() => onHold(booking.id)} className="gap-1.5">
                <CalendarCheck size={14} /> Giữ chỗ
              </Button>
              <Button size="sm" onClick={() => onStart(booking.id)} className="gap-1.5">
                <AlertCircle size={14} /> Bắt đầu
              </Button>
            </>
          )}
          {booking.status === 'held' && (
            <Button size="sm" variant="success" onClick={() => onStart(booking.id)} className="gap-1.5">
              <CalendarCheck size={14} /> Xác nhận đến
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => onEdit(booking)} className="gap-1.5 px-2" title="Chỉnh sửa">
            <Pencil size={14} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(booking)} className="gap-1.5 px-2 hover:text-red-400" title="Xóa">
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    table_id: '',
    start_time: '',
    end_time: '',
  });
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null); // booking đang sửa
  const [editForm, setEditForm] = useState({ customer_name: '', phone: '', table_id: '', start_time: '', end_time: '', notes: '' });
  const [savingEdit, setSavingEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // booking sắp xóa
  const [deleting, setDeleting] = useState(false);

  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data.bookings || data || []);
    } catch { toast.error('Lỗi khi tải lịch sử đặt bàn'); }
    finally { setLoading(false); }
  };

  const fetchTables = async () => {
    try {
      const data = await getTables();
      const list = data.tables || data || [];
      setTables(list.filter(t => t.status === 'available' || t.status === 'empty'));
    } catch {}
  };

  useEffect(() => {
    fetchBookings();
    fetchTables();
  }, []);

  useEffect(() => {
    if (showModal) fetchTables();
  }, [showModal]);

  const handleCreate = async () => {
    if (!form.customer_name.trim() || !form.phone.trim()) {
      toast.error('Vui lòng nhập tên và SDT');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        customer_name: form.customer_name.trim(),
        phone: form.phone.trim(),
        start_time: form.start_time,
        ...(form.table_id ? { table_id: Number(form.table_id) } : {}),
        ...(form.end_time ? { end_time: form.end_time } : {}),
      };
      await createBooking(payload);
      toast.success('Đã tạo đặt trước');
      setShowModal(false);
      setForm({ customer_name: '', phone: '', table_id: '', start_time: '', end_time: '' });
      fetchBookings();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleConfirm = async (id) => {
    try { await confirmBooking(id); toast.success('Đã xác nhận'); fetchBookings(); }
    catch (e) { toast.error(e.message); }
  };

  const handleHold = async (id) => {
    try { await holdBooking(id); toast.success('Đã chuyển giữ chỗ — bàn hiển thị "Giữ chỗ"'); fetchBookings(); }
    catch (e) { toast.error(e.message); }
  };

  const handleEdit = (booking) => {
    setEditing(booking);
    // start_time từ DB có dạng ISO, cần convert sang input datetime-local
    const toLocalInput = (iso) => {
      if (!iso) return '';
      const d = new Date(iso);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    setEditForm({
      customer_name: booking.customer_name || '',
      phone: booking.phone || '',
      table_id: booking.table_id || '',
      start_time: toLocalInput(booking.start_time),
      end_time: toLocalInput(booking.end_time),
      notes: booking.notes || '',
    });
  };

  const handleUpdate = async () => {
    if (!editing) return;
    if (!editForm.customer_name?.trim()) { toast.error('Vui lòng nhập tên khách'); return; }
    setSavingEdit(true);
    try {
      const payload = {
        customer_name: editForm.customer_name.trim(),
        phone: editForm.phone?.trim() || null,
        table_id: editForm.table_id || null,
        start_time: editForm.start_time ? new Date(editForm.start_time).toISOString() : null,
        end_time: editForm.end_time ? new Date(editForm.end_time).toISOString() : null,
        notes: editForm.notes?.trim() || null,
      };
      await updateBooking(editing.id, payload);
      toast.success('Đã cập nhật đặt bàn');
      setEditing(null);
      fetchBookings();
    } catch (e) { toast.error(e.message); }
    finally { setSavingEdit(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteBooking(confirmDelete.id);
      toast.success(`Đã xóa đặt bàn của ${confirmDelete.customer_name}`);
      setConfirmDelete(null);
      fetchBookings();
    } catch (e) { toast.error(e.message); }
    finally { setDeleting(false); }
  };

  const handleCancel = async (id) => {
    try { await cancelBooking(id); toast.success('Đã hủy'); fetchBookings(); }
    catch (e) { toast.error(e.message); }
  };

  const handleStart = async (id) => {
    try { await startFromBooking(id); toast.success('Bắt đầu chơi'); fetchBookings(); }
    catch (e) { toast.error(e.message); }
  };

  const pending = bookings.filter(b => b.status === 'pending').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const active = bookings.filter(b => b.status === 'active').length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Đặt bàn</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {bookings.length} đặt chỗ
            {pending > 0 && <span className="text-amber-400 ml-2">({pending} chờ xác nhận)</span>}
            {confirmed > 0 && <span className="text-indigo-400 ml-2">({confirmed} đã xác nhận)</span>}
            {active > 0 && <span className="text-emerald-400 ml-2">({active} đang chơi)</span>}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus size={16} /> Đặt trước
        </Button>
      </motion.div>

      {/* Booking list — no Card wrapper, direct rows */}
      <motion.div variants={item} className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border">
            <CalendarCheck size={48} className="text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">Chưa có đặt chỗ nào</p>
            <p className="text-xs text-muted-foreground mt-1">Nhấn "Đặt trước" để tạo đặt chỗ mới</p>
          </div>
        ) : (
          bookings.map(b => (
            <BookingRow
              key={b.id}
              booking={b}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onStart={handleStart}
              onHold={handleHold}
              onEdit={handleEdit}
              onDelete={(booking) => setConfirmDelete(booking)}
            />
          ))
        )}
      </motion.div>

      {/* Create Booking Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Đặt trước bàn" size="md">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Họ và tên</label>
              <Input
                placeholder="Nguyễn Văn A"
                value={form.customer_name}
                onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">SDT</label>
              <Input
                type="tel"
                placeholder="0901234567"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Bàn</label>
              <select
                className="w-full h-10 px-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                value={form.table_id}
                onChange={e => setForm(p => ({ ...p, table_id: e.target.value }))}
              >
                <option value="">Không chọn</option>
                {tables.map(t => (
                  <option key={t.id} value={t.id}>{getTableLabel(t)} ({t.status === 'available' ? 'Trống' : t.status})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Giờ bắt đầu</label>
              <Input
                type="datetime-local"
                value={form.start_time}
                onChange={e => setForm(p => ({ ...p, start_time: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Giờ kết thúc</label>
              <Input
                type="datetime-local"
                value={form.end_time}
                onChange={e => setForm(p => ({ ...p, end_time: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button className="flex-1" onClick={handleCreate} loading={saving}>Tạo đặt trước</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Booking Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Chỉnh sửa đặt bàn" size="md">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Họ và tên *</label>
              <Input
                value={editForm.customer_name}
                onChange={(e) => setEditForm({ ...editForm, customer_name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Số điện thoại</label>
              <Input
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Bàn</label>
              <select
                className="w-full h-10 px-3 rounded-xl border border-border bg-card text-sm"
                value={editForm.table_id}
                onChange={(e) => setEditForm({ ...editForm, table_id: e.target.value })}
              >
                <option value="">-- Chưa chọn bàn --</option>
                {tables.map(t => (
                  <option key={t.id} value={t.id}>{getTableLabel(t)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Giờ bắt đầu</label>
              <Input
                type="datetime-local"
                value={editForm.start_time}
                onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Giờ kết thúc</label>
              <Input
                type="datetime-local"
                value={editForm.end_time}
                onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Ghi chú</label>
              <Input
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              />
            </div>
          </div>
          {editing?.status === 'held' && (
            <p className="text-xs text-amber-400 bg-amber-500/10 rounded-xl px-3 py-2">
              ⚠ Bàn đang ở trạng thái "Giữ chỗ". Nếu đổi bàn/giờ, thông tin trên bàn sẽ tự cập nhật.
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setEditing(null)}>Hủy</Button>
            <Button className="flex-1" onClick={handleUpdate} loading={savingEdit}>Lưu thay đổi</Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete Dialog */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Xác nhận xóa" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm">
            Bạn có chắc muốn xóa đặt bàn của <strong>{confirmDelete?.customer_name}</strong>?
          </p>
          {confirmDelete?.table_name && (
            <p className="text-xs text-muted-foreground">Bàn: {confirmDelete.table_name}</p>
          )}
          {confirmDelete?.start_time && (
            <p className="text-xs text-muted-foreground">Giờ: {formatDate(confirmDelete.start_time)}</p>
          )}
          <p className="text-xs text-amber-400 bg-amber-500/10 rounded-xl px-3 py-2">
            ⚠ Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>Hủy</Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete} loading={deleting}>
              <Trash2 size={14} /> Xóa
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
