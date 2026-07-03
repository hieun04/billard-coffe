import db from '../db.js';

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/"/g, '""');
}

export default {
  async getKPI(req, res) {
    try {
      const { from, to } = req.query;
      const today = from || new Date().toISOString().slice(0, 10);
      const yesterdayDate = new Date(new Date(today).getTime() - 86400000).toISOString().slice(0, 10);
      const toDate = to || new Date().toISOString().slice(0, 10);

      const todayRevenue = await db.prepare(`
        SELECT COALESCE(SUM(total), 0) as t FROM orders WHERE status = 'paid' AND CAST(completed_at AS DATE) = CAST(? AS DATE)
      `).get(today);
      const yesterdayRevenue = await db.prepare(`
        SELECT COALESCE(SUM(total), 0) as t FROM orders WHERE status = 'paid' AND CAST(completed_at AS DATE) = CAST(? AS DATE)
      `).get(yesterdayDate);
      const todayOrders = await db.prepare(`
        SELECT COUNT(*) as c FROM orders WHERE status = 'paid' AND CAST(completed_at AS DATE) = CAST(? AS DATE)
      `).get(today);
      const yesterdayOrders = await db.prepare(`
        SELECT COUNT(*) as c FROM orders WHERE status = 'paid' AND CAST(completed_at AS DATE) = CAST(? AS DATE)
      `).get(yesterdayDate);
      const todayCustomers = await db.prepare(`
        SELECT COUNT(DISTINCT customer_id) as c FROM orders WHERE status = 'paid' AND CAST(completed_at AS DATE) = CAST(? AS DATE) AND customer_id IS NOT NULL
      `).get(today);
      const yesterdayCustomers = await db.prepare(`
        SELECT COUNT(DISTINCT customer_id) as c FROM orders WHERE status = 'paid' AND CAST(completed_at AS DATE) = CAST(? AS DATE) AND customer_id IS NOT NULL
      `).get(yesterdayDate);

      const revenueTrend = yesterdayRevenue.t > 0 ? Math.round((todayRevenue.t - yesterdayRevenue.t) / yesterdayRevenue.t * 100) : (todayRevenue.t > 0 ? 100 : 0);
      const orderTrend = yesterdayOrders.c > 0 ? Math.round((todayOrders.c - yesterdayOrders.c) / yesterdayOrders.c * 100) : (todayOrders.c > 0 ? 100 : 0);
      const customerTrend = yesterdayCustomers.c > 0 ? Math.round((todayCustomers.c - yesterdayCustomers.c) / yesterdayCustomers.c * 100) : (todayCustomers.c > 0 ? 100 : 0);

      const totalTables        = (await db.prepare('SELECT COUNT(*) as c FROM tables').get()).c;
      const playingTables      = (await db.prepare(`SELECT COUNT(*) as c FROM tables WHERE status IN ('occupied','playing')`).get()).c;
      const availableTables    = (await db.prepare(`SELECT COUNT(*) as c FROM tables WHERE status IN ('empty','available')`).get()).c;
      const reservedTables     = (await db.prepare(`SELECT COUNT(*) as c FROM tables WHERE status = 'reserved'`).get()).c;
      const maintenanceTables  = (await db.prepare(`SELECT COUNT(*) as c FROM tables WHERE status = 'maintenance'`).get()).c;

      const revenueByDay = await db.prepare(`
        SELECT CAST(completed_at AS DATE) as date, SUM(total) as revenue
        FROM orders WHERE status = 'paid' AND completed_at IS NOT NULL
          AND CAST(completed_at AS DATE) BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)
        GROUP BY CAST(completed_at AS DATE) ORDER BY date
      `).all(from || '1970-01-01', to || '2100-01-01');

      const topProducts = await db.prepare(`
        SELECT TOP 5 oi.description as name, SUM(oi.quantity) as quantity
        FROM order_items oi JOIN orders o ON oi.order_id = o.id
        WHERE o.status = 'paid' AND CAST(o.completed_at AS DATE) BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)
        GROUP BY oi.description ORDER BY quantity DESC
      `).all(from || '1970-01-01', to || '2100-01-01');

      const totalRevenue    = (await db.prepare(`
        SELECT COALESCE(SUM(total), 0) as t FROM orders WHERE status = 'paid' AND completed_at IS NOT NULL
          AND CAST(completed_at AS DATE) BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)
      `).get(from || '1970-01-01', to || '2100-01-01')).t;
      const totalOrders     = (await db.prepare(`
        SELECT COUNT(*) as c FROM orders WHERE status = 'paid' AND completed_at IS NOT NULL
          AND CAST(completed_at AS DATE) BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)
      `).get(from || '1970-01-01', to || '2100-01-01')).c;

      const billiardRevenue = (await db.prepare(`
        SELECT COALESCE(SUM(total), 0) as t FROM orders WHERE status = 'paid' AND table_id IS NOT NULL
          AND CAST(completed_at AS DATE) BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)
      `).get(from || '1970-01-01', to || '2100-01-01')).t;
      const drinksRevenue   = (await db.prepare(`
        SELECT COALESCE(SUM(oi.line_total), 0) as t
        FROM order_items oi JOIN orders o ON oi.order_id = o.id
        WHERE o.status = 'paid' AND CAST(o.completed_at AS DATE) BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)
      `).get(from || '1970-01-01', to || '2100-01-01')).t;

      const hoursResult = await db.prepare(`
        SELECT COALESCE(SUM(
          CASE WHEN end_time IS NULL THEN 0
          ELSE ROUND(CAST(DATEDIFF(MINUTE, start_time, end_time) AS FLOAT) / 60.0, 1)
          END
        ), 0) as h FROM staff_shifts WHERE CAST(start_time AS DATE) BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)
      `).get(today, toDate);

      res.json({
        success: true,
        todayRevenue: todayRevenue?.t || 0,
        todayOrders: todayOrders?.c || 0,
        todayCustomers: todayCustomers?.c || 0,
        totalTables, playingTables, availableTables, reservedTables, maintenanceTables,
        revenueByDay, topProducts,
        totalRevenue, totalOrders,
        billiardRevenue, drinksRevenue,
        totalDiscount: 0,
        revenueTrend, orderTrend, customerTrend,
        totalHours: hoursResult?.h || 0,
      });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getRevenue(req, res) {
    try {
      const { from, to } = req.query;
      const orders = await db.prepare(`
        SELECT * FROM orders WHERE status = 'paid'
          AND CAST(completed_at AS DATE) BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)
        ORDER BY completed_at DESC
      `).all(from || '1970-01-01', to || '2100-01-01');
      res.json({ success: true, orders });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getProductReport(req, res) {
    try {
      const { from, to } = req.query;
      const products = await db.prepare(`
        SELECT oi.description as name, SUM(oi.quantity) as quantity, SUM(oi.line_total) as revenue
        FROM order_items oi JOIN orders o ON oi.order_id = o.id
        WHERE o.status = 'paid' AND CAST(o.completed_at AS DATE) BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)
        GROUP BY oi.description ORDER BY revenue DESC
      `).all(from || '1970-01-01', to || '2100-01-01');
      res.json({ success: true, products });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async export(req, res) {
    try {
      const { type, from, to } = req.query;
      const fromDate = from || '1970-01-01';
      const toDate = to || '2100-01-01';

      let title = '';
      let rows = [];

      if (type === 'orders') {
        title = 'BÁO CÁO LỊCH SỬ ĐƠN HÀNG';
        const orders = await db.prepare(`
          SELECT o.id, o.table_id, t.table_number, o.customer_name, o.subtotal, o.discount, o.total,
                 o.payment_method, o.completed_at
          FROM orders o LEFT JOIN tables t ON o.table_id = t.id
          WHERE o.status = 'paid' AND CAST(o.completed_at AS DATE) BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)
          ORDER BY o.completed_at DESC
        `).all(fromDate, toDate);

        rows = [
          ['STT', 'Mã ĐH', 'Bàn', 'Khách hàng', 'Tạm tính', 'Giảm giá', 'Thành tiền', 'Thanh toán', 'Ngày thanh toán'],
          ...orders.map((o, i) => [
            i + 1, `DH${String(o.id).padStart(4, '0')}`,
            o.table_number ? `Bàn ${o.table_number}` : '-',
            o.customer_name || 'Khách lẻ', o.subtotal, o.discount || 0, o.total,
            o.payment_method?.toUpperCase() || '-',
            o.completed_at ? new Date(o.completed_at).toLocaleString('vi-VN') : '-',
          ]),
        ];

      } else if (type === 'revenue_daily') {
        title = 'BÁO CÁO DOANH THU THEO NGÀY';
        const daily = await db.prepare(`
          SELECT CAST(completed_at AS DATE) as date, COUNT(*) as order_count,
                 SUM(subtotal) as subtotal, SUM(discount) as discount, SUM(total) as revenue
          FROM orders WHERE status = 'paid' AND completed_at IS NOT NULL
            AND CAST(completed_at AS DATE) BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)
          GROUP BY CAST(completed_at AS DATE) ORDER BY date
        `).all(fromDate, toDate);

        const totalRevenue = daily.reduce((sum, d) => sum + d.revenue, 0);
        const totalOrders = daily.reduce((sum, d) => sum + d.order_count, 0);

        rows = [
          ['STT', 'Ngày', 'Số đơn', 'Tạm tính', 'Giảm giá', 'Doanh thu'],
          ...daily.map((d, i) => [
            i + 1, new Date(d.date).toLocaleDateString('vi-VN'),
            d.order_count, d.subtotal, d.discount || 0, d.revenue,
          ]),
          ['-', 'TỔNG CỘNG', totalOrders,
           daily.reduce((s, d) => s + d.subtotal, 0),
           daily.reduce((s, d) => s + d.discount, 0), totalRevenue],
        ];

      } else if (type === 'revenue_monthly') {
        title = 'BÁO CÁO DOANH THU THEO THÁNG';
        const monthly = await db.prepare(`
          SELECT FORMAT(completed_at, 'yyyy-MM') as month, COUNT(*) as order_count,
                 SUM(subtotal) as subtotal, SUM(discount) as discount, SUM(total) as revenue
          FROM orders WHERE status = 'paid' AND completed_at IS NOT NULL
            AND CAST(completed_at AS DATE) BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)
          GROUP BY FORMAT(completed_at, 'yyyy-MM') ORDER BY month
        `).all(fromDate, toDate);

        const totalRevenue = monthly.reduce((sum, d) => sum + d.revenue, 0);
        const totalOrders = monthly.reduce((sum, d) => sum + d.order_count, 0);

        rows = [
          ['STT', 'Tháng', 'Số đơn', 'Tạm tính', 'Giảm giá', 'Doanh thu'],
          ...monthly.map((d, i) => [
            i + 1, d.month, d.order_count, d.subtotal, d.discount || 0, d.revenue,
          ]),
          ['-', 'TỔNG CỘNG', totalOrders,
           monthly.reduce((s, d) => s + d.subtotal, 0),
           monthly.reduce((s, d) => s + d.discount, 0), totalRevenue],
        ];

      } else if (type === 'top_products') {
        title = 'BÁO CÁO MÓN BÁN CHẠY';
        const products = await db.prepare(`
          SELECT oi.description as name, SUM(oi.quantity) as quantity, SUM(oi.line_total) as revenue
          FROM order_items oi JOIN orders o ON oi.order_id = o.id
          WHERE o.status = 'paid' AND CAST(o.completed_at AS DATE) BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)
          GROUP BY oi.description ORDER BY revenue DESC
        `).all(fromDate, toDate);

        const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
        const totalQty = products.reduce((sum, p) => sum + p.quantity, 0);

        rows = [
          ['STT', 'Tên món', 'Số lượng bán', 'Doanh thu'],
          ...products.map((p, i) => [i + 1, p.name || 'Không xác định', p.quantity, p.revenue]),
          ['-', 'TỔNG CỘNG', totalQty, totalRevenue],
        ];

      } else {
        title = 'BÁO CÁO TỔNG HỢP';
        const orders = await db.prepare(`
          SELECT o.*, t.table_number FROM orders o LEFT JOIN tables t ON o.table_id = t.id
          WHERE o.status = 'paid' AND CAST(o.completed_at AS DATE) BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)
          ORDER BY o.completed_at DESC
        `).all(fromDate, toDate);

        const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
        const totalOrders = orders.length;
        const totalDiscount = orders.reduce((s, o) => s + (o.discount || 0), 0);

        rows = [
          ['STT', 'Mã ĐH', 'Bàn', 'Khách hàng', 'Tạm tính', 'Giảm giá', 'Thành tiền', 'PT Thanh toán', 'Ngày'],
          ...orders.map((o, i) => [
            i + 1, `DH${String(o.id).padStart(4, '0')}`,
            o.table_number ? `Bàn ${o.table_number}` : '-',
            o.customer_name || 'Khách lẻ', o.subtotal, o.discount || 0, o.total,
            o.payment_method?.toUpperCase() || '-',
            o.completed_at ? new Date(o.completed_at).toLocaleString('vi-VN') : '-',
          ]),
          ['-', 'TỔNG CỘNG', '', '', '', totalDiscount, totalRevenue, '', ''],
        ];
      }

      let csv = '\uFEFF';
      csv += title + '\n';
      csv += `Thời gian: ${fromDate} đến ${toDate}\n`;
      csv += '\n';

      for (const row of rows) {
        csv += row.map(cell => {
          if (typeof cell === 'string') return `"${escapeHtml(cell)}"`;
          if (typeof cell === 'number') return `"${formatCurrency(cell)}"`;
          return `""`;
        }).join(',') + '\n';
      }

      const filename = `bao_cao_${type || 'tong_hop'}_${fromDate}_${toDate}.csv`;
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },
};