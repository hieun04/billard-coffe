import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-secondary text-secondary-foreground border-transparent',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  destructive: 'bg-red-500/15 text-red-400 border-red-500/30',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  primary: 'bg-primary/15 text-primary border-primary/30',
  outline: 'border border-input bg-transparent text-foreground',
};

export function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        'transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
