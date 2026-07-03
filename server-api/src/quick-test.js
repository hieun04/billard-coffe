/**
 * quick-test.js — Test nhanh SQL Server connection
 * Chạy: node --env-file=.env src/quick-test.js
 */
import 'dotenv/config';
import { getPool } from './db.js';

async function test() {
  console.log('Connecting to SQL Server...');
  const pool = await getPool();
  console.log('Connected! Running queries...');

  const req = pool.request();

  // Test 1: Check users
  const users = await req.query("SELECT TOP 5 id, username, role FROM users");
  console.log('\n[1] Users:', users.recordset);

  // Test 2: Check categories
  const cats = await req.query("SELECT * FROM categories");
  console.log('[2] Categories:', cats.recordset);

  // Test 3: Check tables
  const tables = await req.query("SELECT TOP 5 id, table_number, status FROM tables");
  console.log('[3] Tables:', tables.recordset);

  // Test 4: Check settings
  const settings = await req.query("SELECT TOP 5 [key], [value] FROM settings");
  console.log('[4] Settings:', settings.recordset);

  // Test 5: Check products
  const prods = await req.query("SELECT TOP 5 id, name, price FROM products");
  console.log('[5] Products:', prods.recordset);

  // Test 6: Insert + read back a test notification
  const insertResult = await req.query(`
    INSERT INTO notifications (type, message, is_read) OUTPUT INSERTED.id VALUES ('info', N'Test notification - SQL Server OK', 0)
  `);
  console.log('[6] Insert notification, new ID:', insertResult.recordset);

  const notifs = await pool.request().query("SELECT TOP 5 id, type, message FROM notifications ORDER BY id DESC");
  console.log('[7] Notifications:', notifs.recordset);

  console.log('\n All tests passed!');
  await pool.close();
}

test().catch(e => {
  console.error('Test failed:', e.message);
  process.exit(1);
});
