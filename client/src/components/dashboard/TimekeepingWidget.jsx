import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Play, Square, X, CheckCircle2, Coffee, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getActiveShifts, getStaff, clockIn, clockOut } from '@/api/staff';
import { toast } from 'sonner';

const SHIFT_OPTIONS = [
  { value: 'Ca sáng', label: 'Ca sáng', sub: '06:00-14:00' },
  { value: 'Ca chiều', label: 'Ca chiều', sub: '14:00-22:00' },
  { value: 'Ca đêm', label: 'Ca đêm', sub: '22:00-06:00' },
  { value: 'Ca ngày', label: 'Ca ngày', sub: '08:00-17:00' },
  { value: 'Làm thêm', label: 'Làm thêm', sub: 'tăng ca' },
];

const ROLE_COLORS = {
  admin: 'from-rose-500 to-pink-600',
  staff: 'from-indigo-500 to-purple-600',
  cashier: 'from-emerald-500 to-teal-600',
  bartender: 'from-orange-500 to-amber-600',
};

function ClockInPanel({ staff, activeShifts, onClose, onSuccess }) {
  const [selected, setSelected] = useState(null);
  const [shiftName, setShiftName] = useState('Ca ngày');
  const [loading, setLoading] = useState(false);

  const handleClockIn = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await clockIn({
        user_id: selected.id,
        staff_name: selected.full_name || selected.username,
        role: selected.role,
        shift_name: shiftName,
      });
      toast.success(`Bắt đầu ca: ${selected.full_name || selected.username}`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      className="absolute top-full left-0 right-0 mt-2 z-20 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Play size={14} className="text-emerald-400" />
          Bắt đầu ca làm việc
        </div>
        <button onClick={onClose} className="w-6 h-6 rounded-md hover:bg-muted flex items-center justify-center transition-colors">
          <X size={13} />
        </button>
      </div>
      <div className="p-3 space-y-3 max-h-72 overflow-y-auto">
        {/* Shift selector */}
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Chọn ca</p>
          <div className="flex gap-1.5 flex-wrap">
            {SHIFT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setShiftName(opt.value)}
                className={cn(
                  'px-2.5 py-1.5 rounded-2xl border text-xs font-medium transition-all',
                  shiftName === opt.value
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : 'border-border hover:border-emerald-500/30 text-muted-foreground'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {/* Staff list */}
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Chọn nhân viên</p>
          <div className="space-y-1">
            {staff.map(s => {
              const isActive = activeShifts.some(a => a.user_id === s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => !isActive && setSelected(s)}
                  disabled={isActive}
                  className={cn(
                    'w-full flex items-center gap-2.5 p-2 rounded-2xl border transition-all text-left',
                    selected?.id === s.id
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : isActive
                      ? 'border-border opacity-40 cursor-not-allowed'
                      : 'border-border hover:border-emerald-500/30 hover:bg-emerald-500/5'
                  )}
                >
                  <div className={cn('w-7 h-7 rounded-md bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold',
                    ROLE_COLORS[s.role] || ROLE_COLORS.staff
                  )}>
                    {s.full_name?.[0]?.toUpperCase() || s.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{s.full_name || s.username}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{s.role}</p>
                  </div>
                  {isActive && <span className="text-[10px] text-emerald-400 font-medium">Đang làm</span>}
                  {selected?.id === s.id && <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
        {selected && (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-2">
            <p className="text-xs text-emerald-400">
              <strong>{selected.full_name || selected.username}</strong> · {shiftName} · {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        )}
        <button
          onClick={handleClockIn}
          disabled={!selected || loading}
          className={cn(
            'w-full py-2 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2',
            selected
              ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.97]'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Play size={14} /> Bắt đầu ca</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function ClockOutPanel({ shift, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const hours = shift.start_time
    ? Math.round((new Date() - new Date(shift.start_time)) / 3600000 * 10) / 10
    : 0;

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await clockOut(shift.id);
      toast.success(`Kết thúc ca: ${shift.staff_name}`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      className="absolute top-full left-0 right-0 mt-2 z-20 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Square size={14} className="text-rose-400" />
          Kết thúc ca làm việc
        </div>
        <button onClick={onClose} className="w-6 h-6 rounded-md hover:bg-muted flex items-center justify-center transition-colors">
          <X size={13} />
        </button>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl border border-border">
          <div className={cn('w-9 h-9 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold',
            ROLE_COLORS[shift.role] || ROLE_COLORS.staff
          )}>
            {shift.staff_name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{shift.staff_name}</p>
            <p className="text-xs text-muted-foreground">{shift.shift_name} · {shift.staff_name}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-muted/50 p-2 text-center">
            <p className="text-[10px] text-muted-foreground">Bắt đầu</p>
            <p className="text-xs font-semibold mt-0.5">
              {new Date(shift.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-2 text-center">
            <p className="text-[10px] text-muted-foreground">Đã làm</p>
            <p className="text-xs font-bold text-emerald-400 mt-0.5">{hours}h</p>
          </div>
        </div>
        <button
          onClick={handleClockOut}
          disabled={loading}
          className="w-full py-2 rounded-2xl text-sm font-semibold bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
        >
          {loading
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <><Square size={14} /> Kết thúc ca</>
          }
        </button>
      </div>
    </motion.div>
  );
}

export default function TimekeepingWidget({ className }) {
  const [activeShifts, setActiveShifts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClockIn, setShowClockIn] = useState(false);
  const [showClockOut, setShowClockOut] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [activeRes, staffRes] = await Promise.all([
        getActiveShifts(),
        getStaff(),
      ]);
      setActiveShifts(activeRes.shifts || []);
      setStaff(staffRes.staff || []);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-refresh every 30s
  useEffect(() => {
    const timer = setInterval(fetchData, 30000);
    return () => clearInterval(timer);
  }, [fetchData]);

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
            <Clock size={15} className="text-indigo-400" />
          </div>
          <span className="text-sm font-semibold">Chấm công</span>
        </div>
        <button
          onClick={() => { setShowClockIn(v => !v); setShowClockOut(null); }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 active:scale-[0.97] transition-all"
        >
          <Play size={11} /> Bắt đầu ca
        </button>
      </div>

      {/* Active shifts */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="h-12 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : activeShifts.length === 0 ? (
        <div
          onClick={() => setShowClockIn(v => !v)}
          className="flex flex-col items-center justify-center py-5 rounded-2xl border border-dashed border-border cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all"
        >
          <Coffee size={20} className="text-muted-foreground/40 mb-1.5" />
          <p className="text-xs text-muted-foreground">Không ai đang làm việc</p>
          <p className="text-[10px] text-emerald-500 mt-0.5">Bấm để bắt đầu ca</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activeShifts.map(shift => {
            const hours = shift.start_time
              ? Math.round((new Date() - new Date(shift.start_time)) / 3600000 * 10) / 10
              : 0;
            return (
              <div
                key={shift.id}
                className="flex items-center gap-2.5 p-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5"
              >
                <div className={cn('w-8 h-8 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold flex-shrink-0',
                  ROLE_COLORS[shift.role] || ROLE_COLORS.staff
                )}>
                  {shift.staff_name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{shift.staff_name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">{shift.shift_name}</span>
                    <span className="text-[10px] text-emerald-400 font-medium">{hours}h</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowClockOut(shift)}
                  className="flex-shrink-0 px-2 py-1 rounded-2xl bg-rose-500/20 text-rose-400 text-[10px] font-semibold hover:bg-rose-500/30 transition-colors flex items-center gap-1"
                >
                  <Square size={9} /> Kết thúc
                </button>
              </div>
            );
          })}
          <button
            onClick={() => setShowClockIn(v => !v)}
            className="w-full py-1.5 rounded-2xl border border-dashed border-border text-xs text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
          >
            + Thêm nhân viên vào ca
          </button>
        </div>
      )}

      {/* Clock In Panel */}
      <AnimatePresence>
        {showClockIn && (
          <ClockInPanel
            staff={staff}
            activeShifts={activeShifts}
            onClose={() => setShowClockIn(false)}
            onSuccess={fetchData}
          />
        )}
      </AnimatePresence>

      {/* Clock Out Panel */}
      <AnimatePresence>
        {showClockOut && (
          <ClockOutPanel
            shift={showClockOut}
            onClose={() => setShowClockOut(null)}
            onSuccess={fetchData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
