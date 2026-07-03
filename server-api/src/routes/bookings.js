import db from '../db.js';

const BOOKING_STATUSES = new Set(['pending','confirmed','held','active','checked_in','completed','cancelled','no_show']);

export default {
  async get(req, res) {
    try {
      const bookings = await db.prepare(`
        SELECT b.*, COALESCE(t.table_number, t.name, CAST(t.id AS NVARCHAR(MAX))) as table_number
        FROM bookings b
        LEFT JOIN tables t ON b.table_id = t.id
        ORDER BY b.start_time DESC
      `).all();
      const mapped = bookings.map(b => ({
        ...b,
        table_name: b.table_number ? `Ban ${b.table_number}` : null,
      }));
      res.json({ success: true, bookings: mapped });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async create(req, res) {
    try {
      const { customer_name, phone, table_id, start_time, end_time, notes } = req.body;
      const result = await db.prepare(`
        INSERT INTO bookings (customer_name, phone, table_id, start_time, end_time, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, 'pending')
      `).run(customer_name, phone, table_id || null, start_time, end_time || null, notes || null);
      res.json({ success: true, booking_id: result.lastInsertRowid });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async confirm(req, res) {
    try {
      const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
      if (!booking) return res.status(404).json({ success: false, error: 'Not found' });
      if (booking.status !== 'pending') {
        return res.status(400).json({ success: false, error: `Booking is ${booking.status}, cannot confirm` });
      }
      const now = new Date().toISOString();
      await db.prepare(`UPDATE bookings SET status = 'confirmed', confirmed_at = ? WHERE id = ?`).run(now, req.params.id);

      if (booking.table_id && booking.start_time) {
        await db.prepare(`
          UPDATE tables
          SET booking_id = ?, booking_start_time = ?, next_check_in_at = ?,
              booking_status = 'none', booking_customer_name = ?,
              current_customer_name = COALESCE(current_customer_name, ?),
              current_customer_phone = COALESCE(current_customer_phone, ?)
          WHERE id = ?
        `).run(req.params.id, booking.start_time, booking.start_time, booking.customer_name, booking.customer_name, booking.phone, booking.table_id);
      }

      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async hold(req, res) {
    try {
      const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
      if (!booking) return res.status(404).json({ success: false, error: 'Not found' });
      if (booking.status !== 'confirmed') {
        return res.status(400).json({ success: false, error: `Booking đang ở trạng thái "${booking.status}", chỉ confirmed mới chuyển được.` });
      }
      if (!booking.table_id || !booking.start_time) {
        return res.status(400).json({ success: false, error: 'Booking chưa có bàn hoặc giờ đặt.' });
      }

      await db.prepare(`UPDATE bookings SET status = 'held' WHERE id = ?`).run(req.params.id);
      await db.prepare(`
        UPDATE tables
        SET booking_id = ?, booking_start_time = ?, next_check_in_at = ?,
            booking_status = 'held', booking_customer_name = ?,
            current_customer_name = COALESCE(current_customer_name, ?),
            current_customer_phone = COALESCE(current_customer_phone, ?)
        WHERE id = ?
      `).run(req.params.id, booking.start_time, booking.start_time, booking.customer_name, booking.customer_name, booking.phone, booking.table_id);

      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async cancel(req, res) {
    try {
      const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
      if (!booking) return res.status(404).json({ success: false, error: 'Not found' });

      if (booking.table_id) {
        const table = await db.prepare('SELECT booking_id, status, current_session_start FROM tables WHERE id = ?').get(booking.table_id);
        if (table && table.booking_id === booking.id) {
          const hasRealSession = (table.status === 'occupied' || table.status === 'playing') && table.current_session_start;
          if (!hasRealSession) {
            await db.prepare(`
              UPDATE tables
              SET status = 'available', booking_id = NULL, booking_start_time = NULL,
                  booking_customer_name = NULL, booking_status = 'none', next_check_in_at = NULL
              WHERE id = ?
            `).run(booking.table_id);
          } else {
            await db.prepare(`
              UPDATE tables
              SET booking_id = NULL, booking_start_time = NULL, booking_customer_name = NULL,
                  booking_status = 'none', next_check_in_at = NULL
              WHERE id = ?
            `).run(booking.table_id);
          }
        }
      }
      await db.prepare(`UPDATE bookings SET status = 'cancelled' WHERE id = ?`).run(req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async start(req, res) {
    try {
      const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
      if (!booking) return res.status(404).json({ success: false, error: 'Not found' });
      if (!booking.table_id) return res.status(400).json({ success: false, error: 'Booking has no table assigned' });

      const table = await db.prepare('SELECT * FROM tables WHERE id = ?').get(booking.table_id);
      if (!table) return res.status(404).json({ success: false, error: 'Table not found' });

      if ((table.status === 'occupied' || table.status === 'playing') && table.current_session_start) {
        return res.status(409).json({ success: false, error: 'Table already has an active session' });
      }

      const now = new Date().toISOString();
      const orderResult = await db.prepare(`
        INSERT INTO orders (table_id, customer_name, subtotal, discount, tier_discount, tax, total,
                            payment_method, status, created_at)
        VALUES (?, ?, 0, 0, 0, 0, 0, 'cash', 'active', ?)
      `).run(booking.table_id, booking.customer_name, now);

      await db.prepare(`UPDATE bookings SET status = 'active', checked_in_at = ? WHERE id = ?`).run(now, req.params.id);
      await db.prepare(`
        UPDATE tables SET status = 'occupied', current_session_start = ?, drinks_total = 0,
                          booking_id = NULL, next_check_in_at = NULL, booking_status = 'checked_in'
        WHERE id = ?
      `).run(now, booking.table_id);

      res.json({ success: true, order_id: orderResult.lastInsertRowid });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async checkIn(req, res) {
    try {
      const table = await db.prepare('SELECT * FROM tables WHERE id = ?').get(req.params.id);
      if (!table) return res.status(404).json({ success: false, error: 'Table not found' });

      if (table.booking_status !== 'held') {
        return res.status(400).json({ success: false, error: `Table is not held (status: ${table.booking_status}). Use "Bắt đầu" for empty tables.` });
      }

      const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(table.booking_id);
      if (!booking) return res.status(404).json({ success: false, error: 'Linked booking not found' });

      const now = new Date().toISOString();
      const orderResult = await db.prepare(`
        INSERT INTO orders (table_id, customer_name, subtotal, discount, tier_discount, tax, total,
                            payment_method, status, created_at)
        VALUES (?, ?, 0, 0, 0, 0, 0, 'cash', 'active', ?)
      `).run(table.id, booking.customer_name, now);

      await db.prepare(`UPDATE bookings SET status = 'checked_in', checked_in_at = ? WHERE id = ?`).run(now, table.booking_id);
      await db.prepare(`
        UPDATE tables SET status = 'occupied', current_session_start = ?, drinks_total = 0,
                          booking_id = NULL, next_check_in_at = NULL, booking_status = 'checked_in'
        WHERE id = ?
      `).run(now, table.id);

      res.json({ success: true, order_id: orderResult.lastInsertRowid, booking_id: table.booking_id });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async update(req, res) {
    try {
      const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
      if (!booking) return res.status(404).json({ success: false, error: 'Not found' });

      const { customer_name, phone, table_id, start_time, end_time, notes } = req.body || {};
      const newTableId = table_id !== undefined ? (table_id || null) : booking.table_id;
      const newStart = start_time !== undefined ? (start_time || null) : booking.start_time;
      const tableChanged = newTableId !== booking.table_id;
      const startChanged = newStart !== booking.start_time;

      await db.prepare(`
        UPDATE bookings
        SET customer_name = COALESCE(?, customer_name),
            phone = COALESCE(?, phone),
            table_id = ?,
            start_time = COALESCE(?, start_time),
            end_time = ?,
            notes = COALESCE(?, notes)
        WHERE id = ?
      `).run(
        customer_name ?? null,
        phone ?? null,
        newTableId,
        newStart,
        end_time !== undefined ? (end_time || null) : booking.end_time,
        notes ?? null,
        req.params.id
      );

      if (booking.table_id && booking.status === 'held') {
        if (tableChanged && booking.table_id) {
          const oldTable = await db.prepare('SELECT booking_id FROM tables WHERE id = ?').get(booking.table_id);
          if (oldTable && oldTable.booking_id === booking.id) {
            await db.prepare(`
              UPDATE tables SET booking_id = NULL, booking_start_time = NULL, next_check_in_at = NULL, booking_status = 'none'
              WHERE id = ?
            `).run(booking.table_id);
          }
          if (newTableId) {
            await db.prepare(`
              UPDATE tables
              SET booking_id = ?, booking_start_time = ?, next_check_in_at = ?, booking_status = 'held',
                  current_customer_name = ?, current_customer_phone = ?
              WHERE id = ?
            `).run(req.params.id, newStart || booking.start_time, newStart || booking.start_time,
                   customer_name ?? booking.customer_name, phone ?? booking.phone, newTableId);
          }
        } else if (newTableId && startChanged) {
          await db.prepare(`UPDATE tables SET booking_start_time = ?, next_check_in_at = ? WHERE id = ?`)
            .run(newStart, newStart, newTableId);
        }
        if (newTableId && (customer_name || phone)) {
          await db.prepare(`
            UPDATE tables
            SET current_customer_name = COALESCE(current_customer_name, ?),
                current_customer_phone = COALESCE(current_customer_phone, ?)
            WHERE id = ? AND booking_id = ?
          `).run(customer_name ?? null, phone ?? null, newTableId, req.params.id);
        }
      }

      const updated = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
      res.json({ success: true, booking: updated });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async remove(req, res) {
    try {
      const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
      if (!booking) return res.status(404).json({ success: false, error: 'Not found' });

      if (booking.table_id) {
        const table = await db.prepare('SELECT booking_id, status, current_session_start FROM tables WHERE id = ?').get(booking.table_id);
        if (table && table.booking_id === booking.id) {
          const hasRealSession = (table.status === 'occupied' || table.status === 'playing') && table.current_session_start;
          if (hasRealSession) {
            await db.prepare(`
              UPDATE tables
              SET booking_id = NULL, booking_start_time = NULL, booking_customer_name = NULL,
                  booking_status = 'none', next_check_in_at = NULL
              WHERE id = ?
            `).run(booking.table_id);
          } else {
            await db.prepare(`
              UPDATE tables
              SET status = 'available', booking_id = NULL, booking_start_time = NULL,
                  booking_customer_name = NULL, booking_status = 'none', next_check_in_at = NULL
              WHERE id = ?
            `).run(booking.table_id);
          }
        }
      }
      await db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getSchedule(req, res) {
    try {
      const days = parseInt(req.query.days) || 7;
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + days);

      const bookings = await db.prepare(`
        SELECT b.id, b.table_id, b.customer_name, b.phone,
               b.start_time, b.end_time, b.status, b.notes, b.confirmed_at,
               COALESCE(t.table_number, t.name, CAST(b.table_id AS NVARCHAR(MAX))) as table_number,
               tb.booking_status
        FROM bookings b
        LEFT JOIN tables t ON b.table_id = t.id
        LEFT JOIN tables tb ON tb.booking_id = b.id
        WHERE b.start_time < ?
          AND b.status IN ('pending','confirmed','active','checked_in','completed','no_show')
        ORDER BY b.start_time ASC
      `).all(end.toISOString());

      res.json({ success: true, bookings });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getUpcomingByTable(req, res) {
    try {
      const hours = parseInt(req.query.hours) || 6;
      const now = new Date();
      const end = new Date(now);
      end.setHours(end.getHours() + hours);

      const upcoming = await db.prepare(`
        SELECT b.id, b.table_id, b.customer_name, b.phone,
               b.start_time, b.end_time, b.status,
               COALESCE(t.table_number, t.name, CAST(b.table_id AS NVARCHAR(MAX))) as table_number
        FROM bookings b
        INNER JOIN (
          SELECT table_id, MIN(start_time) AS next_start
          FROM bookings
          WHERE status IN ('pending','confirmed','active','checked_in')
            AND start_time >= ?
            AND start_time <= ?
          GROUP BY table_id
        ) nx ON nx.table_id = b.table_id AND nx.next_start = b.start_time
        LEFT JOIN tables t ON b.table_id = t.id
        WHERE b.status IN ('pending','confirmed','active','checked_in')
      `).all(now.toISOString(), end.toISOString());

      const held = await db.prepare(`
        SELECT t.id as table_id, t.booking_status, t.booking_start_time,
               t.next_check_in_at, b.id as booking_id, b.customer_name, b.phone,
               COALESCE(t.table_number, t.name, CAST(t.id AS NVARCHAR(MAX))) as table_number,
               b.start_time, b.end_time, b.status as booking_status2
        FROM tables t
        INNER JOIN bookings b ON b.id = t.booking_id
        WHERE t.booking_status = 'held'
      `).all();

      const map = {};
      for (const b of upcoming) {
        map[b.table_id] = { id: b.id, start_time: b.start_time, customer_name: b.customer_name, phone: b.phone, status: b.status, is_held: false };
      }
      for (const h of held) {
        if (!map[h.table_id]) {
          map[h.table_id] = { id: h.booking_id, start_time: h.start_time, customer_name: h.customer_name, phone: h.phone, status: 'held', is_held: true, next_check_in_at: h.next_check_in_at };
        }
      }

      res.json({ success: true, bookings: Object.values(map) });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },
};