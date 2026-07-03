import { cn, getStatusColor, formatCurrency, formatDuration } from '@/lib/utils';
import { Clock, Coffee, User, Wrench, CalendarCheck, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const statusLabels = {
  empty: 'Trống',
  available: 'Trống',
  occupied: 'Đang chơi',
  playing: 'Đang chơi',
  reserved: 'Đặt trước',
  maintenance: 'Bảo trì',
};

function formatBookingTime(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return '';
  }
}

const BOOKING_STATUS_LABELS = {
  held: 'Giữ chỗ',
  checked_in: 'Đã check-in',
};

export default function TableCard({ table, upcoming, onClick, selected, onDelete }) {
  const isPlaying = table.status === 'occupied' || table.status === 'playing';
  const isReserved = table.status === 'reserved';
  const isMaintenance = table.status === 'maintenance';
  const isHeld = table.booking_status === 'held';
  const isCheckedIn = table.booking_status === 'checked_in';
  // Booking đã được nhân viên "xác nhận" (confirmed) — bàn vẫn cho khách chơi,
  // chỉ hiện note nhắc nhở nhân viên
  const hasConfirmedBooking = !!table.booking_id && !isHeld && !isCheckedIn && !!table.booking_start_time;

  // Upcoming booking badge: only meaningful when table is not already playing
  const showUpcomingBadge = !isPlaying && upcoming && upcoming.start_time;
  const upcomingTime = showUpcomingBadge
    ? new Date(upcoming.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
    : null;
  const minutesUntil = showUpcomingBadge
    ? Math.round((new Date(upcoming.start_time).getTime() - Date.now()) / 60000)
    : null;
  const isImminent = minutesUntil !== null && minutesUntil <= 30;

  // Effective display status
  const effectiveStatus = isHeld ? 'held' : isCheckedIn ? 'checked_in' : table.status;
  const effectiveLabel = BOOKING_STATUS_LABELS[effectiveStatus] || statusLabels[effectiveStatus] || effectiveStatus;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(table)}
      className={cn(
        'rounded-2xl border p-6 min-h-[200px] cursor-pointer transition-all duration-200 relative overflow-hidden group',
        'bg-card',
        isPlaying && 'border-orange-500/40 bg-gradient-to-br from-orange-500/5 to-transparent',
        isReserved && 'border-blue-500/40 bg-gradient-to-br from-blue-500/5 to-transparent',
        isMaintenance && 'border-red-500/40 bg-gradient-to-br from-red-500/5 to-transparent',
        isHeld && 'border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-transparent',
        isCheckedIn && 'border-amber-600/40 bg-gradient-to-br from-amber-600/5 to-transparent',
        !isPlaying && !isReserved && !isMaintenance && !isHeld && !isCheckedIn && 'border-border hover:border-primary/40',
        selected && 'ring-2 ring-primary border-primary'
      )}
    >
      {/* Glow effect for active tables */}
      {isPlaying && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl" />
      )}
      {isReserved && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
      )}
      {isHeld && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-base">{
          (() => {
            const num = table.table_number;
            // Nếu chứa "Bàn" thì trích xuất số, ngược lại hiển thị trực tiếp
            const match = num && num.toString().match(/(\d+)/);
            return match ? `Bàn ${match[1]}` : (num || `Bàn ${table.id}`);
          })()
        }</h3>
        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', getStatusColor(effectiveStatus))}>
          {effectiveLabel}
        </span>
      </div>

      {/* Delete button — only for empty/available/maintenance tables */}
      {(table.status === 'empty' || table.status === 'available' || table.status === 'maintenance') && (
        <div className="flex justify-end -mt-1 mb-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(table); }}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
          >
            <Trash2 size={12} />
            <span>Xóa</span>
          </button>
        </div>
      )}

      {/* Upcoming booking badge */}
      {showUpcomingBadge && (
        <div className={cn(
          'mb-2 flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-lg border',
          isImminent
            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            : 'bg-blue-500/10 text-blue-300 border-blue-500/25'
        )}>
          <CalendarCheck size={12} />
          <span>Có đặt trước {upcomingTime}</span>
          {upcoming.customer_name && (
            <span className="text-blue-200/70 truncate max-w-[80px]">· {upcoming.customer_name}</span>
          )}
        </div>
      )}

      {/* Info */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={14} />
          <span>{formatCurrency(table.rate_per_hour || 0)}/giờ</span>
        </div>

        {isPlaying && table.current_session_start && (
          <>
            <div className="flex items-center gap-2 text-sm text-orange-400">
              <User size={14} />
              <span>{table.current_customer_name || 'Khách lẻ'}</span>
              {table.current_customer_phone && (
                <span className="text-[11px] text-orange-300/70">· {table.current_customer_phone}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-orange-300 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <span>{formatDuration(table.current_session_start)}</span>
            </div>
          </>
        )}

        {isReserved && (
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <User size={14} />
            <span>{table.customer_name || 'Đặt trước'}</span>
          </div>
        )}

        {hasConfirmedBooking && (
          <div className="flex items-center gap-2 text-sm text-blue-300/90">
            <CalendarCheck size={14} />
            <span>Khách đặt lúc {formatBookingTime(table.booking_start_time)}</span>
            {table.booking_customer_name && (
              <span className="text-blue-200/60 truncate max-w-[80px]">· {table.booking_customer_name}</span>
            )}
          </div>
        )}

        {isMaintenance && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <Wrench size={14} />
            <span>Đang bảo trì</span>
          </div>
        )}

        {isHeld && upcoming && (
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <CalendarCheck size={14} />
            <span>Khách đặt lúc {upcomingTime}</span>
            {upcoming.customer_name && (
              <span className="text-amber-200/70 truncate max-w-[80px]">· {upcoming.customer_name}</span>
            )}
          </div>
        )}

        {isCheckedIn && (
          <div className="flex items-center gap-2 text-sm text-amber-500">
            <User size={14} />
            <span>Khách đã đến</span>
            {table.current_customer_name && (
              <span className="text-amber-200/70 truncate max-w-[80px]">· {table.current_customer_name}</span>
            )}
          </div>
        )}

        {/* Booking info on occupied tables — keep showing until paid */}
        {isPlaying && table.booking_start_time && (
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <CalendarCheck size={14} />
            <span>Đặt lúc {formatBookingTime(table.booking_start_time)}</span>
            {table.booking_customer_name && (
              <span className="text-blue-200/70 truncate max-w-[80px]">· {table.booking_customer_name}</span>
            )}
          </div>
        )}

        {table.drinks_total > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coffee size={14} />
            <span>{formatCurrency(table.drinks_total)}</span>
          </div>
        )}

        {isPlaying && (
          <div className="mt-1 flex items-center gap-1 text-[10px] text-primary/60">
            <Coffee size={10} />
            <span>Nhan để thêm đồ uống</span>
          </div>
        )}
      </div>

      {/* Action hint */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-[11px] text-muted-foreground text-center">
          {isPlaying ? 'Nhấn để xem chi tiết' : isHeld ? 'Nhấn để xác nhận check-in' : isCheckedIn ? 'Nhấn để xem chi tiết' : 'Nhấn để bắt đầu'}
        </p>
      </div>
    </motion.div>
  );
}
