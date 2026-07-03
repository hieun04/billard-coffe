import db from '../db.js';

const PRODUCT_COLS = 'p.id, p.name, p.category_id, p.price, p.stock, p.unit, p.image_url, p.cost_price, p.created_at';
const WITH_CAT = `SELECT ${PRODUCT_COLS}, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id`;

export default {
  async getProducts(req, res) {
    try {
      const products = await db.prepare(`${WITH_CAT} WHERE p.is_deleted = 0 ORDER BY p.name`).all();
      res.json({ success: true, products });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getProductById(req, res) {
    try {
      const product = await db.prepare(`${WITH_CAT} WHERE p.id = ? AND p.is_deleted = 0`).get(req.params.id);
      if (!product) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, product });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async create(req, res) {
    try {
      const { name, category_id, price, stock = 0, unit = 'phan', image_url = '', cost_price = 0 } = req.body;
      const safeImageUrl = image_url ?? '';
      const result = await db.prepare(`
        INSERT INTO products (name, category_id, price, stock, unit, image_url, cost_price)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(name, category_id, price, stock, unit, safeImageUrl, cost_price);
      res.json({ success: true, product_id: result.lastInsertRowid });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async update(req, res) {
    try {
      const { name, category_id, price, stock, unit, image_url, cost_price } = req.body;
      const existing = await db.prepare('SELECT id FROM products WHERE id = ? AND is_deleted = 0').get(req.params.id);
      if (!existing) return res.status(404).json({ success: false, error: 'Not found' });

      const fields = [];
      const values = [];
      const pairs = [[name, 'name'], [category_id, 'category_id'], [price, 'price'], [stock, 'stock'], [unit, 'unit'], [image_url, 'image_url'], [cost_price, 'cost_price']];
      for (const [v, col] of pairs) {
        if (v !== undefined && v !== null) { fields.push(`${col}=?`); values.push(v); }
      }
      if (!fields.length) return res.status(400).json({ success: false, error: 'No fields to update' });
      values.push(req.params.id);

      await db.prepare(`UPDATE products SET ${fields.join(',')} WHERE id=?`).run(...values);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async delete(req, res) {
    try {
      const existing = await db.prepare('SELECT id FROM products WHERE id = ? AND is_deleted = 0').get(req.params.id);
      if (!existing) return res.status(404).json({ success: false, error: 'Sản phẩm không tồn tại hoặc đã bị xóa' });

      const inOrders    = (await db.prepare('SELECT COUNT(*) as c FROM order_items WHERE product_id = ?').get(req.params.id)).c;
      const inPurchases = (await db.prepare('SELECT COUNT(*) as c FROM purchase_items WHERE product_id = ?').get(req.params.id)).c;

      await db.prepare('UPDATE products SET is_deleted = 1 WHERE id = ?').run(req.params.id);
      res.json({
        success: true,
        message: inOrders > 0 || inPurchases > 0
          ? `Đã ẩn sản phẩm. Sản phẩm vẫn còn trong ${inOrders > 0 ? 'đơn hàng cũ' : ''}${inOrders > 0 && inPurchases > 0 ? ' và ' : ''}${inPurchases > 0 ? 'phiếu nhập hàng' : ''}.`
          : 'Đã xóa sản phẩm thành công'
      });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getCategories(req, res) {
    try {
      const categories = await db.prepare('SELECT * FROM categories ORDER BY name').all();
      res.json({ success: true, categories });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },
};