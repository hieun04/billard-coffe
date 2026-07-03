// Diagnose product IDs and image_url values
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import sql from 'mssql';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '.env') });

async function diagnose() {
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
    const r = await pool.request().query(
      "SELECT id, name, image_url FROM products WHERE image_url IS NOT NULL AND image_url != ''"
    );
    console.log('Products:');
    for (const p of r.recordset) {
      console.log(`  id=${p.id} name="${p.name}" image_url="${p.image_url}"`);
    }

    // Now test the exact UPDATE the route would run for product 9
    // Get current values
    const prod = r.recordset.find(p => p.id === 9);
    if (prod) {
      console.log('\nTesting UPDATE for id=9 with name:', prod.name);
      const newUrl = `http://localhost:3002${prod.image_url}`;
      console.log('New URL:', newUrl);
      await pool.request()
        .input('p1', sql.NVarChar, prod.name)
        .input('p2', sql.Int, prod.category_id)
        .input('p3', sql.Decimal(18,2), prod.price)
        .input('p4', sql.Int, prod.stock)
        .input('p5', sql.NVarChar, prod.unit)
        .input('p6', sql.NVarChar, newUrl)
        .input('p7', sql.Decimal(18,2), prod.cost_price)
        .input('p8', sql.Int, 9)
        .query('UPDATE products SET name=@p1, category_id=@p2, price=@p3, stock=@p4, unit=@p5, image_url=@p6, cost_price=@p7 WHERE id=@p8');
      console.log('UPDATE succeeded');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }

  await pool.close();
}

diagnose().catch(err => { console.error('Fatal:', err); process.exit(1); });
