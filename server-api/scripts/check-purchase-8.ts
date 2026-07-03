import sql from 'mssql';
import 'dotenv/config';

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'billard_cafe',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
  },
};

(async () => {
  try {
    const pool = await sql.connect(config);
    const purchase = await pool.request().query('SELECT * FROM purchases WHERE id = 8');
    console.log('PURCHASE', JSON.stringify(purchase.recordset[0], null, 2));

    const items = await pool.request().query('SELECT * FROM purchase_items WHERE purchase_id = 8');
    console.log('ITEMS', JSON.stringify(items.recordset, null, 2));

    await sql.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
