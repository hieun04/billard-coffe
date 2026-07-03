import db from '../db.js';

export default {
  async getInventory(req, res) {
    try {
      const products = await db.prepare(`
        SELECT p.*, c.name as category
        FROM products p LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_deleted = 0 ORDER BY p.stock ASC
      `).all();
      res.json({ success: true, products });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async adjustStock(req, res) {
    try {
      const { quantity } = req.body;
      await db.prepare('UPDATE products SET stock = ? WHERE id = ?').run(quantity, req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getPurchases(req, res) {
    try {
      const purchases = await db.prepare(`
        SELECT TOP 50 pu.id, pu.total, COALESCE(pu.notes, '') as notes, pu.created_at,
          s.name as supplier
        FROM purchases pu
        LEFT JOIN suppliers s ON pu.supplier_id = s.id
        ORDER BY pu.created_at DESC
      `).all();

      const getItems = db.prepare(`
        SELECT pi.*, p.name as product_name FROM purchase_items pi
        LEFT JOIN products p ON pi.product_id = p.id
        WHERE pi.purchase_id = ?
      `);
      for (const p of purchases) {
        p.items = await getItems.all(p.id);
      }

      res.json({ success: true, purchases });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getPurchaseDetail(req, res) {
    try {
      const id = Number(req.params.id);
      const purchase = await db.prepare(`
        SELECT pu.id, pu.total, COALESCE(pu.notes, '') as notes, pu.created_at,
          s.id as supplier_id, s.name as supplier, s.phone as supplier_phone, s.address as supplier_address
        FROM purchases pu
        LEFT JOIN suppliers s ON pu.supplier_id = s.id
        WHERE pu.id = ?
      `).get(id);

      if (!purchase) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy phiếu nhập' });
      }

      const items = await db.prepare(`
        SELECT pi.*, p.name as product_name FROM purchase_items pi
        LEFT JOIN products p ON pi.product_id = p.id
        WHERE pi.purchase_id = ?
      `).all(id);
      console.log('[DEBUG] getPurchaseDetail #' + id + ' items=' + JSON.stringify(items));

      res.json({ success: true, purchase: { ...purchase, items } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async createPurchase(req, res) {
    try {
      const { supplier, supplier_id, items = [], notes = '' } = req.body;
      let supplierId = null;
      if (supplier_id) {
        supplierId = Number(supplier_id);
      } else if (supplier) {
        const existing = await db.prepare('SELECT id FROM suppliers WHERE name = ?').get(supplier);
        if (existing) {
          supplierId = existing.id;
        } else {
          const result = await db.prepare('INSERT INTO suppliers (name) VALUES (?)').run(supplier);
          supplierId = result.lastInsertRowid;
        }
      }
      const total = items.reduce((s, it) => s + (parseFloat(it.quantity) || 0) * (parseFloat(it.unit_cost || it.unit_price) || 0), 0);
      const now = new Date().toISOString();

      // Insert purchase and get the ID
      let purchaseId;
      const insertResult = await db.prepare(`
        INSERT INTO purchases (supplier_id, total, notes, created_at) OUTPUT INSERTED.id VALUES (?, ?, ?, ?)
      `).get(supplierId, total, notes, now);
      purchaseId = insertResult?.id;
      console.log('[DEBUG] createPurchase: new purchase_id=' + purchaseId);

      // Now insert items with the correct purchase_id
      for (const item of items) {
        const unitCost = parseFloat(item.unit_cost || item.unit_price) || 0;
        const lineTotal = (parseFloat(item.quantity) || 0) * unitCost;
        await db.prepare(`
          INSERT INTO purchase_items (purchase_id, product_id, quantity, unit_cost, line_total)
          VALUES (?, ?, ?, ?, ?)
        `).run(purchaseId, item.product_id, item.quantity, unitCost, lineTotal);
        await db.prepare('UPDATE products SET stock = stock + ? WHERE id = ? AND is_deleted = 0')
          .run(item.quantity, item.product_id);
      }
      res.json({ success: true, purchase_id: purchaseId });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async updatePurchase(req, res) {
    try {
      const purchaseId = Number(req.params.id);
      const { supplier, supplier_id, items = [], notes = '' } = req.body;

      const purchase = await db.prepare('SELECT * FROM purchases WHERE id = ?').get(purchaseId);
      if (!purchase) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy phiếu nhập' });
      }

      let supplierId = null;
      if (supplier_id) {
        supplierId = Number(supplier_id);
      } else if (supplier) {
        const existing = await db.prepare('SELECT id FROM suppliers WHERE name = ?').get(supplier);
        if (existing) {
          supplierId = existing.id;
        } else {
          const result = await db.prepare('INSERT INTO suppliers (name) VALUES (?)').run(supplier);
          supplierId = result.lastInsertRowid;
        }
      }

      const oldItems = await db.prepare('SELECT * FROM purchase_items WHERE purchase_id = ?').all(purchaseId);
      for (const oldItem of oldItems) {
        await db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND is_deleted = 0')
          .run(oldItem.quantity, oldItem.product_id);
      }

      await db.prepare('DELETE FROM purchase_items WHERE purchase_id = ?').run(purchaseId);

      const total = items.reduce((s, it) => s + (parseFloat(it.quantity) || 0) * (parseFloat(it.unit_cost || it.unit_price) || 0), 0);
      const now = new Date().toISOString();
      await db.prepare(`
        UPDATE purchases SET supplier_id = ?, total = ?, notes = ?, created_at = ? WHERE id = ?
      `).run(supplierId, total, notes || '', now, purchaseId);

      for (const item of items) {
        const unitCost = parseFloat(item.unit_cost || item.unit_price) || 0;
        await db.prepare(`
          INSERT INTO purchase_items (purchase_id, product_id, quantity, unit_cost, line_total)
          VALUES (?, ?, ?, ?, ?)
        `).run(purchaseId, item.product_id, item.quantity, unitCost,
               (parseFloat(item.quantity) || 0) * unitCost);
        await db.prepare('UPDATE products SET stock = stock + ? WHERE id = ? AND is_deleted = 0')
          .run(item.quantity, item.product_id);
      }

      res.json({ success: true, purchase_id: purchaseId });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async deletePurchase(req, res) {
    try {
      const purchaseId = Number(req.params.id);

      const purchase = await db.prepare('SELECT * FROM purchases WHERE id = ?').get(purchaseId);
      if (!purchase) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy phiếu nhập' });
      }

      const items = await db.prepare('SELECT * FROM purchase_items WHERE purchase_id = ?').all(purchaseId);
      for (const item of items) {
        await db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND is_deleted = 0')
          .run(item.quantity, item.product_id);
      }

      await db.prepare('DELETE FROM purchase_items WHERE purchase_id = ?').run(purchaseId);
      await db.prepare('DELETE FROM purchases WHERE id = ?').run(purchaseId);

      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async getSuppliers(req, res) {
    try {
      const suppliers = await db.prepare('SELECT * FROM suppliers ORDER BY name').all();
      res.json({ success: true, suppliers });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async createSupplier(req, res) {
    try {
      const { name, phone, address } = req.body;
      const result = await db.prepare('INSERT INTO suppliers (name, phone, address) VALUES (?, ?, ?)').run(name, phone, address);
      res.json({ success: true, supplier_id: result.lastInsertRowid });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async updateSupplier(req, res) {
    try {
      const { name, phone, address } = req.body;
      const supplierId = Number(req.params.id);
      await db.prepare('UPDATE suppliers SET name = ?, phone = ?, address = ? WHERE id = ?').run(name, phone, address, supplierId);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },

  async deleteSupplier(req, res) {
    try {
      const supplierId = Number(req.params.id);
      await db.prepare('DELETE FROM suppliers WHERE id = ?').run(supplierId);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
  },
};
