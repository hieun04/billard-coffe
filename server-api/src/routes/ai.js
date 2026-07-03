import db from '../db.js';
import { isGeminiEnabled, getModel, GEMINI_MODEL_NAME } from '../services/geminiClient.js';
import {
  customerTools,
  executeCustomerTool,
  adminTools,
  executeAdminTool,
  safeJsonStringify,
} from '../services/aiTools.js';

function formatVND(n) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(n || 0)) + ' VND';
}

async function getSetting(key, fallback = '') {
  try {
    const row = await db.prepare('SELECT value FROM settings WHERE [key] = ?').get(key);
    return row && row.value ? row.value : fallback;
  } catch { return fallback; }
}

async function logChat(sessionId, role, channel, content, toolCalls = null, userId = null) {
  try {
    await db.prepare(`
      INSERT INTO ai_chat_logs (session_id, role, channel, user_id, content, tool_calls, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      sessionId,
      role,
      channel,
      userId,
      typeof content === 'string' ? content : JSON.stringify(content),
      toolCalls ? JSON.stringify(toolCalls) : null,
      new Date().toISOString()
    );
  } catch (e) { console.warn('logChat failed:', e.message); }
}

function buildHistory(rows) {
  const history = [];
  for (const r of rows) {
    if (r.role === 'user') {
      history.push({ role: 'user', parts: [{ text: r.content }] });
    } else if (r.role === 'assistant') {
      history.push({ role: 'model', parts: [{ text: r.content }] });
    }
  }
  return history;
}

// ── Gemini function-calling loop ────────────────────────────────────────
async function runGemini({ systemInstruction, history, userMessage, tools, executor, sessionId, channel, userId }) {
  const model = getModel(channel);

  const chat = model.startChat({
    systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
    tools: [{ functionDeclarations: tools }],
    history,
  });

  await logChat(sessionId, 'user', channel, userMessage, null, userId);
  let result = await chat.sendMessage(userMessage);

  let safetyCount = 0;
  while (safetyCount < 5) {
    safetyCount++;
    const call = result.response.functionCalls?.()?.[0];
    if (!call) break;

    const toolName = call.name;
    const toolArgs = call.args || {};
    const toolResult = executor(toolName, toolArgs);

    await logChat(sessionId, 'tool', channel, safeJsonStringify({ name: toolName, args: toolArgs }), { name: toolName, args: toolArgs }, userId);

    result = await chat.sendMessage([
      {
        functionResponse: {
          name: toolName,
          response: toolResult,
        },
      },
    ]);
  }

  const reply = result.response.text();
  await logChat(sessionId, 'assistant', channel, reply, null, userId);
  return reply;
}

// ════════════════════════════════════════════════════════════════════════════
// ── BOOKING FLOW ENGINE ──────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

const bookingStore = new Map();

function getBookingCtx(sessionId) {
  if (!bookingStore.has(sessionId)) {
    bookingStore.set(sessionId, { step: 'idle', name: null, phone: null, table_id: null, table_name: null, datetime: null, notes: null });
  }
  return bookingStore.get(sessionId);
}

function clearBookingCtx(sessionId) {
  bookingStore.delete(sessionId);
}

function extractPhone(text) {
  const normalized = (text || '').replace(/[.\-\s]/g, '');
  const match = normalized.match(/0\d{9,10}/);
  return match ? match[0] : null;
}

function extractName(text) {
  const n = normalizeVietnamese(text || '');
  const patterns = [
    /(?:ten|ho ten|ho va ten)\s*(?:la|:|\s)\s*([a-z\s]{2,30})/,
    /(?:toi|mình|minh)\s+(?:la|:)\s*([a-z\s]{2,30})/,
    /(?:mình|minh)\s+ten\s*([a-z\s]{2,30})/,
    /^([a-z\s]{2,40})$/,
  ];
  for (const p of patterns) {
    const m = n.match(p);
    if (m && m[1]) {
      const name = m[1].trim().replace(/\s+/g, ' ');
      if (name && name.length >= 2 && !/^\d/.test(name) && !/^\d/.test(text || '')) {
        return capitalizeName(m[1].trim().replace(/\s+/g, ' '), text || '');
      }
    }
  }
  const words = (text || '').trim().split(/\s+/);
  if (words.length >= 1 && words.length <= 5 && words.every(w => /^[A-ZÀ-ỹa-zà-ỹ]+$/.test(w))) {
    return capitalizeName((text || '').trim(), text || '');
  }
  return null;
}

function capitalizeName(name, originalText) {
  const lowerOrig = (originalText || '').toLowerCase();
  const lowerName = normalizeVietnamese(name.toLowerCase());
  const idx = lowerOrig.indexOf(lowerName);
  if (idx >= 0) {
    return (originalText || '')
      .slice(idx, idx + lowerName.length)
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
  return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function extractTableId(text) {
  const n = normalizeVietnamese((text || '').toLowerCase());
  const m = n.match(/ban\s*#?(\d+)|id\s*#?(\d+)|#(\d+)/);
  if (m) return parseInt(m[1] || m[2] || m[3]);
  const num = n.match(/\b(\d+)\b/);
  if (num && num[1].length <= 3) return parseInt(num[1]);
  return null;
}

function extractDatetime(text) {
  const n = normalizeVietnamese((text || '').toLowerCase());
  const now = new Date();

  const todayMatch = n.match(/hom\s*nay\s*(?:luc\s*)?(\d{1,2})(?::(\d{2}))?/);
  if (todayMatch) {
    const h = parseInt(todayMatch[1]);
    const m = todayMatch[2] ? parseInt(todayMatch[2]) : 0;
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    if (d < now) d.setDate(d.getDate() + 1);
    return d.toISOString();
  }

  const tomorrowMatch = n.match(/ngay\s*mai\s*(?:luc\s*)?(\d{1,2})(?::(\d{2}))?/);
  if (tomorrowMatch) {
    const h = parseInt(tomorrowMatch[1]);
    const m = tomorrowMatch[2] ? parseInt(tomorrowMatch[2]) : 0;
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  }

  const timeMatch = n.match(/(?:luc\s*)?(\d{1,2})(?::(\d{2}))?\s*h$/);
  if (timeMatch) {
    const h = parseInt(timeMatch[1]);
    const m = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    if (d < now) d.setDate(d.getDate() + 1);
    return d.toISOString();
  }

  const isoMatch = n.match(/(\d{4}-\d{2}-\d{2})(?:[T\s](\d{1,2}):(\d{2}))?/);
  if (isoMatch) {
    const dateStr = isoMatch[1];
    const h = isoMatch[2] ? parseInt(isoMatch[2]) : 18;
    const m = isoMatch[3] ? parseInt(isoMatch[3]) : 0;
    return new Date(`${dateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`).toISOString();
  }
  return null;
}

async function getAvailableTables() {
  try {
    const tables = await db.prepare(`
      SELECT TOP 8 id, table_number, description, rate_per_hour FROM tables
      WHERE status IN ('available','empty')
    `).all();
    const defaultRate = parseInt(await getSetting('default_rate', '50000')) || 50000;

    const heldTableIds = new Set();
    try {
      const held = await db.prepare(`
        SELECT DISTINCT table_id FROM bookings
        WHERE status IN ('pending','confirmed','playing')
          AND start_time IS NOT NULL
          AND start_time >= DATEADD(HOUR, -2, GETDATE())
          AND start_time <= DATEADD(HOUR, 24, GETDATE())
      `).all();
      for (const h of held) if (h.table_id) heldTableIds.add(h.table_id);
    } catch {}

    return tables
      .filter(t => !heldTableIds.has(t.id))
      .map(t => ({
        id: t.id,
        table_number: t.table_number,
        display_name: displayTable(t.table_number),
        description: t.description || null,
        rate_per_hour: t.rate_per_hour || defaultRate,
      }));
  } catch { return []; }
}

function displayTable(tableNumber) {
  if (!tableNumber) return 'Ban Unknown';
  const n = String(tableNumber).trim();
  if (n.toLowerCase().startsWith('ban') || n.toLowerCase().startsWith('bàn')) return n;
  return `Ban ${n}`;
}

async function processBookingStep(sessionId, userMessage) {
  const ctx = getBookingCtx(sessionId);
  const m = userMessage || '';
  const n = m.toLowerCase();

  const nc = normalizeVietnamese(n);
  const cancelIntent = /\b(huy\s*(dat|phieu)?|bo\s*(di|qua|roi)?|thoi(\s*roi)?|khong\s*(dat|can|muon)\s*nua|huy\s*bo)\b/.test(nc)
    || /^(khong|huy|thoi|bo)(\s|$|[!.])/.test(nc.trim());
  if (ctx.step !== 'idle' && cancelIntent) {
    clearBookingCtx(sessionId);
    return { text: 'Đã huỷ phiếu đặt bàn. Bạn cần gì thêm không?', booking_context: null };
  }

  const tables = await getAvailableTables();
  const fmtVND = (v) => formatVND(v || 50000);

  if (ctx.step === 'idle') {
    if (n.includes('dat ban') || n.includes('đặt bàn') || n.includes('booking') || n.includes('dat') || n.includes('đặt')) {
      if (tables.length === 0) {
        clearBookingCtx(sessionId);
        return { text: 'Rất tiếc, hiện không có bàn trống. Gọi hotline ' + await getSetting('phone', '0901 234 567') + ' để đặt trước nhé!', booking_context: null };
      }
      ctx.step = 'name';
      return { text: 'Tôi giúp bạn đặt bàn nhé! Cho mình biết tên của bạn:', booking_context: { step: 'name' } };
    }
    return null;
  }

  if (ctx.step === 'name') {
    const name = extractName(m);
    if (name) {
      ctx.name = name;
      ctx.step = 'phone';
      const tableList = tables.slice(0, 4).map(t => `  Bàn ${displayTable(t.table_number)}${t.description ? ` (${t.description})` : ''} - ${fmtVND(t.rate_per_hour)}/giờ (ID: #${t.id})`).join('\n');
      return { text: `Cảm ơn ${ctx.name}! Số điện thoại của bạn là gì?\n\nHiện có ${tables.length} bàn trống:\n${tableList}`, booking_context: { step: 'phone', name: ctx.name } };
    }
    return { text: 'Xin lỗi, mình chưa lấy được tên. Bạn cho mình biết tên của bạn được không? (ví dụ: Nguyễn Văn A)', booking_context: { step: 'name' } };
  }

  if (ctx.step === 'phone') {
    const phone = extractPhone(m);
    if (phone) {
      ctx.phone = phone;
      ctx.step = 'table';
      const tableList = tables.length > 0
        ? `\n\nBạn muốn đặt bàn nào? Hiện có ${tables.length} bàn trống:\n` + tables.slice(0, 5).map(t => `  Bàn ${displayTable(t.table_number)}${t.description ? ` (${t.description})` : ''} - ${fmtVND(t.rate_per_hour)}/giờ (ID: #${t.id})`).join('\n')
        : '';
      return { text: `Số điện thoại ${ctx.phone} đã được ghi nhận. Bạn muốn đặt bàn nào?${tableList}\n\n(Bạn có thể chỉ cần nói "Bàn 1" hoặc "ID #3" là được)`, booking_context: { step: 'table', name: ctx.name, phone: ctx.phone } };
    }
    return { text: 'Số điện thoại chưa đúng định dạng. Bạn nhập lại số điện thoại của bạn được không? (ví dụ: 0901234567)', booking_context: { step: 'phone', name: ctx.name } };
  }

  if (ctx.step === 'table') {
    const tableId = extractTableId(m);
    if (tableId) {
      const table = tables.find(t => t.id === tableId);
      if (table) {
        ctx.table_id = table.id;
        ctx.table_name = displayTable(table.table_number);
        ctx.step = 'datetime';
        return { text: `Bàn ${table.table_number} đã được chọn! Bạn muốn chơi lúc mấy giờ? (ví dụ: hôm nay 18:00, ngày mai 14:00)`, booking_context: { step: 'datetime', name: ctx.name, phone: ctx.phone, table_id: ctx.table_id, table_name: ctx.table_name } };
      }
      return { text: `Không tìm thấy bàn ID #${tableId}. Bạn chọn lại bàn trống:\n` + tables.slice(0, 5).map(t => `  Bàn ${displayTable(t.table_number)} (ID: #${t.id})`).join('\n'), booking_context: { step: 'table', name: ctx.name, phone: ctx.phone } };
    }
    return { text: 'Bạn chưa chọn bàn. Vui lòng cho biết số bàn hoặc ID bàn bạn muốn đặt. (ví dụ: Bàn 1, hoặc ID #3)', booking_context: { step: 'table', name: ctx.name, phone: ctx.phone } };
  }

  if (ctx.step === 'datetime') {
    const datetime = extractDatetime(m);
    if (datetime) {
      ctx.datetime = datetime;
      ctx.step = 'confirm';
      const timeStr = new Date(ctx.datetime).toLocaleString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      return { text: `Xác nhận thông tin đặt bàn:\n\n  Tên: ${ctx.name}\n  SĐT: ${ctx.phone}\n  Bàn: ${ctx.table_name}\n  Giờ: ${timeStr}\n\nXác nhận đặt bàn? (Trả lời "Có" hoặc "Xác nhận" để tạo phiếu)`, booking_context: { step: 'confirm', name: ctx.name, phone: ctx.phone, table_id: ctx.table_id, table_name: ctx.table_name, datetime: ctx.datetime } };
    }
    return { text: 'Thời gian chưa rõ. Bạn nhập lại giờ bạn muốn chơi? (ví dụ: hôm nay 18:00, ngày mai 14:00)', booking_context: { step: 'datetime', name: ctx.name, phone: ctx.phone, table_id: ctx.table_id, table_name: ctx.table_name } };
  }

  if (ctx.step === 'confirm') {
    const n2 = normalizeVietnamese(n.replace(/[.,!?]/g, ''));
    const isConfirm = /\b(co|ok|yes|dung|xac\s*nhan|chap\s*nhan|duoc|dong\s*y)\b/.test(n2);
    const isCancel = /\b(khong|khong\s*co|huy|bo\s*qua|sai|thoi\s*roi)\b/.test(n2);

    if (isCancel) {
      clearBookingCtx(sessionId);
      return { text: 'Đã huỷ phiếu đặt bàn. Bạn cần gì thêm không?', booking_context: null };
    }

    if (isConfirm) {
      try {
        const recent = await db.prepare(`
          SELECT TOP 1 id FROM bookings
          WHERE customer_name = ? AND phone = ? AND table_id = ? AND start_time = ?
            AND status = 'pending' AND created_at >= DATEADD(SECOND, -60, GETDATE())
          ORDER BY id DESC
        `).get(ctx.name, ctx.phone, ctx.table_id, ctx.datetime);
        if (recent) {
          clearBookingCtx(sessionId);
          return { text: `Phiếu đặt bàn #${recent.id} đã được tạo trước đó. Vui lòng chờ nhân viên xác nhận hoặc gọi hotline ${await getSetting('phone', '0901 234 567')} nếu cần hỗ trợ.`, booking_context: null, booking_id: recent.id };
        }
      } catch {}

      try {
        const result = await db.prepare(`
          INSERT INTO bookings (customer_name, phone, table_id, start_time, notes, status, created_at)
          VALUES (?, ?, ?, ?, ?, 'pending', ?)
        `).run(ctx.name, ctx.phone, ctx.table_id, ctx.datetime, ctx.notes || null, new Date().toISOString());

        const bookingId = result.lastInsertRowid;
        const timeStr = new Date(ctx.datetime).toLocaleString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });
        clearBookingCtx(sessionId);
        return { text: `✅ Đặt bàn thành công!\n\n  Mã phiếu: #${bookingId}\n  Khách: ${ctx.name}\n  SĐT: ${ctx.phone}\n  Bàn: ${ctx.table_name}\n  Thời gian: ${timeStr}\n  Trạng thái: Chờ xác nhận\n\nNhân viên sẽ liên hệ xác nhận với bạn trong giây lát. Cảm ơn bạn đã đặt tại ${await getSetting('name', 'Billiard Cafe')}!`, booking_context: null, booking_id: bookingId };
      } catch (err) {
        console.error('Booking creation failed:', err);
        clearBookingCtx(sessionId);
        return { text: 'Đã xảy ra lỗi khi tạo phiếu đặt bàn. Vui lòng gọi hotline ' + await getSetting('phone', '0901 234 567') + ' để đặt trước nhé!', booking_context: null };
      }
    }
    return { text: 'Xin cho biết "Có" để xác nhận đặt bàn, hoặc "Không" để huỷ.', booking_context: { step: 'confirm', name: ctx.name, phone: ctx.phone, table_id: ctx.table_id, table_name: ctx.table_name, datetime: ctx.datetime } };
  }

  return null;
}

// ════════════════════════════════════════════════════════════════════════════
// ── INTENT CLASSIFICATION ────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

function normalizeVietnamese(s) {
  let r = (s || '').toLowerCase();
  const map = [
    ['à','a'],['á','a'],['ả','a'],['ã','a'],['ạ','a'],
    ['ă','a'],['ằ','a'],['ắ','a'],['ẳ','a'],['ẵ','a'],['ặ','a'],
    ['â','a'],['ầ','a'],['ấ','a'],['ẩ','a'],['ẫ','a'],['ậ','a'],
    ['è','e'],['é','e'],['ẻ','e'],['ẽ','e'],['ẹ','e'],
    ['ê','e'],['ề','e'],['ế','e'],['ể','e'],['ễ','e'],['ệ','e'],
    ['ì','i'],['í','i'],['ỉ','i'],['ĩ','i'],['ị','i'],
    ['ò','o'],['ó','o'],['ỏ','o'],['õ','o'],['ọ','o'],
    ['ô','o'],['ồ','o'],['ố','o'],['ổ','o'],['ỗ','o'],['ộ','o'],
    ['ơ','o'],['ờ','o'],['ớ','o'],['ở','o'],['ỡ','o'],['ợ','o'],
    ['ù','u'],['ú','u'],['ủ','u'],['ũ','u'],['ụ','u'],
    ['ư','u'],['ừ','u'],['ứ','u'],['ử','u'],['ữ','u'],['ự','u'],
    ['ỳ','y'],['ý','y'],['ỷ','y'],['ỹ','y'],['ỵ','y'],
    ['đ','d'],
  ];
  for (const [from, to] of map) { r = r.split(from).join(to); }
  return r;
}

function classifyIntent(message) {
  const m = (message || '').trim();
  if (!m) return 'general';
  const n = normalizeVietnamese(m);
  if (n.includes('dat ban') || n.includes('booking') || n.includes('book')) return 'booking';
  if (n.includes('goi y') || n.includes('tu van') || n.includes('suggest') || n.includes('recommend')) return 'suggest';
  if (n.includes('thuc don') || n.includes('douong') || n.includes('do uong') || n.includes('menu')) return 'menu';
  if (n.includes('cafe') || n.includes('bia') || n.includes('nuoc')) return 'menu';
  if (/(^|\s)mon(\s|$|nhat|ngon|an|nay)/.test(n) || n.includes('mon an') || n.includes('mon nuoc')) return 'menu';
  if (n.includes('thuc an') || n.includes('do an')) return 'menu';
  if (n.includes('gia') || n.includes('tien') || n.includes('thue') || n.includes('bang gia')) return 'price';
  if (n.includes('dia chi') || n.includes('o dau') || n.includes('cho nao') || n.includes('ban do') || n.includes('map ')) return 'location';
  if (n.includes('mo cua') || n.includes('dong cua') || n.includes('may gio') || n.includes('gio mo') || n.includes('mo cua')) return 'hours';
  if (/(^|\s)ban(\s|$|trong|nao|dau|day|nay)/.test(n) || n.includes('con ban')) return 'tables';
  return 'general';
}

// ════════════════════════════════════════════════════════════════════════════
// ── FALLBACK REPLY (no Gemini API key) ──────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

async function fallbackRuleBasedReply(message, shopName) {
  const m = message || '';
  const intent = classifyIntent(m);
  const exec = async (tool, args) => await executeCustomerTool(tool, args || {});
  const fmtVND = (n) => new Intl.NumberFormat('vi-VN').format(Math.round(n || 0)) + ' VND';
  const lower = normalizeVietnamese(m);

  // Check for "top mon ban chay" type queries (admin-level query, still answerable)
  const isTopSelling = /top|ban\s*chay|banchay|nhieu\s*nhat|nhieunhat|hot|best|seller/.test(lower);
  if (isTopSelling) {
    let days = 30, limit = 5;
    const daysMatch = lower.match(/(\d+)\s*(ngay|tuan|thang)?/);
    if (daysMatch) {
      const n = parseInt(daysMatch[1]);
      const unit = daysMatch[2] || 'ngay';
      if (unit.startsWith('tuan')) days = n * 7;
      else if (unit.startsWith('thang')) days = n * 30;
      else days = n;
    }
    const limitMatch = lower.match(/top\s*(\d+)/);
    if (limitMatch) limit = parseInt(limitMatch[1]);

    try {
      // SQL Server: TOP n requires literal (not parameter). Embed directly.
      rows = await db.prepare(`
        SELECT TOP ${limit} oi.description as name, SUM(oi.quantity) as qty, SUM(oi.line_total) as revenue
        FROM order_items oi JOIN orders o ON oi.order_id = o.id
        WHERE o.status='paid' AND o.completed_at >= DATEADD(DAY, -${days}, GETDATE())
        GROUP BY oi.description ORDER BY qty DESC
      `).all();

      if (rows.length > 0) {
        let reply = `🍽️ **TOP ${limit} MÓN BÁN CHẠY** tại ${shopName} (${days} ngày qua)\n\n`;
        const medals = ['🥇','🥈','🥉'];
        rows.forEach((r, i) => {
          reply += `${medals[i] || `${i+1}.`} ${r.name} — **${r.qty}** phần · ${fmtVND(r.revenue)}\n`;
        });
        const totalQty = rows.reduce((s, r) => s + r.qty, 0);
        reply += `\n📊 Tổng ${totalQty} phần từ top ${limit} món này.\n`;
        return reply;
      }
      return `📈 Chưa có dữ liệu bán hàng trong ${days} ngày qua tại ${shopName}.`;
    } catch (e) {
      console.error('Top selling query error:', e);
      return `Hiện tại chưa lấy được dữ liệu món bán chạy. Vui lòng thử lại sau.`;
    }
  }

  if (intent === 'menu' || intent === 'suggest') {
    const n = normalizeVietnamese(m);
    let cat = '';
    if (n.includes('bia') || n.includes('beer')) cat = 'Bia';
    else if (n.includes('nuoc uong') || n.includes('douong') || n.includes('cafe') || n.includes('ca phe')) cat = 'Nuoc uong';
    else if (n.includes('thuc an') || n.includes('do an') || (n.includes('an') && n.includes('thuc'))) cat = 'Do an';

    const toolResult = await exec('get_menu', cat ? { category: cat, limit: 15 } : { limit: 15 });
    if (toolResult?.products?.length > 0) {
      const products = toolResult.products;
      const prices = products.map(p => p.price);
      let reply = `Tại ${shopName}, mình gợi ý cho bạn:\n\n`;
      for (const p of products) reply += `  • ${p.name} — ${fmtVND(p.price)}\n`;
      reply += `\nGiá từ ${fmtVND(Math.min(...prices))} đến ${fmtVND(Math.max(...prices))}.\n`;
      if (intent === 'suggest') {
        const pick = products[Math.floor(Math.random() * Math.min(3, products.length))];
        reply += `\nGợi ý hôm nay: ${pick?.name} (${fmtVND(pick?.price)}) — rất được khách yêu thích!`;
      } else {
        reply += `\nBạn muốn đặt món nào ạ?`;
      }
      return reply;
    }
    return `${shopName} rất sẵn lòng phục vụ bạn! Gọi hotline ${await getSetting('phone', '0901 234 567')} để biết thêm nhé.`;
  }

  if (intent === 'tables') {
    const toolResult = await exec('list_available_tables');
    if (toolResult?.tables?.length > 0) {
      let reply = `Hiện ${shopName} có ${toolResult.tables.length} bàn trống:\n\n`;
      for (const t of toolResult.tables.slice(0, 6)) {
        const rate = t.rate_per_hour ? fmtVND(t.rate_per_hour) : fmtVND(toolResult.default_rate);
        reply += `  • Bàn ${displayTable(t.table_number)}${t.description ? ` (${t.description})` : ''} — ${rate}/giờ\n`;
      }
      if (toolResult.tables.length > 6) reply += `  ...và ${toolResult.tables.length - 6} bàn khác.\n`;
      reply += `\nGọi ${await getSetting('phone', '0901 234 567')} để đặt bàn ngay nhé!`;
      return reply;
    }
    return `Rất tiếc, hiện tất cả bàn đã được đặt. Gọi hotline ${await getSetting('phone', '0901 234 567')} để đặt trước nhé!`;
  }

  if (intent === 'price') {
    const defaultRate = parseInt(await getSetting('default_rate', '50000')) || 50000;
    const toolResult = await exec('list_available_tables');
    if (toolResult?.tables?.length > 0) {
      const rateMap = {};
      for (const t of toolResult.tables) {
        const r = t.rate_per_hour || defaultRate;
        rateMap[r] = (rateMap[r] || 0) + 1;
      }
      const rates = [...new Set(Object.keys(rateMap).map(Number))].sort((a, b) => a - b);
      let reply = `Bảng giá tại ${shopName}:\n\n`;
      for (const r of rates) reply += `  • Từ ${fmtVND(r)}/giờ (${rateMap[r]} bàn)\n`;
      reply += `\nHotline: ${await getSetting('phone', '0901 234 567')}. Giá có thể thay đổi theo khung giờ.`;
      return reply;
    }
    return `Giá thuê bàn từ ${fmtVND(defaultRate)}/giờ. Gọi hotline ${await getSetting('phone', '0901 234 567')} để biết chi tiết nhé!`;
  }

  if (intent === 'location') {
    const address = await getSetting('address', 'TP. Hồ Chí Minh');
    const phone = await getSetting('phone', '0901 234 567');
    const open = await getSetting('open_time', '08:00');
    const close = await getSetting('close_time', '23:00');
    return `Địa chỉ ${shopName}: ${address}\nHotline: ${phone}\nMở cửa: ${open} - ${close}\n\nBạn cần hỗ trợ thêm gì không ạ?`;
  }

  if (intent === 'hours') {
    const open = await getSetting('open_time', '08:00');
    const close = await getSetting('close_time', '23:00');
    return `${shopName} mở cửa từ ${open} đến ${close} hàng ngày. Gọi hotline ${await getSetting('phone', '0901 234 567')} để đặt bàn trước nhé!`;
  }

  const toolResult = await exec('list_available_tables');
  const available = toolResult?.total || 0;
  const defaultRate = parseInt(await getSetting('default_rate', '50000')) || 50000;
  return `Xin chào! Mình là trợ lý của ${shopName}\n\nHiện có ${available} bàn trống, giá từ ${fmtVND(defaultRate)}/giờ.\n\nMình có thể giúp bạn:\n  • Xem & đặt bàn trống\n  • Xem thực đơn & gợi ý món\n  • Bảng giá dịch vụ\n  • Địa chỉ & giờ mở cửa\n\nBạn cần gì ạ?`;
}

// ════════════════════════════════════════════════════════════════════════════
// ── PUBLIC CHAT ─────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

const CUSTOMER_SYSTEM_PROMPT = `Bạn là trợ lý ảo thân thiện của quán Billiard Cafe. Luôn trả lời bằng tiếng Việt có dấu đầy đủ, rõ ràng, dễ hiểu.

**QUAN TRỌNG - LUÔN GỌI TOOL LẤY DỮ LIỆU THẬT:**
1. Khi khách hỏi về bàn trống, bàn nào còn, danh sách bàn → BẮT BUỘC gọi tool list_available_tables.
2. Khi khách hỏi về menu, món, gợi ý món, giá món → BẮT BUỘC gọi tool get_menu.
3. Khi khách hỏi về địa chỉ, giờ mở cửa, hotline, bảng giá → BẮT BUỘC gọi tool get_business_info.

**ĐẶT BÀN:**
- Hỏi lần lượt: tên khách, số điện thoại, bàn muốn đặt (gợi ý bàn trống), ngày giờ.
- Khi đủ thông tin (tên + SĐT + bàn + giờ) → gọi tool create_booking_draft.
- Sau khi tool trả booking_id → thông báo nhân viên sẽ xác nhận.

**QUY TẮC TRẢ LỜI:**
- Trả lời ngắn gọn, thân thiện, dùng emoji phù hợp.
- TUYỆT ĐỐI dùng tiếng Việt có dấu (không viết kiểu không dấu như "khach", "tro ly").
- KHÔNG bịa số liệu — luôn gọi tool để lấy dữ liệu thực.
- Nếu khách hỏi về bàn/menu/đặt bàn mà chưa gọi tool → gọi ngay.
- Nếu khách chào hoặc hỏi chung chung → gọi list_available_tables + get_business_info để chào đúng tên quán, giờ mở cửa.`;

export async function publicChat(req, res) {
  const { message, session_id: incomingSessionId, history: incomingHistory, booking_context: incomingCtx } = req.body || {};
  const sessionId = incomingSessionId || `pub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const shopName = await getSetting('name', 'Billiard Cafe');

  try {
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Thieu noi dung tin nhan' });
    }

    if (incomingCtx && typeof incomingCtx === 'object') {
      const ctx = getBookingCtx(sessionId);
      Object.assign(ctx, incomingCtx);
    }

    const bookingResult = await processBookingStep(sessionId, message);
    if (bookingResult) {
      await logChat(sessionId, 'user', 'public', message);
      await logChat(sessionId, 'assistant', 'public', bookingResult.text);
      return res.json({
        success: true, text: bookingResult.text, session_id: sessionId,
        ai_enabled: false, booking_context: bookingResult.booking_context,
        booking_id: bookingResult.booking_id || null,
      });
    }

    if (!isGeminiEnabled()) {
      const fallback = await fallbackRuleBasedReply(message, shopName);
      await logChat(sessionId, 'user', 'public', message);
      await logChat(sessionId, 'assistant', 'public', fallback);
      return res.json({ success: true, text: fallback, session_id: sessionId, ai_enabled: false });
    }

    const historyRows = Array.isArray(incomingHistory) ? incomingHistory : [];
    const history = historyRows.filter(h => h && h.role && h.text).map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: String(h.text) }] }));
    if (history.length > 0 && history[0].role !== 'user') history.shift();

    const text = await runGemini({
      systemInstruction: CUSTOMER_SYSTEM_PROMPT, history, userMessage: message,
      tools: customerTools, executor: executeCustomerTool, sessionId, channel: 'public',
    });

    return res.json({ success: true, text, session_id: sessionId, ai_enabled: true });
  } catch (err) {
    console.error('publicChat error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// ════════════════════════════════════════════════════════════════════════════
// ── ADMIN CHAT ───────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

const ADMIN_SYSTEM_PROMPT = `Bạn là trợ lý AI nội bộ dành cho admin/nhân viên quán Billiard Cafe. Luôn trả lời bằng tiếng Việt có dấu đầy đủ, chuyên nghiệp, rõ ràng.

**3 TÁC VỤ CHÍNH — LUÔN GỌI TOOL TƯƠNG ỨNG:**

1. 📊 **BÁO CÁO DOANH THU HÔM NAY**
   - Câu hỏi ví dụ: "Doanh thu hôm nay?", "Hôm nay bán được bao nhiêu?", "Báo cáo doanh thu".
   - → Gọi tool get_today_revenue.
   - Trình bày: tổng doanh thu (VND), số đơn đã thanh toán, doanh thu theo giờ (giờ nào cao nhất).

2. 🍽️ **MÓN BÁN CHẠY**
   - Câu hỏi ví dụ: "Top món bán chạy?", "Món nào được mua nhiều nhất?", "Best seller".
   - → Gọi tool get_top_selling_products (mặc định 30 ngày, top 5).
   - Trình bày: bảng xếp hạng tên món + số lượng bán + doanh thu.

3. 📦 **HÀNG TỒN KHO**
   - Câu hỏi ví dụ: "Hàng sắp hết?", "Tồn kho?", "Cần nhập gì?", "Hết hàng chưa?".
   - → Gọi tool get_low_stock_products (mặc định ngưỡng 10).
   - Trình bày: danh sách sản phẩm sắp hết + tồn kho hiện tại + cảnh báo nếu = 0.

**TÁC VỤ PHỤ:**
- Tổng quan nhanh → get_kpi_summary.
- Tình trạng bàn → get_table_utilization.

**QUY TẮC:**
- LUÔN dùng số liệu thực từ tool — KHÔNG được bịa.
- LUÔN viết tiếng Việt có dấu.
- Format tiền VND rõ ràng: ví dụ "1.250.000đ" hoặc "1.250.000 VND".
- Trả lời ngắn gọn, dùng emoji phù hợp (📊 🍽️ 📦 💰 ⚠️).`;

export async function adminChat(req, res) {
  const { message, session_id: incomingSessionId, history: incomingHistory } = req.body || {};
  const sessionId = incomingSessionId || `adm-${req.user?.id || 0}-${Date.now()}`;
  const userId = req.user?.id || null;

  console.log('[adminChat] Message:', message);
  console.log('[adminChat] isGeminiEnabled:', isGeminiEnabled());

  try {
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Thieu noi dung tin nhan' });
    }

    if (!isGeminiEnabled()) {
      console.log('[adminChat] Using fallbackRuleBasedAdmin');
      const fallback = await fallbackRuleBasedAdmin(message);
      await logChat(sessionId, 'user', 'admin', message, null, userId);
      await logChat(sessionId, 'assistant', 'admin', fallback, null, userId);
      return res.json({ success: true, text: fallback, session_id: sessionId, ai_enabled: false });
    }

    const historyRows = Array.isArray(incomingHistory) ? incomingHistory : [];
    const history = historyRows.filter(h => h && h.role && h.text).map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: String(h.text) }] }));
    if (history.length > 0 && history[0].role !== 'user') history.shift();

    const text = await runGemini({
      systemInstruction: ADMIN_SYSTEM_PROMPT, history, userMessage: message,
      tools: adminTools, executor: executeAdminTool, sessionId, channel: 'admin', userId,
    });

    return res.json({ success: true, text, session_id: sessionId, ai_enabled: true });
  } catch (err) {
    console.error('adminChat error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function fallbackRuleBasedAdmin(message) {
  const original = (message || '').toLowerCase().trim();
  const lower = normalizeVietnamese(original);
  const hasWord = (words) => words.some(w => lower.includes(w));

  if (hasWord(['doanh thu','doanhthu','thu nhap','thunhap','bao cao','baocao','ban duoc','doanh so','doanhso','revenue'])) {
    const today = new Date().toISOString().slice(0, 10);
    const row = await db.prepare(`
      SELECT COALESCE(SUM(total), 0) as r, COUNT(*) as c FROM orders WHERE status='paid' AND CAST(completed_at AS DATE) = CAST(? AS DATE)
    `).get(today);
    const byHour = await db.prepare(`
      SELECT DATEPART(HOUR, completed_at) as hour, COUNT(*) as orders, SUM(total) as rev
      FROM orders WHERE status='paid' AND CAST(completed_at AS DATE) = CAST(? AS DATE)
      GROUP BY DATEPART(HOUR, completed_at) ORDER BY hour
    `).all(today);

    const totalRev = row?.r || 0;
    const totalOrders = row?.c || 0;
    let reply = `📊 **BÁO CÁO DOANH THU HÔM NAY** (${today})\n\n`;
    reply += `• Tổng doanh thu: **${formatVND(totalRev)}**\n`;
    reply += `• Số đơn đã thanh toán: **${totalOrders}**\n`;
    reply += `• Trung bình/đơn: **${formatVND(totalOrders > 0 ? totalRev / totalOrders : 0)}**\n`;
    if (byHour.length > 0) {
      const peak = byHour.reduce((max, h) => (!max || h.rev > max.rev) ? h : max, null);
      reply += `• Giờ cao điểm: **${String(peak.hour).padStart(2,'0')}:00** — ${peak.orders} đơn, ${formatVND(peak.rev)}\n`;
      reply += `\nChi tiết theo giờ:\n`;
      for (const h of byHour) reply += `  - ${String(h.hour).padStart(2,'0')}:00 → ${h.orders} đơn · ${formatVND(h.rev)}\n`;
    } else {
      reply += `\n(Chưa có giao dịch nào hôm nay.)\n`;
    }
    return reply;
  }

  if (hasWord(['ton kho','tonkho','kho','het hang','hethang','sap het','saphet','can nhap','cannhap'])) {
    const thresholdMatch = lower.match(/(\d+)\s*(don vi|donvi|san pham|sanpham)?/);
    const threshold = thresholdMatch ? parseInt(thresholdMatch[1]) : 10;
    const items = await db.prepare(`
      SELECT TOP 20 id, name, stock, unit FROM products WHERE stock <= ? AND is_deleted = 0 ORDER BY stock ASC
    `).all(threshold);
    if (!items.length) return `✅ Kho ổn — không có sản phẩm nào dưới ngưỡng ${threshold}.`;
    let reply = `📦 **HÀNG TỒN KHO** (ngưỡng ≤ ${threshold})\n\n`;
    let outOfStock = 0, lowStock = 0;
    for (const it of items) {
      const status = it.stock === 0 ? '🔴 HẾT' : it.stock <= 3 ? '🟠 Rất ít' : '🟡 Sắp hết';
      reply += `• ${it.name}: **${it.stock} ${it.unit || 'phần'}** — ${status}\n`;
      if (it.stock === 0) outOfStock++; else lowStock++;
    }
    reply += `\n📌 Tổng: ${outOfStock} món hết hàng, ${lowStock} món sắp hết.\n`;
    reply += `→ Cần nhập gấp: ${items.filter(i => i.stock <= 3).map(i => i.name).join(', ') || 'không có'}.\n`;
    return reply;
  }

  if (hasWord(['ban chay','banchay','nhieu nhat','nhieunhat','hot','best','top','topmon','top mon'])) {
    let days = 30, limit = 5;
    const daysMatch = lower.match(/(\d+)\s*(ngay|tuan|thang)?/);
    if (daysMatch) {
      const n = parseInt(daysMatch[1]);
      const unit = daysMatch[2] || 'ngay';
      if (unit.startsWith('tuan')) days = n * 7;
      else if (unit.startsWith('thang')) days = n * 30;
      else days = n;
    }
    const limitMatch = lower.match(/top\s*(\d+)/);
    if (limitMatch) limit = parseInt(limitMatch[1]);

    // SQL Server: TOP n requires literal (not parameter). Embed directly.
    let rows = await db.prepare(`
      SELECT TOP ${limit} oi.description as name, SUM(oi.quantity) as qty, SUM(oi.line_total) as revenue
      FROM order_items oi JOIN orders o ON oi.order_id = o.id
      WHERE o.status='paid' AND o.completed_at >= DATEADD(DAY, -${days}, GETDATE())
      GROUP BY oi.description ORDER BY qty DESC
    `).all();

    if (!rows.length) return `📈 Chưa có dữ liệu bán hàng trong ${days} ngày qua.`;
    let reply = `🍽️ **TOP ${limit} MÓN BÁN CHẠY** (${days} ngày qua)\n\n`;
    const medals = ['🥇','🥈','🥉'];
    rows.forEach((r, i) => {
      reply += `${medals[i] || `${i+1}.`} ${r.name} — **${r.qty}** phần · ${formatVND(r.revenue)}\n`;
    });
    const totalQty = rows.reduce((s, r) => s + r.qty, 0);
    reply += `\n📊 Tổng ${totalQty} phần từ top ${limit} món này.\n`;
    return reply;
  }

  if (hasWord(['tong quan','tongquan','kpi','tom tat','tomtat','hom nay'])) {
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = await db.prepare(`
      SELECT COALESCE(SUM(total), 0) as r, COUNT(*) as c FROM orders WHERE status='paid' AND CAST(completed_at AS DATE) = CAST(? AS DATE)
    `).get(today);
    const newCustomers = await db.prepare(`
      SELECT COUNT(*) as c FROM customers WHERE CAST(created_at AS DATE) = CAST(? AS DATE)
    `).get(today);
    const playing = await db.prepare(`
      SELECT COUNT(*) as c FROM tables WHERE status IN ('occupied','playing')
    `).get();
    const total = await db.prepare('SELECT COUNT(*) as c FROM tables').get();
    return [
      `📊 **TỔNG QUAN HÔM NAY** (${today})`, ``,
      `• Doanh thu: **${formatVND(todayOrders?.r)}**`,
      `• Số đơn: **${todayOrders?.c || 0}**`,
      `• Khách mới: **${newCustomers?.c || 0}**`,
      `• Bàn đang chơi: **${playing?.c || 0}/${total?.c || 0}**`, ``,
      `Bạn có thể hỏi thêm: doanh thu hôm nay, hàng tồn kho, món bán chạy, tỷ lệ bàn.`,
    ].join('\n');
  }

  if (hasWord(['ty le','tyle','su dung','sudung','book nhieu','booknhieu','dat nhieu','datnhieu','ti le dat ban','tiledatban','ti le su dung'])) {
    try {
      const total = await db.prepare('SELECT COUNT(*) as c FROM tables').get();
      const byStatus = await db.prepare('SELECT status, COUNT(*) as c FROM tables GROUP BY status').all();
      const playing = (byStatus.find(r => r.status === 'occupied')?.c || 0) + (byStatus.find(r => r.status === 'playing')?.c || 0);
      const available = (byStatus.find(r => r.status === 'available')?.c || 0) + (byStatus.find(r => r.status === 'empty')?.c || 0);
      const reserved = (byStatus.find(r => r.status === 'reserved')?.c || 0) + (byStatus.find(r => r.status === 'booked')?.c || 0);
      const utilPct = total.c > 0 ? Math.round((playing / total.c) * 100) : 0;

      const todayStart = new Date().toISOString().slice(0, 10);
      const bookingsRows = await db.prepare(`
        SELECT COUNT(*) as total, SUM(CASE WHEN status IN ('pending','confirmed') THEN 1 ELSE 0 END) as pending,
               SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
               SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
        FROM bookings WHERE CAST(COALESCE(created_at, start_time) AS DATE) = CAST(? AS DATE)
      `).get(todayStart);
      const totalBk = bookingsRows?.total || 0;
      const pendingBk = bookingsRows?.pending || 0;
      const completedBk = bookingsRows?.completed || 0;
      const cancelledBk = bookingsRows?.cancelled || 0;
      const confirmedRate = totalBk > 0 ? Math.round((completedBk / totalBk) * 100) : 0;

      let reply = `🎱 **TỶ LỆ SỬ DỤNG BÀN HIỆN TẠI**\n\n`;
      reply += `• Tổng số bàn: **${total.c}**\n`;
      reply += `• Đang chơi: **${playing}** bàn\n`;
      reply += `• Trống: **${available}** bàn\n`;
      reply += `• Đã đặt trước: **${reserved}** bàn\n`;
      reply += `• Tỷ lệ sử dụng: **${utilPct}%**\n\n`;

      reply += `📅 **TỶ LỆ ĐẶT BÀN HÔM NAY** (${todayStart})\n\n`;
      reply += `• Tổng phiếu đặt: **${totalBk}**\n`;
      reply += `• Chờ xác nhận: **${pendingBk}**\n`;
      reply += `• Hoàn thành: **${completedBk}**\n`;
      reply += `• Đã huỷ: **${cancelledBk}**\n`;
      reply += `• Tỷ lệ đặt thành công: **${confirmedRate}%**\n`;
      return reply;
    } catch (e) {
      console.error('Table utilization error:', e);
      return `Hiện tại chưa lấy được dữ liệu tỷ lệ sử dụng bàn. Vui lòng thử lại sau.`;
    }
  }

  return `💡 AI Gemini chưa bật (thiếu GEMINI_API_KEY trong server-api/.env).\n\nMình vẫn trả lời được các tác vụ chính bằng dữ liệu thật:\n  1. "Doanh thu hôm nay" → báo cáo chi tiết theo giờ\n  2. "Hàng tồn kho" → sản phẩm sắp hết/hết\n  3. "Món bán chạy" → top N món theo khoảng thời gian\n  4. "Tổng quan" → KPI nhanh hôm nay\n  5. "Tỷ lệ bàn / Tỷ lệ đặt bàn" → tình trạng bàn và booking hôm nay\n\nBạn muốn xem tác vụ nào?`;
}

// ════════════════════════════════════════════════════════════════════════════
// ── INSIGHTS ────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

export async function getInsights(req, res) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const insights = [];

    const hourlyOrders = await db.prepare(`
      SELECT DATEPART(HOUR, completed_at) as hour, COUNT(*) as cnt, SUM(total) as rev
      FROM orders WHERE status = 'paid' AND completed_at IS NOT NULL
        AND CAST(completed_at AS DATE) = CAST(? AS DATE)
      GROUP BY DATEPART(HOUR, completed_at) ORDER BY cnt DESC
    `).all(today);

    if (hourlyOrders.length > 0) {
      const topHour = hourlyOrders[0];
      insights.push({
        type: 'peak', icon: 'clock',
        text: `Giờ cao điểm nhất hôm nay là ${String(topHour.hour).padStart(2,'0')}:00 với ${topHour.cnt} đơn và doanh thu ${formatVND(topHour.rev)}.`,
        priority: 'high',
      });
    }

    const lowStock = await db.prepare(`
      SELECT TOP 3 name, stock, unit FROM products WHERE stock < 20 AND stock > 0 AND is_deleted = 0 ORDER BY stock ASC
    `).all();
    if (lowStock.length > 0) {
      insights.push({
        type: 'stock', icon: 'alert',
        text: lowStock.map(p => `${p.name} (còn ${p.stock} ${p.unit})`).join(', ') + ' sắp hết hàng.',
        priority: 'high',
      });
    }

    const outOfStock = await db.prepare(`
      SELECT TOP 3 name FROM products WHERE stock = 0 AND is_deleted = 0 ORDER BY name
    `).all();
    if (outOfStock.length > 0) {
      insights.push({
        type: 'stock', icon: 'alert',
        text: outOfStock.map(p => p.name).join(', ') + ' đã hết hàng!',
        priority: 'critical',
      });
    }

    res.json({ success: true, insights, ai_enabled: isGeminiEnabled(), model: GEMINI_MODEL_NAME });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}