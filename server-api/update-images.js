// Update all product image URLs from relative to absolute via direct SQL
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import sql from 'mssql';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '.env') });

async function updateImageUrls() {
  const dbConfig = {
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server:   process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port:     parseInt(process.env.DB_PORT || '1433', 10),
    options: {
      encrypt:               process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_CERT !== 'false',
    },
  };

  const pool = await sql.connect(dbConfig);

  // Get all products with relative image URLs
  const result = await pool.request().query(
    "SELECT id, name, image_url FROM products WHERE image_url IS NOT NULL AND image_url != '' AND image_url NOT LIKE 'http%' AND image_url LIKE '/uploads/%'"
  );

  console.log(`Found ${result.recordset.length} products with relative image URLs`);

  let updated = 0;
  for (const p of result.recordset) {
    const newUrl = `http://localhost:3002${p.image_url}`;
    await pool.request()
      .input('url', sql.VarChar, newUrl)
      .input('id', sql.Int, p.id)
      .query('UPDATE products SET image_url = @url WHERE id = @id');
    console.log(`Updated ${p.id} (${p.name}): ${p.image_url} -> ${newUrl}`);
    updated++;
  }

  await pool.close();
  console.log(`Done! Updated ${updated} products.`);
}

updateImageUrls().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
