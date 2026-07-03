// Show full product details
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import sql from 'mssql';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '.env') });

async function showAll() {
  const pool = await sql.connect({
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '1433', 10),
    options: { encrypt: process.env.DB_ENCRYPT === 'true', trustServerCertificate: process.env.DB_TRUST_CERT !== 'false' },
  });

  const r = await pool.request().query(
    "SELECT id, name, category_id, price, stock, unit, image_url, cost_price FROM products ORDER BY id"
  );

  console.log('All products:');
  for (const p of r.recordset) {
    console.log(JSON.stringify(p));
  }
  await pool.close();
}

showAll().catch(err => { console.error(err); process.exit(1); });
