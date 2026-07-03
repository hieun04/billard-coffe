import { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const types = {
  info: { icon: Info, bg: 'bg-blue-500/15 border-blue-500/30', text: 'text-blue-400' },
  success: { icon: CheckCircle, bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400' },
  warning: { icon: AlertTriangle, bg: 'bg-yellow-500/15 border-yellow-500/30', text: 'text-yellow-400' },
  error: { icon: XCircle, bg: 'bg-red-500/15 border-red-500/30', text: 'text-red-400' },
};

export function Alert({ type = 'info', title, children, className, dismissible, onDismiss }) {
  const [visible, setVisible] = useState(true);
  const style = types[type];
  const Icon = style.icon;

  if (!visible) return null;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-2xl border p-4',
        style.bg,
        className
      )}
    >
      <Icon size={18} className={cn('mt-0.5 shrink-0', style.text)} />
      <div className="flex-1 min-w-0">
        {title && <h4 className={cn('text-sm font-semibold mb-1', style.text)}>{title}</h4>}
        <div className="text-sm text-muted-foreground">{children}</div>
      </div>
      {dismissible && (
        <button onClick={() => { setVisible(false); onDismiss?.(); }} className="shrink-0 text-muted-foreground hover:text-foreground">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
