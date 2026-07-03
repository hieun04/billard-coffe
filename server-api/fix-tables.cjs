const sql = require('mssql');
const cfg = {
  user: 'sa',
  password: '170404',
  server: 'localhost',
  database: 'billard_cafe',
  port: 1433,
  options: { trustServerCertificate: true }
};

(async () => {
  try {
    await sql.connect(cfg);
    console.log('Connected to SQL Server');

    // Check FK constraints first
    const fks = await sql.query(`
      SELECT fk.name, tp.name as parent_table
      FROM sys.foreign_keys fk
      JOIN sys.tables tp ON fk.parent_object_id = tp.object_id
      WHERE fk.referenced_object_id = OBJECT_ID('tables')
    `);
    console.log('FK constraints referencing tables:', fks.recordset);

    // Delete related data for tables > 3
    const del1 = await sql.query("DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE table_id > 3)");
    console.log('Deleted order_items:', del1.rowsAffected);

    const del2 = await sql.query("DELETE FROM orders WHERE table_id > 3");
    console.log('Deleted orders:', del2.rowsAffected);

    const del3 = await sql.query("DELETE FROM bookings WHERE table_id > 3");
    console.log('Deleted bookings:', del3.rowsAffected);

    // Delete tables 4-10
    const delTables = await sql.query("DELETE FROM tables WHERE id > 3");
    console.log('Deleted tables:', delTables.rowsAffected);

    // Update name for remaining tables (use explicit values to avoid encoding issues)
    await sql.query("UPDATE tables SET name = N'Bàn 1' WHERE id = 1");
    await sql.query("UPDATE tables SET name = N'Bàn 2' WHERE id = 2");
    await sql.query("UPDATE tables SET name = N'Bàn 3' WHERE id = 3");

    // Verify
    const r = await sql.query('SELECT id, name, table_number FROM tables ORDER BY id');
    console.log('\nFinal tables:');
    console.log(JSON.stringify(r.recordset, null, 2));
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    sql.close();
  }
})();
