# Billiard Cafe - Sơ đồ cho Báo cáo Đồ án

## Giới thiệu

Thư mục này chứa các file `.drawio` để import trực tiếp vào **draw.io** (diagrams.net) cho báo cáo đồ án.

## Cách sử dụng

1. Truy cập [https://app.diagrams.net/](https://app.diagrams.net/) hoặc mở ứng dụng draw.io
2. Click **File** → **Open** → **Device**
3. Chọn file `.drawio` tương ứng
4. Chỉnh sửa nếu cần thiết
5. Export: **File** → **Export as** → chọn định dạng (PNG, SVG, PDF)

## Các file sơ đồ

| File | Mô tả | Nên dùng cho chương |
|------|--------|---------------------|
| `01-ERD-billiard-cafe.drawio` | Entity Relationship Diagram | Phân tích thiết kế CSDL |
| `02-UseCase-billiard-cafe.drawio` | Use Case Diagram | Phân tích yêu cầu |
| `03-ClassDiagram-billiard-cafe.drawio` | Class Diagram | Thiết kế hướng đối tượng |
| `04-ActivityFlow-billiard-cafe.drawio` | Activity/Flowchart Diagram | Quy trình nghiệp vụ |
| `05-SystemArchitecture-billiard-cafe.drawio` | System Architecture | Tổng quan hệ thống |
| `06-SequenceDiagram-checkout-flow.drawio` | Sequence Diagram | Mô tả tương tác |

## Tóm tắt nội dung mỗi sơ đồ

### 1. ERD (Entity Relationship Diagram)
- 15 bảng trong hệ thống
- Các mối quan hệ giữa các bảng (1:N, FK)
- Các trường và kiểu dữ liệu

### 2. Use Case Diagram
- 3 Actor: Admin, Staff, Customer
- 15 Use Case chính:
  - UC1: Đăng nhập
  - UC2: Xem Dashboard
  - UC3: Quản lý bàn
  - UC4: Bán hàng POS
  - UC5: Quản lý Menu
  - UC6: Quản lý Khách hàng
  - UC7: Quản lý Voucher
  - UC8: Quản lý Tồn kho
  - UC9: Quản lý Nhập hàng
  - UC10: Quản lý Nhân viên
  - UC11: Đặt bàn
  - UC12: Xuất Báo cáo
  - UC13: Quản lý Thông báo
  - UC14: Cài đặt Hệ thống
  - UC15: Quản lý Tài khoản

### 3. Class Diagram
- 11 class chính
- Thuộc tính và phương thức của mỗi class
- Quan hệ giữa các class

### 4. Activity Diagram (Quy trình bán hàng)
- Quy trình đăng nhập
- Quy trình quản lý bàn
- Quy trình POS/bán hàng
- Thanh toán và xuất hóa đơn
- Cập nhật điểm tích lũy

### 5. System Architecture
- 3 Layer: Client, API, Database
- Security & Authentication
- Utilities & Helpers
- System Modules (12 modules)

### 6. Sequence Diagram (Thanh toán)
- Tương tác giữa Staff → Browser → Server → Routes → Database
- Các bước trong quy trình checkout

## Mẹo chỉnh sửa

- **Di chuyển**: Click và kéo
- **Zoom**: Ctrl + scroll
- **Chọn nhiều**: Ctrl + click
- **Copy/Paste**: Ctrl + C / Ctrl + V
- **Undo/Redo**: Ctrl + Z / Ctrl + Y
- **Thêm text**: Kéo thả shape "Text" từ panel bên trái

## Màu sắc trong sơ đồ

| Màu | Ý nghĩa |
|-----|---------|
| Xanh dương (#4472C4) | Tables trong ERD, Client/Frontend |
| Xanh lá (#388E3C)) | Tables (bàn billiard), Process chính |
| Cam (#E65100) | Orders, Backend/Server |
| Tím (#7B1FA2) | Products, Database |
| Vàng (#FFF9C4) | Decision diamonds (quyết định) |
