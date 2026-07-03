import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Coffee, Play, Square, History, Filter,
  X, CheckCircle2, Calendar, Search, Timer, LogIn, LogOut, Users,
  ChevronRight, AlertCircle, Check, UserPlus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, formatTime, formatDuration, cn } from '@/lib/utils';
import {
  getShifts, getActiveShifts, getMyActiveShift,
  getShiftStats, clockIn, clockOut, getStaff
} from '@/api/staff';
import { createUser } from '@/api/settings';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const SHIFT_OPTIONS = [
  { value: 'Ca sáng', label: 'Ca sáng', sub: '06:00 - 14:00', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', badge: 'bg-amber-500/10 text-amber-400' },
  { value: 'Ca chiều', label: 'Ca chiều', sub: '14:00 - 22:00', color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10', badge: 'bg-blue-500/10 text-blue-400' },
  { value: 'Ca đêm', label: 'Ca đêm', sub: '22:00 - 06:00', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10', badge: 'bg-purple-500/10 text-purple-400' },
  { value: 'Ca ngày', label: 'Ca ngày', sub: '08:00 - 17:00', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', badge: 'bg-emerald-500/10 text-emerald-400' },
  { value: 'Làm thêm', label: 'Làm thêm', sub: 'Tăng ca', color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10', badge: 'bg-orange-500/10 text-orange-400' },
];

const ROLE_COLORS = {
  admin: 'from-rose-500 to-pink-600',
  staff: 'from-indigo-500 to-purple-600',
  cashier: 'from-emerald-500 to-teal-600',
  bartender: 'from-orange-500 to-amber-600',
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

// ── Clock In Modal ──────────────────────────────────────────
function ClockInModal({ staffMember, onClose, onSuccess }) {
  const [shiftName, setShiftName] = useState('Ca ngày');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const now = new Date();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clockIn({
        user_id: staffMember.id,
        staff_name: staffMember.full_name || staffMember.username,
        role: staffMember.role,
        shift_name: shiftName,
        notes: notes || undefined,
      });
      toast.success(`Đã bắt đầu ca cho ${staffMember.full_name || staffMember.username}`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selOpt = SHIFT_OPTIONS.find(o => o.value === shiftName);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 24 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className={cn(
            'flex items-center justify-between p-5 border-b border-border',
            'bg-gradient-to-r from-emerald-500/15 to-teal-500/10'
          )}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                <LogIn size={20} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Chấm công bắt đầu ca</h3>
                <p className="text-xs text-muted-foreground">
                  {now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-2xl hover:bg-muted flex items-center justify-center transition-colors">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Staff identity */}
            <div className={cn(
              'flex items-center gap-3 p-3 rounded-2xl border',
              selOpt?.border || 'border-emerald-500/20',
              selOpt?.bg || 'bg-emerald-500/5'
            )}>
              <div className={cn(
                'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg',
                ROLE_COLORS[staffMember.role] || ROLE_COLORS.staff
              )}>
                {staffMember.full_name?.[0]?.toUpperCase() || staffMember.username?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{staffMember.full_name || staffMember.username}</p>
                <p className="text-xs text-muted-foreground capitalize">{staffMember.role}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-400">{now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-xs text-muted-foreground">bắt đầu</p>
              </div>
            </div>

            {/* Shift selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Chọn ca làm việc</label>
              <div className="space-y-2">
                {SHIFT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setShiftName(opt.value)}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-2xl border text-sm transition-all text-left',
                      shiftName === opt.value
                        ? `${opt.border} ${opt.bg}`
                        : 'border-border hover:border-emerald-500/30 hover:bg-emerald-500/5'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('w-8 h-8 rounded-2xl flex items-center justify-center', shiftName === opt.value ? opt.bg : 'bg-muted')}>
                        <Clock size={14} className={shiftName === opt.value ? opt.color : 'text-muted-foreground'} />
                      </div>
                      <div>
                        <p className={cn('font-semibold', shiftName === opt.value ? opt.color : 'text-foreground')}>{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.sub}</p>
                      </div>
                    </div>
                    {shiftName === opt.value && <CheckCircle2 size={18} className={opt.color} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Ghi chú</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="VD: Thay ca, ca trực đặc biệt..."
                rows={2}
                className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50 resize-none"
              />
            </div>

            {/* Confirmation preview */}
            <div className="rounded-2xl bg-muted/50 border border-border p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 size={13} className="text-emerald-400" />
                Xác nhận chấm công
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-foreground">{staffMember.full_name || staffMember.username}</span>
                <ChevronRight size={14} className="text-muted-foreground" />
                <span className={selOpt?.color || 'text-muted-foreground'}>{shiftName}</span>
                <ChevronRight size={14} className="text-muted-foreground" />
                <span className="text-emerald-400 font-medium">{formatTime(now.toISOString())}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Hủy</Button>
              <Button type="submit" variant="success" className="flex-1" loading={loading}>
                <Play size={16} /> Bắt đầu ca
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Clock Out Modal ────────────────────────────────────────
function ClockOutModal({ shift, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const now = new Date();

  useEffect(() => {
    if (!shift?.start_time) return;
    const update = () => setElapsed(new Date() - new Date(shift.start_time));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [shift]);

  const fmtElapsed = (ms) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const shiftOpt = SHIFT_OPTIONS.find(o => o.value === shift?.shift_name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clockOut(shift.id);
      toast.success(`Kết thúc ca cho ${shift.staff_name}`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 24 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-rose-500/15 to-red-500/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/20 flex items-center justify-center">
                <LogOut size={20} className="text-rose-400" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Kết thúc ca làm việc</h3>
                <p className="text-xs text-muted-foreground">{formatDate(now.toISOString())}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-2xl hover:bg-muted flex items-center justify-center transition-colors">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Staff info */}
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-rose-500/20 bg-rose-500/5">
              <div className={cn(
                'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg',
                ROLE_COLORS[shift.role] || ROLE_COLORS.staff
              )}>
                {shift.staff_name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{shift.staff_name}</p>
                <p className={cn('text-xs font-medium', shiftOpt?.color || 'text-muted-foreground')}>{shift.shift_name}</p>
              </div>
            </div>

            {/* Time row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-border bg-muted/50 p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-0.5">Bắt đầu</p>
                <p className="text-sm font-semibold">{formatTime(shift.start_time)}</p>
              </div>
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3 text-center">
                <p className="text-[10px] text-rose-400 mb-0.5">Kết thúc</p>
                <p className="text-sm font-semibold text-rose-400">{formatTime(now.toISOString())}</p>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
                <p className="text-[10px] text-emerald-400 mb-0.5">Giờ làm</p>
                <p className="text-sm font-bold text-emerald-400">{formatDuration(shift.start_time, now.toISOString())}</p>
              </div>
            </div>

            {/* Big live timer */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer size={16} className="text-emerald-400" />
                <span className="text-xs text-muted-foreground">Thời gian làm việc</span>
              </div>
              <p className="text-4xl font-bold font-mono text-emerald-400 tracking-widest">{fmtElapsed(elapsed)}</p>
            </div>

            {shift.notes && (
              <div className="rounded-2xl bg-muted/50 border border-border p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Ghi chú</p>
                <p className="text-sm">{shift.notes}</p>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Hủy</Button>
              <Button type="submit" variant="destructive" className="flex-1" loading={loading}>
                <Square size={16} /> Kết thúc ca
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── My Shift Banner ─────────────────────────────────────────
function MyShiftBanner({ myActiveShift, staff, user, onClockIn, onClockOut }) {
  const [elapsed, setElapsed] = useState(0);
  const now = new Date();

  useEffect(() => {
    if (!myActiveShift?.start_time) return;
    const update = () => setElapsed(new Date() - new Date(myActiveShift.start_time));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [myActiveShift]);

  const fmtElapsed = (ms) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const shiftOpt = SHIFT_OPTIONS.find(o => o.value === myActiveShift?.shift_name);

  // Find my staff record
  const myStaff = staff.find(s => s.id === myActiveShift?.user_id);
  const myStaffRecord = staff.find(s => s.username === user?.username || s.id === user?.id);

  if (myActiveShift) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/8 to-cyan-500/8 p-5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(52,211,153,0.03)_50%,transparent_100%)] animate-pulse" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-semibold text-emerald-400">Ca làm việc hiện tại</span>
            </div>
            <Badge className={shiftOpt?.badge || 'bg-emerald-500/10 text-emerald-400'}>{myActiveShift.shift_name}</Badge>
          </div>

          <div className="flex items-center gap-6">
            {/* Live timer */}
            <div className="text-center shrink-0">
              <p className="text-4xl font-bold font-mono text-emerald-400 tracking-widest">{fmtElapsed(elapsed)}</p>
              <p className="text-xs text-muted-foreground mt-1">thời gian làm việc</p>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <LogIn size={13} />
                Bắt đầu: <span className="text-foreground font-medium">{formatTime(myActiveShift.start_time)}</span>
                <span className="text-muted-foreground/50">·</span>
                <span>{formatDate(myActiveShift.start_time)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock size={13} />
                Hiện tại: <span className="text-emerald-400 font-medium">{now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              {myStaff && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users size={13} />
                  {myStaff.full_name || myStaff.username} · <span className="capitalize">{myStaff.role}</span>
                </div>
              )}
            </div>

            {/* End shift */}
            <div className="shrink-0">
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5"
                onClick={() => onClockOut(myActiveShift)}
              >
                <Square size={13} /> Kết thúc ca
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Not clocked in yet
  const targetStaff = myStaffRecord || staff.find(s => s.role !== 'admin') || staff[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border-2 border-dashed border-amber-500/40 bg-amber-500/5 p-5 text-center cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/60 transition-all group"
      onClick={() => targetStaff && onClockIn(targetStaff)}
    >
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
        <Coffee size={28} className="text-amber-400/70" />
      </div>
      <p className="text-base font-semibold text-amber-400 mb-1">Bạn chưa bắt đầu ca hôm nay</p>
      <p className="text-sm text-muted-foreground mb-3">
        Nhấn vào đây hoặc bấm tên mình bên dưới để chấm công bắt đầu ca
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400 font-medium">
        <LogIn size={15} />
        Bắt đầu ca ngay
      </div>
    </motion.div>
  );
}

// ── Staff Card ──────────────────────────────────────────────
function StaffCard({ staffMember, activeShift, user, onClockIn, onClockOut, canManage }) {
  const [elapsed, setElapsed] = useState(0);
  const isActive = !!activeShift;
  const isMe = user?.id === staffMember.id || user?.username === staffMember.username;
  const shiftOpt = SHIFT_OPTIONS.find(o => o.value === activeShift?.shift_name);

  useEffect(() => {
    if (!isActive || !activeShift?.start_time) return;
    const update = () => setElapsed(new Date() - new Date(activeShift.start_time));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [isActive, activeShift]);

  const fmtElapsed = (ms) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleClick = () => {
    if (isActive) return;
    if (canManage) {
      onClockIn(staffMember);
    } else if (isMe) {
      onClockIn(staffMember);
    }
  };

  const cursorStyle = !isActive && (canManage || isMe) ? 'cursor-pointer' : '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'rounded-2xl border p-4 transition-all relative',
        isActive
          ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-teal-500/5'
          : 'border-border bg-card hover:border-emerald-500/30 hover:bg-emerald-500/5',
        cursorStyle
      )}
      onClick={handleClick}
    >
      {/* Active glow */}
      {isActive && (
        <div className="absolute top-3 right-3">
          <Badge variant="success" className="text-[10px] gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Đang làm
          </Badge>
        </div>
      )}

      {/* "Bạn" badge */}
      {isMe && !isActive && (
        <div className="absolute top-3 right-3">
          <Badge variant="info" className="text-[10px]">Bạn</Badge>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={cn(
          'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg shrink-0',
          ROLE_COLORS[staffMember.role] || ROLE_COLORS.staff,
          isActive && 'ring-2 ring-emerald-500/50',
          !isActive && (canManage || isMe) && 'group-hover:ring-2 group-hover:ring-emerald-500/30'
        )}>
          {staffMember.full_name?.[0]?.toUpperCase() || staffMember.username?.[0]?.toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="font-semibold text-sm truncate">{staffMember.full_name || staffMember.username}</p>
            {isMe && <span className="text-[10px] text-emerald-400 font-medium shrink-0">· Bạn</span>}
          </div>
          <p className="text-xs text-muted-foreground capitalize mb-3">{staffMember.role}</p>

          {isActive ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className={cn('text-xs font-medium', shiftOpt?.color)}>{activeShift.shift_name}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">từ {formatTime(activeShift.start_time)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-emerald-500/20 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: '100%' }} />
                </div>
                <span className="text-sm font-bold font-mono text-emerald-400 shrink-0">{fmtElapsed(elapsed)}</span>
              </div>
              <Button
                size="sm"
                variant="destructive"
                className="w-full h-7 text-[11px] gap-1"
                onClick={(e) => { e.stopPropagation(); onClockOut(activeShift); }}
              >
                <Square size={10} /> Kết thúc ca
              </Button>
            </div>
          ) : (
            <div className={cn(
              'flex items-center gap-1.5 text-xs',
              (canManage || isMe) ? 'text-emerald-500' : 'text-muted-foreground'
            )}>
              {(canManage || isMe) ? (
                <>
                  <LogIn size={12} />
                  <span>Bấm để chấm công</span>
                  <ChevronRight size={11} />
                </>
              ) : (
                <>
                  <AlertCircle size={11} />
                  <span>Chưa check-in</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main ────────────────────────────────────────────────────
export default function StaffPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [allShifts, setAllShifts] = useState([]);
  const [activeShifts, setActiveShifts] = useState([]);
  const [myActiveShift, setMyActiveShift] = useState(null);
  const [staff, setStaff] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('clock');
  const [clockInTarget, setClockInTarget] = useState(null);
  const [clockOutTarget, setClockOutTarget] = useState(null);
  const [filterStaff, setFilterStaff] = useState('');
  const [staffSearch, setStaffSearch] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ full_name: '', phone: '', cccd: '', username: '', password: '', role: 'staff' });
  const [addingStaff, setAddingStaff] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [shiftsRes, activeRes, staffRes] = await Promise.all([
        getShifts({ limit: 200 }),
        getActiveShifts(),
        getStaff(),
      ]);
      setAllShifts(shiftsRes.shifts || []);
      setActiveShifts(activeRes.shifts || []);
      setStaff(staffRes.staff || []);
    } catch (err) {
      toast.error('Không tải được dữ liệu: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyShift = useCallback(async () => {
    try {
      const res = await getMyActiveShift();
      setMyActiveShift(res.shift || null);
    } catch {}
  }, []);

  const fetchStats = useCallback(async () => {
    if (view !== 'history') return;
    try {
      const params = {};
      if (filterStaff) params.user_id = filterStaff;
      if (filterDateFrom) params.date_from = filterDateFrom;
      if (filterDateTo) params.date_to = filterDateTo;
      const res = await getShiftStats(params);
      setStats(res.stats);
    } catch {}
  }, [view, filterStaff, filterDateFrom, filterDateTo]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchMyShift(); }, [fetchMyShift]);

  useEffect(() => {
    const t = setInterval(() => { fetchData(); fetchMyShift(); }, 30000);
    return () => clearInterval(t);
  }, [fetchData, fetchMyShift]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleAddStaff = async () => {
    if (!newStaff.full_name.trim() || !newStaff.username.trim() || !newStaff.password.trim()) {
      toast.error('Vui lòng nhập họ tên, tài khoản và mật khẩu');
      return;
    }
    setAddingStaff(true);
    try {
      await createUser({
        ...newStaff,
        full_name: newStaff.full_name.trim(),
        phone: newStaff.phone.trim(),
        cccd: newStaff.cccd.trim(),
        username: newStaff.username.trim(),
      });
      toast.success('Đã thêm nhân viên mới');
      setShowAddStaff(false);
      setNewStaff({ full_name: '', phone: '', cccd: '', username: '', password: '', role: 'staff' });
      fetchData();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setAddingStaff(false);
    }
  };

  const filteredShifts = allShifts.filter(s => {
    if (filterStaff && String(s.user_id) !== filterStaff) return false;
    if (filterDateFrom && s.date < filterDateFrom) return false;
    if (filterDateTo && s.date > filterDateTo) return false;
    return true;
  });

  const recentShifts = filteredShifts.slice(0, 50);
  const shiftLabelColor = (name) => SHIFT_OPTIONS.find(o => o.value === name)?.color || 'text-muted-foreground';
  const filteredStaffList = staff.filter(member =>
    !staffSearch
    || member.full_name?.toLowerCase().includes(staffSearch.toLowerCase())
    || member.username?.toLowerCase().includes(staffSearch.toLowerCase())
    || member.role?.toLowerCase().includes(staffSearch.toLowerCase())
  );

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">

      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Chấm công nhân viên</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeShifts.length > 0
              ? `${activeShifts.length} nhân viên đang làm việc`
              : 'Không có nhân viên nào đang làm'}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant={view === 'clock' ? 'default' : 'outline'} size="sm" onClick={() => setView('clock')}>
            <Clock size={16} /> Chấm công
          </Button>
          {isAdmin && (
            <Button variant={view === 'history' ? 'default' : 'outline'} size="sm" onClick={() => setView('history')}>
              <History size={16} /> Lịch sử
            </Button>
          )}
          {isAdmin && (
            <Button size="sm" onClick={() => setShowAddStaff(true)}>
              <UserPlus size={16} /> Thêm nhân viên
            </Button>
          )}
        </div>
      </motion.div>

      {/* ── CHẤM CÔNG VIEW ── */}
      {view === 'clock' && (
        <>
          {/* Personal shift banner */}
          <motion.div variants={item}>
            <MyShiftBanner
              myActiveShift={myActiveShift}
              staff={staff}
              user={user}
              onClockIn={setClockInTarget}
              onClockOut={setClockOutTarget}
            />
          </motion.div>

          {/* Quick stats */}
          <motion.div variants={item}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{activeShifts.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Đang làm</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">{allShifts.filter(s => s.end_time).length}</p>
                <p className="text-xs text-muted-foreground mt-1">Ca hoàn thành</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">{staff.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Tổng nhân viên</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{staff.length - activeShifts.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Chưa check-in</p>
              </Card>
            </div>
          </motion.div>

          {/* Staff grid */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
              <h3 className="font-semibold flex items-center gap-2">
                <Users size={16} className="text-muted-foreground" />
                Danh sách nhân viên
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                <Input
                  placeholder="Tìm nhân viên..."
                  value={staffSearch}
                  onChange={e => setStaffSearch(e.target.value)}
                  className="w-60"
                />
                <span className="text-xs text-muted-foreground">
                  {isAdmin ? 'Bấm tên nhân viên để chấm công' : 'Bấm tên mình để chấm công'}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
              </div>
            ) : (
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3" layout>
                {filteredStaffList.map(s => {
                  const active = activeShifts.find(a => a.user_id === s.id);
                  return (
                    <StaffCard
                      key={s.id}
                      staffMember={s}
                      activeShift={active}
                      user={user}
                      canManage={isAdmin}
                      onClockIn={setClockInTarget}
                      onClockOut={setClockOutTarget}
                    />
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        </>
      )}

      {/* ── LỊCH SỬ VIEW (Admin) ── */}
      {view === 'history' && isAdmin && (
        <>
          {/* Filters */}
          <motion.div variants={item}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Bộ lọc lịch sử ca làm</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Nhân viên</label>
                    <select
                      value={filterStaff}
                      onChange={e => setFilterStaff(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="">Tất cả nhân viên</option>
                      {staff.map(s => (
                        <option key={s.id} value={s.id}>{s.full_name || s.username}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Từ ngày</label>
                    <input
                      type="date"
                      value={filterDateFrom}
                      onChange={e => setFilterDateFrom(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Đến ngày</label>
                    <input
                      type="date"
                      value={filterDateTo}
                      onChange={e => setFilterDateTo(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button size="sm" variant="outline" className="w-full" onClick={() => { setFilterStaff(''); setStaffSearch(''); setFilterDateFrom(''); setFilterDateTo(''); }}>
                      Xóa lọc
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          {stats && (
            <motion.div variants={item}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{stats.total_shifts || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Tổng ca đã làm</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-400">{Math.round(stats.total_hours || 0)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Giờ đã làm</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-2xl font-bold">{stats.first_shift || '—'}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ca đầu tiên</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-2xl font-bold">{stats.last_shift || '—'}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ca gần nhất</p>
                </Card>
              </div>
            </motion.div>
          )}

          {/* History table */}
          <motion.div variants={item}>
            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Lịch sử ca làm việc ({filteredShifts.length} ca)</h3>
                  {(filterStaff || filterDateFrom || filterDateTo) && (
                    <Badge variant="outline" className="text-xs">
                      Đang lọc
                    </Badge>
                  )}
                </div>
                {loading ? (
                  <div className="p-6 space-y-3">{[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12" />)}</div>
                ) : recentShifts.length === 0 ? (
                  <div className="text-center py-12">
                    <Search size={36} className="mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">Không có ca làm việc nào</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Nhân viên</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Ca</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Ngày</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Bắt đầu</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Kết thúc</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Giờ làm</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentShifts.map(s => (
                          <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  'w-7 h-7 rounded-md bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold',
                                  ROLE_COLORS[s.role] || ROLE_COLORS.staff
                                )}>
                                  {s.staff_name?.[0]?.toUpperCase()}
                                </div>
                                <span className="font-medium text-xs">{s.staff_name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={cn('text-xs font-medium', shiftLabelColor(s.shift_name))}>{s.shift_name}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">{s.date}</td>
                            <td className="px-4 py-3 text-xs">{formatTime(s.start_time)}</td>
                            <td className="px-4 py-3 text-xs">{s.end_time ? formatTime(s.end_time) : '—'}</td>
                            <td className="px-4 py-3">
                              {s.end_time ? (
                                <span className="text-xs font-medium text-emerald-400">{formatDuration(s.start_time, s.end_time)}</span>
                              ) : (
                                <span className="text-xs text-amber-400 animate-pulse">{formatDuration(s.start_time)}</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {s.end_time ? (
                                <Badge variant="success" className="text-xs">Hoàn thành</Badge>
                              ) : (
                                <Badge variant="warning" className="text-xs">Đang làm</Badge>
                              )}
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
        </>
      )}

      {/* Modals */}
      <AnimatePresence>
        {clockInTarget && (
          <ClockInModal
            staffMember={clockInTarget}
            onClose={() => setClockInTarget(null)}
            onSuccess={() => { fetchData(); fetchMyShift(); }}
          />
        )}
        {clockOutTarget && (
          <ClockOutModal
            shift={clockOutTarget}
            onClose={() => setClockOutTarget(null)}
            onSuccess={() => { fetchData(); fetchMyShift(); }}
          />
        )}
        {showAddStaff && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setShowAddStaff(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-indigo-500/15 to-purple-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <UserPlus size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">Thêm nhân viên mới</h3>
                    <p className="text-xs text-muted-foreground">Nhập thông tin nhân viên</p>
                  </div>
                </div>
                <button onClick={() => setShowAddStaff(false)} className="w-8 h-8 rounded-2xl hover:bg-muted flex items-center justify-center transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Họ và tên <span className="text-red-400">*</span></label>
                  <Input
                    value={newStaff.full_name}
                    onChange={e => setNewStaff(p => ({ ...p, full_name: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Số điện thoại</label>
                  <Input
                    value={newStaff.phone}
                    onChange={e => setNewStaff(p => ({ ...p, phone: e.target.value }))}
                    placeholder="0901234567"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">CCCD / CMND</label>
                  <Input
                    value={newStaff.cccd}
                    onChange={e => setNewStaff(p => ({ ...p, cccd: e.target.value }))}
                    placeholder="07920300xxxx"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Tên đăng nhập <span className="text-red-400">*</span></label>
                  <Input
                    value={newStaff.username}
                    onChange={e => setNewStaff(p => ({ ...p, username: e.target.value }))}
                    placeholder="nhanvien01"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Mật khẩu <span className="text-red-400">*</span></label>
                  <Input
                    type="password"
                    value={newStaff.password}
                    onChange={e => setNewStaff(p => ({ ...p, password: e.target.value }))}
                    placeholder="Ít nhất 6 ký tự"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Vai trò</label>
                  <select
                    className="w-full h-10 px-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:border-indigo-500/50"
                    value={newStaff.role}
                    onChange={e => setNewStaff(p => ({ ...p, role: e.target.value }))}
                  >
                    <option value="staff">Nhân viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>

                <div className="rounded-2xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                  Sau khi thêm, nhân viên sẽ xuất hiện trong danh sách để chấm công.
                </div>

                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowAddStaff(false)}>
                    Hủy
                  </Button>
                  <Button type="button" className="flex-1" onClick={handleAddStaff} loading={addingStaff}>
                    <UserPlus size={16} /> Thêm nhân viên
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
