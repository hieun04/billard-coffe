import { Lightbulb, RefreshCw, AlertTriangle, TrendingUp, Coffee, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { getAIInsights } from '@/api/ai';

const iconMap = {
  clock: Clock,
  alert: AlertTriangle,
  trend: TrendingUp,
  star: Coffee,
  table: Coffee,
  user: Users,
};

const priorityColors = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  medium: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

export default function AIInsightCard({ loading, onRefresh }) {
  const [insights, setInsights] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);

  const fetchInsights = async () => {
    setFetching(true);
    setError(false);
    try {
      const data = await getAIInsights();
      setInsights(data.insights || []);
    } catch {
      setError(true);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchInsights(); }, []);

  const displayInsights = loading || fetching ? [] : insights;
  const randomInsight = displayInsights.length > 0
    ? displayInsights[Math.floor(Math.random() * displayInsights.length)]
    : null;

  const cycleInsight = () => {
    if (displayInsights.length > 1) {
      setInsights(prev => {
        const rotated = [...prev.slice(1), prev[0]];
        return rotated;
      });
    }
  };

  if (loading || fetching) {
    return (
      <Card className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400 shrink-0">
              <Lightbulb size={24} />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !randomInsight) {
    return (
      <Card className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400 shrink-0">
              <Lightbulb size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">AI Insight</h3>
                <Button variant="ghost" size="icon-sm" onClick={fetchInsights}>
                  <RefreshCw size={14} />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Chua co du lieu. Nhan lam moi de tai.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const Icon = iconMap[randomInsight.icon] || Lightbulb;
  const colorClass = priorityColors[randomInsight.priority] || priorityColors.medium;

  return (
    <Card className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn('p-3 rounded-2xl shrink-0 border', colorClass)}>
            <Icon size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">
                {randomInsight.type === 'peak' ? 'Gio cao diem' :
                  randomInsight.type === 'stock' ? 'Canh bao kho' :
                    randomInsight.type === 'revenue' ? 'Xu huong doanh thu' :
                      randomInsight.type === 'product' ? 'San pham noi bat' :
                        randomInsight.type === 'table' ? 'Tinh trang ban' : 'AI Insight'}
              </h3>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{displayInsights.length} tips</span>
                <Button variant="ghost" size="icon-sm" onClick={cycleInsight} title="Goi y khac">
                  <RefreshCw size={14} />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {randomInsight.text}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
