import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Table2, ShoppingCart, UtensilsCrossed,
  Users, CalendarDays, PackagePlus, UserCog, Tag,
  Package, BarChart3, Settings, Bell, Search, X,
  Coffee, ShoppingBag, UserCheck, CalendarClock, Package as PackageIcon,
  BarChart2, Bell as BellIcon, Tag as TagIcon, FileText
} from 'lucide-react';
import { cn, getTableLabel } from '@/lib/utils';
import { searchAll } from '@/api/client';

const quickLinks = [
  { path: '/dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard, category: 'Tổng quan' },
  { path: '/tables', label: 'Quản lý bàn', icon: Table2, category: 'Tổng quan' },
  { path: '/pos', label: 'Bán hàng', icon: ShoppingCart, category: 'Tổng quan' },
  { path: '/menu', label: 'Thực đơn', icon: UtensilsCrossed, category: 'Tổng quan' },
  { path: '/customers', label: 'Khách hàng', icon: Users, category: 'Vận hành' },
  { path: '/bookings', label: 'Đặt bàn', icon: CalendarDays, category: 'Vận hành' },
  { path: '/purchases', label: 'Nhập hàng', icon: PackagePlus, category: 'Vận hành' },
  { path: '/staff', label: 'Nhân viên', icon: UserCog, category: 'Vận hành' },
  { path: '/vouchers', label: 'Phiếu giảm giá', icon: TagIcon, category: 'Vận hành' },
  { path: '/inventory', label: 'Kho hàng', icon: Package, category: 'Quản trị' },
  { path: '/reports', label: 'Báo cáo doanh thu', icon: BarChart2, category: 'Quản trị' },
  { path: '/settings', label: 'Cài đặt', icon: Settings, category: 'Quản trị' },
  { path: '/notifications', label: 'Thông báo', icon: BellIcon, category: 'Khác' },
];

const categoryIcons = {
  'Tổng quan': LayoutDashboard,
  'Vận hành': TagIcon,
  'Quản trị': BarChart2,
  'Khác': BellIcon,
};

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchAll(query);
        const flat = [
          ...(data.tables || []).map(t => ({
            id: t.id, type: 'Bàn', label: getTableLabel(t), sub: t.status || '',
            path: '/tables', icon: Table2, status: t.status
          })),
          ...(data.products || []).map(p => ({
            id: p.id, type: 'Sản phẩm', label: p.name, sub: `${p.category} — ${new Intl.NumberFormat('vi-VN').format(p.price)}đ`,
            path: '/menu', icon: Coffee
          })),
          ...(data.customers || []).map(c => ({
            id: c.id, type: 'Khách hàng', label: c.name, sub: c.phone || '',
            path: '/customers', icon: UserCheck
          })),
          ...(data.orders || []).map(o => ({
            id: o.id, type: 'Đơn hàng', label: `Đơn #${o.id}`, sub: `${new Intl.NumberFormat('vi-VN').format(o.total || 0)}đ`,
            path: '/pos', icon: ShoppingBag
          })),
        ];
        setResults(flat);
        setSelectedIndex(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback((item) => {
    navigate(item.path);
    onClose();
  }, [navigate, onClose]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length + quickLinks.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const allItems = [...results, ...filteredQuickLinks];
      if (allItems[selectedIndex]) {
        handleSelect(allItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const filteredQuickLinks = !query.trim()
    ? quickLinks
    : quickLinks.filter(l =>
        l.label.toLowerCase().includes(query.toLowerCase()) ||
        l.category.toLowerCase().includes(query.toLowerCase())
      );

  const allItems = [...results, ...filteredQuickLinks];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-[15vh] -translate-x-1/2 w-full max-w-lg z-50"
            onKeyDown={handleKeyDown}
          >
            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                <Search size={18} className="text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm kiếm bàn, sản phẩm, khách hàng..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {loading && (
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin shrink-0" />
                )}
                {query && !loading && (
                  <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground">Esc</kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {!query.trim() && (
                  <div className="px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Đường dẫn nhanh</p>
                    <div className="space-y-0.5">
                      {quickLinks.map((item, i) => {
                        return (
                          <button
                            key={item.path}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIndex(i)}
                            className={cn(
                              'w-full flex items-center px-3 py-2 rounded-2xl text-sm transition-colors',
                              selectedIndex === i ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent'
                            )}
                          >
                            <span className="flex-1 text-left">{item.label}</span>
                            <span className="text-[10px] text-muted-foreground">{item.category}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {query.trim() && results.length === 0 && !loading && (
                  <div className="py-10 text-center">
                    <p className="text-sm text-muted-foreground">Không tìm thấy kết quả cho "{query}"</p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Kết quả tìm kiếm</p>
                    <div className="space-y-0.5">
                      {results.map((item, i) => {
                        return (
                          <button
                            key={`${item.type}-${item.id}`}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIndex(i)}
                            className={cn(
                              'w-full flex items-center px-3 py-2 rounded-2xl text-sm transition-colors',
                              selectedIndex === i ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent'
                            )}
                          >
                            <div className="flex-1 text-left">
                              <span className="font-medium">{item.label}</span>
                              {item.sub && <span className="text-muted-foreground text-xs ml-2">{item.sub}</span>}
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{item.type}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2.5 border-t border-border flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">↑↓</kbd> Điều hướng
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">↵</kbd> Chọn
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">Esc</kbd> Đóng
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
