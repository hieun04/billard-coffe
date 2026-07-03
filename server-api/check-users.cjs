const sql = require('mssql');
const cfg = {
  server: 'localhost', port: 1433, database: 'billard_cafe',
  user: 'sa', password: '170404',
  options: { encrypt: false, trustServerCertificate: true }
};
sql.connect(cfg).then(async () => {
  const rs = await sql.query("SELECT TOP 5 id, username, phone, role FROM users WHERE role='admin'");
  console.log(JSON.stringify(rs.recordset, null, 2));
  sql.close();
}).catch(e => console.log('ERR:', e.message));
