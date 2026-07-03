import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot } from 'lucide-react';
import { chatPublic } from '@/api/ai';

const QUICK_REPLIES = [
  'Còn bàn nào trống không?',
  'Tôi muốn đặt bàn',
  'Món ngon gợi ý cho tôi?',
  'Giá thuê bàn bao nhiêu?',
  'Quán ở đâu, giờ mở cửa?',
];

const SESSION_KEY = 'ai_public_session';

function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-muted-foreground/20 px-1 rounded text-xs">$1</code>');
}

export default function ChatWidget({ businessInfo = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        role: 'assistant',
        text: `Xin chào! Mình là trợ lý của ${businessInfo.name || 'quán'}. Mình có thể giúp bạn:\n\n• Xem bàn bida còn trống\n• Gợi ý món ngon\n• Giá thuê bàn\n• Đặt bàn theo yêu cầu\n• Địa chỉ & giờ mở cửa\n\nBạn cần gì?`,
      },
    ];
  });
  const [sessionId, setSessionId] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY + ':sid');
      if (saved) return saved;
    } catch {}
    return `pub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  });
  const [bookingCtx, setBookingCtx] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY + ':ctx');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages.slice(-30)));
      sessionStorage.setItem(SESSION_KEY + ':sid', sessionId);
      if (bookingCtx) {
        sessionStorage.setItem(SESSION_KEY + ':ctx', JSON.stringify(bookingCtx));
      } else {
        sessionStorage.removeItem(SESSION_KEY + ':ctx');
      }
    } catch {}
  }, [messages, sessionId, bookingCtx]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const recentMessages = newMessages.slice(-10);
      const firstUserIdx = recentMessages.findIndex(m => m.role === 'user');
      const historyToSend = firstUserIdx >= 0 ? recentMessages.slice(firstUserIdx).map(m => ({ role: m.role, text: m.text })) : [];

      const data = await chatPublic({
        message: userText,
        session_id: sessionId,
        history: historyToSend,
        booking_context: bookingCtx,
      });

      let replyText;
      if (data?.success === false) {
        replyText = `Xin lỗi, gặp lỗi: "${data?.error || 'Lỗi không xác định'}". Gọi hotline: ${businessInfo.phone || '0901 234 567'} nhé!`;
      } else if (data?.text && typeof data.text === 'string') {
        replyText = data.text;
      } else {
        replyText = 'Xin lỗi, mình chưa hiểu ý bạn. Bạn thử hỏi cụ thể hơn nhé!';
      }

      setMessages(prev => [...prev, { role: 'assistant', text: replyText }]);

      if (data?.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
      }

      // Update booking context from response
      if (data?.booking_context !== undefined) {
        setBookingCtx(data.booking_context);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Xin lỗi, hiện tại mình chưa trả lời được. Gọi hotline: ' + (businessInfo.phone || '0901 234 567') + ' nhé!' },
      ]);
      setBookingCtx(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-160px)] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-primary text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Trợ lý ảo</p>
                  <p className="text-xs opacity-80">Sẵn sàng hỗ trợ</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    }`}
                    style={{ whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{ __html: msg.role === 'user' ? msg.text : renderMarkdown(msg.text) }}
                  />
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            {messages.length <= 2 && !loading && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_REPLIES.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full border bg-muted hover:bg-muted/70 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-4 pt-2 border-t">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Nhắn tin hỏi ngay..."
                  className="flex-1 h-10 px-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center relative"
      >
        {isOpen ? <X size={22} /> : <Bot size={22} />}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-background animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
