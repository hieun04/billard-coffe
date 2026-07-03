import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Stepper input cho số lượng: nút -/input nhập trực tiếp/nút +.
 * - Giữ 2 nút tăng/giảm 1 đơn vị
 * - Cho phép gõ số trực tiếp (Enter hoặc blur để commit)
 * - Props: value, onChange (nhận số mới), min, max, size ('sm' | 'md')
 */
export default function QuantityInput({
  value,
  onChange,
  min = 0,
  max = 999,
  size = 'md',
  className,
  inputClassName,
  disabled = false,
  hideButtons = false,
}) {
  const v = Number.isFinite(value) ? value : 0;
  const clamp = (n) => Math.max(min, Math.min(max, n));
  const dec = () => onChange(clamp(v - 1));
  const inc = () => onChange(clamp(v + 1));

  const sizes = {
    sm: {
      btn: 'w-6 h-6',
      input: 'w-9 text-xs',
      icon: 10,
    },
    md: {
      btn: 'w-7 h-7',
      input: 'w-12 text-sm',
      icon: 12,
    },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      {!hideButtons && (
        <button
          type="button"
          onClick={dec}
          disabled={disabled || v <= min}
          className={cn(
            s.btn,
            'rounded-2xl bg-muted hover:bg-accent flex items-center justify-center transition-colors',
            'disabled:opacity-30 disabled:cursor-not-allowed',
          )}
          aria-label="Giảm số lượng"
        >
          <Minus size={s.icon} />
        </button>
      )}
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={v}
        disabled={disabled}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') {
            onChange(min);
            return;
          }
          const n = parseInt(raw, 10);
          if (Number.isNaN(n)) return;
          onChange(clamp(n));
        }}
        onFocus={(e) => e.target.select()}
        className={cn(
          s.input,
          'h-7 text-center font-semibold tabular-nums rounded-xl',
          'bg-transparent border border-border/60',
          'focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/60',
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          disabled && 'opacity-50 cursor-not-allowed',
          inputClassName,
        )}
        aria-label="Số lượng"
      />
      {!hideButtons && (
        <button
          type="button"
          onClick={inc}
          disabled={disabled || v >= max}
          className={cn(
            s.btn,
            'rounded-2xl bg-muted hover:bg-accent flex items-center justify-center transition-colors',
            'disabled:opacity-30 disabled:cursor-not-allowed',
          )}
          aria-label="Tăng số lượng"
        >
          <Plus size={s.icon} />
        </button>
      )}
    </div>
  );
}
