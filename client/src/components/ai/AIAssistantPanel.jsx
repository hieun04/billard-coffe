import { useState, useRef, useEffect, useMemo } from 'react';
import { X, MessageSquare, Send, Lightbulb, TrendingUp, AlertTriangle, Coffee, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { getKPI } from '@/api/reports';
import { chatAdminAI } from '@/api/ai';

const quickSuggestions = [
  { icon: TrendingUp, label: 'Doanh thu hôm nay', query: 'Doanh thu hôm nay bao nhiêu?' },
  { icon: AlertTriangle, label: 'Hàng tồn kho', query: 'Hàng nào sắp hết trong kho?' },
  { icon: Coffee, label: 'Món bán chạy', query: 'Top món bán chạy trong 30 ngày?' },
  { icon: Clock, label: 'Tỷ lệ bàn', query: 'Tỷ lệ sử dụng bàn hiện tại?' },
];

const SESSION_KEY = 'ai_admin_session';

/**
 * Render text từ AI: hỗ trợ **bold**, xuống dòng, bullet • / 🥇🥈🥉.
 * Trả về JSX giữ nguyên emoji + highlight bold.
 */
function RichText({ text }) {
  const lines = useMemo(() => String(text || '').split('\n'), [text]);
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;

        // Tách phần **bold**
        const parts = [];
        const regex = /\*\*([^*]+)\*\*/g;
        let lastIdx = 0;
        let m;
        while ((m = regex.exec(line)) !== null) {
          if (m.index > lastIdx) parts.push({ text: line.slice(lastIdx, m.index), bold: false });
          parts.push({ text: m[1], bold: true });
          lastIdx = m.index + m[0].length;
        }
        if (lastIdx < line.length) parts.push({ text: line.slice(lastIdx), bold: false });

        return (
          <div key={i} className="whitespace-pre-wrap">
            {parts.map((p, j) => p.bold ? (
              <strong key={j} className="font-bold text-foreground">{p.text}</strong>
            ) : (
              <span key={j}>{p.text}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function AIAssistantPanel({ open, onToggle }) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      { role: 'ai', text: 'Xin chào! Mình là trợ lý AI nội bộ. Mình có thể giúp bạn tra cứu doanh thu, tồn kho, món bán chạy, tỷ lệ sử dụng bàn. Bạn cần gì?', time: new Date() }
    ];
  });
  const [sessionId, setSessionId] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY + ':sid');
      if (saved) return saved;
    } catch {}
    return `adm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages.slice(-30)));
      sessionStorage.setItem(SESSION_KEY + ':sid', sessionId);
    } catch {}
  }, [messages, sessionId]);

  useEffect(() => {
    setLoadingInsights(true);
    getKPI().then(data => setInsights(data)).catch(() => {}).finally(() => setLoadingInsights(false));
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text, time: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await chatAdminAI({
        message: text,
        session_id: sessionId,
        history: updatedMessages.slice(-10).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', text: m.text })),
      });
      const data = res?.data || res;
      const aiMsg = {
        role: 'ai',
        text: data?.text || 'Mình chưa trả lời được, bạn thử lại nhé.',
        time: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      if (data?.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
      }
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
        time: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={cn(
          'fixed right-0 top-1/2 -translate-y-1/2 z-40',
          'flex items-center gap-2 px-3 py-4 rounded-l-2xl shadow-2xl',
          'bg-gradient-to-b from-indigo-600 to-purple-700 text-white',
          'transition-all duration-300 hover:pr-4',
          'border border-indigo-500/30'
        )}
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        <MessageSquare size={16} />
        <span className="text-xs font-semibold tracking-wide">AI Assistant</span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[380px] z-50 flex flex-col"
          >
            <div className="flex flex-col h-full rounded-l-2xl border-l border-border bg-[hsl(var(--card))] shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <MessageSquare size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">AI Assistant</h3>
                    <p className="text-[10px] text-emerald-400">Online</p>
                  </div>
                </div>
                <button onClick={onToggle} className="p-1.5 rounded-2xl hover:bg-accent text-muted-foreground">
                  <X size={16} />
                </button>
              </div>

              {/* Quick Insights */}
              <div className="px-5 py-3 border-b border-border shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Insights nhanh</p>
                {loadingInsights ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                  </div>
                ) : insights && (
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Doanh thu hom nay', value: insights.todayRevenue ? new Intl.NumberFormat('vi-VN').format(insights.todayRevenue / 1000) + 'K' : '0', color: 'text-emerald-400' },
                      { label: 'Ban dang choi', value: `${insights.playingTables || 0}/${insights.totalTables || 0}`, color: 'text-orange-400' },
                      { label: 'Don hom nay', value: insights.todayOrders || '0', color: 'text-blue-400' },
                      { label: 'Khach hang', value: insights.todayCustomers || '0', color: 'text-purple-400' },
                    ].map(item => (
                      <div key={item.label} className="rounded-2xl bg-muted/40 p-2.5">
                        <p className="text-[10px] text-muted-foreground leading-tight">{item.label}</p>
                        <p className={`text-sm font-bold mt-0.5 ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
                  >
                    <div className={cn(
                      'w-7 h-7 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold',
                      msg.role === 'ai' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-primary/20 text-primary'
                    )}>
                      {msg.role === 'ai' ? 'AI' : 'U'}
                    </div>
                    <div className={cn('space-y-1.5', msg.role === 'user' && 'items-end')}>
                      <div className={cn(
                        'rounded-2xl px-4 py-2.5 max-w-[280px]',
                        msg.role === 'ai' ? 'bg-muted rounded-tl-sm' : 'bg-primary text-primary-foreground rounded-tr-sm'
                      )}>
                        {msg.role === 'ai' ? <RichText text={msg.text} /> : (
                          <p className="text-sm whitespace-pre-line">{msg.text}</p>
                        )}
                      </div>
                      {msg.data && Array.isArray(msg.data) && msg.data.length > 0 && (
                        <ul className="space-y-0.5">
                          {msg.data.map((item, j) => (
                            <li key={j} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                              {typeof item === 'object' ? Object.values(item).join(' - ') : item}
                            </li>
                          ))}
                        </ul>
                      )}
                      {msg.suggestion && (
                        <div className="flex items-start gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs">
                          <Lightbulb size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                          <p className="text-emerald-400/90 leading-relaxed">{msg.suggestion}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">AI</div>
                    <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick suggestions */}
              <div className="px-5 py-3 border-t border-border shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Go y nhanh</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickSuggestions.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.label}
                        onClick={() => sendMessage(s.query)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-muted/50 text-xs hover:bg-accent transition-colors border border-transparent hover:border-border"
                      >
                        <Icon size={12} className="text-indigo-400" />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input */}
              <div className="px-5 py-4 border-t border-border shrink-0">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                    placeholder="Hoi ve doanh thu, kho, gio cao diem..."
                    className="flex-1 h-10 rounded-2xl border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button size="icon" onClick={() => sendMessage(input)} disabled={!input.trim() || loading}>
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
