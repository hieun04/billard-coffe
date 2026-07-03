import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import 'dotenv/config';
import db from './db.js';

import authRoutes from './routes/auth.js';
import tablesRoutes from './routes/tables.js';
import ordersRoutes from './routes/orders.js';
import productsRoutes from './routes/products.js';
import customersRoutes from './routes/customers.js';
import bookingsRoutes from './routes/bookings.js';
import staffRoutes from './routes/staff.js';
import inventoryRoutes from './routes/inventory.js';
import reportsRoutes from './routes/reports.js';
import settingsRoutes from './routes/settings.js';
import vouchersRoutes from './routes/vouchers.js';
import notificationsRoutes from './routes/notifications.js';
import { publicChat, getInsights, adminChat } from './routes/ai.js';
import { validate, productSchema, productUpdateSchema, customerSchema, addPointsSchema, orderSchema, startSessionSchema, addDrinkSchema, bookingSchema, purchaseSchema, voucherSchema, adjustStockSchema, changePasswordSchema, chatSchema, tableSchema } from './middleware/validate.js';

const BACKUP_DIR = 'D:/chuyende/billard-coffe/billard-coffe/backups';
const UPLOAD_DIR = 'D:/chuyende/billard-coffe/billard-coffe/uploads';

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  }
});

const ALLOWED_IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_IMAGE_MIME.has(file.mimetype)) {
    return cb(new Error(`Định dạng không hỗ trợ: ${file.mimetype}. Chỉ chấp nhận JPG, PNG, WEBP, GIF.`));
  }
  if (!ALLOWED_IMAGE_EXT.has(ext)) {
    return cb(new Error(`Phần mở rộng không hợp lệ: ${ext}.`));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter,
});

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'billard-cafe-secret-key-2024';

app.use(helmet({ contentSecurityPolicy: false }));
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5174,http://localhost:3000').split(',').map(s => s.trim());
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin only' });
  next();
}

// Auth (unprotected)
authRoutes(app, JWT_SECRET);

// Tables
app.get('/api/tables', auth, (req, res) => tablesRoutes.get(req, res));
app.get('/api/tables/customer-lookup', auth, (req, res) => tablesRoutes.customerLookup(req, res));
app.get('/api/tables/public', async (req, res) => {
  try {
    const tables = await db.prepare(`
      SELECT id, COALESCE(table_number, name, CAST(id AS NVARCHAR(MAX))) as table_number,
             status, rate_per_hour, current_customer_name
      FROM tables
    `).all();
    res.json({ success: true, tables });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});
app.get('/api/tables/:id', auth, (req, res) => tablesRoutes.getById(req, res));
app.post('/api/tables', auth, validate(tableSchema), (req, res) => tablesRoutes.create(req, res));
app.post('/api/tables/:id/start', auth, validate(startSessionSchema), (req, res) => tablesRoutes.start(req, res));
app.post('/api/tables/:id/end', auth, (req, res) => tablesRoutes.end(req, res));
app.delete('/api/tables/:id', auth, (req, res) => tablesRoutes.delete(req, res));
app.post('/api/tables/:id/reserve', auth, (req, res) => tablesRoutes.reserve(req, res));
app.post('/api/tables/:id/cancel-reserve', auth, (req, res) => tablesRoutes.cancelReserve(req, res));
app.post('/api/tables/:id/assign-customer', auth, (req, res) => tablesRoutes.assignCustomer(req, res));
app.post('/api/tables/:id/add-drink', auth, validate(addDrinkSchema), (req, res) => tablesRoutes.addDrink(req, res));
app.post('/api/tables/:id/add-drinks', auth, (req, res) => tablesRoutes.addDrinks(req, res));
app.get('/api/tables/:id/payment-preview', auth, (req, res) => tablesRoutes.getPaymentPreview(req, res));

// Orders
app.get('/api/orders', auth, (req, res) => ordersRoutes.get(req, res));
app.get('/api/orders/history', auth, (req, res) => ordersRoutes.history(req, res));
app.get('/api/orders/:id', auth, (req, res) => ordersRoutes.getById(req, res));
app.post('/api/orders', auth, validate(orderSchema), (req, res) => ordersRoutes.create(req, res));
app.post('/api/orders/:id/cancel', auth, (req, res) => ordersRoutes.cancel(req, res));

// Products
app.get('/api/products/public', async (req, res) => {
  try {
    const catRows = await db.prepare('SELECT id, name FROM categories').all();
    const catMap = {};
    catRows.forEach(r => { catMap[r.id] = r.name; });
    const defaultCats = { 1: 'Bia', 2: 'Nuoc uong', 3: 'Do an', 4: 'Khac' };
    const products = await db.prepare(`
      SELECT id, name, price, image_url, category_id FROM products WHERE is_deleted = 0 ORDER BY name
    `).all();
    const result = products.map(p => ({
      id: p.id, name: p.name, price: p.price,
      image_url: p.image_url,
      category: catMap[p.category_id] || defaultCats[p.category_id] || 'Khac',
    }));
    res.json({ success: true, products: result });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});
app.get('/api/products', auth, (req, res) => productsRoutes.getProducts(req, res));
app.get('/api/products/:id', auth, (req, res) => productsRoutes.getProductById(req, res));
app.post('/api/products', auth, validate(productSchema), (req, res) => productsRoutes.create(req, res));
app.put('/api/products/:id', auth, validate(productUpdateSchema), (req, res) => productsRoutes.update(req, res));
app.delete('/api/products/:id', auth, (req, res) => productsRoutes.delete(req, res));

// Categories
app.get('/api/categories', auth, (req, res) => productsRoutes.getCategories(req, res));

// Customers
app.get('/api/customers', auth, (req, res) => customersRoutes.get(req, res));
app.get('/api/customers/search', auth, (req, res) => customersRoutes.search(req, res));
app.get('/api/customers/:id', auth, (req, res) => customersRoutes.getById(req, res));
app.post('/api/customers', auth, validate(customerSchema), (req, res) => customersRoutes.create(req, res));
app.put('/api/customers/:id', auth, (req, res) => customersRoutes.update(req, res));
app.post('/api/customers/:id/add-points', auth, validate(addPointsSchema), (req, res) => customersRoutes.addPoints(req, res));
app.delete('/api/customers/:id', auth, (req, res) => customersRoutes.delete(req, res));

// Bookings
app.get('/api/bookings', auth, (req, res) => bookingsRoutes.get(req, res));
app.get('/api/bookings/schedule', auth, (req, res) => bookingsRoutes.getSchedule(req, res));
app.get('/api/bookings/upcoming', auth, (req, res) => bookingsRoutes.getUpcomingByTable(req, res));
app.post('/api/bookings', auth, validate(bookingSchema), (req, res) => bookingsRoutes.create(req, res));
app.post('/api/bookings/:id/confirm', auth, (req, res) => bookingsRoutes.confirm(req, res));
app.post('/api/bookings/:id/hold', auth, (req, res) => bookingsRoutes.hold(req, res));
app.put('/api/bookings/:id', auth, (req, res) => bookingsRoutes.update(req, res));
app.delete('/api/bookings/:id', auth, (req, res) => bookingsRoutes.remove(req, res));
app.post('/api/bookings/:id/cancel', auth, (req, res) => bookingsRoutes.cancel(req, res));
app.post('/api/bookings/:id/start', auth, (req, res) => bookingsRoutes.start(req, res));
app.post('/api/bookings/:id/check-in', auth, (req, res) => bookingsRoutes.checkIn(req, res));

// Staff & Shifts
app.get('/api/staff', auth, (req, res) => staffRoutes.getStaff(req, res));
app.get('/api/shifts', auth, (req, res) => staffRoutes.getShifts(req, res));
app.get('/api/shifts/active', auth, (req, res) => staffRoutes.getActiveShifts(req, res));
app.get('/api/shifts/my-active', auth, (req, res) => staffRoutes.getMyActiveShift(req, res));
app.get('/api/shifts/stats', auth, (req, res) => staffRoutes.getShiftStats(req, res));
app.post('/api/shifts/clock-in', auth, (req, res) => staffRoutes.clockIn(req, res));
app.post('/api/shifts/:id/clock-out', auth, (req, res) => staffRoutes.clockOut(req, res));

// Inventory
app.get('/api/inventory', auth, (req, res) => inventoryRoutes.getInventory(req, res));
app.post('/api/inventory/:id/adjust', auth, validate(adjustStockSchema), (req, res) => inventoryRoutes.adjustStock(req, res));
app.get('/api/purchases', auth, (req, res) => inventoryRoutes.getPurchases(req, res));
app.get('/api/purchases/:id', auth, (req, res) => inventoryRoutes.getPurchaseDetail(req, res));
app.post('/api/purchases', auth, validate(purchaseSchema), (req, res) => inventoryRoutes.createPurchase(req, res));
app.put('/api/purchases/:id', auth, validate(purchaseSchema), (req, res) => inventoryRoutes.updatePurchase(req, res));
app.delete('/api/purchases/:id', auth, (req, res) => inventoryRoutes.deletePurchase(req, res));
app.get('/api/suppliers', auth, (req, res) => inventoryRoutes.getSuppliers(req, res));
app.post('/api/suppliers', auth, (req, res) => inventoryRoutes.createSupplier(req, res));
app.put('/api/suppliers/:id', auth, (req, res) => inventoryRoutes.updateSupplier(req, res));
app.delete('/api/suppliers/:id', auth, (req, res) => inventoryRoutes.deleteSupplier(req, res));

// Reports
app.get('/api/reports/kpi', auth, (req, res) => reportsRoutes.getKPI(req, res));
app.get('/api/reports/revenue', auth, (req, res) => reportsRoutes.getRevenue(req, res));
app.get('/api/reports/products', auth, (req, res) => reportsRoutes.getProductReport(req, res));
app.get('/api/reports/export', auth, (req, res) => reportsRoutes.export(req, res));

// Settings
app.get('/api/settings', auth, (req, res) => settingsRoutes.getSettings(req, res));
app.post('/api/settings/business', auth, (req, res) => settingsRoutes.updateBusiness(req, res));
app.post('/api/settings/pricing', auth, (req, res) => settingsRoutes.updatePricing(req, res));
app.post('/api/settings/hours', auth, (req, res) => settingsRoutes.updateHours(req, res));
app.post('/api/settings/loyalty', auth, (req, res) => settingsRoutes.updateLoyalty(req, res));
app.post('/api/settings/media', auth, (req, res) => settingsRoutes.updateMedia(req, res));
app.get('/api/settings/users', auth, adminOnly, (req, res) => settingsRoutes.getUsers(req, res));
app.post('/api/settings/users', auth, adminOnly, (req, res) => settingsRoutes.createUser(req, res));
app.delete('/api/settings/users/:id', auth, adminOnly, (req, res) => settingsRoutes.deleteUser(req, res));
app.post('/api/settings/password', auth, validate(changePasswordSchema), (req, res) => settingsRoutes.changePassword(req, res));
app.post('/api/settings/backup', auth, adminOnly, (req, res) => settingsRoutes.backupData(req, res));

// Vouchers
app.get('/api/vouchers', auth, (req, res) => vouchersRoutes.get(req, res));
app.get('/api/vouchers/eligible', auth, (req, res) => vouchersRoutes.listEligible(req, res));
app.post('/api/vouchers/validate', auth, (req, res) => vouchersRoutes.validateOne(req, res));
app.post('/api/vouchers', auth, validate(voucherSchema), (req, res) => vouchersRoutes.create(req, res));
app.post('/api/vouchers/:id/toggle', auth, (req, res) => vouchersRoutes.toggle(req, res));
app.delete('/api/vouchers/:id', auth, (req, res) => vouchersRoutes.delete(req, res));

// Notifications
app.get('/api/notifications', auth, (req, res) => notificationsRoutes.get(req, res));
app.get('/api/notifications/preview', auth, (req, res) => notificationsRoutes.preview(req, res));
app.post('/api/notifications', auth, (req, res) => notificationsRoutes.create(req, res));
app.post('/api/notifications/:id/read', auth, (req, res) => notificationsRoutes.markRead(req, res));
app.post('/api/notifications/mark-all-read', auth, (req, res) => notificationsRoutes.markAllRead(req, res));
app.delete('/api/notifications/:id', auth, (req, res) => notificationsRoutes.delete(req, res));

// AI Insights (protected)
app.get('/api/ai/insights', auth, (req, res) => getInsights(req, res));
// AI Chat (public — for landing page customers)
app.post('/api/ai/chat', (req, res) => publicChat(req, res));
// AI Admin Chat (TEMPORARY: no auth for testing - enable auth later)
// TODO: Re-enable auth: app.post('/api/admin/ai/chat', auth, (req, res) => adminChat(req, res));
app.post('/api/admin/ai/chat', (req, res) => adminChat(req, res));

// Public endpoints for landing page
app.get('/api/settings/public', async (req, res) => {
  try {
    const rows = await db.prepare('SELECT [key], [value] FROM settings').all();
    const settings = {};
    for (const row of rows) settings[row.key] = row.value;
    res.json({ success: true, settings });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get('/api/search', auth, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) return res.json({ tables: [], products: [], customers: [], orders: [] });

    const like = `%${q}%`;
    const [tables, products, customers, orders] = await Promise.all([
      db.prepare(`
        SELECT TOP 10 id, COALESCE(table_number, name, CAST(id AS NVARCHAR(MAX))) as tableNumber, status
        FROM tables
        WHERE COALESCE(table_number, name, CAST(id AS NVARCHAR(MAX))) LIKE ? OR status LIKE ?
      `).all(like, like),
      db.prepare(`
        SELECT TOP 10 p.id, p.name, p.price, c.name as category
        FROM products p LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.name LIKE ? AND p.is_deleted = 0
      `).all(like),
      db.prepare(`
        SELECT TOP 10 id, name, phone, tier, points FROM customers WHERE name LIKE ? OR phone LIKE ?
      `).all(like, like),
      db.prepare(`
        SELECT TOP 10 id, total, status, created_at FROM orders WHERE CAST(id AS NVARCHAR(MAX)) LIKE ?
        ORDER BY created_at DESC
      `).all(like),
    ]);

    res.json({ tables, products, customers, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Backups
app.get('/api/settings/backups', auth, (req, res) => {
  try {
    if (!fs.existsSync(BACKUP_DIR)) return res.json({ success: true, backups: [] });
    const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).reverse().map(f => {
      const s = fs.statSync(path.join(BACKUP_DIR, f));
      return { name: f, size: s.size, created: s.mtime };
    });
    res.json({ success: true, backups: files });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.use('/backups', express.static(BACKUP_DIR));
app.use('/uploads', express.static(UPLOAD_DIR));

app.post('/api/upload/image', auth, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ success: false, error: 'File quá lớn. Tối đa 5MB.' });
      }
      return res.status(400).json({ success: false, error: err.message || 'Upload thất bại' });
    }
    if (!req.file) return res.status(400).json({ success: false, error: 'Không có file được tải lên' });
    res.json({ success: true, url: `/uploads/${req.file.filename}` });
  });
});

const server = app.listen(PORT, () => {
  console.log(`Billiard Cafe API running on http://localhost:${PORT}`);
});

const shutdown = (signal) => {
  console.log(`[server] ${signal} received, closing...`);
  server.close(async () => {
    const pool = db.pool;
    if (pool) await pool.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 5000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
