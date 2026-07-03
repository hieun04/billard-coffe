import db from '../db.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const BACKUP_DIR = 'D:/chuyende/billard-coffe/billard-coffe/backups';

// MERGE-based upsert helper for the settings key-value table (replaces INSERT OR REPLACE)
async function upsertSetting(key, value) {
  const p = await db.pool;
  await p.request()
    .input('k', key)
    .input('v', value == null ? null : String(value))
    .query(`
      MERGE settings AS target
      USING (SELECT @k AS [key]) AS source
      ON target.[key] = source.[key]
      WHEN MATCHED THEN UPDATE SET [value] = @v
      WHEN NOT MATCHED THEN INSERT ([key], [value]) VALUES (@k, @v);
    `);
}

async function deleteSetting(key) {
  const p = await db.pool;
  await p.request()
    .input('k', key)
    .query('DELETE FROM settings WHERE [key] = @k');
}

export default {
  async getSettings(req, res) {
    try {
      const rows = await db.prepare('SELECT * FROM settings').all();
      const settings = {};
      for (const row of rows) settings[row.key] = row.value;
      res.json({ success: true, settings });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async updateBusiness(req, res) {
    try {
      const { name, address, phone, email } = req.body;
      if (name)    await upsertSetting('name', name);
      if (address) await upsertSetting('address', address);
      if (phone)   await upsertSetting('phone', phone);
      if (email)   await upsertSetting('email', email);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async updatePricing(req, res) {
    try {
      const { default_rate } = req.body;
      await upsertSetting('default_rate', default_rate);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async updateHours(req, res) {
    try {
      const { open_time, close_time } = req.body;
      if (open_time)  await upsertSetting('open_time', open_time);
      if (close_time) await upsertSetting('close_time', close_time);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async updateLoyalty(req, res) {
    try {
      const { points_rate } = req.body;
      if (points_rate) await upsertSetting('points_rate', points_rate);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async updateMedia(req, res) {
    try {
      const { logo_url, hero_image, billiard_space_image, cafe_space_image, billiard_gallery_images, lat, lng } = req.body;
      const keys = [
        { key: 'logo_url', value: logo_url },
        { key: 'hero_image', value: hero_image },
        { key: 'billiard_space_image', value: billiard_space_image },
        { key: 'cafe_space_image', value: cafe_space_image },
        { key: 'billiard_gallery_images', value: billiard_gallery_images },
        { key: 'lat', value: lat != null ? String(lat) : null },
        { key: 'lng', value: lng != null ? String(lng) : null },
      ];
      for (const k of keys) {
        if (k.value == null) await deleteSetting(k.key);
        else await upsertSetting(k.key, k.value);
      }
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getUsers(req, res) {
    try {
      if (req.user?.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin only' });
      const users = await db.prepare(`
        SELECT id, username, COALESCE(full_name, username) as full_name, phone, cccd, role, created_at
        FROM users ORDER BY created_at DESC
      `).all();
      res.json({ success: true, users });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async createUser(req, res) {
    try {
      if (req.user?.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin only' });
      const { username, password, full_name, phone = '', cccd = '', role = 'staff' } = req.body;
      if (!username || !password || !full_name) return res.status(400).json({ success: false, error: 'Username, password and full name are required' });
      if (password.length < 6) return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
      const existing = await db.prepare('SELECT id FROM users WHERE username = ?').get(username);
      if (existing) return res.status(409).json({ success: false, error: 'Username already exists' });
      const existingPhone = phone ? await db.prepare('SELECT id FROM users WHERE phone = ?').get(phone) : null;
      if (existingPhone) return res.status(409).json({ success: false, error: 'Phone already exists' });
      const existingCccd = cccd ? await db.prepare('SELECT id FROM users WHERE cccd = ?').get(cccd) : null;
      if (existingCccd) return res.status(409).json({ success: false, error: 'CCCD already exists' });
      const hash = await bcrypt.hash(password, 10);
      const result = await db.prepare(`
        INSERT INTO users (username, password_hash, full_name, phone, cccd, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(username, hash, full_name, phone || null, cccd || null, role);
      res.json({ success: true, user_id: result.lastInsertRowid });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async deleteUser(req, res) {
    try {
      if (req.user?.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin only' });
      const userId = parseInt(req.params.id);
      if (userId === req.user.id) return res.status(400).json({ success: false, error: 'Cannot delete your own account' });
      await db.prepare('DELETE FROM users WHERE id = ?').run(userId);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async changePassword(req, res) {
    try {
      const { old_password, new_password, confirm_password } = req.body;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
      if (!old_password || !new_password || !confirm_password) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
      }
      if (new_password.length < 6) {
        return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });
      }
      if (new_password !== confirm_password) {
        return res.status(400).json({ success: false, error: 'New password and confirm password do not match' });
      }
      const user = await db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      const valid = await bcrypt.compare(old_password, user.password_hash);
      if (!valid) return res.status(400).json({ success: false, error: 'Current password is incorrect' });
      const hash = await bcrypt.hash(new_password, 10);
      await db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, userId);
      res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async backupData(req, res) {
    try {
      if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup-${timestamp}.json`;
      const filepath = path.join(BACKUP_DIR, filename);
      const tables = ['settings', 'users', 'tables', 'orders', 'order_items', 'products', 'categories', 'customers', 'bookings', 'staff_shifts', 'purchases', 'purchase_items', 'suppliers', 'vouchers', 'notifications'];
      const data = {};
      for (const table of tables) {
        try { data[table] = await db.prepare(`SELECT * FROM ${table}`).all(); } catch {}
      }
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
      res.json({
        success: true,
        message: `Backup created: ${filename}`,
        filename,
        size: fs.statSync(filepath).size,
        path: `/backups/${filename}`,
      });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },
};