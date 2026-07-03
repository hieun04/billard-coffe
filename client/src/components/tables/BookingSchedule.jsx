import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, User, Phone, Clock, FileText, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { getSchedule } from '@/api/bookings';
import { getTables } from '@/api/tables';
import { getTableLabel } from '@/lib/utils';

const HOURS = Array.from({ length: 16 }, (_, i) => 8 + i); // 8..23

const STATUS_CONFIG = {
  pending: {
    label: 'Chờ xác nhận',
    bg: 'bg-amber-400/80',
    text: 'text-amber-900',
    border: 'border-amber-500',
  },
  confirmed: {
    label: 'Đã xác nhận',
    bg: 'bg-orange-400/80',
    text: 'text-orange-900',
    border: 'border-orange-500',
  },
  active: {
    label: 'Đang chơi',
    bg: 'bg-emerald-400/80',
    text: 'text-emerald-900',
    border: 'border-emerald-500',
  },
  playing: {
    label: 'Đang chơi',
    bg: 'bg-emerald-400/80',
    text: 'text-emerald-900',
    border: 'border-emerald-500',
  },
  completed: {
    label: 'Hoàn thành',
    bg: 'bg-slate-300/60',
    text: 'text-slate-600',
    border: 'border-slate-400',
  },
  cancelled: {
    label: 'Đã hủy',
    bg: 'bg-slate-200/40',
    text: 'text-slate-400 line-through',
    border: 'border-slate-300',
  },
};

function formatDateLocal(date) {
  return new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
}

function formatTimeLocal(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDateKey(iso) {
  return new Date(iso).toLocaleDateString('vi-VN'); // YYYY-MM-DD in local TZ
}

function usePopover(booking) {
  const [anchor, setAnchor] = useState(null);
  const [popover, setPopover] = useState(null);

  useEffect(() => {
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    setPopover({
      x: rect.left,
      y: rect.top + rect.height + 4,
    });
  }, [anchor]);

  return { anchor, setAnchor, popover, close: () => { setAnchor(null); setPopover(null); } };
}

function BookingPopover({ booking, anchor, popover, onClose }) {
  if (!anchor || !popover) return null;
  const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  return (
    <div
      className="fixed z-[200] w-72 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
      style={{ left: popover.x, top: popover.y }}
    >
      <div className={`px-4 py-2.5 bg-muted/60 border-b border-border flex items-center justify-between`}>
        <span className="text-sm font-semibold">Chi tiết đặt bàn</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>
          {cfg.label}
        </span>
      </div>
      <div className="p-4 space-y-3 text-sm">
        <div className="flex items-center gap-2.5">
          <FileText size={14} className="text-muted-foreground shrink-0" />
          <span className="text-muted-foreground w-16 shrink-0">Mã phiếu</span>
          <span className="font-medium">#{booking.id}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <User size={14} className="text-muted-foreground shrink-0" />
          <span className="text-muted-foreground w-16 shrink-0">Khách</span>
          <span className="font-medium">{booking.customer_name || '—'}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone size={14} className="text-muted-foreground shrink-0" />
          <span className="text-muted-foreground w-16 shrink-0">SĐT</span>
          <span className="font-medium">{booking.phone || '—'}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Tag size={14} className="text-muted-foreground shrink-0" />
          <span className="text-muted-foreground w-16 shrink-0">Bàn</span>
          <span className="font-medium">{getTableLabel({ table_number: booking.table_number, name: booking.table_number, id: booking.table_id })}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Clock size={14} className="text-muted-foreground shrink-0" />
          <span className="text-muted-foreground w-16 shrink-0">Giờ</span>
          <span className="font-medium">
            {formatTimeLocal(booking.start_time)}
            {booking.end_time ? ` – ${formatTimeLocal(booking.end_time)}` : ' – (mặc định 2h)'}
          </span>
        </div>
        {booking.notes && (
          <div className="flex items-start gap-2.5">
            <FileText size={14} className="text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground w-16 shrink-0">Ghi chú</span>
              <p className="mt-0.5 text-xs text-muted-foreground">{booking.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Backdrop to close popover on click outside
function PopoverOverlay({ onClose }) {
  return <div className="fixed inset-0 z-[199]" onClick={onClose} />;
}

export default function BookingSchedule() {
  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverPos, setPopoverPos] = useState(null);

  const popoverRef = useRef(null);

  // Build 7-day columns starting from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  const fetchData = useCallback(async () => {
    try {
      const [schedData, tableData] = await Promise.all([
        getSchedule(7),
        getTables(),
      ]);
      setBookings(schedData.bookings || []);
      setTables((tableData.tables || tableData || []).sort((a, b) => {
        const na = parseInt(a.table_number) || 0;
        const nb = parseInt(b.table_number) || 0;
        return na - nb;
      }));
    } catch (e) {
      console.error('Failed to load schedule:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Group bookings: dateKey -> tableId -> booking[]
  const grouped = {};
  for (const b of bookings) {
    const d = new Date(b.start_time);
    d.setHours(0, 0, 0, 0);
    const key = d.toLocaleDateString('vi-VN');
    if (!grouped[key]) grouped[key] = {};
    if (!grouped[key][b.table_id]) grouped[key][b.table_id] = [];
    grouped[key][b.table_id].push(b);
  }

  function handleBookingClick(e, booking) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setAnchorEl(e.currentTarget);
    setSelectedBooking(booking);
    setPopoverPos({ x: rect.left, y: rect.top + rect.height + 4 });
  }

  function closePopover() {
    setAnchorEl(null);
    setSelectedBooking(null);
    setPopoverPos(null);
  }

  function getBookingBlock(booking, hourIndex) {
    if (!booking.start_time) return null;
    const start = new Date(booking.start_time);
    const startHour = start.getHours();
    const endRaw = booking.end_time ? new Date(booking.end_time) : new Date(start.getTime() + 2 * 3600000);
    const endHour = endRaw.getHours() + endRaw.getMinutes() / 60;

    if (hourIndex < startHour || hourIndex >= endHour) return null;

    const isFirstHour = hourIndex === startHour;
    const isLastHour = hourIndex < endHour && hourIndex + 1 >= endHour;

    const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;

    return { isFirstHour, isLastHour, cfg, booking };
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-10 flex-1 rounded-2xl" />
          ))}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-xs text-muted-foreground">Trạng thái:</span>
        {Object.entries(STATUS_CONFIG).filter(([k]) => ['pending', 'confirmed', 'active', 'completed', 'cancelled'].includes(k)).map(([k, cfg]) => (
          <div key={k} className="flex items-center gap-1.5">
            <div className={`w-3.5 h-3.5 rounded-sm ${cfg.bg} ${cfg.border} border`} />
            <span className="text-xs text-muted-foreground">{cfg.label}</span>
          </div>
        ))}
        <span className="text-xs text-muted-foreground ml-2">Giờ hoạt động: 8:00 – 23:00</span>
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto rounded-2xl border border-border">
        <div className="min-w-[900px]">
          {/* Header row: sticky left column (table names) + 7 day columns */}
          <div className="flex border-b border-border bg-muted/40">
            <div className="w-24 shrink-0 px-3 py-2.5 text-xs font-semibold text-muted-foreground">
              Bàn
            </div>
            {days.map((d, i) => {
              const isToday = i === 0;
              return (
                <div
                  key={i}
                  className={`flex-1 px-2 py-2.5 text-center border-l border-border ${isToday ? 'bg-primary/5' : ''}`}
                >
                  <div className="text-xs font-semibold">{d.toLocaleDateString('vi-VN', { weekday: 'short' })}</div>
                  <div className={`text-sm font-bold ${isToday ? 'text-primary' : ''}`}>
                    {d.getDate()}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{d.toLocaleDateString('vi-VN', { month: 'short' })}</div>
                </div>
              );
            })}
          </div>

          {/* Each table is a row */}
          {tables.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Không có bàn nào
            </div>
          ) : (
            tables.map((table) => {
              const tableName = getTableLabel({ table_number: table.table_number, name: table.table_number, id: table.id });
              return (
                <div key={table.id} className="flex border-b border-border/60 hover:bg-muted/10 transition-colors">
                  {/* Table name cell */}
                  <div className="w-24 shrink-0 px-3 py-2.5 flex items-center">
                    <span className="text-xs font-semibold text-muted-foreground truncate" title={tableName}>
                      {tableName}
                    </span>
                  </div>

                  {/* 7 day cells */}
                  {days.map((d, dayIdx) => {
                    const isToday = dayIdx === 0;
                    const dateKey = d.toLocaleDateString('vi-VN');
                    const dayBookings = (grouped[dateKey] || {})[table.id] || [];

                    return (
                      <div
                        key={dayIdx}
                        className={`flex-1 border-l border-border/60 relative ${
                          isToday ? 'bg-primary/5' : ''
                        }`}
                        onClick={closePopover}
                      >
                        {/* Hour grid */}
                        <div className="flex h-full">
                          {HOURS.map((hour) => {
                            // Find a booking block that starts at this hour
                            const block = dayBookings.find((b) => {
                              if (!b.start_time) return false;
                              const start = new Date(b.start_time);
                              return start.getHours() === hour;
                            });

                            const cfg = block ? (STATUS_CONFIG[block.status] || STATUS_CONFIG.pending) : null;

                            return (
                              <div
                                key={hour}
                                className={`flex-1 h-12 border-r border-border/30 last:border-r-0 relative group ${
                                  cfg ? '' : 'hover:bg-muted/20'
                                }`}
                              >
                                {cfg && (
                                  <div
                                    ref={block === selectedBooking ? popoverRef : null}
                                    className={`absolute inset-x-0 mx-0.5 top-0.5 bottom-0.5 rounded-lg ${cfg.bg} ${cfg.text} border ${cfg.border} cursor-pointer flex items-center px-1.5 overflow-hidden hover:brightness-110 transition-all text-[10px] font-semibold leading-tight`}
                                    style={{ zIndex: 10 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (selectedBooking?.id === block.id) {
                                        closePopover();
                                      } else {
                                        handleBookingClick(e, block);
                                      }
                                    }}
                                    title={`${block.customer_name} ${formatTimeLocal(block.start_time)} – ${formatTimeLocal(block.end_time)}`}
                                  >
                                    <span className="truncate">
                                      {hour}:{new Date(block.start_time).getMinutes().toString().padStart(2, '0')} {block.customer_name}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Popover */}
      {selectedBooking && popoverPos && (
        <>
          <PopoverOverlay onClose={closePopover} />
          <div
            className="fixed z-[200] w-72 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            style={{ left: popoverPos.x, top: popoverPos.y, maxWidth: 'calc(100vw - 32px)' }}
          >
            <BookingDetail booking={selectedBooking} onClose={closePopover} />
          </div>
        </>
      )}
    </motion.div>
  );
}

function BookingDetail({ booking, onClose }) {
  const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  return (
    <>
      <div className="px-4 py-2.5 bg-muted/60 border-b border-border flex items-center justify-between">
        <span className="text-sm font-semibold">Chi tiết đặt bàn</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>
          {cfg.label}
        </span>
      </div>
      <div className="p-4 space-y-2.5 text-sm">
        <Row icon={Tag} label="Mã phiếu" value={`#${booking.id}`} />
        <Row icon={User} label="Khách" value={booking.customer_name || '—'} />
        <Row icon={Phone} label="SĐT" value={booking.phone || '—'} />
        <Row icon={CalendarCheck} label="Bàn" value={getTableLabel({ table_number: booking.table_number, name: booking.table_number, id: booking.table_id })} />
        <Row
          icon={Clock}
          label="Giờ"
          value={
            booking.start_time
              ? `${formatTimeLocal(booking.start_time)} – ${booking.end_time ? formatTimeLocal(booking.end_time) : '(mặc định 2h)'}`
              : '—'
          }
        />
        {booking.notes && <Row icon={FileText} label="Ghi chú" value={booking.notes} />}
      </div>
    </>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={14} className="text-muted-foreground shrink-0 mt-0.5" />
      <span className="text-muted-foreground w-16 shrink-0">{label}</span>
      <span className="font-medium text-right break-all">{value}</span>
    </div>
  );
}
