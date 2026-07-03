import db from '../db.js';

async function getSetting(key, fallback = '') {
  try {
    const row = await db.prepare('SELECT value FROM settings WHERE [key] = ?').get(key);
    return row?.value || fallback;
  } catch { return fallback; }
}

function safeJsonStringify(obj) {
  try { return JSON.stringify(obj); } catch { return '[]'; }
}

// ───────────────────────── Customer-facing tools ─────────────────────────

export const customerTools = [
  {
    name: 'list_available_tables',
    description: 'Tra ve danh sach cac ban dang trong tai quan. Bat buoc goi tool nay khi khach hoi con ban nao, ban nao trong, muon dat ban, hoac muon biet thong tin ban. Tra ve ID, so ban, gia, mo ta chi tiet.',
    parameters: {
      type: 'object',
      properties: {
        party_size: { type: 'integer', description: 'So nguoi du kien (neu khach noi ro)' },
        prefer_vip: { type: 'boolean', description: 'true neu khach muon ban VIP/cao cap' },
      },
    },
  },
  {
    name: 'get_menu',
    description: 'Lay danh sach thuc don (do uong, do an). Bat buoc goi khi khach hoi mon, menu, goi y mon, hoac muon xem gia. Tra ve ten mon, gia, hinh anh (neu co).',
    parameters: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Loc theo loai (Bia, Nuoc uong, Do an, Khac). De trong neu lay tat ca.', enum: ['Bia', 'Nuoc uong', 'Do an', 'Khac'] },
        limit: { type: 'integer', description: 'So mon toi da tra ve (mac dinh 10)' },
      },
    },
  },
  {
    name: 'get_business_info',
    description: 'Lay thong tin quan: dia chi, gio mo cua, hotline, gia thue ban mac dinh. Dung khi khach hoi quan o dau, gio mo cua, hotline.',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'create_booking_draft',
    description: 'TAO DON DAT BAN (chua hoan tat — can staff xac nhan). Bat buoc goi khi khach da cung cap day du thong tin: ten, sdt, ban, gio. Sau khi tao thanh cong, thong bao cho khach rang nhan vien se lien he xac nhan.',
    parameters: {
      type: 'object',
      properties: {
        customer_name: { type: 'string', description: 'Ten khach hang' },
        customer_phone: { type: 'string', description: 'So dien thoai khach hang' },
        table_id: { type: 'integer', description: 'ID ban khach muon dat' },
        start_time: { type: 'string', description: 'Thoi gian bat dau (ISO string). Vi du: 2026-06-25T18:00:00' },
        duration_minutes: { type: 'integer', description: 'Thoi luong du kien (phut)' },
        notes: { type: 'string', description: 'Ghi chu (neu co)' },
      },
      required: ['customer_name', 'customer_phone', 'table_id', 'start_time'],
    },
  },
];

export async function executeCustomerTool(name, args = {}) {
  switch (name) {
    case 'list_available_tables': {
      const all = await db.prepare(`SELECT id, table_number, description, rate_per_hour, status FROM tables WHERE status IN ('available','empty')`).all();
      let filtered = all;
      if (args.prefer_vip) {
        filtered = all.filter(t =>
          (t.description || '').toLowerCase().includes('vip') ||
          String(t.table_number || '').toLowerCase().includes('vip')
        );
        if (filtered.length === 0) filtered = all;
      }
      const defaultRate = parseInt(await getSetting('default_rate', '50000')) || 50000;
      const tables = filtered.slice(0, 8).map(t => ({
        id: t.id,
        table_number: t.table_number,
        description: t.description || null,
        rate_per_hour: t.rate_per_hour || defaultRate,
      }));
      if (tables.length === 0) {
        return { total: 0, message: 'Rất tiếc, hiện tất cả các bàn đều đã được đặt. Vui lòng quay lại sau hoặc liên hệ hotline để được hỗ trợ.' };
      }
      const tableList = tables.map(t => {
        const price = t.rate_per_hour ? `${t.rate_per_hour.toLocaleString('vi-VN')}đ/giờ` : `${defaultRate.toLocaleString('vi-VN')}đ/giờ`;
        const desc = t.description ? ` - ${t.description}` : '';
        return `  • Bàn ${t.table_number}${desc} | Giá: ${price} | ID: #${t.id}`;
      }).join('\n');
      return { total: tables.length, message: `Hiện có ${tables.length} bàn trống:\n${tableList}\n\nLiên hệ hotline hoặc nhắn tin để đặt bàn nhé!`, tables, default_rate: defaultRate };
    }

    case 'get_menu': {
      const limit = Math.min(20, Math.max(1, parseInt(args.limit) || 10));
      const cat = (args.category || '').toString().trim();
      let products;
      if (cat) {
        const catRow = await db.prepare('SELECT id FROM categories WHERE name = ?').get(cat);
        if (catRow) {
          products = await db.prepare(`SELECT TOP ${limit} id, name, price, image_url FROM products WHERE category_id = ? AND is_deleted = 0 ORDER BY id`).all(catRow.id);
        } else {
          products = await db.prepare(`SELECT TOP ${limit} id, name, price, image_url FROM products WHERE is_deleted = 0 ORDER BY id`).all();
        }
      } else {
        products = await db.prepare(`SELECT TOP ${limit} id, name, price, image_url FROM products WHERE is_deleted = 0 ORDER BY id`).all();
      }
      if (products.length === 0) return { products: [], message: 'Không có món nào trong danh mục này.' };
      const productList = products.map(p => `  • ${p.name} - ${p.price.toLocaleString('vi-VN')}đ`).join('\n');
      const catLabel = cat ? `[${cat}] ` : '[Tất cả] ';
      return { products, message: `${catLabel}Menu của chúng tôi:\n${productList}` };
    }

    case 'get_business_info': {
      const shopName   = await getSetting('name',        'Billiard Cafe');
      const address   = await getSetting('address',      'TP. Hồ Chí Minh');
      const phone     = await getSetting('phone',         '0901 234 567');
      const openTime  = await getSetting('open_time',    '08:00');
      const closeTime = await getSetting('close_time',    '23:00');
      const defaultRate = parseInt(await getSetting('default_rate', '50000')) || 50000;
      return {
        message: `${shopName}\nĐịa chỉ: ${address}\nHotline: ${phone}\nGiờ mở cửa: ${openTime} - ${closeTime}\nGiá thuê bàn: từ ${defaultRate.toLocaleString('vi-VN')}đ/giờ`,
        shop_name: shopName, address, phone, open_time: openTime, close_time: closeTime, default_rate: defaultRate,
      };
    }

    case 'create_booking_draft': {
      const required = ['customer_name', 'customer_phone', 'table_id', 'start_time'];
      const missing = required.filter(k => !args[k]);
      if (missing.length > 0) {
        return { error: `Thiếu thông tin bắt buộc: ${missing.join(', ')}`, needs_more_info: true, missing_fields: missing };
      }
      const table = await db.prepare('SELECT id, status, table_number FROM tables WHERE id = ?').get(args.table_id);
      if (!table) return { error: 'Bàn không tồn tại', needs_more_info: true };
      if (table.status !== 'available' && table.status !== 'empty') {
        return { error: `Bàn ${table.table_number} hiện đang không trống. Vui lòng chọn bàn khác.`, needs_more_info: true };
      }

      const startDate = new Date(args.start_time);
      if (Number.isNaN(startDate.getTime())) {
        return { error: 'Thời gian không hợp lệ. Định dạng ISO cần thiết.', needs_more_info: true };
      }
      const duration = parseInt(args.duration_minutes) || 120;
      const endDate = new Date(startDate.getTime() + duration * 60000);

      const result = await db.prepare(`
        INSERT INTO bookings (customer_name, phone, table_id, start_time, end_time, notes, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
      `).run(
        String(args.customer_name).trim(),
        String(args.customer_phone).trim(),
        args.table_id,
        startDate.toISOString(),
        endDate.toISOString(),
        args.notes ? String(args.notes) : null,
        new Date().toISOString()
      );

      const timeStr = startDate.toLocaleString('vi-VN', {
        weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      return {
        booking_id: result.lastInsertRowid,
        status: 'pending',
        confirmed: true,
        summary: `Đặt bàn thành công!\nKhách: ${args.customer_name}\nSĐT: ${args.customer_phone}\nBàn: Bàn ${table.table_number} (ID #${table.id})\nThời gian: ${timeStr}\nDự kiến: ${duration} phút`,
        message: 'Đơn đặt bàn đã được gửi thành công! Nhân viên sẽ liên hệ xác nhận với bạn trong giây lát.',
      };
    }

    default:
      return { error: `Tool "${name}" không tồn tại` };
  }
}

// ───────────────────────── Admin-facing tools ─────────────────────────

export const adminTools = [
  {
    name: 'get_today_revenue',
    description: 'Doanh thu hôm nay (đã thanh toán): tổng tiền, số đơn, doanh thu theo giờ.',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'get_low_stock_products',
    description: 'Sản phẩm sắp hết hoặc đã hết hàng trong kho.',
    parameters: {
      type: 'object',
      properties: {
        threshold: { type: 'integer', description: 'Ngưỡng tồn kho thấp (mặc định 10)' },
      },
    },
  },
  {
    name: 'get_top_selling_products',
    description: 'Top món bán chạy trong khoảng thời gian (mặc định 30 ngày gần nhất).',
    parameters: {
      type: 'object',
      properties: {
        period_days: { type: 'integer', description: 'Số ngày gần đây (mặc định 30)' },
        limit: { type: 'integer', description: 'Số món tối đa (mặc định 5)' },
      },
    },
  },
  {
    name: 'get_kpi_summary',
    description: 'Tổng hợp KPI: tổng đơn hôm nay, số khách mới, doanh thu hôm nay, số bàn đang chơi.',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'get_table_utilization',
    description: 'Tỷ lệ sử dụng bàn hiện tại và số bàn theo từng trạng thái.',
    parameters: { type: 'object', properties: {} },
  },
];

export async function executeAdminTool(name, args = {}) {
  switch (name) {
    case 'get_today_revenue': {
      const today = new Date().toISOString().slice(0, 10);
      const total = await db.prepare(`
        SELECT COALESCE(SUM(total), 0) as revenue, COUNT(*) as orders
        FROM orders WHERE status = 'paid' AND CAST(completed_at AS DATE) = CAST(? AS DATE)
      `).get(today);
      const byHour = await db.prepare(`
        SELECT DATEPART(HOUR, completed_at) as hour, COUNT(*) as orders, SUM(total) as revenue
        FROM orders WHERE status = 'paid' AND CAST(completed_at AS DATE) = CAST(? AS DATE)
        GROUP BY DATEPART(HOUR, completed_at) ORDER BY hour
      `).all(today);
      return { date: today, total_revenue: total?.revenue || 0, total_orders: total?.orders || 0, by_hour: byHour };
    }

    case 'get_low_stock_products': {
      const threshold = parseInt(args.threshold) || 10;
      const items = await db.prepare(`
        SELECT TOP 15 id, name, stock, unit FROM products WHERE stock <= ? AND is_deleted = 0 ORDER BY stock ASC
      `).all(threshold);
      return { threshold, items };
    }

    case 'get_top_selling_products': {
      const days  = Math.max(1, parseInt(args.period_days) || 30);
      const limit = Math.min(20, Math.max(1, parseInt(args.limit) || 5));
      const rows = await db.prepare(`
        SELECT TOP ${limit} oi.description as name, SUM(oi.quantity) as qty, SUM(oi.line_total) as revenue
        FROM order_items oi JOIN orders o ON oi.order_id = o.id
        WHERE o.status = 'paid' AND o.completed_at >= DATEADD(DAY, -${days}, GETDATE())
        GROUP BY oi.description ORDER BY qty DESC
      `).all();
      return { period_days: days, products: rows };
    }

    case 'get_kpi_summary': {
      const today = new Date().toISOString().slice(0, 10);
      const todayOrders = await db.prepare(`
        SELECT COALESCE(SUM(total), 0) as revenue, COUNT(*) as orders
        FROM orders WHERE status = 'paid' AND CAST(completed_at AS DATE) = CAST(? AS DATE)
      `).get(today);
      const newCustomers = await db.prepare(`
        SELECT COUNT(*) as c FROM customers WHERE CAST(created_at AS DATE) = CAST(? AS DATE)
      `).get(today);
      const playingTables = await db.prepare(`SELECT COUNT(*) as c FROM tables WHERE status IN ('occupied','playing')`).get();
      const totalTables  = await db.prepare('SELECT COUNT(*) as c FROM tables').get();
      return {
        date: today,
        today_revenue: todayOrders?.revenue || 0,
        today_orders: todayOrders?.orders || 0,
        new_customers_today: newCustomers?.c || 0,
        playing_tables: playingTables?.c || 0,
        total_tables: totalTables?.c || 0,
      };
    }

    case 'get_table_utilization': {
      const rows = await db.prepare('SELECT status, COUNT(*) as count FROM tables GROUP BY status').all();
      const total = rows.reduce((s, r) => s + r.count, 0);
      const playing = (rows.find(r => r.status === 'occupied')?.count || 0) + (rows.find(r => r.status === 'playing')?.count || 0);
      return {
        total_tables: total,
        utilization_percent: total > 0 ? Math.round((playing / total) * 100) : 0,
        by_status: rows,
      };
    }

    default:
      return { error: `Tool "${name}" không tồn tại` };
  }
}

export { safeJsonStringify };