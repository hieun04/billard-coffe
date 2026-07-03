import db from '../db.js';
import { calculateTier } from '../utils/tier.js';

function normalizeVoucher(voucher) {
  if (!voucher) return null;
  return {
    ...voucher,
    status: voucher.active ? 'active' : 'inactive',
    expiry_date: voucher.expires_at,
    quantity: Math.max(0, (voucher.max_uses || 0) - (voucher.used_count || 0)),
    used_count: voucher.used_count,
    min_order: voucher.min_order || 0,
  };
}

export function validateVoucherForSubtotal(voucher, subtotal) {
  if (!voucher) return { valid: false, error: 'Mã giảm giá không tồn tại' };
  if (!voucher.active) return { valid: false, error: 'Mã giảm giá đã bị khóa' };
  if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
    return { valid: false, error: 'Mã giảm giá đã hết hạn' };
  }
  if ((voucher.used_count || 0) >= (voucher.max_uses || 0)) {
    return { valid: false, error: 'Mã giảm giá đã hết lượt sử dụng' };
  }
  if ((voucher.min_order || 0) > 0 && subtotal < voucher.min_order) {
    return {
      valid: false,
      error: `Đơn hàng chưa đạt điều kiện tối thiểu ${Math.round(voucher.min_order).toLocaleString('vi-VN')}đ`,
    };
  }
  return { valid: true };
}

export function calculateVoucherDiscount(voucher, subtotal) {
  if (!voucher || subtotal <= 0) return 0;
  if (voucher.type === 'percent') {
    return Math.min(subtotal, Math.round(subtotal * (voucher.value || 0) / 100));
  }
  return Math.min(subtotal, Math.round(voucher.value || 0));
}

export default {
  async get(req, res) {
    try {
      const vouchers = await db.prepare('SELECT * FROM vouchers ORDER BY id DESC').all();
      const mapped = vouchers.map(normalizeVoucher);
      res.json({ success: true, vouchers: mapped });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async listEligible(req, res) {
    try {
      const subtotal = Math.max(0, parseFloat(req.query.subtotal) || 0);
      const customerId = req.query.customer_id ? parseInt(req.query.customer_id) : null;
      let tier = null;
      if (customerId) {
        const c = await db.prepare('SELECT tier, total_spent FROM customers WHERE id = ?').get(customerId);
        if (c) tier = c.tier;
      }
      const now = new Date().toISOString();
      let rows = await db.prepare(`
        SELECT * FROM vouchers
        WHERE active = 1
          AND (expires_at IS NULL OR expires_at > ?)
          AND used_count < max_uses
          AND (min_order = 0 OR min_order <= ?)
          AND (tier IS NULL OR tier = '' OR tier = ?)
        ORDER BY value DESC, id DESC
      `).all(now, subtotal, tier || 'Bronze');
      if (tier) {
        rows = rows.sort((a, b) => {
          const aTier = (a.tier || '') === tier ? 1 : 0;
          const bTier = (b.tier || '') === tier ? 1 : 0;
          if (aTier !== bTier) return bTier - aTier;
          return (b.value || 0) - (a.value || 0);
        });
      }
      res.json({
        success: true,
        vouchers: rows.map(v => ({
          ...normalizeVoucher(v),
          discount: calculateVoucherDiscount(v, subtotal),
          applicable_to_tier: !v.tier || v.tier === tier,
        })),
        customer_tier: tier,
      });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async validateOne(req, res) {
    try {
      const { code, subtotal = 0, customer_id = null } = req.body || {};
      if (!code) return res.status(400).json({ success: false, error: 'Thiếu mã giảm giá' });
      const voucher = await db.prepare('SELECT * FROM vouchers WHERE code = ?').get(code);
      const subNum = Math.max(0, parseFloat(subtotal) || 0);
      if (!voucher) return res.json({ success: false, valid: false, error: 'Mã giảm giá không tồn tại' });

      let customerTier = null;
      if (customer_id) {
        const c = await db.prepare('SELECT tier, total_spent FROM customers WHERE id = ?').get(customer_id);
        if (c) customerTier = c.tier;
      }

      if (voucher.tier && customerTier && voucher.tier !== customerTier) {
        return res.json({
          success: true, valid: false,
          error: `Mã này chỉ dành cho khách hạng ${voucher.tier}`,
        });
      }

      const validation = validateVoucherForSubtotal(voucher, subNum);
      if (!validation.valid) return res.json({ success: true, valid: false, error: validation.error });

      const discount = calculateVoucherDiscount(voucher, subNum);
      res.json({
        success: true, valid: true,
        voucher: normalizeVoucher(voucher),
        discount,
        final_total: Math.max(0, subNum - discount),
      });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async create(req, res) {
    try {
      const { code, type, value, expiry_date, min_order = 0, quantity = 100, id, _method } = req.body;

      if (id && _method === 'PUT') {
        await db.prepare(`
          UPDATE vouchers SET code=?, type=?, value=?, expires_at=?, min_order=?, max_uses=?
          WHERE id=?
        `).run(code, type, parseFloat(value), expiry_date || null, parseFloat(min_order) || 0, parseInt(quantity) || 100, id);
        return res.json({ success: true });
      }

      const result = await db.prepare(`
        INSERT INTO vouchers (code, type, value, expires_at, min_order, max_uses, used_count, active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 0, 1, ?)
      `).run(code, type, parseFloat(value), expiry_date || null, parseFloat(min_order) || 0, parseInt(quantity) || 100, new Date().toISOString());
      res.json({ success: true, voucher_id: result.lastInsertRowid });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async toggle(req, res) {
    try {
      await db.prepare('UPDATE vouchers SET active = ~active WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async delete(req, res) {
    try {
      await db.prepare('DELETE FROM vouchers WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },
};