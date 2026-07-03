import db from '../db.js';

export default {
  async getStaff(req, res) {
    try {
      const staff = await db.prepare(`
        SELECT id, username, COALESCE(full_name, username) as full_name, phone, cccd, role, created_at
        FROM users ORDER BY created_at
      `).all();
      res.json({ success: true, staff });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getShifts(req, res) {
    try {
      const { user_id, date_from, date_to, limit = 200 } = req.query;
      let query = 'SELECT * FROM staff_shifts WHERE 1=1';
      const params = [];
      if (user_id)   { query += ' AND user_id = ?';   params.push(user_id); }
      if (date_from) { query += ' AND date >= ?';     params.push(date_from); }
      if (date_to)   { query += ' AND date <= ?';     params.push(date_to); }
      query += ' ORDER BY start_time DESC OFFSET 0 ROWS FETCH NEXT ? ROWS ONLY';
      params.push(parseInt(limit));
      const shifts = await db.prepare(query).all(...params);
      res.json({ success: true, shifts });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getActiveShifts(req, res) {
    try {
      const shifts = await db.prepare(`
        SELECT * FROM staff_shifts WHERE end_time IS NULL ORDER BY start_time DESC
      `).all();
      res.json({ success: true, shifts });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async clockIn(req, res) {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const { user_id, staff_name, role, shift_name, notes } = req.body;
      const uid = user_id || req.user?.id;
      const userRecord = uid ? await db.prepare('SELECT username, full_name, role FROM users WHERE id = ?').get(uid) : null;
      const name = staff_name || userRecord?.full_name || req.user?.full_name || req.user?.username || 'Staff';
      const r = role || userRecord?.role || req.user?.role || 'staff';
      const sn = shift_name || 'Ca ngày';

      const existing = await db.prepare(`
        SELECT * FROM staff_shifts WHERE user_id = ? AND date = ? AND end_time IS NULL
      `).get(uid, today);
      if (existing) {
        return res.status(400).json({ success: false, error: 'Ban da bat dau ca lam viec hom nay roi' });
      }

      const result = await db.prepare(`
        INSERT INTO staff_shifts (user_id, staff_name, role, shift_name, date, start_time, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(uid, name, r, sn, today, now.toISOString(), notes || null);

      res.json({ success: true, shift_id: result.lastInsertRowid });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async clockOut(req, res) {
    try {
      const now = new Date().toISOString();
      const { id } = req.params;
      const shift = await db.prepare('SELECT * FROM staff_shifts WHERE id = ?').get(id);
      if (!shift) return res.status(404).json({ success: false, error: 'Khong tim thay ca lam viec' });
      if (shift.end_time) return res.status(400).json({ success: false, error: 'Ca nay da ket thuc roi' });
      await db.prepare(`UPDATE staff_shifts SET end_time = ?, status = ? WHERE id = ?`).run(now, 'completed', id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getMyActiveShift(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const today = new Date().toISOString().split('T')[0];
      const shift = await db.prepare(`
        SELECT * FROM staff_shifts WHERE user_id = ? AND date = ? AND end_time IS NULL
      `).get(userId, today);
      res.json({ success: true, shift });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getShiftStats(req, res) {
    try {
      const { user_id, date_from, date_to } = req.query;
      let where = 'WHERE end_time IS NOT NULL';
      const params = [];
      if (user_id)   { where += ' AND user_id = ?'; params.push(user_id); }
      if (date_from) { where += ' AND date >= ?';   params.push(date_from); }
      if (date_to)   { where += ' AND date <= ?';   params.push(date_to); }

      const stats = await db.prepare(`
        SELECT
          COUNT(*) as total_shifts,
          SUM(CASE WHEN end_time IS NOT NULL THEN
            ROUND(CAST(DATEDIFF(MINUTE, start_time, end_time) AS FLOAT) / 60.0, 1)
          ELSE 0 END) as total_hours,
          MIN(date) as first_shift,
          MAX(date) as last_shift
        FROM staff_shifts ${where}
      `).get(...params);

      res.json({
        success: true,
        stats: {
          total_shifts: stats?.total_shifts || 0,
          total_hours: Math.round((stats?.total_hours || 0) * 10) / 10,
          first_shift: stats?.first_shift || '—',
          last_shift: stats?.last_shift || '—',
        }
      });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },
};