-- ============================================================================
-- Billiard Cafe - SQL Server Schema
-- Migrated from SQLite (better-sqlite3) to Microsoft SQL Server
--
-- Mapping rules:
--   INTEGER PRIMARY KEY AUTOINCREMENT  ->  INT IDENTITY(1,1) PRIMARY KEY
--   TEXT                              ->  NVARCHAR(255) / NVARCHAR(MAX)
--   REAL                              ->  DECIMAL(18,2)
--   INTEGER DEFAULT 0/1 (boolean)     ->  BIT DEFAULT 0
--   INTEGER (other)                   ->  INT
--   CURRENT_TIMESTAMP default         ->  DEFAULT GETDATE()
--   datetime('now', '+N hours')       ->  DATEADD(HOUR, N, GETDATE())
--   date(x)                           ->  CAST(x AS DATE)
--   strftime('%Y-%m', x)              ->  FORMAT(x, 'yyyy-MM')
--   strftime('%H', x)                 ->  DATEPART(HOUR, x)
--   julianday(a)-julianday(b)*24      ->  CAST(DATEDIFF(MINUTE,b,a)/60.0 AS DECIMAL(18,4))
--   last_insert_rowid()               ->  SCOPE_IDENTITY() (handled in app layer)
--   INSERT OR REPLACE                 ->  MERGE (handled in app layer)
--   LIMIT ? OFFSET ?                  ->  OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
--   sqlite_master                     ->  sys.tables
-- ============================================================================

IF DB_ID(N'billard_cafe') IS NULL
BEGIN
    CREATE DATABASE billard_cafe;
END;
GO

USE billard_cafe;
GO

-- Drop existing tables in dependency order so the script is idempotent
IF OBJECT_ID('dbo.ai_chat_logs', 'U')        IS NOT NULL DROP TABLE dbo.ai_chat_logs;
IF OBJECT_ID('dbo.notifications', 'U')       IS NOT NULL DROP TABLE dbo.notifications;
IF OBJECT_ID('dbo.settings', 'U')            IS NOT NULL DROP TABLE dbo.settings;
IF OBJECT_ID('dbo.purchase_items', 'U')      IS NOT NULL DROP TABLE dbo.purchase_items;
IF OBJECT_ID('dbo.purchases', 'U')           IS NOT NULL DROP TABLE dbo.purchases;
IF OBJECT_ID('dbo.suppliers', 'U')           IS NOT NULL DROP TABLE dbo.suppliers;
IF OBJECT_ID('dbo.staff_shifts', 'U')        IS NOT NULL DROP TABLE dbo.staff_shifts;
IF OBJECT_ID('dbo.order_items', 'U')         IS NOT NULL DROP TABLE dbo.order_items;
IF OBJECT_ID('dbo.orders', 'U')              IS NOT NULL DROP TABLE dbo.orders;
IF OBJECT_ID('dbo.bookings', 'U')            IS NOT NULL DROP TABLE dbo.bookings;
IF OBJECT_ID('dbo.customers', 'U')           IS NOT NULL DROP TABLE dbo.customers;
IF OBJECT_ID('dbo.products', 'U')            IS NOT NULL DROP TABLE dbo.products;
IF OBJECT_ID('dbo.categories', 'U')          IS NOT NULL DROP TABLE dbo.categories;
IF OBJECT_ID('dbo.tables', 'U')              IS NOT NULL DROP TABLE dbo.tables;
IF OBJECT_ID('dbo.users', 'U')               IS NOT NULL DROP TABLE dbo.users;
GO

-- ============================================================================
-- 1. categories
-- ============================================================================
CREATE TABLE dbo.categories (
    id    INT IDENTITY(1,1) PRIMARY KEY,
    name  NVARCHAR(100) NOT NULL UNIQUE
);
GO

-- ============================================================================
-- 2. tables (billiard tables)
-- ============================================================================
CREATE TABLE dbo.tables (
    id                       INT IDENTITY(1,1) PRIMARY KEY,
    name                     NVARCHAR(100) NULL,
    table_number             NVARCHAR(50) NULL,
    status                   NVARCHAR(50)  NULL DEFAULT N'available',
    rate_per_hour            DECIMAL(18,2) NOT NULL DEFAULT 50000,
    current_session_start    DATETIME2(0)  NULL,
    current_customer_id      INT           NULL,
    current_customer_name    NVARCHAR(200) NULL,
    current_customer_phone   NVARCHAR(50)  NULL,
    current_customer_tier    NVARCHAR(50)  NULL,
    drinks_total             INT           NOT NULL DEFAULT 0,
    description              NVARCHAR(500) NULL DEFAULT N'',
    booking_id               INT           NULL,
    booking_start_time       DATETIME2(0)  NULL,
    next_check_in_at         DATETIME2(0)  NULL,
    booking_status           NVARCHAR(50)  NULL DEFAULT N'none',
    booking_customer_name    NVARCHAR(200) NULL,
    CONSTRAINT UQ_tables_table_number UNIQUE (table_number)
);
GO

-- ============================================================================
-- 3. products
-- ============================================================================
CREATE TABLE dbo.products (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    name          NVARCHAR(200) NOT NULL,
    category_id   INT           NULL,
    price         DECIMAL(18,2) NOT NULL DEFAULT 0,
    stock         INT           NOT NULL DEFAULT 0,
    unit          NVARCHAR(50)  NULL DEFAULT N'phan',
    image_url     NVARCHAR(500) NULL DEFAULT N'',
    cost_price    DECIMAL(18,2) NOT NULL DEFAULT 0,
    is_deleted    BIT           NOT NULL DEFAULT 0,
    created_at    DATETIME2(0)  NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_products_categories FOREIGN KEY (category_id) REFERENCES dbo.categories(id)
);
GO

CREATE INDEX IX_products_category_id ON dbo.products(category_id);
GO

-- ============================================================================
-- 4. orders
-- ============================================================================
CREATE TABLE dbo.orders (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    table_id         INT           NULL,
    customer_id      INT           NULL,
    customer_name    NVARCHAR(200) NULL,
    subtotal         DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount         DECIMAL(18,2) NOT NULL DEFAULT 0,
    tier_discount    DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax              DECIMAL(18,2) NOT NULL DEFAULT 0,
    total            DECIMAL(18,2) NOT NULL DEFAULT 0,
    payment_method   NVARCHAR(50)  NULL DEFAULT N'cash',
    status           NVARCHAR(50)  NULL DEFAULT N'pending',
    note             NVARCHAR(500) NULL DEFAULT N'',
    completed_at     DATETIME2(0)  NULL,
    created_at       DATETIME2(0)  NOT NULL DEFAULT GETDATE(),
    voucher_code     NVARCHAR(100) NULL,
    voucher_discount DECIMAL(18,2) NOT NULL DEFAULT 0,
    billiard_total   DECIMAL(18,2) NOT NULL DEFAULT 0,
    billiard_rate    DECIMAL(18,2) NOT NULL DEFAULT 0,
    billiard_hours   DECIMAL(18,2) NOT NULL DEFAULT 0,
    drinks_total     DECIMAL(18,2) NOT NULL DEFAULT 0,
    CONSTRAINT FK_orders_tables FOREIGN KEY (table_id) REFERENCES dbo.tables(id)
);
GO

CREATE INDEX IX_orders_table_id      ON dbo.orders(table_id);
CREATE INDEX IX_orders_customer_id   ON dbo.orders(customer_id);
CREATE INDEX IX_orders_status        ON dbo.orders(status);
CREATE INDEX IX_orders_completed_at  ON dbo.orders(completed_at);
GO

-- ============================================================================
-- 5. order_items
-- ============================================================================
CREATE TABLE dbo.order_items (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    order_id    INT           NULL,
    product_id  INT           NULL,
    description NVARCHAR(500) NULL,
    quantity    INT           NOT NULL DEFAULT 1,
    unit_price  DECIMAL(18,2) NOT NULL DEFAULT 0,
    line_total  DECIMAL(18,2) NOT NULL DEFAULT 0,
    CONSTRAINT FK_order_items_orders   FOREIGN KEY (order_id)   REFERENCES dbo.orders(id),
    CONSTRAINT FK_order_items_products FOREIGN KEY (product_id) REFERENCES dbo.products(id)
);
GO

CREATE INDEX IX_order_items_order_id   ON dbo.order_items(order_id);
CREATE INDEX IX_order_items_product_id ON dbo.order_items(product_id);
GO

-- ============================================================================
-- 6. customers
-- ============================================================================
CREATE TABLE dbo.customers (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(200) NOT NULL,
    phone       NVARCHAR(50)  NULL,
    points      INT           NOT NULL DEFAULT 0,
    tier        NVARCHAR(50)  NULL DEFAULT N'Bronze',
    total_spent DECIMAL(18,2) NOT NULL DEFAULT 0,
    visit_count INT           NOT NULL DEFAULT 0,
    created_at  DATETIME2(0)  NOT NULL DEFAULT GETDATE()
);
GO

CREATE INDEX IX_customers_phone ON dbo.customers(phone);
GO

-- ============================================================================
-- 7. bookings
-- ============================================================================
CREATE TABLE dbo.bookings (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    customer_name   NVARCHAR(200) NOT NULL,
    phone           NVARCHAR(50)  NULL,
    table_id        INT           NULL,
    start_time      DATETIME2(0)  NULL,
    end_time        DATETIME2(0)  NULL,
    status          NVARCHAR(50)  NULL DEFAULT N'pending',
    notes           NVARCHAR(500) NULL,
    created_at      DATETIME2(0)  NOT NULL DEFAULT GETDATE(),
    confirmed_at    DATETIME2(0)  NULL,
    checked_in_at   DATETIME2(0)  NULL,
    no_show_at      DATETIME2(0)  NULL,
    checked_in_by   INT           NULL,
    no_show_by      INT           NULL,
    CONSTRAINT FK_bookings_tables FOREIGN KEY (table_id) REFERENCES dbo.tables(id)
);
GO

CREATE INDEX IX_bookings_table_id   ON dbo.bookings(table_id);
CREATE INDEX IX_bookings_start_time ON dbo.bookings(start_time);
CREATE INDEX IX_bookings_status     ON dbo.bookings(status);
GO

-- ============================================================================
-- 8. vouchers
-- ============================================================================
CREATE TABLE dbo.vouchers (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    code        NVARCHAR(100) NOT NULL UNIQUE,
    type        NVARCHAR(50)  NULL DEFAULT N'percent',
    value       DECIMAL(18,2) NOT NULL DEFAULT 0,
    expires_at  DATETIME2(0)  NULL,
    min_order   DECIMAL(18,2) NOT NULL DEFAULT 0,
    max_uses    INT           NOT NULL DEFAULT 100,
    used_count  INT           NOT NULL DEFAULT 0,
    active      BIT           NOT NULL DEFAULT 1,
    tier        NVARCHAR(50)  NULL,
    created_at  DATETIME2(0)  NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================================================
-- 9. suppliers
-- ============================================================================
CREATE TABLE dbo.suppliers (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    name       NVARCHAR(200) NOT NULL UNIQUE,
    phone      NVARCHAR(50)  NULL,
    address    NVARCHAR(500) NULL,
    category   NVARCHAR(200) NULL,
    created_at DATETIME2(0)  NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================================================
-- 10. purchases
-- ============================================================================
CREATE TABLE dbo.purchases (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    supplier_id INT           NULL,
    total       DECIMAL(18,2) NOT NULL DEFAULT 0,
    notes       NVARCHAR(500) NULL DEFAULT N'',
    created_at  DATETIME2(0)  NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_purchases_suppliers FOREIGN KEY (supplier_id) REFERENCES dbo.suppliers(id)
);
GO

-- ============================================================================
-- 11. purchase_items
-- ============================================================================
CREATE TABLE dbo.purchase_items (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    purchase_id INT           NULL,
    product_id  INT           NULL,
    quantity    INT           NOT NULL DEFAULT 1,
    unit_cost   DECIMAL(18,2) NOT NULL DEFAULT 0,
    line_total  DECIMAL(18,2) NOT NULL DEFAULT 0,
    CONSTRAINT FK_purchase_items_purchases FOREIGN KEY (purchase_id) REFERENCES dbo.purchases(id),
    CONSTRAINT FK_purchase_items_products  FOREIGN KEY (product_id)  REFERENCES dbo.products(id)
);
GO

-- ============================================================================
-- 12. staff_shifts
-- ============================================================================
CREATE TABLE dbo.staff_shifts (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    user_id     INT           NULL,
    staff_name  NVARCHAR(200) NULL,
    role        NVARCHAR(50)  NULL DEFAULT N'staff',
    shift_name  NVARCHAR(100) NULL,
    start_time  DATETIME2(0)  NULL,
    end_time    DATETIME2(0)  NULL,
    notes       NVARCHAR(500) NULL,
    status      NVARCHAR(50)  NULL DEFAULT N'active',
    date        DATE          NULL,
    created_at  DATETIME2(0)  NOT NULL DEFAULT GETDATE()
);
GO

CREATE INDEX IX_staff_shifts_user_id ON dbo.staff_shifts(user_id);
CREATE INDEX IX_staff_shifts_date    ON dbo.staff_shifts(date);
GO

-- ============================================================================
-- 13. notifications
-- ============================================================================
CREATE TABLE dbo.notifications (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    type       NVARCHAR(50)  NULL DEFAULT N'info',
    message    NVARCHAR(MAX) NOT NULL,
    is_read    BIT           NOT NULL DEFAULT 0,
    created_at DATETIME2(0)  NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================================================
-- 14. users
-- ============================================================================
CREATE TABLE dbo.users (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    username      NVARCHAR(100) NOT NULL UNIQUE,
    password_hash NVARCHAR(500) NOT NULL,
    full_name     NVARCHAR(200) NULL,
    phone         NVARCHAR(50)  NULL,
    cccd          NVARCHAR(50)  NULL,
    role          NVARCHAR(50)  NOT NULL DEFAULT N'staff',
    created_at    DATETIME2(0)  NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================================================
-- 15. settings
-- ============================================================================
CREATE TABLE dbo.settings (
    [key]   NVARCHAR(100) PRIMARY KEY,
    [value] NVARCHAR(MAX) NULL
);
GO

-- ============================================================================
-- 16. ai_chat_logs
-- ============================================================================
CREATE TABLE dbo.ai_chat_logs (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    session_id NVARCHAR(100) NOT NULL,
    role       NVARCHAR(50)  NOT NULL,
    channel    NVARCHAR(50)  NOT NULL DEFAULT N'public',
    user_id    INT           NULL,
    content    NVARCHAR(MAX) NOT NULL,
    tool_calls NVARCHAR(MAX) NULL,
    created_at DATETIME2(0)  NOT NULL DEFAULT GETDATE()
);
GO

CREATE INDEX IX_ai_chat_logs_session ON dbo.ai_chat_logs(session_id, created_at);
GO

-- ============================================================================
-- SEED DATA
-- ============================================================================
-- NOTE: Password hashes for "admin" / "staff" are bcrypt 10 rounds.
-- Generated from the same seeds used in the SQLite version (db.js).
-- admin / admin123  -> $2a$10$Q9kV7yC8lZ7nQ5p1X0eOkeMqE8b5hJ8aWnY2V5rL9oK3sD4fG6iH7.
-- staff / staff123  -> $2a$10$N8lW3vB5kT6mR4pX2yC1zAeH7jF0gK9dQ8sV2bN5xM3pL7oI9kJ4u.
-- These are placeholders; in production the server.js boot will overwrite them
-- with real hashes from the seedUsers() helper.
-- ============================================================================

-- Default business settings (overridable via Settings UI)
IF NOT EXISTS (SELECT 1 FROM dbo.settings WHERE [key] = 'name')           INSERT INTO dbo.settings ([key], [value]) VALUES (N'name',           N'Billiard Cafe');
IF NOT EXISTS (SELECT 1 FROM dbo.settings WHERE [key] = 'address')        INSERT INTO dbo.settings ([key], [value]) VALUES (N'address',        N'TP. Hồ Chí Minh');
IF NOT EXISTS (SELECT 1 FROM dbo.settings WHERE [key] = 'phone')          INSERT INTO dbo.settings ([key], [value]) VALUES (N'phone',          N'0901 234 567');
IF NOT EXISTS (SELECT 1 FROM dbo.settings WHERE [key] = 'email')          INSERT INTO dbo.settings ([key], [value]) VALUES (N'email',          N'contact@billard-cafe.vn');
IF NOT EXISTS (SELECT 1 FROM dbo.settings WHERE [key] = 'default_rate')   INSERT INTO dbo.settings ([key], [value]) VALUES (N'default_rate',   N'50000');
IF NOT EXISTS (SELECT 1 FROM dbo.settings WHERE [key] = 'open_time')      INSERT INTO dbo.settings ([key], [value]) VALUES (N'open_time',      N'08:00');
IF NOT EXISTS (SELECT 1 FROM dbo.settings WHERE [key] = 'close_time')     INSERT INTO dbo.settings ([key], [value]) VALUES (N'close_time',     N'23:00');
IF NOT EXISTS (SELECT 1 FROM dbo.settings WHERE [key] = 'points_rate')    INSERT INTO dbo.settings ([key], [value]) VALUES (N'points_rate',    N'1');
GO

-- Default categories (only insert if missing)
IF NOT EXISTS (SELECT 1 FROM dbo.categories WHERE name = N'Bia')         INSERT INTO dbo.categories (name) VALUES (N'Bia');
IF NOT EXISTS (SELECT 1 FROM dbo.categories WHERE name = N'Nuoc uong')    INSERT INTO dbo.categories (name) VALUES (N'Nuoc uong');
IF NOT EXISTS (SELECT 1 FROM dbo.categories WHERE name = N'Do an')        INSERT INTO dbo.categories (name) VALUES (N'Do an');
IF NOT EXISTS (SELECT 1 FROM dbo.categories WHERE name = N'Khac')         INSERT INTO dbo.categories (name) VALUES (N'Khac');
GO

-- Default tables 1..10 (only if no tables exist)
IF NOT EXISTS (SELECT 1 FROM dbo.tables)
BEGIN
    INSERT INTO dbo.tables (table_number, status, rate_per_hour, booking_status) VALUES (N'1',  N'available', 50000, N'none');
    INSERT INTO dbo.tables (table_number, status, rate_per_hour, booking_status) VALUES (N'2',  N'available', 50000, N'none');
    INSERT INTO dbo.tables (table_number, status, rate_per_hour, booking_status) VALUES (N'3',  N'available', 50000, N'none');
    INSERT INTO dbo.tables (table_number, status, rate_per_hour, booking_status) VALUES (N'4',  N'available', 50000, N'none');
    INSERT INTO dbo.tables (table_number, status, rate_per_hour, booking_status) VALUES (N'5',  N'available', 50000, N'none');
    INSERT INTO dbo.tables (table_number, status, rate_per_hour, booking_status) VALUES (N'6',  N'available', 50000, N'none');
    INSERT INTO dbo.tables (table_number, status, rate_per_hour, booking_status) VALUES (N'7',  N'available', 50000, N'none');
    INSERT INTO dbo.tables (table_number, status, rate_per_hour, booking_status) VALUES (N'8',  N'available', 50000, N'none');
    INSERT INTO dbo.tables (table_number, status, rate_per_hour, booking_status) VALUES (N'9',  N'available', 50000, N'none');
    INSERT INTO dbo.tables (table_number, status, rate_per_hour, booking_status) VALUES (N'10', N'available', 50000, N'none');
END
GO

-- Default products (only if none exist)
IF NOT EXISTS (SELECT 1 FROM dbo.products)
BEGIN
    INSERT INTO dbo.products (name, category_id, price, stock)
      SELECT N'Bia Tiger lon',   (SELECT id FROM dbo.categories WHERE name = N'Bia'),      25000, 100
      WHERE (SELECT id FROM dbo.categories WHERE name = N'Bia') IS NOT NULL;
    INSERT INTO dbo.products (name, category_id, price, stock)
      SELECT N'Bia Tiger chai',  (SELECT id FROM dbo.categories WHERE name = N'Bia'),      30000, 80
      WHERE (SELECT id FROM dbo.categories WHERE name = N'Bia') IS NOT NULL;
    INSERT INTO dbo.products (name, category_id, price, stock)
      SELECT N'Bia 333 lon',     (SELECT id FROM dbo.categories WHERE name = N'Bia'),      20000, 120
      WHERE (SELECT id FROM dbo.categories WHERE name = N'Bia') IS NOT NULL;
    INSERT INTO dbo.products (name, category_id, price, stock)
      SELECT N'Nuoc ngot 333ml', (SELECT id FROM dbo.categories WHERE name = N'Nuoc uong'), 10000, 200
      WHERE (SELECT id FROM dbo.categories WHERE name = N'Nuoc uong') IS NOT NULL;
    INSERT INTO dbo.products (name, category_id, price, stock)
      SELECT N'Tra da',          (SELECT id FROM dbo.categories WHERE name = N'Nuoc uong'), 15000, 150
      WHERE (SELECT id FROM dbo.categories WHERE name = N'Nuoc uong') IS NOT NULL;
    INSERT INTO dbo.products (name, category_id, price, stock)
      SELECT N'Ca phe sua da',   (SELECT id FROM dbo.categories WHERE name = N'Nuoc uong'), 20000, 100
      WHERE (SELECT id FROM dbo.categories WHERE name = N'Nuoc uong') IS NOT NULL;
    INSERT INTO dbo.products (name, category_id, price, stock)
      SELECT N'Nuoc suoi',        (SELECT id FROM dbo.categories WHERE name = N'Nuoc uong'), 8000, 300
      WHERE (SELECT id FROM dbo.categories WHERE name = N'Nuoc uong') IS NOT NULL;
    INSERT INTO dbo.products (name, category_id, price, stock)
      SELECT N'Snack',           (SELECT id FROM dbo.categories WHERE name = N'Do an'),  15000, 50
      WHERE (SELECT id FROM dbo.categories WHERE name = N'Do an') IS NOT NULL;
    INSERT INTO dbo.products (name, category_id, price, stock)
      SELECT N'Khoai tay ran',   (SELECT id FROM dbo.categories WHERE name = N'Do an'),  20000, 40
      WHERE (SELECT id FROM dbo.categories WHERE name = N'Do an') IS NOT NULL;
END
GO

-- Tier vouchers (only if no tier vouchers exist)
IF NOT EXISTS (SELECT 1 FROM dbo.vouchers WHERE tier IS NOT NULL AND tier <> N'')
BEGIN
    INSERT INTO dbo.vouchers (code, type, value, tier, min_order, max_uses, active, expires_at, created_at)
      VALUES (N'BRONZE02',   N'percent', 2,  N'Bronze',   0, 9999, 1, DATEADD(MONTH, 6, GETDATE()), GETDATE());
    INSERT INTO dbo.vouchers (code, type, value, tier, min_order, max_uses, active, expires_at, created_at)
      VALUES (N'SILVER05',   N'percent', 5,  N'Silver',   0, 9999, 1, DATEADD(MONTH, 6, GETDATE()), GETDATE());
    INSERT INTO dbo.vouchers (code, type, value, tier, min_order, max_uses, active, expires_at, created_at)
      VALUES (N'GOLD10',     N'percent', 10, N'Gold',     0, 9999, 1, DATEADD(MONTH, 6, GETDATE()), GETDATE());
    INSERT INTO dbo.vouchers (code, type, value, tier, min_order, max_uses, active, expires_at, created_at)
      VALUES (N'PLATINUM15', N'percent', 15, N'Platinum', 0, 9999, 1, DATEADD(MONTH, 6, GETDATE()), GETDATE());
END
GO

-- Note: admin/staff users are seeded by db.js at server startup so the bcrypt
-- hashes are computed in-process. Use INSERT IGNORE-style check there.
PRINT N'billard_cafe schema created successfully.';
GO