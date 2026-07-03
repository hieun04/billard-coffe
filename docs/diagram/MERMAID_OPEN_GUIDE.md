# MỞ DIAGRAM TRÊN MERMAID.LIVE

## Hướng dẫn nhanh:

### Bước 1: Truy cập
Mở trình duyệt → Đi đến: **https://mermaid.live**

### Bước 2: Chọn file
Copy nội dung bên dưới và paste vào khung bên trái của https://mermaid.live

---

# USE CASE DIAGRAM

```
flowchart TB
    subgraph "HỆ THỐNG QUẢN LÝ BILLIARD CAFE"

        subgraph "QUẢN LÝ BÀN BIDA"
            UC1["Xem bàn trống"]
            UC2["Đặt bàn trước"]
            UC3["Check-in bàn"]
            UC4["Check-out bàn"]
            UC5["Cập nhật bàn"]
            UC6["Theo dõi thời gian"]
            UC7["Hủy đặt bàn"]
        end

        subgraph "QUẢN LÝ KHÁCH HÀNG"
            UC8["Đăng ký KH"]
            UC9["Tra cứu KH"]
            UC10["Tích điểm"]
            UC11["Đổi điểm"]
            UC12["Xem lịch sử"]
        end

        subgraph "GỌI MÓN & THANH TOÁN"
            UC13["Gọi món"]
            UC14["Cập nhật order"]
            UC15["Thanh toán"]
            UC16["Xuất hóa đơn"]
            UC17["Áp dụng KM"]
            UC18["TT đa phương"]
            UC19["Xem menu"]
            UC20["Quản lý voucher"]
        end

        subgraph "QUẢN LÝ MENU"
            UC21["Thêm món"]
            UC22["Sửa món"]
            UC23["Xóa món"]
            UC24["QL danh mục"]
        end

        subgraph "BÁO CÁO & THỐNG KÊ"
            UC25["Dashboard"]
            UC26["BC doanh thu"]
            UC27["BC tồn kho"]
            UC28["BC nhân viên"]
            UC29["Xuất BC"]
            UC30["Món bán chạy"]
        end

        subgraph "QUẢN LÝ NHÂN VIÊN"
            UC31["Thêm NV"]
            UC32["Phân ca"]
            UC33["Chấm công"]
            UC34["Tính lương"]
        end

        subgraph "AI SERVICES"
            UC35["Chat AI"]
            UC36["Kiểm tra bàn AI"]
            UC37["Gợi ý bàn AI"]
            UC38["Gợi ý món AI"]
            UC39["AI Insights"]
            UC40["AI dự đoán"]
            UC41["AI trả lời"]
        end

        subgraph "CÀI ĐẶT"
            UC42["Cấu hình giá"]
            UC43["Cấu hình giờ"]
            UC44["QL tài khoản"]
            UC45["Sao lưu"]
        end

        UC_LOGIN{{"Đăng nhập"}}
    end

    ADMIN["👤 Quản trị viên"]
    STAFF["👤 Nhân viên"]
    CUSTOMER["👤 Khách hàng"]
    AI_BOT["🤖 AI Chatbot"]

    ADMIN --> UC_LOGIN
    ADMIN --> UC1 & UC2 & UC3 & UC4 & UC5
    ADMIN --> UC8 & UC9 & UC10 & UC11
    ADMIN --> UC13 & UC14 & UC15 & UC16 & UC17 & UC18 & UC19 & UC20
    ADMIN --> UC21 & UC22 & UC23 & UC24
    ADMIN --> UC25 & UC26 & UC27 & UC28 & UC29 & UC30
    ADMIN --> UC31 & UC32 & UC33 & UC34
    ADMIN --> UC35 & UC36 & UC37 & UC38 & UC39 & UC40 & UC41
    ADMIN --> UC42 & UC43 & UC44 & UC45

    STAFF --> UC_LOGIN
    STAFF --> UC1 & UC3 & UC4
    STAFF --> UC8 & UC9
    STAFF --> UC13 & UC14 & UC15 & UC16
    STAFF --> UC33

    CUSTOMER --> UC1 & UC2 & UC6
    CUSTOMER --> UC10 & UC11 & UC12
    CUSTOMER --> UC19
    CUSTOMER --> UC35 & UC36 & UC37 & UC38

    AI_BOT --> UC35 & UC36 & UC41
```

---

# ERD DIAGRAM

```
erDiagram
    users ||--o{ shifts : has
    users ||--o{ table_sessions : serves
    users {
        bigint id PK
        varchar username UK
        varchar password_hash
        varchar email
        varchar role
        varchar full_name
        decimal salary
        boolean is_active
    }

    customers ||--o{ reservations : makes
    customers ||--o{ orders : places
    customers ||--o{ table_sessions : plays
    customers ||--o{ points_transactions : earns
    customers ||--o{ ai_conversations : chats
    customers {
        bigint id PK
        varchar name
        varchar phone UK
        varchar email
        int points
        varchar tier
        datetime last_visit
    }

    tables ||--o{ table_sessions : has
    tables ||--o{ reservations : reserved
    tables {
        bigint id PK
        varchar table_number UK
        varchar name
        varchar type
        varchar status
        decimal rate_per_hour
        int capacity
    }

    table_sessions ||--o| customers : for
    table_sessions ||--o| users : assigned
    table_sessions ||--o{ orders : generates
    table_sessions {
        bigint id PK
        bigint table_id FK
        bigint customer_id FK
        bigint staff_id FK
        datetime start_time
        datetime end_time
        int duration_minutes
        decimal table_fee
        varchar status
    }

    reservations ||--o| customers : by
    reservations ||--o| tables : for
    reservations {
        bigint id PK
        bigint customer_id FK
        bigint table_id FK
        datetime reservation_time
        int number_of_guests
        varchar status
        text notes
    }

    categories ||--o{ products : contains
    categories {
        bigint id PK
        varchar name
        text description
        boolean is_active
    }

    products ||--o{ order_items : included
    products ||--|| categories : belongs
    products {
        bigint id PK
        bigint category_id FK
        varchar name
        decimal price
        int stock
        boolean is_available
    }

    orders ||--o| customers : placed_by
    orders ||--o| table_sessions : belongs_to
    orders ||--o{ order_items : contains
    orders ||--o| vouchers : uses
    orders ||--o| payments : has
    orders ||--o{ points_transactions : for
    orders {
        bigint id PK
        bigint customer_id FK
        bigint session_id FK
        bigint voucher_id FK
        decimal subtotal
        decimal discount_amount
        decimal total
        varchar status
        varchar payment_method
    }

    order_items ||--|| products : product
    order_items ||--|| orders : order
    order_items {
        bigint id PK
        bigint order_id FK
        bigint product_id FK
        int quantity
        decimal unit_price
        decimal line_total
    }

    vouchers {
        bigint id PK
        varchar code UK
        varchar type
        decimal discount_value
        decimal min_order_amount
        datetime valid_from
        datetime valid_to
        int usage_limit
        boolean is_active
    }

    payments ||--|| orders : payment_for
    payments {
        bigint id PK
        bigint order_id FK
        decimal amount
        varchar payment_method
        varchar status
    }

    points_transactions ||--|| customers : customer
    points_transactions {
        bigint id PK
        bigint customer_id FK
        varchar type
        int points
        bigint order_id FK
    }

    ai_conversations ||--o| customers : customer
    ai_conversations {
        bigint id PK
        varchar session_id
        bigint customer_id FK
        text user_message
        text ai_response
        varchar intent
    }

    business_settings {
        bigint id PK
        varchar business_name
        text address
        varchar phone
        time open_time
        time close_time
        decimal default_table_rate
    }
```

---

# CÁCH PASTE VÀO MERMAID.LIVE

1. Mở **https://mermaid.live** trong trình duyệt
2. Click vào khung bên trái (nơi có placeholder code)
3. **Ctrl+A** để chọn tất cả
4. **Ctrl+V** paste code bên trên (phần USE CASE hoặc ERD)
5. Diagram sẽ hiển thị ngay bên phải!

---

# MẸO SỬ DỤNG MERMAID.LIVE

- **Zoom**: Dùng scroll chuột hoặc pinch trên touchpad
- **Di chuyển**: Click và kéo diagram
- **Xuất file**: Click nút "Actions" → "Save" để tải PNG/SVG
- **Chia sẻ**: Click "Actions" → "Share" để lấy link
- **Đổi theme**: Click biểu tượng bánh răng để đổi màu sáng/tối
