-- =====================================================
-- SQL Server Schema for BilliardCafe
-- Chạy trong SQL Server Management Studio 17
-- =====================================================

USE master;
GO

-- Tạo Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'BilliardCafe')
BEGIN
    CREATE DATABASE BilliardCafe;
END
GO

USE BilliardCafe;
GO

-- =====================================================
-- Xóa các bảng theo đúng thứ tự (bảng con trước)
-- =====================================================

-- Xóa Foreign Keys trước
DECLARE @sql NVARCHAR(MAX) = N'';
SELECT @sql += 'ALTER TABLE ' + QUOTENAME(rc.name) + ' DROP CONSTRAINT ' + QUOTENAME(fk.name) + ';'
FROM sys.foreign_keys AS fk
INNER JOIN sys.tables AS rc ON fk.parent_object_id = rc.object_id
WHERE rc.name IN ('orders', 'order_items', 'purchases', 'purchase_items', 
                  'bookings', 'products', 'tables', 'customers', 'vouchers');

EXEC sp_executesql @sql;
GO

-- Xóa bảng (theo thứ tự ngược - bảng con trước)
IF OBJECT_ID('notifications', 'U') IS NOT NULL DROP TABLE notifications;
IF OBJECT_ID('bookings', 'U') IS NOT NULL DROP TABLE bookings;
IF OBJECT_ID('shifts', 'U') IS NOT NULL DROP TABLE shifts;
IF OBJECT_ID('purchase_items', 'U') IS NOT NULL DROP TABLE purchase_items;
IF OBJECT_ID('purchases', 'U') IS NOT NULL DROP TABLE purchases;
IF OBJECT_ID('suppliers', 'U') IS NOT NULL DROP TABLE suppliers;
IF OBJECT_ID('order_items', 'U') IS NOT NULL DROP TABLE order_items;
IF OBJECT_ID('orders', 'U') IS NOT NULL DROP TABLE orders;
IF OBJECT_ID('vouchers', 'U') IS NOT NULL DROP TABLE vouchers;
IF OBJECT_ID('customers', 'U') IS NOT NULL DROP TABLE customers;
IF OBJECT_ID('products', 'U') IS NOT NULL DROP TABLE products;
IF OBJECT_ID('categories', 'U') IS NOT NULL DROP TABLE categories;
IF OBJECT_ID('tables', 'U') IS NOT NULL DROP TABLE tables;
IF OBJECT_ID('settings', 'U') IS NOT NULL DROP TABLE settings;
IF OBJECT_ID('users', 'U') IS NOT NULL DROP TABLE users;
GO

-- =====================================================
-- Tạo bảng (bảng cha trước)
-- =====================================================

-- Users
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(100) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL DEFAULT 'admin',
    password_hint NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE()
);

-- Settings
CREATE TABLE settings (
    key_name NVARCHAR(100) PRIMARY KEY,
    value NVARCHAR(MAX)
);

-- Tables (Billiard tables)
CREATE TABLE tables (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'empty',
    rate_per_hour DECIMAL(18,2) NOT NULL DEFAULT 50000,
    current_session_start DATETIME,
    reserved_phone NVARCHAR(20),
    reserved_name NVARCHAR(255),
    current_order_id INT,
    drinks_total DECIMAL(18,2) DEFAULT 0,
    billiard_total DECIMAL(18,2) DEFAULT 0
);

-- Categories
CREATE TABLE categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL
);

-- Products
CREATE TABLE products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    category_id INT,
    name NVARCHAR(255) NOT NULL,
    price DECIMAL(18,2) NOT NULL,
    stock DECIMAL(18,2) DEFAULT 0,
    unit NVARCHAR(50) DEFAULT 'pcs',
    image_url NVARCHAR(MAX),
    cost_price DECIMAL(18,2) DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Customers
CREATE TABLE customers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255),
    phone NVARCHAR(20),
    points INT DEFAULT 0,
    tier NVARCHAR(50) DEFAULT 'Bronze',
    total_spent DECIMAL(18,2) DEFAULT 0,
    visit_count INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE()
);

-- Vouchers
CREATE TABLE vouchers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(50) UNIQUE NOT NULL,
    type NVARCHAR(20) NOT NULL,
    value DECIMAL(18,2) NOT NULL,
    expires_at DATETIME,
    min_order DECIMAL(18,2) DEFAULT 0,
    max_uses INT,
    used_count INT DEFAULT 0,
    active BIT DEFAULT 1
);

-- Orders
CREATE TABLE orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT,
    customer_name NVARCHAR(255),
    customer_phone NVARCHAR(20),
    table_id INT,
    subtotal DECIMAL(18,2) NOT NULL,
    discount DECIMAL(18,2) DEFAULT 0,
    tier_discount DECIMAL(18,2) DEFAULT 0,
    voucher_discount DECIMAL(18,2) DEFAULT 0,
    voucher_code NVARCHAR(50),
    tax DECIMAL(18,2) DEFAULT 0,
    total DECIMAL(18,2) NOT NULL,
    payment_method NVARCHAR(50) DEFAULT 'cash',
    status NVARCHAR(50) NOT NULL DEFAULT 'paid',
    points_earned INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    completed_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (table_id) REFERENCES tables(id)
);

-- Thêm Foreign Key cho tables.current_order_id
ALTER TABLE tables ADD FOREIGN KEY (current_order_id) REFERENCES orders(id);

-- Order Items
CREATE TABLE order_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT,
    description NVARCHAR(MAX),
    quantity DECIMAL(18,2) NOT NULL,
    unit_price DECIMAL(18,2) NOT NULL,
    line_total DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Suppliers
CREATE TABLE suppliers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20),
    address NVARCHAR(MAX)
);

-- Purchases
CREATE TABLE purchases (
    id INT IDENTITY(1,1) PRIMARY KEY,
    supplier_id INT,
    total DECIMAL(18,2) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Purchase Items
CREATE TABLE purchase_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    purchase_id INT NOT NULL,
    product_id INT,
    quantity DECIMAL(18,2) NOT NULL,
    unit_cost DECIMAL(18,2) NOT NULL,
    line_total DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Shifts
CREATE TABLE shifts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    staff_name NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) DEFAULT 'staff',
    start_time DATETIME NOT NULL,
    end_time DATETIME
);

-- Bookings
CREATE TABLE bookings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_name NVARCHAR(255),
    phone NVARCHAR(20),
    table_id INT,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    status NVARCHAR(50) DEFAULT 'booked',
    FOREIGN KEY (table_id) REFERENCES tables(id)
);

-- Notifications
CREATE TABLE notifications (
    id INT IDENTITY(1,1) PRIMARY KEY,
    message NVARCHAR(MAX) NOT NULL,
    type NVARCHAR(50) DEFAULT 'info',
    created_at DATETIME DEFAULT GETDATE(),
    read_status BIT DEFAULT 0
);

GO

-- =====================================================
-- Insert Sample Data
-- =====================================================

-- Users (password: admin123, staff123) — hashes generated with bcryptjs $2b$10$
INSERT INTO users (username, password_hash, role, password_hint) VALUES
('admin', N'$2b$10$4ik4hjPEwMHSn1M8HOTSeuBoUWSpQ2dwvdwt7H9f3ScaW.Xl.SR3i', 'admin', 'admin123'),
('staff', N'$2b$10$mbJPtw0rtqi6U5FDchiIoesi7/N9s1gKBs4aN9IOUvcepcX8WbqPi', 'staff', 'staff123');

-- Tables
DECLARE @i INT = 1;
WHILE @i <= 12
BEGIN
    INSERT INTO tables (name, status, rate_per_hour) VALUES ('Bàn #' + CAST(@i AS NVARCHAR), 'empty', 60000);
    SET @i = @i + 1;
END

-- Categories
INSERT INTO categories (name) VALUES (N'Đồ uống'), (N'Đồ ăn nhẹ');

-- Products
INSERT INTO products (category_id, name, price, stock, unit, cost_price) VALUES
(1, N'Cà phê sữa', 25000, 100, 'ly', 15000),
(1, N'Cà phê đen', 20000, 95, 'ly', 12000),
(1, N'Trà đào', 30000, 80, 'ly', 18000),
(1, N'Trà sữa', 35000, 75, 'ly', 21000),
(1, N'Nước ngọt', 20000, 120, 'lon', 12000),
(1, N'Bia Tiger', 30000, 90, 'lon', 18000),
(2, N'Khoai tây chiên', 35000, 50, 'phần', 21000),
(2, N'Gà rán', 45000, 30, 'phần', 27000),
(2, N'Xúc xích nướng', 25000, 40, 'phần', 15000);

-- Customers
INSERT INTO customers (name, phone, points, tier, total_spent, visit_count) VALUES
(N'Nguyễn Văn A', '0901234567', 850, 'Silver', 8500000, 5),
(N'Trần Thị B', '0912345678', 1500, 'Gold', 23000000, 12),
(N'Lê Văn C', '0923456789', 350, 'Bronze', 1200000, 2),
(N'Phạm Thị D', '0934567890', 2500, 'Platinum', 55000000, 28),
(N'Hoàng Văn E', '0945678901', 120, 'Bronze', 380000, 1);

-- Vouchers
INSERT INTO vouchers (code, type, value, expires_at) VALUES
('SUMMER2024', 'percent', 10, '2026-12-31'),
('NEWCUSTOMER', 'amount', 50000, NULL),
('VIP20', 'percent', 20, '2026-12-31');

-- Suppliers
INSERT INTO suppliers (name, phone, address) VALUES
(N'Công ty TNHH Cà phê Việt', '0281234567', N'123 Nguyễn Văn Linh, Q7, TP.HCM'),
(N'Nhà cung cấp thực phẩm Á Châu', '0282345678', N'456 Lê Văn Việt, Q9, TP.HCM');

-- Shifts (Ca làm việc)
DECLARE @today DATETIME = GETDATE();
DECLARE @yesterday DATETIME = DATEADD(DAY, -1, GETDATE());

INSERT INTO shifts (staff_name, role, start_time, end_time) VALUES
(N'Nguyễn Văn Nam', 'cashier', @yesterday, DATEADD(HOUR, 8, @yesterday)),
(N'Trần Thị Mai', 'bartender', @yesterday, DATEADD(HOUR, 8, @yesterday)),
(N'Lê Hoàng Minh', 'cashier', @today, DATEADD(HOUR, 4, @today)),
(N'Phạm Thu Hà', 'bartender', @today, NULL);

-- Bookings (Đặt bàn)
DECLARE @tomorrow DATETIME = DATEADD(DAY, 1, GETDATE());
DECLARE @tomorrowDate NVARCHAR(10) = CONVERT(NVARCHAR(10), @tomorrow, 120);

INSERT INTO bookings (customer_name, phone, table_id, start_time, status) VALUES
(N'Lê Minh Tuấn', '0956789012', 3, @tomorrowDate + 'T18:00:00', 'booked'),
(N'Phạm Thu Hà', '0967890123', 5, @tomorrowDate + 'T20:00:00', 'confirmed');

-- Orders (Đơn hàng mẫu - 10 đơn trong 7 ngày qua)
DECLARE @orderDate DATETIME;
DECLARE @orderId INT;

-- Đơn 1
SET @orderDate = DATEADD(DAY, -1, GETDATE());
INSERT INTO orders (customer_id, customer_name, customer_phone, table_id, subtotal, discount, tier_discount, voucher_discount, tax, total, payment_method, status, points_earned, created_at, completed_at)
VALUES (1, N'Nguyễn Văn A', '0901234567', 1, 180000, 0, 18000, 0, 0, 162000, 'cash', 'paid', 0, DATEADD(HOUR, -5, @orderDate), DATEADD(HOUR, -1, @orderDate));

-- Đơn 2
SET @orderDate = DATEADD(DAY, -2, GETDATE());
INSERT INTO orders (customer_id, customer_name, customer_phone, table_id, subtotal, discount, tier_discount, voucher_discount, tax, total, payment_method, status, points_earned, created_at, completed_at)
VALUES (2, N'Trần Thị B', '0912345678', 3, 320000, 0, 32000, 0, 0, 288000, 'transfer', 'paid', 0, DATEADD(HOUR, -10, @orderDate), DATEADD(HOUR, -3, @orderDate));

-- Đơn 3
SET @orderDate = DATEADD(DAY, -3, GETDATE());
INSERT INTO orders (customer_id, customer_name, customer_phone, table_id, subtotal, discount, tier_discount, voucher_discount, tax, total, payment_method, status, points_earned, created_at, completed_at)
VALUES (3, N'Lê Văn C', '0923456789', 5, 95000, 0, 0, 50000, 0, 45000, 'cash', 'paid', 0, DATEADD(HOUR, -8, @orderDate), DATEADD(HOUR, -2, @orderDate));

-- Đơn 4
SET @orderDate = DATEADD(DAY, -4, GETDATE());
INSERT INTO orders (customer_id, customer_name, customer_phone, table_id, subtotal, discount, tier_discount, voucher_discount, tax, total, payment_method, status, points_earned, created_at, completed_at)
VALUES (4, N'Phạm Thị D', '0934567890', 2, 450000, 0, 67500, 0, 0, 382500, 'transfer', 'paid', 0, DATEADD(HOUR, -12, @orderDate), DATEADD(HOUR, -4, @orderDate));

-- Đơn 5
SET @orderDate = DATEADD(DAY, -5, GETDATE());
INSERT INTO orders (customer_id, customer_name, customer_phone, table_id, subtotal, discount, tier_discount, voucher_discount, tax, total, payment_method, status, points_earned, created_at, completed_at)
VALUES (1, N'Nguyễn Văn A', '0901234567', 7, 210000, 0, 21000, 0, 0, 189000, 'cash', 'paid', 0, DATEADD(HOUR, -6, @orderDate), DATEADD(HOUR, -1, @orderDate));

-- Đơn 6
SET @orderDate = DATEADD(DAY, -6, GETDATE());
INSERT INTO orders (customer_id, customer_name, customer_phone, table_id, subtotal, discount, tier_discount, voucher_discount, tax, total, payment_method, status, points_earned, created_at, completed_at)
VALUES (5, N'Hoàng Văn E', '0945678901', 4, 80000, 0, 0, 0, 0, 80000, 'cash', 'paid', 0, DATEADD(HOUR, -4, @orderDate), DATEADD(HOUR, -1, @orderDate));

-- Đơn 7
SET @orderDate = DATEADD(DAY, -7, GETDATE());
INSERT INTO orders (customer_id, customer_name, customer_phone, table_id, subtotal, discount, tier_discount, voucher_discount, tax, total, payment_method, status, points_earned, created_at, completed_at)
VALUES (2, N'Trần Thị B', '0912345678', 8, 380000, 0, 38000, 20000, 0, 322000, 'transfer', 'paid', 0, DATEADD(HOUR, -9, @orderDate), DATEADD(HOUR, -2, @orderDate));

-- Order Items (Chi tiết đơn hàng)
-- Đơn 1 - Bàn 1, Khách A
INSERT INTO order_items (order_id, product_id, description, quantity, unit_price, line_total) VALUES
(1, NULL, N'Phí giờ chơi bida (3.5h)', 1, 210000, 210000);

-- Đơn 2 - Bàn 3, Khách B
INSERT INTO order_items (order_id, product_id, description, quantity, unit_price, line_total) VALUES
(2, NULL, N'Phí giờ chơi bida (5h)', 1, 300000, 300000);

-- Đơn 3 - Bàn 5, Khách C
INSERT INTO order_items (order_id, product_id, description, quantity, unit_price, line_total) VALUES
(3, NULL, N'Phí giờ chơi bida (1.5h)', 1, 90000, 90000);

-- Đơn 4 - Bàn 2, Khách D
INSERT INTO order_items (order_id, product_id, description, quantity, unit_price, line_total) VALUES
(4, NULL, N'Phí giờ chơi bida (7h)', 1, 420000, 420000);

-- Đơn 5 - Bàn 7, Khách A
INSERT INTO order_items (order_id, product_id, description, quantity, unit_price, line_total) VALUES
(5, NULL, N'Phí giờ chơi bida (3.5h)', 1, 210000, 210000);

-- Đơn 6 - Bàn 4, Khách E
INSERT INTO order_items (order_id, product_id, description, quantity, unit_price, line_total) VALUES
(6, NULL, N'Phí giờ chơi bida (1h)', 1, 60000, 60000);

-- Đơn 7 - Bàn 8, Khách B
INSERT INTO order_items (order_id, product_id, description, quantity, unit_price, line_total) VALUES
(7, NULL, N'Phí giờ chơi bida (6h)', 1, 360000, 360000);

-- Thêm đồ uống cho một số đơn
INSERT INTO order_items (order_id, product_id, description, quantity, unit_price, line_total) VALUES
(1, 1, N'Cà phê sữa', 2, 25000, 50000),
(1, 4, N'Trà sữa', 1, 35000, 35000),
(2, 2, N'Cà phê đen', 3, 20000, 60000),
(4, 6, N'Bia Tiger', 4, 30000, 120000),
(5, 3, N'Trà đào', 1, 30000, 30000),
(7, 5, N'Nước ngọt', 2, 20000, 40000);

-- Notifications
INSERT INTO notifications (message, type, read_status) VALUES
(N'Hệ thống đã được khởi động thành công', 'info', 1),
(N'Tồn kho Cà phê sắp hết, cần nhập thêm', 'warning', 0),
(N'Đã hoàn thành backup dữ liệu', 'success', 1),
(N'Có 2 đặt bàn mới cho ngày mai', 'info', 0),
(N'Khách hàng Nguyễn Văn A đã đạt 850 điểm tích lũy', 'success', 1),
(N'Bàn #3 đang được đặt cho ngày mai 18:00', 'info', 0);

-- Settings (Cấu hình hệ thống)
INSERT INTO settings (key_name, value) VALUES
('business_name', N'Billiard Cafe'),
('phone', '02812345678'),
('address', N'123 Nguyễn Văn Linh, Q7, TP.HCM'),
('email', 'contact@billiardcafe.vn'),
('website', 'https://billiardcafe.vn'),
('vip_rate', '80000'),
('normal_rate', '60000'),
('vat', '0'),
('service_fee', '0'),
('points_per', '100000'),
('bronze_discount', '0'),
('silver_discount', '5'),
('gold_discount', '10'),
('platinum_discount', '15'),
('threshold_platinum', '50000000'),
('threshold_gold', '20000000'),
('threshold_silver', '5000000');

GO

PRINT N'✅ Database BilliardCafe đã được tạo thành công!';
GO
