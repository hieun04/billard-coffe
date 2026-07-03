import db from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default function authRoutes(router, JWT_SECRET) {
  router.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Missing credentials' });
      }
      const user = await db.prepare('SELECT * FROM users WHERE username = ?').get(username);
      if (!user) return res.status(401).json({ success: false, error: 'Invalid username or password' });

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ success: false, error: 'Invalid username or password' });

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
      res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.post('/api/auth/logout', (req, res) => {
    res.json({ success: true });
  });

  router.get('/api/auth/me', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ success: true, user: decoded });
    } catch {
      res.status(401).json({ success: false, error: 'Invalid token' });
    }
  });
}