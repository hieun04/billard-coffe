const sql = require('mssql');
require('dotenv').config();
const cfg = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '170404',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'billard_cafe',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  options: {
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
    encrypt: process.env.DB_ENCRYPT === 'true',
  },
};
(async () => {
  try {
    await sql.connect(cfg);

    const all = await sql.query(`
      SELECT t.id, t.name, t.table_number, t.status, t.booking_status,
             (SELECT COUNT(*) FROM orders o WHERE o.table_id=t.id) AS orders_total
      FROM tables t
      ORDER BY t.id
    `);
    console.log('=== ALL TABLES ===');
    console.table(all.recordset);

    const fkTables = await sql.query(`
      SELECT name FROM sys.foreign_keys
      WHERE parent_object_id = OBJECT_ID('dbo.orders')
         OR referenced_object_id = OBJECT_ID('dbo.tables')
    `);
    console.log('FK involving tables/orders:', fkTables.recordset.map(r => r.name));
  } catch (e) {
    console.error('ERR:', e.message);
  } finally {
    sql.close();
  }
})();
