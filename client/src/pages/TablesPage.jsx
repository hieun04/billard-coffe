import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CalendarDays } from 'lucide-react';
import TableGrid from '@/components/tables/TableGrid';
import BookingSchedule from '@/components/tables/BookingSchedule';
import TimekeepingWidget from '@/components/dashboard/TimekeepingWidget';
import { getTables } from '@/api/tables';
import { getUpcomingBookings } from '@/api/bookings';
import { useRealtime } from '@/hooks/useRealtime';
import { cn } from '@/lib/utils';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function StatCard({ label, value, color }) {
  const colors = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };
  return (
    <div className={`rounded-2xl border px-3 py-2.5 text-center ${colors[color] || colors.blue}`}>
      <p className="text-[10px] opacity-70 font-medium">{label}</p>
      <p className="text-lg font-bold mt-0.5">{value}</p>
    </div>
  );
}

export default function TablesPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tables');
  const [upcomingByTable, setUpcomingByTable] = useState({});

  const fetchTables = useCallback(async () => {
    try {
      const data = await getTables();
      setTables(data.tables || data || []);
    } catch { /* silent fail */ }
    finally { setLoading(false); }
  }, []);

  const fetchUpcoming = useCallback(async () => {
    try {
      const res = await getUpcomingBookings(6);
      const map = {};
      for (const b of res.bookings || []) {
        map[b.table_id] = {
          id: b.id,
          start_time: b.start_time,
          customer_name: b.customer_name,
          phone: b.phone,
          status: b.status,
        };
      }
      setUpcomingByTable(map);
    } catch { /* silent fail */ }
  }, []);

  useEffect(() => { fetchTables(); fetchUpcoming(); }, [fetchTables, fetchUpcoming]);
  useRealtime(() => { fetchTables(); fetchUpcoming(); }, 5000, true);

  const playing = tables.filter(t => t.status === 'occupied' || t.status === 'playing').length;
  const available = tables.filter(t => t.status === 'empty' || t.status === 'available').length;
  const reserved = tables.filter(t => t.status === 'reserved').length;
  const maintenance = tables.filter(t => t.status === 'maintenance').length;

  const totalHours = tables
    .filter(t => t.status === 'occupied' || t.status === 'playing')
    .reduce((sum, t) => {
      if (!t.current_session_start) return sum;
      const ms = Date.now() - new Date(t.current_session_start).getTime();
      return sum + ms / 3600000;
    }, 0);

  const TABS = [
    { key: 'tables', label: 'Danh sách bàn' },
    { key: 'schedule', label: 'Lịch đặt bàn' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="h-full">

      {/* Header — full width */}
      <motion.div variants={item} className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản lý bàn bida</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeTab === 'tables'
              ? `${tables.length} bàn — ${playing} đang chơi, ${available} trống, ${reserved} đặt trước`
              : 'Lịch đặt bàn 7 ngày tới'
            }
          </p>
        </div>
        <button
          onClick={fetchTables}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted/50 text-sm hover:bg-accent transition-colors"
        >
          <RefreshCw size={14} /> Làm mới
        </button>
      </motion.div>

      {/* Live indicator */}
      <motion.div variants={item} className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-xs text-emerald-400 font-medium">Cập nhật realtime — Tự động làm mới 5s</span>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="flex items-center gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-200',
              activeTab === tab.key
                ? 'bg-primary/15 text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            {tab.key === 'tables' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            ) : (
              <CalendarDays size={14} />
            )}
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'tables' ? (
          <motion.div
            key="tables"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Main 2-column layout */}
            <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_340px] gap-4">

              <div className="min-w-0">
                <TableGrid tables={tables} upcomingByTable={upcomingByTable} loading={loading} onRefresh={() => { fetchTables(); fetchUpcoming(); }} />
              </div>

              {/* Right: Stats + Timekeeping */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Tổng số bàn" value={tables.length} color="blue" />
                  <StatCard label="Bàn trống" value={available} color="emerald" />
                  <StatCard label="Bàn chơi" value={playing} color="orange" />
                  <StatCard label="Tổng giờ chơi" value={`${Math.round(totalHours * 10) / 10}h`} color="purple" />
                </div>
                <TimekeepingWidget />
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <BookingSchedule />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
