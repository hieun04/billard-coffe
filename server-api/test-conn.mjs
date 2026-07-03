import sql from 'mssql';

const pool = await sql.connect({
  user: 'sa',
  password: '170404',
  server: 'localhost',
  database: 'master',
  port: 1433,
  options: { encrypt: false, trustServerCertificate: true }
});

const r = await pool.request().query('SELECT name FROM sys.databases');
console.log('Databases:', r.recordset.map(x => x.name).join(', '));
const target = r.recordset.find(x => x.name === 'billard_cafe');
console.log('billard_cafe exists?', !!target);

if (target) {
  await pool.close();
  const p2 = await sql.connect({
    user: 'sa', password: '170404', server: 'localhost',
    database: 'billard_cafe', port: 1433,
    options: { encrypt: false, trustServerCertificate: true }
  });
  const tables = await p2.request().query("SELECT name FROM sys.tables ORDER BY name");
  console.log('Tables:', tables.recordset.map(x => x.name).join(', '));
  const counts = await p2.request().query("SELECT 'tables' AS t, COUNT(*) AS n FROM tables UNION ALL SELECT 'products', COUNT(*) FROM products UNION ALL SELECT 'orders', COUNT(*) FROM orders");
  console.log('Row counts:');
  for (const row of counts.recordset) console.log('  ' + row.t + ': ' + row.n);
  await p2.close();
}

process.exit(0);