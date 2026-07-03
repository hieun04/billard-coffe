import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Table2, ShoppingCart, UtensilsCrossed,
  Users, CalendarDays, PackagePlus, UserCog, Tag,
  Package, BarChart3, Settings, Bell, ChevronLeft, ChevronRight, Zap, MessageSquare, Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 4-group navigation matching the UI screenshots
const navItems = [
  {
    group: 'Tổng quan',
    items: [
      { path: '/dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
      { path: '/tables', label: 'Quản lý bàn', icon: Table2 },
      { path: '/pos', label: 'Bán hàng', icon: ShoppingCart },
      { path: '/menu', label: 'Thực đơn', icon: UtensilsCrossed },
    ],
  },
  {
    group: 'Vận hành',
    items: [
      { path: '/customers', label: 'Khách hàng', icon: Users },
      { path: '/bookings', label: 'Đặt bàn', icon: CalendarDays },
      { path: '/orders', label: 'Đơn hàng', icon: Receipt },
      { path: '/purchases', label: 'Nhập hàng', icon: PackagePlus },
      { path: '/staff', label: 'Nhân viên', icon: UserCog },
      { path: '/vouchers', label: 'Phiếu giảm giá', icon: Tag },
    ],
  },
  {
    group: 'Quản trị',
    isAdmin: true,
    items: [
      { path: '/inventory', label: 'Kho hàng', icon: Package },
      { path: '/reports', label: 'Báo cáo', icon: BarChart3 },
      { path: '/settings', label: 'Cài đặt', icon: Settings },
    ],
  },
  {
    group: 'Khác',
    items: [
      { path: '/notifications', label: 'Thông báo', icon: Bell },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle, userRole }) {
  const location = useLocation();
  const isAdmin = userRole === 'admin';

  const visibleGroups = navItems.filter(g => !g.isAdmin || isAdmin);

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300',
        'bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))]',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 border-b border-[hsl(var(--sidebar-border))]',
        'h-[64px] shrink-0'
      )}>
        <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 shrink-0">
          <Zap size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="font-bold text-base tracking-tight text-foreground">Billiard</span>
              <span className="block text-[10px] text-muted-foreground font-medium -mt-0.5">Cafe Manager</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {visibleGroups.map((group) => (
          <div key={group.group}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    'px-3 mb-2 text-sm font-extrabold uppercase tracking-[0.18em]',
                    group.isAdmin ? 'text-amber-300/90' : 'text-foreground/80'
                  )}
                >
                  {group.group}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center px-3 py-2.5 rounded-2xl text-sm font-medium',
                      'transition-all duration-200 relative group',
                      group.isAdmin
                        ? isActive
                          ? 'bg-amber-500/15 text-amber-400 shadow-sm'
                          : 'text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/10'
                        : isActive
                          ? 'bg-primary/15 text-primary shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    {isActive && (
                      <span
                        className={cn(
                          'absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full',
                          group.isAdmin ? 'bg-amber-400' : 'bg-primary'
                        )}
                      />
                    )}
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-[hsl(var(--sidebar-border))] shrink-0">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-2 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}

export function MobileSidebar({ open, onClose }) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))] z-50 lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-5 border-b border-[hsl(var(--sidebar-border))] h-[64px]">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                  <Zap size={18} className="text-white" />
                </div>
                <div>
                  <span className="font-bold text-base tracking-tight block text-foreground">Billiard</span>
                  <span className="text-[10px] text-muted-foreground font-medium -mt-0.5 block">Cafe Manager</span>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-2xl hover:bg-accent text-muted-foreground">
                <span className="sr-only">Close</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
              {navItems.map((group) => (
                <div key={group.group}>
                  <p className={cn(
                    'px-3 mb-2 text-sm font-extrabold uppercase tracking-[0.18em]',
                    group.isAdmin ? 'text-amber-300/90' : 'text-foreground/80'
                  )}>
                    {group.group}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={onClose}
                          className={cn(
                            'flex items-center px-3 py-2.5 rounded-2xl text-sm font-medium',
                            'transition-all duration-200',
                            group.isAdmin
                              ? isActive
                                ? 'bg-amber-500/15 text-amber-400'
                                : 'text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/10'
                              : isActive
                                ? 'bg-primary/15 text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                          )}
                        >
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
