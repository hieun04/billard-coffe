# ☕🎱 Hệ Thống Quản Lý Quán Cafe Bida

Hệ thống quản lý toàn diện cho quán cafe bida với giao diện hiện đại, nhiều tính năng và animation mượt mà.

## 🚀 Tính năng chính

### 1. 🔐 Xác thực & Bảo mật
- Đăng nhập với tài khoản admin
- Session management
- CSRF protection
- Password hashing với bcrypt

### 2. 📊 Dashboard
- Tổng quan doanh thu, đơn hàng
- Biểu đồ doanh thu theo thời gian
- Quick actions
- Timeline hoạt động gần đây

### 3. 🎱 Quản lý bàn bida
- Theo dõi trạng thái bàn (Trống/Đang chơi/Đặt trước)
- Bắt đầu/Kết thúc phiên chơi
- Tự động tính phí theo giờ
- **Đặt bàn trước với SĐT**: Nhập SĐT tự động kiểm tra khách hàng trong hệ thống
- Hiển thị thông tin người đặt trên bàn

### 4. 🛒 POS - Bán hàng
- Giao diện chọn sản phẩm trực quan
- Giỏ hàng với tăng/giảm số lượng
- Áp dụng voucher giảm giá
- Tính thuế tự động
- Tính tổng tiền real-time

### 5. 📋 Menu & Sản phẩm
- Quản lý danh mục sản phẩm
- Thêm/Xoá sản phẩm
- Hiển thị giá và tồn kho
- Phân loại theo category

### 6. 👥 Quản lý khách hàng
- **Tìm kiếm SĐT thông minh**: Nhập số tự động gợi ý khách có số đó
- Thêm khách hàng mới
- Tích điểm loyalty
- Phân hạng thành viên (Bronze/Silver/Gold/Platinum)
- Cộng điểm cho khách hàng

### 7. 🎟️ Voucher & Khuyến mãi
- Tạo voucher giảm theo % hoặc số tiền
- Đặt ngày hết hạn
- Copy mã voucher nhanh
- Hiển thị trạng thái hoạt động/hết hạn

### 8. 📦 Quản lý tồn kho
- Theo dõi số lượng tồn
- Điều chỉnh nhập/xuất kho
- Cảnh báo sản phẩm sắp hết
- Filter theo danh mục và trạng thái
- **Xuất báo cáo Excel/CSV**

### 9. 🏢 Nhập hàng & Nhà cung cấp
- Quản lý danh sách nhà cung cấp
- Tạo đơn nhập hàng
- Theo dõi lịch sử nhập
- Thống kê tổng giá trị nhập

### 10. 👔 Quản lý nhân viên & Ca làm
- Bắt đầu ca làm mới
- Kết thúc ca tự động tính giờ
- Theo dõi ca đang hoạt động
- Lịch sử ca làm việc

### 11. 📅 Đặt bàn (Booking)
- Tạo đặt bàn với thông tin khách
- Xác nhận/Huỷ đặt bàn
- Filter theo trạng thái
- Lịch sử đặt bàn

### 12. 📊 Báo cáo & Phân tích
- Biểu đồ doanh thu theo ngày
- Báo cáo sản phẩm bán chạy
- Phân tích theo danh mục
- Biểu đồ giờ cao điểm
- **Xuất báo cáo CSV/Excel**

### 13. 🔔 Thông báo
- Tạo thông báo hệ thống
- Phân loại (Info/Warning/Success/Error)
- Đánh dấu đã đọc
- Filter theo loại và trạng thái

### 14. ⚙️ Cài đặt
- **Thông tin doanh nghiệp**: Tên, địa chỉ, SĐT, email
- **Giá & Thuế**: Cấu hình giá bàn, VAT, phí phục vụ
- **Giờ mở cửa**: Đặt giờ cho từng ngày
- **Loyalty**: Cấu hình tích điểm và hạng thành viên
- **Thông tin hệ thống**: Version, platform, backup

### 15. 🎨 UI/UX
- Dark theme hiện đại
- Gradient backgrounds
- GSAP animations
- Responsive design
- Toast notifications
- Modal dialogs
- Loading states
- Hover effects

## 📦 Công nghệ sử dụng

### Backend
- **Node.js** + **Express.js**: Web framework
- **SQLite** (better-sqlite3): Database
- **EJS**: Template engine
- **bcrypt**: Password hashing
- **express-session**: Session management
- **helmet**: Security headers
- **morgan**: Logging
- **csurf**: CSRF protection

### Frontend
- **Tailwind CSS**: Styling
- **GSAP**: Animations
- **Chart.js**: Data visualization

## 🛠️ Cài đặt & Chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Build CSS (nếu cần)
```bash
npm run build:css
```

### 3. Chạy server
```bash
npm start
```

hoặc

```bash
node server.js
```

Server sẽ chạy tại: **http://localhost:8080**

## 🔑 Đăng nhập

- **Username**: `admin`
- **Password**: `admin123`

## 📁 Cấu trúc thư mục

```
billard-coffe/
├── data/
│   └── app.db              # SQLite database
├── public/
│   ├── css/
│   │   └── styles.css      # Compiled Tailwind CSS
│   └── js/
│       └── app.js          # Frontend JS (animations, theme)
├── src/
│   ├── db.js               # Database initialization
│   ├── middleware.js       # Authentication middleware
│   └── routes.js           # Application routes
├── views/
│   ├── layout.ejs          # Main layout
│   ├── login.ejs           # Login page
│   ├── dashboard.ejs       # Dashboard
│   ├── tables.ejs          # Quản lý bàn
│   ├── pos.ejs             # Bán hàng
│   ├── menu.ejs            # Menu
│   ├── customers.ejs       # Khách hàng
│   ├── vouchers.ejs        # Voucher
│   ├── inventory.ejs       # Tồn kho
│   ├── purchases.ejs       # Nhập hàng
│   ├── staff.ejs           # Nhân viên
│   ├── bookings.ejs        # Đặt bàn
│   ├── reports.ejs         # Báo cáo
│   ├── notifications.ejs   # Thông báo
│   ├── settings.ejs        # Cài đặt
│   └── partials/
│       ├── sidebar.ejs     # Sidebar navigation
│       └── topbar.ejs      # Top navigation bar
├── server.js               # Main server file
├── package.json
├── tailwind.config.js
└── README.md
```

## 🗄️ Database Schema

### Tables (14 bảng)
1. **users** - Tài khoản đăng nhập
2. **settings** - Cài đặt hệ thống
3. **tables** - Bàn bida (có reserved_phone, reserved_name)
4. **categories** - Danh mục sản phẩm
5. **products** - Sản phẩm
6. **customers** - Khách hàng
7. **vouchers** - Mã giảm giá
8. **orders** - Đơn hàng
9. **order_items** - Chi tiết đơn hàng
10. **suppliers** - Nhà cung cấp
11. **purchases** - Đơn nhập hàng
12. **purchase_items** - Chi tiết nhập hàng
13. **shifts** - Ca làm việc
14. **bookings** - Đặt bàn
15. **notifications** - Thông báo

## ✨ Các tính năng nổi bật

### 1. Đặt bàn thông minh
- Khi đặt bàn, nhập SĐT sẽ tự động kiểm tra khách hàng trong database
- Nếu tìm thấy: Tự động điền tên, hiển thị thông báo "✓ Tìm thấy khách hàng"
- Nếu không tìm thấy: Cho phép nhập tên khách hàng mới

### 2. POS hiện đại
- Chọn sản phẩm với UI card đẹp mắt
- Giỏ hàng động với tăng/giảm số lượng
- Tính tổng tiền real-time
- Áp dụng voucher và thuế tự động

### 3. Tìm kiếm khách hàng
- Input tìm kiếm real-time
- Filter theo hạng thành viên
- Highlight kết quả tìm kiếm

### 4. Animations & Transitions
- Page load animations với GSAP
- Smooth transitions
- Hover effects
- Toast notifications với animation

### 5. Responsive Design
- Mobile-friendly
- Tablet-optimized
- Desktop full-featured

## 🔧 Các API Endpoints

### Authentication
- `GET /login` - Trang đăng nhập
- `POST /login` - Xử lý đăng nhập
- `POST /logout` - Đăng xuất

### Dashboard
- `GET /dashboard` - Trang chủ

### Tables
- `GET /tables` - Danh sách bàn
- `POST /tables/:id/start` - Bắt đầu phiên
- `POST /tables/:id/stop` - Kết thúc phiên
- `POST /tables/:id/reserve` - Đặt bàn trước

### Customers
- `GET /customers` - Danh sách khách hàng
- `GET /customers/search?phone=xxx` - Tìm khách bằng SĐT
- `POST /customers/create` - Thêm khách hàng
- `POST /customers/:id/add-points` - Cộng điểm
- `POST /customers/:id/delete` - Xoá khách hàng

### Orders (POS)
- `GET /orders` - Trang POS
- `POST /orders/create` - Tạo hoá đơn

### Menu
- `GET /menu` - Danh sách menu
- `POST /menu/create` - Thêm sản phẩm
- `POST /menu/delete/:id` - Xoá sản phẩm

### Vouchers
- `GET /vouchers` - Danh sách voucher
- `POST /vouchers/create` - Tạo voucher
- `POST /vouchers/:id/delete` - Xoá voucher

### Inventory
- `GET /inventory` - Danh sách tồn kho
- `POST /inventory/:id/adjust` - Điều chỉnh tồn

### Purchases
- `GET /purchases` - NCC & Nhập hàng
- `POST /purchases/suppliers/create` - Thêm NCC
- `POST /purchases/suppliers/:id/delete` - Xoá NCC
- `POST /purchases/create` - Tạo đơn nhập

### Staff
- `GET /staff` - Ca làm việc
- `POST /staff/create` - Bắt đầu ca
- `POST /staff/:id/end` - Kết thúc ca

### Bookings
- `GET /bookings` - Danh sách đặt bàn
- `POST /bookings/create` - Tạo đặt bàn
- `POST /bookings/:id/confirm` - Xác nhận
- `POST /bookings/:id/cancel` - Huỷ

### Reports
- `GET /reports` - Trang báo cáo
- `GET /reports/kpi` - Dữ liệu KPI (JSON)
- `GET /reports/export?format=csv` - Xuất CSV

### Notifications
- `GET /notifications` - Danh sách thông báo
- `POST /notifications/create` - Tạo thông báo
- `POST /notifications/:id/read` - Đánh dấu đã đọc
- `POST /notifications/mark-all-read` - Đánh dấu tất cả
- `POST /notifications/:id/delete` - Xoá

### Settings
- `GET /settings` - Trang cài đặt
- `POST /settings/business` - Lưu thông tin DN
- `POST /settings/pricing` - Lưu giá & thuế
- `POST /settings/hours` - Lưu giờ mở cửa
- `POST /settings/loyalty` - Lưu cài đặt loyalty

## 🎯 Hướng dẫn sử dụng

### 1. Quản lý bàn bida
- Vào menu "Bàn bida"
- Click "▶ Bắt đầu" để bắt đầu phiên chơi
- Click "⏹ Kết thúc" để kết thúc và tính tiền
- Click "📅 Đặt" để đặt bàn trước (nhập SĐT sẽ tự động tìm khách)

### 2. Bán hàng (POS)
- Vào menu "POS"
- Click "+ Thêm" trên sản phẩm cần bán
- Điều chỉnh số lượng trong giỏ hàng
- Nhập voucher (nếu có)
- Click "✓ Thanh toán"

### 3. Quản lý khách hàng
- Vào menu "Khách hàng"
- Click "➕ Thêm khách hàng"
- Nhập thông tin và chọn hạng
- Dùng ô tìm kiếm để tìm khách bằng SĐT hoặc tên

### 4. Tạo voucher
- Vào menu "Voucher"
- Click "🎟️ Tạo voucher mới"
- Nhập mã, loại (% hoặc số tiền), giá trị
- Đặt ngày hết hạn (tuỳ chọn)

### 5. Quản lý tồn kho
- Vào menu "Tồn kho"
- Click "⚙️ Điều chỉnh" để nhập/xuất kho
- Nhập số âm để giảm, số dương để tăng
- Sử dụng filter để lọc theo trạng thái

## 🔒 Bảo mật

- CSRF protection trên tất cả POST requests
- Session-based authentication
- Password hashing với bcrypt
- Helmet.js security headers
- SQL injection prevention với prepared statements

## 📝 Notes

- Database tự động tạo khi khởi động lần đầu
- Có sẵn dữ liệu mẫu (12 bàn, sản phẩm, khách hàng, voucher...)
- Dark mode mặc định
- Tất cả số tiền hiển thị theo định dạng Việt Nam

## 🐛 Troubleshooting

### Port 8080 đã được sử dụng
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Database bị lỗi
Xoá file `data/app.db` và khởi động lại server để tạo database mới

### Không thấy thay đổi UI
- Hard refresh: `Ctrl + Shift + R`
- Hoặc sử dụng Incognito mode

## 👨‍💻 Developer

Phát triển bởi AI Assistant với yêu cầu từ người dùng.

---

**Chúc bạn sử dụng hệ thống hiệu quả! 🎉**
