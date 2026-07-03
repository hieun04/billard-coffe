import db from '../db.js';
import { applyLoyaltyForOrder } from '../utils/loyalty.js';

export default {
  async get(req, res) {
    try {
      const tables = await db.prepare(`
        SELECT *, COALESCE(table_number, name, CAST(id AS NVARCHAR(MAX))) as table_number
        FROM tables
        ORDER BY TRY_CAST(COALESCE(table_number, name, CAST(id AS NVARCHAR(MAX))) AS INT),
                 COALESCE(table_number, name, CAST(id AS NVARCHAR(MAX)))
      `).all();
      res.json({ success: true, tables });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getById(req, res) {
    try {
      const table = await db.prepare('SELECT * FROM tables WHERE id = ?').get(req.params.id);
      if (!table) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, table });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async create(req, res) {
    try {
      const { table_number, rate_per_hour = 50000, description = '' } = req.body;
      const trimmed = String(table_number).trim();
      if (!trimmed) {
        return res.status(400).json({ success: false, error: 'Số bàn là bắt buộc' });
      }

      const exists = await db.prepare('SELECT id FROM tables WHERE table_number = ?').get(trimmed);
      if (exists) {
        return res.status(409).json({ success: false, error: `Số bàn "${trimmed}" đã tồn tại` });
      }

      const result = await db.prepare(`
        INSERT INTO tables (name, table_number, status, rate_per_hour, description, booking_status)
        VALUES (?, ?, 'available', ?, ?, 'none')
      `).run(trimmed, trimmed, Number(rate_per_hour) || 50000, description || '');

      const table = await db.prepare('SELECT * FROM tables WHERE id = ?').get(result.lastInsertRowid);
      res.json({ success: true, table_id: result.lastInsertRowid, table });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async start(req, res) {
    try {
      const { customer_id } = req.body;
      const now = new Date();
      const table = await db.prepare('SELECT * FROM tables WHERE id = ?').get(req.params.id);
      if (!table) return res.status(404).json({ success: false, error: 'Table not found' });

      if (table.booking_status === 'held') {
        const bookingTime = new Date(table.booking_start_time);
        const booking = await db.prepare('SELECT customer_name, phone FROM bookings WHERE id = ?').get(table.booking_id);
        return res.status(409).json({
          success: false,
          error: `Bàn đang được giữ chỗ cho khách đặt lúc ${bookingTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}. Vui lòng check-in khách đặt trước.`,
          booking: booking || null,
          booking_start_time: table.booking_start_time,
        });
      }

      if (table.status !== 'empty' && table.status !== 'available') {
        return res.status(400).json({ success: false, error: 'Table not available' });
      }
      const customer = customer_id ? await db.prepare('SELECT name, phone, tier FROM customers WHERE id = ?').get(customer_id) : null;
      const customerName = customer ? customer.name : null;
      const customerPhone = customer ? customer.phone : null;
      const customerTier = customer ? customer.tier : null;
      const nowIso = new Date().toISOString();
      const orderResult = await db.prepare(`
        INSERT INTO orders (customer_id, customer_name, table_id, subtotal, discount, tier_discount, tax, total,
                            payment_method, status, created_at)
        VALUES (?, ?, ?, 0, 0, 0, 0, 0, 'cash', 'active', ?)
      `).run(customer_id || null, customerName, req.params.id, nowIso);
      await db.prepare(`
        UPDATE tables SET status = 'occupied', current_session_start = ?, drinks_total = 0,
                          current_customer_id = ?, current_customer_name = ?, current_customer_phone = ?, current_customer_tier = ?
        WHERE id = ?
      `).run(nowIso, customer_id || null, customerName, customerPhone, customerTier, req.params.id);
      res.json({ success: true, order_id: orderResult.lastInsertRowid });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async end(req, res) {
    try {
      const { voucher_id } = req.body || {};
      const table = await db.prepare('SELECT * FROM tables WHERE id = ?').get(req.params.id);
      if (!table) return res.status(404).json({ success: false, error: 'Table not found' });
      if (!table.current_session_start) {
        return res.status(400).json({ success: false, error: 'No active session for this table' });
      }
      const start = new Date(table.current_session_start);
      const end = new Date();
      const diffMs = end - start;
      const hours = Math.max(0.5, diffMs / 3600000);
      const billiardTotal = Math.round(hours * (table.rate_per_hour || 50000));

      const order = await db.prepare(`
        SELECT TOP 1 id, customer_id FROM orders
        WHERE table_id = ? AND status = 'active'
        ORDER BY created_at DESC
      `).get(req.params.id);
      let drinksTotal = 0;
      if (order) {
        const itemsResult = await db.prepare(`SELECT COALESCE(SUM(line_total), 0) as d FROM order_items WHERE order_id = ?`).get(order.id);
        drinksTotal = itemsResult?.d || 0;
      }

      const subtotal = billiardTotal + drinksTotal;

      let discount = 0;
      let tierDiscount = 0;
      let appliedVoucher = null;
      if (voucher_id) {
        const voucher = await db.prepare('SELECT * FROM vouchers WHERE id = ?').get(voucher_id);
        if (voucher && voucher.active && (!voucher.expires_at || new Date(voucher.expires_at) > end)) {
          appliedVoucher = voucher;
          if (voucher.type === 'percent') {
            tierDiscount = Math.min(subtotal, Math.round(subtotal * voucher.value / 100));
          } else {
            tierDiscount = Math.min(subtotal, voucher.value);
          }
          discount = tierDiscount;
          await db.prepare('UPDATE vouchers SET used_count = used_count + 1 WHERE id = ?').run(voucher_id);
        }
      }

      const total = Math.max(0, subtotal - discount);

      if (order) {
        await db.prepare(`
          UPDATE orders SET subtotal = ?, discount = ?, tier_discount = ?, total = ?,
                            status = 'paid', completed_at = ?, voucher_code = ?, voucher_discount = ?,
                            billiard_total = ?, billiard_rate = ?, billiard_hours = ?, drinks_total = ?
          WHERE id = ?
        `).run(subtotal, discount, tierDiscount, total, end.toISOString(), appliedVoucher?.code || null,
               discount, billiardTotal, table.rate_per_hour || 50000, Math.round(hours * 10) / 10,
               drinksTotal, order.id);
      }

      let loyalty = null;
      if (order?.customer_id) {
        loyalty = await applyLoyaltyForOrder({ customer_id: order.customer_id, total });
      }

      await db.prepare(`
        UPDATE tables SET status = 'empty', current_session_start = NULL, drinks_total = 0,
                          current_customer_id = NULL, current_customer_name = NULL, current_customer_phone = NULL,
                          current_customer_tier = NULL, booking_id = NULL, booking_start_time = NULL,
                          booking_customer_name = NULL, next_check_in_at = NULL, booking_status = 'none'
        WHERE id = ?
      `).run(req.params.id);

      res.json({
        success: true,
        subtotal, discount, tierDiscount, total,
        hours: Math.round(hours * 10) / 10,
        billiardTotal, drinksTotal,
        appliedVoucher: appliedVoucher ? { code: appliedVoucher.code, discount: tierDiscount } : null,
        loyalty,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async delete(req, res) {
    const tableId = req.params.id;
    try {
      const table = await db.prepare('SELECT * FROM tables WHERE id = ?').get(tableId);
      if (!table) return res.status(404).json({ success: false, error: 'Không tìm thấy bàn' });

      if (table.status === 'occupied' || table.status === 'playing') {
        return res.status(400).json({
          success: false,
          error: 'Bàn đang có khách chơi. Vui lòng kết thúc phiên trước khi xóa.',
        });
      }

      if (table.booking_status === 'held' || table.booking_status === 'checked_in') {
        return res.status(400).json({
          success: false,
          error: 'Bàn đang có đặt trước. Vui lòng hủy đặt trước trước khi xóa.',
        });
      }

      if (table.status === 'reserved') {
        return res.status(400).json({
          success: false,
          error: 'Bàn đang được đặt trước. Vui lòng hủy đặt trước trước khi xóa.',
        });
      }

      // Kiểm tra ràng buộc khóa ngoại từ các bảng orders / bookings / order_items
      const orderCount = await db.prepare(
        "SELECT COUNT(*) AS c FROM orders WHERE table_id = ?"
      ).get(tableId);
      if (orderCount && orderCount.c > 0) {
        return res.status(400).json({
          success: false,
          error: `Bàn đã có ${orderCount.c} đơn hàng trong lịch sử. Không thể xóa để giữ lại dữ liệu báo cáo.`,
        });
      }

      const bookingCount = await db.prepare(
        "SELECT COUNT(*) AS c FROM bookings WHERE table_id = ?"
      ).get(tableId);
      if (bookingCount && bookingCount.c > 0) {
        return res.status(400).json({
          success: false,
          error: `Bàn đã có ${bookingCount.c} lượt đặt trước. Không thể xóa để giữ lại lịch sử đặt bàn.`,
        });
      }

      const itemCount = await db.prepare(
        `SELECT COUNT(*) AS c
           FROM order_items oi
           INNER JOIN orders o ON oi.order_id = o.id
          WHERE o.table_id = ?`
      ).get(tableId);
      if (itemCount && itemCount.c > 0) {
        return res.status(400).json({
          success: false,
          error: `Bàn đã có ${itemCount.c} mục đơn hàng liên quan. Không thể xóa để giữ lại dữ liệu báo cáo.`,
        });
      }

      // Delete table (không cần xóa order_items hay orders vì đã check ở trên)
      await db.prepare('DELETE FROM bookings WHERE table_id = ?').run(tableId);
      await db.prepare('DELETE FROM tables WHERE id = ?').run(tableId);

      res.json({
        success: true,
        message: `Đã xóa bàn ${table.table_number || table.id}`,
      });
    } catch (err) {
      console.error('[delete table] error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async reserve(req, res) {
    try {
      await db.prepare(`UPDATE tables SET status = 'reserved' WHERE id = ?`).run(req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async cancelReserve(req, res) {
    try {
      await db.prepare(`UPDATE tables SET status = 'empty' WHERE id = ?`).run(req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async assignCustomer(req, res) {
    try {
      const { customer_id } = req.body;
      const table = await db.prepare('SELECT * FROM tables WHERE id = ?').get(req.params.id);
      if (!table) return res.status(404).json({ success: false, error: 'Table not found' });
      if (table.status !== 'occupied' && table.status !== 'playing') {
        return res.status(400).json({ success: false, error: 'Table has no active session' });
      }

      let customerName = null;
      let customerTier = null;
      let customerPhone = null;
      if (customer_id) {
        const customer = await db.prepare('SELECT * FROM customers WHERE id = ?').get(customer_id);
        if (!customer) return res.status(404).json({ success: false, error: 'Customer not found' });
        customerName = customer.name;
        customerTier = customer.tier;
        customerPhone = customer.phone;
      }

      await db.prepare(`
        UPDATE tables SET current_customer_id = ?, current_customer_name = ?, current_customer_phone = ?, current_customer_tier = ?
        WHERE id = ?
      `).run(customer_id || null, customerName, customerPhone, customerTier, req.params.id);

      const order = await db.prepare(`
        SELECT TOP 1 id FROM orders WHERE table_id = ? AND status = 'active' ORDER BY created_at DESC
      `).get(req.params.id);
      if (order) {
        await db.prepare(`UPDATE orders SET customer_id = ?, customer_name = ? WHERE id = ?`)
          .run(customer_id || null, customerName, order.id);
      }

      res.json({ success: true, customer_id: customer_id || null, customer_name: customerName, tier: customerTier, phone: customerPhone });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async customerLookup(req, res) {
    try {
      const q = req.query.q || '';
      const customers = await db.prepare(`
        SELECT TOP 10 id, name, phone, points FROM customers WHERE name LIKE ? OR phone LIKE ?
      `).all(`%${q}%`, `%${q}%`);
      res.json({ success: true, customers });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async addDrink(req, res) {
    try {
      const { product_id, quantity = 1 } = req.body;
      const table = await db.prepare('SELECT * FROM tables WHERE id = ?').get(req.params.id);
      if (!table) return res.status(404).json({ success: false, error: 'Table not found' });

      const orderResult = await db.prepare(`
        SELECT TOP 1 id FROM orders WHERE table_id = ? AND status = 'active' ORDER BY created_at DESC
      `).get(req.params.id);
      if (!orderResult) return res.status(400).json({ success: false, error: 'No active order for this table' });

      const product = await db.prepare('SELECT * FROM products WHERE id = ? AND is_deleted = 0').get(product_id);
      if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

      const lineTotal = quantity * product.price;
      await db.prepare(`
        INSERT INTO order_items (order_id, product_id, description, quantity, unit_price, line_total)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(orderResult.id, product_id, product.name, quantity, product.price, lineTotal);

      if (product.stock !== undefined && product.stock !== null) {
        await db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND is_deleted = 0').run(quantity, product_id);
      }

      const newDrinksTotal = (table.drinks_total || 0) + lineTotal;
      await db.prepare('UPDATE tables SET drinks_total = ? WHERE id = ?').run(newDrinksTotal, req.params.id);

      res.json({ success: true, line_total: lineTotal, drinks_total: newDrinksTotal });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async addDrinks(req, res) {
    try {
      const { items } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'No items provided' });
      }

      const table = await db.prepare('SELECT * FROM tables WHERE id = ?').get(req.params.id);
      if (!table) return res.status(404).json({ success: false, error: 'Table not found' });

      const orderResult = await db.prepare(`
        SELECT TOP 1 id FROM orders WHERE table_id = ? AND status = 'active' ORDER BY created_at DESC
      `).get(req.params.id);
      if (!orderResult) return res.status(400).json({ success: false, error: 'No active order for this table' });

      const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, description, quantity, unit_price, line_total)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND is_deleted = 0');

      let totalAdded = 0;
      const results = [];

      for (const item of items) {
        const { product_id, quantity = 1 } = item;
        if (!product_id || quantity <= 0) continue;

        const product = await db.prepare('SELECT * FROM products WHERE id = ? AND is_deleted = 0').get(product_id);
        if (!product) continue;

        const lineTotal = quantity * product.price;
        await insertItem.run(orderResult.id, product_id, product.name, quantity, product.price, lineTotal);
        if (product.stock !== undefined && product.stock !== null) {
          await updateStock.run(quantity, product_id);
        }
        totalAdded += lineTotal;
        results.push({ product_id, name: product.name, quantity, line_total: lineTotal });
      }

      const newDrinksTotal = (table.drinks_total || 0) + totalAdded;
      await db.prepare('UPDATE tables SET drinks_total = ? WHERE id = ?').run(newDrinksTotal, req.params.id);

      res.json({ success: true, drinks_total: newDrinksTotal, items: results, total_added: totalAdded });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getPaymentPreview(req, res) {
    try {
      const table = await db.prepare('SELECT * FROM tables WHERE id = ?').get(req.params.id);
      if (!table) return res.status(404).json({ success: false, error: 'Table not found' });
      if (!table.current_session_start) {
        return res.status(400).json({ success: false, error: 'No active session for this table' });
      }
      const start = new Date(table.current_session_start);
      const now = new Date();
      const diffMs = now - start;
      const hours = Math.max(0.5, diffMs / 3600000);
      const billiardTotal = Math.round(hours * (table.rate_per_hour || 50000));

      const order = await db.prepare(`
        SELECT TOP 1 id, customer_id, customer_name FROM orders WHERE table_id = ? AND status = 'active' ORDER BY created_at DESC
      `).get(req.params.id);
      let items = [];
      let drinksTotal = 0;
      let customer = null;
      let tierVoucher = null;

      if (order) {
        items = await db.prepare(`
          SELECT oi.*, p.image_url, p.name as product_name
          FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `).all(order.id);
        drinksTotal = items.reduce((sum, i) => sum + (i.line_total || 0), 0);

        if (order.customer_id) {
          customer = await db.prepare('SELECT id, name, phone, points, tier, total_spent, visit_count FROM customers WHERE id = ?').get(order.customer_id);
          if (customer) {
            tierVoucher = await db.prepare(`
              SELECT TOP 1 * FROM vouchers
              WHERE tier = ? AND active = 1 AND (expires_at IS NULL OR expires_at > ?)
                AND used_count < max_uses
              ORDER BY id DESC
            `).get(customer.tier, now.toISOString());
          }
        }
      }

      const subtotal = billiardTotal + drinksTotal;
      res.json({
        success: true,
        hours: Math.round(hours * 10) / 10,
        billiardRate: table.rate_per_hour || 50000,
        billiardTotal, drinksTotal, subtotal,
        items, elapsed: diffMs, customer, tierVoucher,
        table_id: table.id,
        table_name: table.table_number || table.name || ('Bàn ' + table.id),
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};