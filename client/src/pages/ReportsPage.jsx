import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, TrendingUp, DollarSign, ShoppingBag, FileText, ClipboardList, CalendarDays, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import StatCard from '@/components/dashboard/StatCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import TopProductsBar from '@/components/dashboard/TopProductsBar';
import { getKPI, exportReport } from '@/api/reports';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const reportTypes = [
  { key: 'summary', label: 'Tổng hợp', icon: FileText },
  { key: 'orders', label: 'Lịch sử đơn hàng', icon: ClipboardList },
  { key: 'revenue_daily', label: 'Doanh thu theo ngày', icon: Calendar },
  { key: 'revenue_monthly', label: 'Doanh thu theo tháng', icon: CalendarDays },
  { key: 'top_products', label: 'Món bán chạy', icon: Trophy },
];

export default function ReportsPage() {
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [reportType, setReportType] = useState('summary');
  const [exporting, setExporting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getKPI({ from: dateFrom, to: dateTo });
      setKpi(data);
    } catch { toast.error('Lỗi khi tải báo cáo'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [dateFrom, dateTo]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportReport({ type: reportType, from: dateFrom, to: dateTo });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bao_cao_${reportType}_${dateFrom}_${dateTo}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Đã tải xuống báo cáo');
    } catch (e) { toast.error(e.message); }
    finally { setExporting(false); }
  };

  const revenueData = kpi?.revenueByDay?.map(r => ({
    date: r.date?.slice(5) || '',
    revenue: r.revenue / 1000,
  })) || [];

  const topProducts = kpi?.topProducts?.slice(0, 5).map(p => ({
    name: p.name?.length > 15 ? p.name.slice(0, 15) : p.name,
    quantity: p.quantity,
  })) || [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Báo cáo doanh thu</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Phân tích chi tiết hiệu suất kinh doanh</p>
        </div>
      </motion.div>

      {/* Date filter */}
      <motion.div variants={item} className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-muted-foreground" />
          <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-auto h-10" />
          <span className="text-muted-foreground">đến</span>
          <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-auto h-10" />
        </div>
      </motion.div>

      {/* Report type selector */}
      <motion.div variants={item}>
        <p className="text-sm font-medium mb-3">Chọn loại báo cáo xuất file:</p>
        <div className="flex flex-wrap gap-2">
          {reportTypes.map(rt => {
            const Icon = rt.icon;
            return (
              <button
                key={rt.key}
                onClick={() => setReportType(rt.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  reportType === rt.key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                <Icon size={15} />
                {rt.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Export button */}
      <motion.div variants={item}>
        <Button onClick={handleExport} disabled={exporting} className="h-11 px-6">
          <Download size={16} />
          {exporting ? 'Đang tải...' : `Xuất báo cáo: ${reportTypes.find(r => r.key === reportType)?.label}`}
        </Button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Tổng doanh thu" value={formatCurrency(kpi?.totalRevenue || 0)} icon={DollarSign} color="emerald" loading={loading} />
        <StatCard title="Tổng đơn hàng" value={kpi?.totalOrders || 0} icon={ShoppingBag} color="blue" loading={loading} />
        <StatCard title="Doanh thu bida" value={formatCurrency(kpi?.billiardRevenue || 0)} icon={TrendingUp} color="purple" loading={loading} />
        <StatCard title="Doanh thu đồ uống" value={formatCurrency(kpi?.drinksRevenue || 0)} icon={DollarSign} color="orange" loading={loading} />
      </motion.div>

      {/* Charts */}
      <motion.div variants={item} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RevenueChart data={revenueData} loading={loading} />
        </div>
        <TopProductsBar data={topProducts} loading={loading} />
      </motion.div>

      {/* Revenue breakdown */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12" />)}</div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Doanh thu bida', value: kpi?.billiardRevenue || 0, color: 'bg-purple-500' },
                  { label: 'Doanh thu đồ uống', value: kpi?.drinksRevenue || 0, color: 'bg-orange-500' },
                  { label: 'Giảm giá', value: kpi?.totalDiscount || 0, color: 'bg-red-500' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm flex-1">{item.label}</span>
                    <span className="text-sm font-semibold">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
