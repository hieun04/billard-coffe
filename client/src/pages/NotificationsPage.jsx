import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';
import { getNotifications, markRead, markAllRead, deleteNotification } from '@/api/notifications';
import { toast } from 'sonner';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const typeIcons = {
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/15' },
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications || data || []);
    } catch { toast.error('Lỗi tải thông báo'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleMarkAll = async () => {
    try {
      await markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (e) { toast.error(e.message); }
  };

  const handleMarkRead = async (id) => {
    try {
      await markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) { toast.error(e.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Đã xóa');
    } catch (e) { toast.error(e.message); }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = notifications.filter(notification => {
    const matchType = typeFilter === 'all' || notification.type === typeFilter;
    const matchUnread = !showUnreadOnly || !notification.read;
    return matchType && matchUnread;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Thông báo</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả đã đọc'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAll}>
            Đánh dấu tất cả
          </Button>
        )}
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-3 mb-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'Tất cả' },
                  { key: 'info', label: 'Thông tin' },
                  { key: 'success', label: 'Thành công' },
                  { key: 'warning', label: 'Cảnh báo' },
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setTypeFilter(filter.key)}
                    className={`px-3 py-2 rounded-2xl text-sm font-medium transition-all ${
                      typeFilter === filter.key ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={e => setShowUnreadOnly(e.target.checked)}
                  className="rounded border-border"
                />
                Chỉ hiển thị chưa đọc
              </label>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16" />)}</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell size={40} className="mx-auto mb-3 opacity-30" />
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map(n => {
                  const typeStyle = typeIcons[n.type] || typeIcons.info;
                  const Icon = typeStyle.icon;
                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all group ${
                        n.read
                          ? 'border-border/50 bg-transparent'
                          : 'border-indigo-500/20 bg-indigo-500/[0.04]'
                      }`}
                    >
                      <div className={`p-2 rounded-2xl shrink-0 ${typeStyle.bg}`}>
                        <Icon size={18} className={typeStyle.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-relaxed ${n.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {n.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(n.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        {!n.read && (
                          <Button size="icon-sm" variant="ghost" onClick={() => handleMarkRead(n.id)} title="Đã đọc">
                            <CheckCheck size={14} />
                          </Button>
                        )}
                        <Button size="icon-sm" variant="ghost" onClick={() => handleDelete(n.id)} title="Xóa" className="text-red-400">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
