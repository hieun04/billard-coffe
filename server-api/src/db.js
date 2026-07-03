import sql from 'mssql';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import fs from 'fs';
import 'dotenv/config';

const dbConfig = {
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

let mssqlPool = null;
let sqliteDb = null;
let useSqlite = false;

async function getMssqlPool() {
  if (!mssqlPool) {
    mssqlPool = await sql.connect(dbConfig);
  }
  return mssqlPool;
}

function getSqlite() {
  if (!sqliteDb) {
    const dir = 'data';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    sqliteDb = new Database('data/app.db');
    sqliteDb.pragma('journal_mode = WAL');
    sqliteDb.pragma('foreign_keys = ON');
  }
  return sqliteDb;
}

function mssqlify(sqlText) {
  let i = 0;
  return sqlText.replace(/\?/g, () => `@p${++i}`);
}

function sqliteify(sqlText) {
  return sqlText.replace(/@p\d+/g, '?');
}

function toSqliteValue(v) {
  if (v === undefined) return null;
  if (Buffer.isBuffer(v)) return Buffer.from(v);
  if (v instanceof Date) return v.toISOString();
  return v;
}

function mapSqliteParams(args) {
  return args.map(toSqliteValue);
}

class PreparedStatement {
  constructor(sqlText) {
    this.sqlText = sqlText;
    this.mssqlSql = mssqlify(sqlText);
    this.sqliteSql = sqliteify(sqlText);
    this._isInsert = /^\s*INSERT\s+/i.test(sqlText);
    this._targetTable = this._isInsert ? (/\bINTO\s+(\w+)/i.exec(sqlText)?.[1] || null) : null;
    this._specialColumns = ['customer_name', 'table_name', 'category', 'product_name', 'supplier', 'staff_name', 'voucher_code', 'voucher_name'];
  }

  async _requestMssql(extraParams = []) {
    const pool = await getMssqlPool();
    const req = pool.request();
    extraParams.forEach((v, idx) => req.input(`p${idx + 1}`, v));
    return req;
  }

  async _mssqlQuery(text, args) {
    const req = await this._requestMssql(args);
    return req.query(text);
  }

  async run(...args) {
    if (useSqlite) {
      const stmt = getSqlite().prepare(this.sqliteSql);
      const result = stmt.run(...mapSqliteParams(args));
      return { lastInsertRowid: result.lastInsertRowid, rowsAffected: result.changes };
    }

    const req = await this._requestMssql(args);
    let text = this.mssqlSql;
    if (this._isInsert && !/OUTPUT\s+INSERTED/i.test(this.mssqlSql)) {
      text = this.mssqlSql.replace(/;?\s*$/, '') + `; SELECT SCOPE_IDENTITY() AS id;`;
      const result = await req.query(text);
      const id = result.recordsets[1]?.[0]?.id ?? null;
      const rows = result.rowsAffected.reduce((a, b) => a + b, 0);
      return { lastInsertRowid: id, rowsAffected: rows };
    } else {
      const result = await req.query(text);
      const rows = result.rowsAffected.reduce((a, b) => a + b, 0);
      return { lastInsertRowid: null, rowsAffected: rows };
    }
  }

  _flattenRecordset(rows) {
    return rows.map(row => {
      const flat = {};
      for (const key of Object.keys(row)) {
        const val = row[key];
        if (this._specialColumns.includes(key) && Array.isArray(val)) {
          flat[key] = val?.[1] ?? null;
        } else {
          flat[key] = val;
        }
      }
      return flat;
    });
  }

  async get(...args) {
    if (useSqlite) {
      const stmt = getSqlite().prepare(this.sqliteSql);
      const row = stmt.get(...mapSqliteParams(args));
      return row || null;
    }
    const req = await this._requestMssql(args);
    const result = await req.query(this.mssqlSql);
    const rows = this._flattenRecordset(result.recordset);
    return rows[0] || null;
  }

  async all(...args) {
    if (useSqlite) {
      const stmt = getSqlite().prepare(this.sqliteSql);
      return stmt.all(...mapSqliteParams(args));
    }
    const req = await this._requestMssql(args);
    const result = await req.query(this.mssqlSql);
    return this._flattenRecordset(result.recordset);
  }
}

async function initMigrations() {
  if (useSqlite) return;
  const pool = await getMssqlPool();

  try {
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('suppliers') AND name = 'category')
        ALTER TABLE suppliers ADD category NVARCHAR(200) NULL
    `);
  } catch (_) { /* column may already exist */ }
}

async function initSeed() {
  if (useSqlite) return;
  const pool = await getMssqlPool();

  const existing = await pool.request().query("SELECT username FROM users WHERE username IN ('admin','staff')");
  const have = new Set(existing.recordset.map(r => r.username));
  if (!have.has('admin')) {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.request()
      .input('u', 'admin').input('h', hash).input('r', 'admin')
      .query("INSERT INTO users (username, password_hash, role) VALUES (@u, @h, @r)");
  }
  if (!have.has('staff')) {
    const hash = await bcrypt.hash('staff123', 10);
    await pool.request()
      .input('u', 'staff').input('h', hash).input('r', 'staff')
      .query("INSERT INTO users (username, password_hash, role) VALUES (@u, @h, @r)");
  }

  const settings = [
    ['name', 'Billiard Cafe'],
    ['address', 'TP. Hồ Chí Minh'],
    ['phone', '0901 234 567'],
    ['email', 'contact@billard-cafe.vn'],
    ['default_rate', '50000'],
    ['open_time', '08:00'],
    ['close_time', '23:00'],
    ['points_rate', '1'],
  ];
  for (const [k, v] of settings) {
    await pool.request()
      .input('k', k).input('v', v)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM settings WHERE [key] = @k)
          INSERT INTO settings ([key], [value]) VALUES (@k, @v)
      `);
  }
}

async function ensureSqliteFallback() {
  if (useSqlite) return;
  try {
    await getMssqlPool();
    await initMigrations();
    await initSeed();
    console.log('[db] SQL Server connection ready');
  } catch (err) {
    console.warn('[db] SQL Server unavailable, falling back to SQLite:', err.message);
    useSqlite = true;
    const db = getSqlite();
    db.exec(`
      PRAGMA journal_mode=WAL;
      PRAGMA foreign_keys=ON;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        category_id INTEGER,
        image_url TEXT,
        is_deleted INTEGER NOT NULL DEFAULT 0,
        created_at TEXT,
        updated_at TEXT
      );
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
      CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        category TEXT
      );
      CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        supplier_id INTEGER,
        total REAL NOT NULL DEFAULT 0,
        notes TEXT DEFAULT '',
        created_at TEXT NOT NULL,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
      );
      CREATE TABLE IF NOT EXISTS purchase_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        purchase_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity REAL NOT NULL,
        unit_cost REAL NOT NULL,
        line_total REAL NOT NULL,
        FOREIGN KEY (purchase_id) REFERENCES purchases(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
      CREATE TABLE IF NOT EXISTS tables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'available',
        customer_id INTEGER,
        start_time TEXT,
        end_time TEXT,
        session_fee REAL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        table_id INTEGER NOT NULL,
        customer_id INTEGER,
        items TEXT NOT NULL DEFAULT '[]',
        total REAL NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL,
        FOREIGN KEY (table_id) REFERENCES tables(id)
      );
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT UNIQUE,
        points INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        table_id INTEGER NOT NULL,
        customer_name TEXT NOT NULL,
        phone TEXT,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (table_id) REFERENCES tables(id)
      );
      CREATE TABLE IF NOT EXISTS staff_shifts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        clock_in TEXT,
        clock_out TEXT
      );
      CREATE TABLE IF NOT EXISTS vouchers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        discount_type TEXT NOT NULL,
        discount_value REAL NOT NULL,
        min_order REAL NOT NULL DEFAULT 0,
        valid_from TEXT,
        valid_to TEXT,
        is_active INTEGER NOT NULL DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'info',
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS settings (
        [key] TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    const hasAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
    if (!hasAdmin) {
      const hash = await bcrypt.hash('admin123', 10);
      db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('admin', hash, 'admin');
    }
    const hasStaff = db.prepare('SELECT id FROM users WHERE username = ?').get('staff');
    if (!hasStaff) {
      const hash = await bcrypt.hash('staff123', 10);
      db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('staff', hash, 'staff');
    }

    const seedSettings = [
      ['name', 'Billiard Cafe'],
      ['address', 'TP. Hồ Chí Minh'],
      ['phone', '0901 234 567'],
      ['email', 'contact@billard-cafe.vn'],
      ['default_rate', '50000'],
      ['open_time', '08:00'],
      ['close_time', '23:00'],
      ['points_rate', '1'],
    ];
    const insertSetting = db.prepare('INSERT OR IGNORE INTO settings ([key], value) VALUES (?, ?)');
    for (const [k, v] of seedSettings) insertSetting.run(k, v);

    console.log('[db] SQLite fallback ready');
  }
}

const db = {
  prepare(sqlText) {
    return new PreparedStatement(sqlText);
  },
  async exec(sqlText) {
    if (useSqlite) {
      getSqlite().exec(sqlText);
      return;
    }
    const pool = await getMssqlPool();
    await pool.request().query(mssqlify(sqlText));
  },
  transaction(fn) {
    return async function (...args) {
      return await fn(...args);
    };
  },
  get pool() { return mssqlPool; },
  async request() {
    if (useSqlite) {
      throw new Error('request() is not supported in SQLite fallback');
    }
    return (await getMssqlPool()).request();
  },
  sql,
};

export default db;
export { PreparedStatement };

(async () => {
  try {
    await ensureSqliteFallback();
  } catch (err) {
    console.error('[db] Failed to initialize database:', err.message);
    console.error('[db] Run database.sql first and check DB_* env vars.');
  }
})();
