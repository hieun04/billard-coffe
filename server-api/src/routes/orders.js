import db from '../db.js';
import { calculateVoucherDiscount, validateVoucherForSubtotal } from './vouchers.js';
import { applyLoyaltyForOrder } from '../utils/loyalty.js';

export default {
  async get(req, res) {
    try {
      const orders = await db.prepare(`
        SELECT o.*, t.name as table_name, c.name as customer_name
        FROM orders o
        LEFT JOIN tables t ON o.table_id = t.id
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE o.status IN ('active','paid')
        ORDER BY o.created_at DESC
      `).all();
      res.json({ success: true, orders });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getById(req, res) {
    try {
      const order = await db.prepare(`
        SELECT o.*, t.name as table_name
        FROM orders o LEFT JOIN tables t ON o.table_id = t.id
        WHERE o.id = ?
      `).get(req.params.id);
      if (!order) return res.status(404).json({ success: false, error: 'Not found' });
      const items = await db.prepare(`
        SELECT oi.*, p.image_url as product_image_url, p.name as product_name, c.name as category_name
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE oi.order_id = ?
        ORDER BY oi.id
      `).all(req.params.id);
      res.json({ success: true, order, items });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async create(req, res) {
    try {
      const { table_id, customer_id, items = [], payment_method = 'cash', note = '', voucher_id } = req.body;
      const now = new Date().toISOString();

      let voucher = null;
      let requestedDiscount = 0;

      let orderId = null;
      if (table_id) {
        const existing = await db.prepare(`
          SELECT TOP 1 id FROM orders
          WHERE table_id = ? AND status = 'active'
          ORDER BY created_at DESC
        `).get(table_id);
        if (existing) orderId = existing.id;
      }

      const isPosCheckout = !orderId;
      const insertOrder = db.prepare(`
        INSERT INTO orders (customer_id, table_id, subtotal, discount, tier_discount, tax, total,
                            payment_method, status, note, created_at, completed_at)
        OUTPUT INSERTED.id VALUES (?, ?, 0, 0, 0, 0, 0, ?, 'active', ?, ?, ?)
      `);

      if (!orderId) {
        const result = await insertOrder.get(customer_id || null, table_id || null, payment_method, note || '', now, now);
        orderId = result?.id;
      }

      let subtotal = 0;
      const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, description, quantity, unit_price, line_total)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const decrementStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND is_deleted = 0');
      const findProduct = db.prepare('SELECT * FROM products WHERE id = ? AND is_deleted = 0');

      const tx = db.transaction(async () => {
        for (const item of items) {
          const product = await findProduct.get(item.product_id);
          if (!product) continue;
          const unitPrice = item.unit_price || product.price;
          const lineTotal = item.quantity * unitPrice;
          subtotal += lineTotal;
          await insertItem.run(orderId, item.product_id, product.name, item.quantity, unitPrice, lineTotal);
          if (product.stock !== undefined && product.stock !== null) {
            await decrementStock.run(item.quantity, item.product_id);
          }
        }
      });
      await tx();

      if (voucher_id) {
        voucher = await db.prepare('SELECT * FROM vouchers WHERE id = ?').get(voucher_id);
        const validation = validateVoucherForSubtotal(voucher, subtotal);
        if (!validation.valid) {
          return res.status(400).json({ success: false, error: validation.error });
        }
        requestedDiscount = calculateVoucherDiscount(voucher, subtotal);
      }

      const discount = Math.min(subtotal, Math.max(0, Math.round(requestedDiscount)));
      const tax = Math.max(0, Math.round((subtotal - discount) * 0.1));
      const total = Math.max(0, Math.round(subtotal - discount + tax));

      const finalStatus = isPosCheckout ? 'paid' : 'active';
      const completedAt = isPosCheckout ? now : null;

      await db.prepare(`
        UPDATE orders SET subtotal = ?, discount = ?, tax = ?, total = ?, payment_method = ?,
                          note = ?, status = ?, completed_at = ?
        WHERE id = ?
      `).run(subtotal, discount, tax, total, payment_method, note || '', finalStatus, completedAt, orderId);

      if (voucher) {
        await db.prepare('UPDATE vouchers SET used_count = used_count + 1 WHERE id = ?').run(voucher.id);
      }

      let loyalty = null;
      if (customer_id && total > 0) {
        loyalty = await applyLoyaltyForOrder({ customer_id, total });
      }

      res.json({
        success: true,
        order_id: orderId,
        total,
        subtotal,
        discount,
        tax,
        voucher_applied: !!voucher,
        voucher_id: voucher?.id || null,
        status: finalStatus,
        loyalty,
      });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async history(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const orders = await db.prepare(`
        SELECT o.*, t.name as table_name, c.name as customer_name
        FROM orders o LEFT JOIN tables t ON o.table_id = t.id LEFT JOIN customers c ON o.customer_id = c.id
        WHERE o.status IN ('paid','cancelled')
        ORDER BY o.created_at DESC
        OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
      `).all(offset, parseInt(limit));
      const total = (await db.prepare(`SELECT COUNT(*) as c FROM orders WHERE status IN ('paid','cancelled')`).get()).c;
      res.json({ success: true, orders, total, page: parseInt(page), limit: parseInt(limit) });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async cancel(req, res) {
    try {
      await db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },
};