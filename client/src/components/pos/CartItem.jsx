import { cn, formatCurrency } from '@/lib/utils';
import QuantityInput from '@/components/ui/QuantityInput';
import { X } from 'lucide-react';

export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 hover:bg-muted/60 transition-colors group">
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">{formatCurrency(item.price)}</p>
      </div>

      {/* Qty controls (giữ nút -/+ và cho phép gõ số trực tiếp) */}
      <QuantityInput
        value={item.quantity}
        onChange={(q) => onUpdate(item.id, q)}
        min={1}
        max={999}
        size="md"
      />

      {/* Total */}
      <p className="text-sm font-semibold w-20 text-right shrink-0 tabular-nums">
        {formatCurrency(item.quantity * item.price)}
      </p>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="w-7 h-7 rounded-2xl opacity-0 group-hover:opacity-100 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-all"
        title="Xóa khỏi giỏ"
      >
        <X size={12} />
      </button>
    </div>
  );
}
