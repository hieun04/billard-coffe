import { cn, formatCurrency, resolveImageUrl } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function ProductCard({ product, onAdd }) {
  const outOfStock = (product.stock ?? 999) <= 0;
  const lowStock = !outOfStock && (product.stock ?? 999) <= 5;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3, boxShadow: '0 8px 30px -10px rgba(0,0,0,0.15)' }}
      whileTap={{ scale: 0.96 }}
      onClick={() => !outOfStock && onAdd(product)}
      disabled={outOfStock}
      className={cn(
        'rounded-2xl border bg-card p-3 text-left w-full transition-all duration-200 group',
        outOfStock
          ? 'opacity-50 cursor-not-allowed border-border/50'
          : 'border-border hover:border-primary/40 cursor-pointer'
      )}
    >
      {/* Image */}
      <div className="aspect-square rounded-2xl bg-muted/50 mb-3 overflow-hidden relative">
        {(() => {
          const raw = product.image_url || '';
          if (!raw) return null;
          const imgSrc = resolveImageUrl(raw);
          return imgSrc ? (
            <img
              src={imgSrc}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : null;
        })()}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-xs font-bold text-red-400 bg-red-500/20 px-2.5 py-1 rounded-2xl border border-red-500/30 backdrop-blur-sm">
              Het hàng
            </span>
          </div>
        )}

        {/* Low stock badge */}
        {lowStock && (
          <div className="absolute top-2 right-2">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/90 text-white shadow-sm">
              Còn {product.stock}
            </span>
          </div>
        )}

        {/* Category badge */}
        {product.category_name && (
          <div className="absolute bottom-2 left-2">
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-black/60 text-white/80 backdrop-blur-sm">
              {product.category_name}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p className="text-sm font-semibold truncate leading-tight">{product.name}</p>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-sm font-bold text-primary">{formatCurrency(product.price)}</p>
          {!outOfStock && (
            <span className="text-[10px] text-muted-foreground">{product.unit || 'phần'}</span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
