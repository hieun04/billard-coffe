// Test INSERT with Vietnamese name
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import sql from 'mssql';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '.env') });

async function test() {
  const dbConfig = {
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server:   process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port:     parseInt(process.env.DB_PORT || '1433', 10),
    options: { encrypt: process.env.DB_ENCRYPT === 'true', trustServerCertificate: process.env.DB_TRUST_CERT !== 'false' },
  };

  const pool = await sql.connect(dbConfig);
  try {
    const r = await pool.request()
      .input('name', sql.NVarChar, 'gà rán')
      .input('cat', sql.Int, 1)
      .input('price', sql.Decimal(18,2), 35000)
      .input('stock', sql.Int, 100)
      .input('unit', sql.NVarChar, 'phần')
      .input('img', sql.NVarChar, '')
      .input('cost', sql.Decimal(18,2), 20000)
      .query('INSERT INTO products (name, category_id, price, stock, unit, image_url, cost_price) OUTPUT INSERTED.id VALUES (@name, @cat, @price, @stock, @unit, @img, @cost)');
    console.log('Inserted id:', r.recordset[0].id);

    // Cleanup
    await pool.request().input('id', sql.Int, r.recordset[0].id).query('DELETE FROM products WHERE id = @id');
    console.log('Cleaned up.');
  } catch (err) {
    console.error('Test failed:', err.message);
  }

  await pool.close();
}

test().catch(err => { console.error('Error:', err); process.exit(1); });
