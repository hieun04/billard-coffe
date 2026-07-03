import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendLabel, color = 'primary', loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-muted/50 animate-pulse" />
          <div className="w-10 h-10 rounded-2xl bg-muted/50 animate-pulse" />
        </div>
        <div className="h-8 w-32 rounded bg-muted/50 animate-pulse" />
        <div className="h-3 w-40 rounded bg-muted/50 animate-pulse" />
      </div>
    );
  }

  const colorMap = {
    primary: 'bg-primary/15 text-primary',
    emerald: 'bg-emerald-500/15 text-emerald-400',
    orange: 'bg-orange-500/15 text-orange-400',
    blue: 'bg-blue-500/15 text-blue-400',
    purple: 'bg-purple-500/15 text-purple-400',
    red: 'bg-red-500/15 text-red-400',
    yellow: 'bg-yellow-500/15 text-yellow-400',
  };

  const trendUp = trend > 0;
  const trendColor = trendUp ? 'text-emerald-400' : 'text-red-400';

  return (
    <div className="rounded-2xl border border-border bg-card p-5 card-hover">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
        {Icon && (
          <div className={cn('p-2 rounded-2xl', colorMap[color])}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight mb-1">{value}</p>
      <div className="flex items-center gap-2">
        {trend !== undefined && (
          <span className={cn('flex items-center gap-0.5 text-xs font-medium', trendColor)}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
        {trendLabel && (
          <span className="text-xs text-muted-foreground">{trendLabel}</span>
        )}
      </div>
    </div>
  );
}
