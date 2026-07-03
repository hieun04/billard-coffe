/**
 * setup-db.js — Tạo database billard_cafe và chạy schema từ database.sql
 * Chạy: node setup-db.js
 */
import sql from 'mssql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const masterConfig = {
  user:     process.env.DB_USER     || 'sa',
  password: process.env.DB_PASSWORD || '',
  server:   process.env.DB_SERVER   || 'localhost',
  database: 'master',
  port:     parseInt(process.env.DB_PORT || '1433', 10),
  options: {
    encrypt:               process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true,
  },
};

const dbConfig = {
  ...masterConfig,
  database: 'billard_cafe',
};

async function run() {
  let pool;
  try {
    console.log('[setup] Connecting to SQL Server...');
    pool = await sql.connect(masterConfig);
    console.log('[setup] Connected. Creating database...');

    // Tạo database nếu chưa có
    try {
      await pool.request().query(`
        IF DB_ID(N'billard_cafe') IS NULL
          CREATE DATABASE billard_cafe;
      `);
      console.log('[setup] Database billard_cafe ready.');
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('[setup] Database billard_cafe already exists, skipping creation.');
      } else {
        // SQL Server Express may not support full-text search features
        // Try simpler approach
        console.log('[setup] Checking existing databases...');
        const dbs = await pool.request().query("SELECT name FROM sys.databases WHERE name = 'billard_cafe'");
        if (dbs.recordset.length === 0) {
          await pool.request().query('CREATE DATABASE billard_cafe');
          console.log('[setup] Database billard_cafe created.');
        } else {
          console.log('[setup] Database billard_cafe already exists.');
        }
      }
    }

    await pool.close();
    pool = null;

    // Kết nối vào database vừa tạo
    console.log('[setup] Connecting to billard_cafe...');
    pool = await sql.connect(dbConfig);
    console.log('[setup] Connected to billard_cafe.');

    // Đọc database.sql
    const sqlPath = path.join(__dirname, '..', '..', 'database.sql');
    let raw = fs.readFileSync(sqlPath, 'utf8');

    // Loại bỏ comment và lọc GO statements, tách thành batch commands
    // SQL Server scripts use GO as batch separator (not T-SQL command)
    const statements = [];

    // Xử lý: thay DECLARE/IF NULL → đơn giản hóa (đã có idempotent checks)
    // Loại bỏ GO statements (chỉ là batch separator cho sqlcmd, không phải T-SQL)
    const lines = raw.split('\n');
    let inBlock = false;
    let currentBlock = [];
    for (const line of lines) {
      const trimmed = line.trim().toUpperCase();

      // Skip USE và IF DB_ID
      if (trimmed === 'USE BILLARD_CAFE;' || trimmed === 'GO' || trimmed === '') {
        if (currentBlock.length > 0) {
          const block = currentBlock.join('\n').trim();
          if (block) statements.push(block);
          currentBlock = [];
        }
        continue;
      }
      if (trimmed.startsWith('IF DB_ID')) continue;
      currentBlock.push(line);
    }
    if (currentBlock.length > 0) {
      const block = currentBlock.join('\n').trim();
      if (block) statements.push(block);
    }

    console.log(`[setup] Found ${statements.length} statements to execute...`);

    let success = 0;
    let errors = 0;

    for (const stmt of statements) {
      if (!stmt.trim() || stmt.trim() === '') continue;
      try {
        await pool.request().query(stmt);
        success++;
      } catch (e) {
        // Bỏ qua lỗi "already exists" — script idempotent
        const msg = e.message.toLowerCase();
        if (msg.includes('already exists') || msg.includes('there is already an object') ||
            msg.includes('cannot drop') || msg.includes('duplicate key') ||
            msg.includes('cannot insert duplicate key')) {
          success++; // count as success — idempotent
        } else {
          console.error(`[setup] ERROR: ${e.message.substring(0, 200)}`);
          console.error(`[setup]   SQL: ${stmt.substring(0, 100)}...`);
          errors++;
        }
      }
    }

    console.log(`\n[setup] Done. ${success} statements OK, ${errors} errors.`);
    if (errors > 0) {
      console.log('[setup] Note: Some errors above may be expected (e.g., "already exists").');
    } else {
      console.log('[setup] Schema is ready!');
    }

  } catch (err) {
    console.error('[setup] Fatal error:', err.message);
    process.exit(1);
  } finally {
    if (pool) await pool.close();
  }
}

run();
