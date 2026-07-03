import db from '../db.js';

export default {
  async get(req, res) {
    try {
      const notifications = await db.prepare(`
        SELECT TOP 50 id, type, message, is_read, created_at FROM notifications ORDER BY created_at DESC
      `).all();
      const mapped = notifications.map(n => ({ ...n, is_read: !!n.is_read, read: !!n.is_read }));
      res.json({ success: true, notifications: mapped });
    } catch (err) {
      try {
        const notifications = await db.prepare('SELECT TOP 50 * FROM notifications ORDER BY created_at DESC').all();
        const mapped = notifications.map(n => ({ ...n, is_read: !!n.read, read: !!n.read }));
        res.json({ success: true, notifications: mapped });
      } catch (err2) { res.status(500).json({ success: false, error: err2.message }); }
    }
  },

  async preview(req, res) {
    try {
      const notifications = await db.prepare(`
        SELECT TOP 5 id, type, message, is_read, created_at FROM notifications WHERE is_read = 0 ORDER BY created_at DESC
      `).all();
      const mapped = notifications.map(n => ({ ...n, is_read: !!n.is_read, read: !!n.is_read }));
      res.json({ success: true, notifications: mapped });
    } catch {
      try {
        const notifications = await db.prepare(`
          SELECT TOP 5 * FROM notifications WHERE is_read = 0 ORDER BY created_at DESC
        `).all();
        const mapped = notifications.map(n => ({ ...n, is_read: !!n.read, read: !!n.read }));
        res.json({ success: true, notifications: mapped });
      } catch (err2) { res.status(500).json({ success: false, error: err2.message }); }
    }
  },

  async create(req, res) {
    try {
      const { message, type = 'info' } = req.body;
      const now = new Date().toISOString();
      const result = await db.prepare(`
        INSERT INTO notifications (message, type, is_read, created_at) VALUES (?, ?, 0, ?)
      `).run(message, type, now);
      res.json({ success: true, notification_id: result.lastInsertRowid });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async markRead(req, res) {
    try {
      await db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch {
      try {
        await db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(req.params.id);
        res.json({ success: true });
      } catch (err2) { res.status(500).json({ success: false, error: err2.message }); }
    }
  },

  async markAllRead(req, res) {
    try {
      await db.prepare('UPDATE notifications SET is_read = 1').run();
      res.json({ success: true });
    } catch {
      try {
        await db.prepare('UPDATE notifications SET is_read = 1').run();
        res.json({ success: true });
      } catch (err2) { res.status(500).json({ success: false, error: err2.message }); }
    }
  },

  async delete(req, res) {
    try {
      await db.prepare('DELETE FROM notifications WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },
};