import { useState, useEffect } from 'react';
import {
  Wallet, Users, ShoppingBag, Clock, TrendingUp, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '@/components/dashboard/StatCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import TableStatusPie from '@/components/dashboard/TableStatusPie';
import TopProductsBar from '@/components/dashboard/TopProductsBar';
import AIInsightCard from '@/components/dashboard/AIInsightCard';
import { getKPI } from '@/api/reports';
import { formatCurrency } from '@/lib/utils';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function DashboardPage() {
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async () => {
    try {
      const data = await getKPI();
      setKpi(data);
    } catch {
      // set error state if needed
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetch(); };

  const revenueChartData = kpi?.revenueByDay?.map((r) => ({
    date: r.date?.slice(5) || '',
    revenue: r.revenue / 1000,
  })) || [];

  const tableStatusData = [
    { name: 'Đang chơi', value: kpi?.playingTables || 0 },
    { name: 'Trống', value: kpi?.availableTables || 0 },
    { name: 'Đặt trước', value: kpi?.reservedTables || 0 },
    { name: 'Bảo trì', value: kpi?.maintenanceTables || 0 },
  ].filter(d => d.value > 0);

  const topProductsData = kpi?.topProducts?.slice(0, 5).map((p) => ({
    name: p.name?.length > 15 ? p.name.slice(0, 15) + '...' : p.name,
    quantity: p.quantity,
  })) || [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bảng điều khiển</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tổng quan hệ thống — {new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted/50 text-sm hover:bg-accent transition-colors"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Làm mới
        </button>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Doanh thu hôm nay"
          value={formatCurrency(kpi?.todayRevenue || 0)}
          trend={kpi?.revenueTrend}
          trendLabel="so với hôm qua"
          icon={Wallet}
          color="emerald"
          loading={loading}
        />
        <StatCard
          title="Đơn hàng hôm nay"
          value={kpi?.todayOrders || 0}
          trend={kpi?.orderTrend}
          trendLabel="so với hôm qua"
          icon={ShoppingBag}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Khách hàng"
          value={kpi?.todayCustomers || 0}
          trend={kpi?.customerTrend}
          trendLabel="khách mới"
          icon={Users}
          color="purple"
          loading={loading}
        />
        <StatCard
          title="Giờ hoạt động"
          value={kpi?.totalHours || 0}
          trendLabel="giờ chơi trung bình"
          icon={Clock}
          color="orange"
          loading={loading}
        />
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={item} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RevenueChart data={revenueChartData} loading={loading} />
        </div>
        <TableStatusPie data={tableStatusData} loading={loading} />
      </motion.div>

      {/* Bottom Row */}
      <motion.div variants={item} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <TopProductsBar data={topProductsData} loading={loading} />
        </div>
        <AIInsightCard loading={loading} />
      </motion.div>
    </motion.div>
  );
}
