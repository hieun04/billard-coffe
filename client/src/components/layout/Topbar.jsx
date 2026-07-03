import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, Bell, Moon, Sun, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { getNotificationsPreview } from '@/api/notifications';
import { getInitials } from '@/lib/utils';

const pageTitles = {
  '/dashboard': 'Bảng điều khiển',
  '/tables': 'Quản lý bàn',
  '/pos': 'Bán hàng',
  '/menu': 'Thực đơn',
  '/customers': 'Khách hàng',
  '/bookings': 'Đặt bàn',
  '/orders': 'Đơn hàng',
  '/purchases': 'Nhập hàng',
  '/staff': 'Nhân viên',
  '/vouchers': 'Phiếu giảm giá',
  '/inventory': 'Kho hàng',
  '/reports': 'Báo cáo doanh thu',
  '/settings': 'Cài đặt',
  '/notifications': 'Thông báo',
};

export default function Topbar({ onMenuClick, onSearchOpen }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);

  const title = pageTitles[location.pathname] || 'Billiard Cafe';
  const unreadCount = notifs.filter(n => !n.is_read && !n.read).length;

  useEffect(() => {
    getNotificationsPreview()
      .then((data) => setNotifs(data.notifications || []))
      .catch(() => {});
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setUserMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-30 h-[64px] border-b border-border glass-panel rounded-bl-[24px]">
      <div className="flex items-center justify-between h-full px-4 lg:px-6 gap-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-2xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {/* Search */}
          <button
            onClick={onSearchOpen}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted/50 text-muted-foreground text-sm hover:bg-accent transition-colors border border-transparent hover:border-border"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span className="text-xs">Tìm kiếm...</span>
            <kbd className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Ctrl K</kbd>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-2xl hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
              className="relative p-2 rounded-2xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Thông báo</h3>
                  <span className="text-xs text-muted-foreground">{unreadCount} chưa đọc</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifs.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-muted-foreground">Không có thông báo</p>
                  ) : (
                    notifs.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          'px-4 py-3 border-b border-border/50 hover:bg-accent/50 transition-colors cursor-pointer',
                          (!n.is_read && !n.read) && 'bg-primary/5'
                        )}
                      >
                        <p className="text-sm leading-snug">{n.message}</p>
                        <span className="text-[11px] text-muted-foreground mt-1 block">{n.type || 'Thông báo'}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-border">
                  <Link to="/notifications" className="text-xs text-primary font-medium hover:underline">Xem tất cả</Link>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-2xl hover:bg-accent transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {getInitials(user?.username || 'U')}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium leading-none">{user?.username}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <ChevronDown size={14} className="hidden sm:block text-muted-foreground" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <div className="p-1">
                  <Link to="/settings" className="flex items-center px-3 py-2 rounded-2xl text-sm hover:bg-accent transition-colors">
                    Cài đặt
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center px-3 py-2 rounded-2xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
