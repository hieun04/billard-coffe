import db from '../db.js';
import { calculateTier } from '../utils/tier.js';

export default {
  async get(req, res) {
    try {
      const customers = await db.prepare('SELECT TOP 100 * FROM customers ORDER BY name').all();
      res.json({ success: true, customers });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async search(req, res) {
    try {
      const q = req.query.q || '';
      const customers = await db.prepare(`
        SELECT TOP 20 * FROM customers WHERE name LIKE ? OR phone LIKE ? ORDER BY name
      `).all(`%${q}%`, `%${q}%`);
      res.json({ success: true, customers });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getById(req, res) {
    try {
      const customer = await db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
      if (!customer) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, customer });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async create(req, res) {
    try {
      const { name, phone } = req.body;
      const result = await db.prepare(`
        INSERT INTO customers (name, phone, points, tier) VALUES (?, ?, 0, ?)
      `).run(name, phone, 'Bronze');
      res.json({ success: true, customer_id: result.lastInsertRowid });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async addPoints(req, res) {
    try {
      const { points } = req.body;
      const customer = await db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
      if (!customer) return res.status(404).json({ success: false, error: 'Not found' });
      const newPoints = (customer.points || 0) + (points || 0);
      const tier = calculateTier(customer.total_spent);
      await db.prepare('UPDATE customers SET points = ?, tier = ? WHERE id = ?').run(newPoints, tier, req.params.id);
      res.json({ success: true, newPoints, tier, currentTier: tier });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async update(req, res) {
    try {
      const { name, phone } = req.body;
      if (!name && !phone) return res.status(400).json({ success: false, error: 'Name or phone required' });
      const customer = await db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
      if (!customer) return res.status(404).json({ success: false, error: 'Not found' });
      await db.prepare(`
        UPDATE customers SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?
      `).run(name || null, phone || null, req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async delete(req, res) {
    try {
      await db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },
};