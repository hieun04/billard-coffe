# Mermaid Diagrams - Billiard Cafe AI System
# Copy and paste các diagram vào: https://mermaid.live hoặc draw.io

# ==========================================
# 1. ARCHITECTURE DIAGRAM
# ==========================================

```mermaid
graph TB
    subgraph "Client Layer"
        WC[Web Client - ReactJS]
        MC[Mobile Client - React Native]
    end

    subgraph "Presentation Layer"
        FE[Frontend Server]
    end

    subgraph "Application Layer"
        API[API Gateway - Spring Boot]
        AUTH[Authentication Service]
        AI[AI Service - OpenAI]
    end

    subgraph "Business Logic Layer"
        BPM[Business Process Manager]
        NR[Notification Service]
        RS[Report Service]
    end

    subgraph "Data Access Layer"
        DAO[Data Access Objects]
        REPO[Repositories]
        CACHE[Redis Cache]
    end

    subgraph "Database Layer"
        MYSQL[(MySQL Database)]
        REDIS[(Redis)]
        S3[Object Storage]
    end

    subgraph "External Services"
        OPENAI[OpenAI API]
        SMS[SMS Gateway]
        EMAIL[Email Service]
        PAYMENT[Payment Gateway]
    end

    WC --> FE
    MC --> FE
    FE --> API
    API --> AUTH
    API --> BPM
    API --> AI
    BPM --> NR
    BPM --> RS
    BPM --> DAO
    DAO --> REPO
    REPO --> MYSQL
    REPO --> CACHE
    CACHE --> REDIS
    AI --> OPENAI
    NR --> SMS
    NR --> EMAIL
    BPM --> PAYMENT
```

# ==========================================
# 2. USE CASE DIAGRAM
# ==========================================

```mermaid
graph LR
    subgraph "Actors"
        ADMIN[Quản trị viên]
        STAFF[Nhân viên]
        CUSTOMER[Khách hàng]
        AI_BOT[AI Chatbot]
        AI_REC[AI Recommender]
    end

    subgraph "Quản lý Bàn"
        UC1[Đặt bàn]
        UC2[Check-in bàn]
        UC3[Check-out bàn]
        UC4[Xem bàn trống]
        UC5[Cập nhật bàn]
    end

    subgraph "Quản lý Khách hàng"
        UC6[Đăng ký KH]
        UC7[Tra cứu KH]
        UC8[Tích điểm]
        UC9[Xem lịch sử]
    end

    subgraph "Gọi món & Thanh toán"
        UC10[Gọi món]
        UC11[Thanh toán]
        UC12[Xuất hóa đơn]
        UC13[Áp dụng KM]
    end

    subgraph "Quản lý Menu"
        UC14[Thêm món]
        UC15[Sửa món]
        UC16[Xóa món]
        UC17[Xem menu]
    end

    subgraph "Báo cáo"
        UC18[Báo cáo doanh thu]
        UC19[Dashboard]
        UC20[Xuất báo cáo]
    end

    subgraph "AI Services"
        UC21[Chat tư vấn]
        UC22[Gợi ý bàn]
        UC23[Gợi ý món]
        UC24[Kiểm tra bàn trống]
    end

    subgraph "Nhân viên"
        UC25[Thêm nhân viên]
        UC26[Phân ca]
        UC27[Chấm công]
    end

    ADMIN --> UC1 & UC2 & UC3 & UC4 & UC5 & UC6 & UC7 & UC8 & UC9 & UC10 & UC11 & UC12 & UC13 & UC14 & UC15 & UC16 & UC17 & UC18 & UC19 & UC20 & UC25 & UC26 & UC27
    STAFF --> UC1 & UC2 & UC3 & UC4 & UC10 & UC11 & UC12 & UC13 & UC6 & UC7 & UC27
    CUSTOMER --> UC1 & UC4 & UC24 & UC21 & UC23 & UC9
    AI_BOT --> UC21 & UC24
    AI_REC --> UC22 & UC23
```

# ==========================================
# 3. ACTIVITY DIAGRAM - Quy trình Check-in/Check-out
# ==========================================

```mermaid
flowchart TD
    A([Bắt đầu]) --> B{Hiện có<br/>đặt bàn trước?}
    B -->|Có| C[Xác nhận<br/>thông tin KH]
    B -->|Không| D[Hỏi số người<br/>và nhu cầu]
    
    C --> E[Check-in bàn]
    D --> E
    
    E --> F[Bắt đầu<br/>đếm giờ]
    
    F --> G{Khách muốn<br/>gọi món?}
    G -->|Có| H[Chọn món<br/>từ menu]
    H --> I[Cập nhật<br/>hóa đơn]
    I --> J[Nhân viên<br/>bar/bếp nhận]
    J --> G
    G -->|Không| K{Khách muốn<br/>thêm món?}
    K -->|Có| H
    K -->|Không| L{Khách muốn<br/>kết thúc?}
    L -->|Chưa| M[Tiếp tục chơi]
    M --> G
    L -->|Có| N[Kết thúc đếm giờ]
    
    N --> O[Tính tiền<br/>thuê bàn]
    O --> P[Tính tiền<br/>đồ đã gọi]
    P --> Q{Có voucher?}
    Q -->|Có| R[Áp dụng<br/>khuyến mãi]
    Q -->|Không| S[Tính tổng]
    R --> S
    
    S --> T[Xác nhận<br/>thanh toán]
    T --> U{Tình trạng<br/>thanh toán?}
    U -->|Thành công| V[Xuất hóa đơn]
    U -->|Thất bại| W[Báo lỗi]
    W --> T
    
    V --> X[Cập nhật<br/>điểm tích lũy]
    X --> Y[Bàn available]
    Y --> Z([Kết thúc])
```

# ==========================================
# 4. SEQUENCE DIAGRAM - Đặt bàn với AI
# ==========================================

```mermaid
sequenceDiagram
    participant KH as Khách hàng
    participant FE as Frontend
    participant API as API Gateway
    participant RS as Reservation Service
    participant TS as Table Service
    participant AI as AI Service
    participant DB as Database

    KH->>FE: Chọn đặt bàn
    FE->>API: GET /tables/available
    API->>TS: Lấy bàn trống
    TS->>DB: SELECT available tables
    DB-->>TS: Danh sách bàn
    TS-->>API: Bàn trống
    API-->>FE: Trả về danh sách
    FE-->>KH: Hiển thị bàn trống

    KH->>FE: Chọn bàn và xác nhận
    FE->>API: POST /reservations
    API->>RS: Tạo reservation
    RS->>DB: INSERT reservation
    RS->>AI: Gửi thông tin đặt bàn
    AI-->>RS: Xác nhận
    RS->>DB: UPDATE table status = 'reserved'
    DB-->>RS: Cập nhật thành công
    RS-->>API: Reservation tạo
    API-->>FE: 201 Created
    FE-->>KH: Hiển thị thành công
```

# ==========================================
# 5. SEQUENCE DIAGRAM - AI Chatbot
# ==========================================

```mermaid
sequenceDiagram
    participant KH as Khách hàng
    participant FE as Frontend
    participant API as API Gateway
    participant CS as Chat Service
    participant AI as AI Service
    participant DB as Database

    KH->>FE: Nhắn tin hỏi chatbot
    FE->>API: POST /ai/chat
    API->>CS: Process message
    CS->>DB: Lấy business context
    DB-->>CS: Thông tin quán
    CS->>AI: Gửi message + context
    AI->>AI: Phân tích intent
    AI->>AI: Truy vấn data
    AI->>AI: Tạo response
    AI-->>CS: Response
    CS-->>API: Chat response
    API-->>FE: Response data
    FE-->>KH: Hiển thị tin nhắn AI
```

# ==========================================
# 6. CLASS DIAGRAM
# ==========================================

```mermaid
classDiagram
    class User {
        <<abstract>>
        +Long id
        +String username
        +String email
        +String phone
        +String role
        +authenticate()
        +updateProfile()
    }

    class Admin {
        +String employeeId
        +manageStaff()
        +manageMenu()
        +viewReports()
    }

    class Staff {
        +String employeeId
        +String position
        +checkInTable()
        +checkOutTable()
        +createOrder()
    }

    class Customer {
        +String name
        +String phone
        +Integer points
        +String tier
        +makeReservation()
        +viewHistory()
    }

    class Table {
        +Long id
        +String tableNumber
        +TableType type
        +TableStatus status
        +BigDecimal ratePerHour
        +checkAvailability()
        +startSession()
    }

    class TableSession {
        +Long id
        +Table table
        +Customer customer
        +LocalDateTime startTime
        +LocalDateTime endTime
        +calculateFee()
    }

    class Product {
        +Long id
        +String name
        +BigDecimal price
        +Category category
    }

    class Order {
        +Long id
        +TableSession session
        +BigDecimal total
        +OrderStatus status
        +addItem()
        +applyDiscount()
    }

    class OrderItem {
        +Long id
        +Product product
        +Integer quantity
        +BigDecimal lineTotal
    }

    class Voucher {
        +Long id
        +String code
        +VoucherType type
        +BigDecimal discountValue
        +isValid()
    }

    class AIConversation {
        +Long id
        +String sessionId
        +String userMessage
        +String aiResponse
    }

    User <|-- Admin
    User <|-- Staff
    User <|-- Customer
    Table "1" --> "0..*" TableSession
    Customer "1" --> "0..*" Order
    TableSession "1" --> "0..1" Order
    Order "1" --> "0..*" OrderItem
    OrderItem "1" --> "1" Product
```

# ==========================================
# 7. ERD DIAGRAM
# ==========================================

```mermaid
erDiagram
    USERS ||--o{ SHIFTS : has
    USERS {
        bigint id PK
        varchar username UK
        varchar password_hash
        varchar email
        varchar phone
        varchar role
        varchar full_name
        boolean is_active
    }

    TABLES ||--o{ TABLE_SESSIONS : has
    TABLES ||--o{ RESERVATIONS : reserved
    TABLES {
        bigint id PK
        varchar table_number UK
        varchar name
        varchar type
        varchar status
        decimal rate_per_hour
        int capacity
    }

    CUSTOMERS ||--o{ RESERVATIONS : makes
    CUSTOMERS ||--o{ ORDERS : places
    CUSTOMERS ||--o{ TABLE_SESSIONS : participates
    CUSTOMERS {
        bigint id PK
        varchar name
        varchar phone UK
        int points
        varchar tier
    }

    TABLE_SESSIONS ||--o| CUSTOMERS : for_customer
    TABLE_SESSIONS ||--o| USERS : assigned_staff
    TABLE_SESSIONS ||--o{ ORDERS : generates
    TABLE_SESSIONS {
        bigint id PK
        bigint table_id FK
        bigint customer_id FK
        datetime start_time
        datetime end_time
        decimal table_fee
        varchar status
    }

    CATEGORIES ||--o{ PRODUCTS : contains
    CATEGORIES {
        bigint id PK
        varchar name
        int sort_order
    }

    PRODUCTS ||--o{ ORDER_ITEMS : included_in
    PRODUCTS {
        bigint id PK
        bigint category_id FK
        varchar name
        decimal price
        int stock
    }

    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o| VOUCHERS : uses
    ORDERS ||--o| PAYMENTS : has
    ORDERS {
        bigint id PK
        bigint customer_id FK
        bigint session_id FK
        decimal total
        varchar status
    }

    ORDER_ITEMS ||--|| PRODUCTS : product
    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK
        bigint product_id FK
        int quantity
        decimal line_total
    }

    VOUCHERS {
        bigint id PK
        varchar code UK
        varchar type
        decimal discount_value
        datetime valid_from
        datetime valid_to
    }

    PAYMENTS ||--|| ORDERS : payment_for
    PAYMENTS {
        bigint id PK
        bigint order_id FK
        decimal amount
        varchar payment_method
        varchar status
    }

    AI_CONVERSATIONS ||--o| CUSTOMERS : customer
    AI_CONVERSATIONS {
        bigint id PK
        varchar session_id
        bigint customer_id FK
        text user_message
        text ai_response
    }
```

# ==========================================
# 8. COMPONENT DIAGRAM
# ==========================================

```mermaid
graph TB
    subgraph "Frontend"
        RC["React Components"]
        STORE["Redux Store"]
        API["API Client"]
    end

    subgraph "Backend"
        subgraph "Controllers"
            AUTH_C["AuthController"]
            TABLE_C["TableController"]
            ORDER_C["OrderController"]
            AI_C["AIController"]
        end

        subgraph "Services"
            AUTH_S["AuthService"]
            TABLE_S["TableService"]
            ORDER_S["OrderService"]
            AI_S["AIService"]
        end

        subgraph "Repositories"
            USER_R["UserRepository"]
            TABLE_R["TableRepository"]
            ORDER_R["OrderRepository"]
        end
    end

    subgraph "AI Layer"
        OPENAI["OpenAI Service"]
        PROMPT["Prompt Builder"]
        INTENT["Intent Detector"]
    end

    subgraph "Database"
        MYSQL["MySQL"]
        REDIS["Redis"]
    end

    API --> AUTH_C
    API --> TABLE_C
    API --> ORDER_C
    API --> AI_C

    AUTH_C --> AUTH_S
    TABLE_C --> TABLE_S
    ORDER_C --> ORDER_S
    AI_C --> AI_S

    AUTH_S --> USER_R
    TABLE_S --> TABLE_R
    ORDER_S --> ORDER_R

    AI_S --> OPENAI
    AI_S --> PROMPT
    AI_S --> INTENT

    USER_R --> MYSQL
    TABLE_R --> MYSQL
    ORDER_R --> MYSQL

    STORE --> REDIS
```

# ==========================================
# 9. DEPLOYMENT DIAGRAM
# ==========================================

```mermaid
graph TB
    subgraph "Client"
        BROWSER[("Web Browser")]
        MOBILE[("Mobile App")]
    end

    subgraph "Cloud Infrastructure"
        subgraph "Application Tier"
            LB[("Load Balancer")]
            FE1[("Frontend 1")]
            FE2[("Frontend 2")]
            API1[("API Server 1")]
            API2[("API Server 2")]
        end

        subgraph "Data Tier"
            DB_PRIMARY[("MySQL Primary")]
            DB_REPLICA[("MySQL Replica")]
            REDIS[("Redis Cache")]
        end

        subgraph "AI Tier"
            AI_SRV[("AI Service")]
            GPU[("GPU Instance")]
        end

        CDN[("CDN")]
        STORAGE[("Object Storage")]
    end

    subgraph "External"
        OPENAI[("OpenAI API")]
        SMS[("SMS Gateway")]
        PAYMENT[("Payment Gateway")]
    end

    BROWSER --> CDN
    MOBILE --> LB
    LB --> FE1
    LB --> FE2
    FE1 --> API1
    FE2 --> API2
    API1 --> DB_PRIMARY
    API2 --> DB_PRIMARY
    API1 --> REDIS
    API2 --> REDIS
    API1 --> AI_SRV
    AI_SRV --> GPU
    AI_SRV --> OPENAI
    AI_SRV --> SMS
    API1 --> PAYMENT
```

# ==========================================
# 10. AI WORKFLOW DIAGRAM
# ==========================================

```mermaid
flowchart TD
    MSG[("User Message")]

    MSG --> INPUT
    INPUT --> CLEAN
    CLEAN --> DETECT

    DETECT -->|table_available| TA
    DETECT -->|price| PI
    DETECT -->|menu| MI
    DETECT -->|recommend| REC
    DETECT -->|general| GEN

    subgraph "Table Available"
        TA[Query Tables]
    end

    subgraph "Price Inquiry"
        PI[Query Pricing]
    end

    subgraph "Menu Inquiry"
        MI[Query Menu]
    end

    subgraph "Recommendation"
        REC[AI Analysis]
        REC --> REC2[Get Context]
        REC2 --> REC3[Generate Suggestion]
    end

    subgraph "General Chat"
        GEN[Call OpenAI]
    end

    TA --> OUT
    PI --> OUT
    MI --> OUT
    REC3 --> OUT
    GEN --> OUT

    OUT[("Response")]

    OUT --> LOG
    LOG[("Log Conversation")]
    LOG --> ANALYTICS[("Analytics")]
```

# ==========================================
# 11. AI RECOMMENDATION DIAGRAM
# ==========================================

```mermaid
flowchart LR
    subgraph "Input"
        HIST[Order History]
        PREF[Preferences]
        CTX[Current Context]
        TREND[Trending]
    end

    subgraph "Analysis"
        PROFILE[Customer Profile]
        SEGMENT[Segment]

        HIST --> PROFILE
        PREF --> PROFILE
        PROFILE --> SEGMENT
    end

    subgraph "Recommendation"
        COLLAB[Collaborative]
        CONTENT[Content-Based]
        HYBRID[Hybrid Model]

        COLLAB --> HYBRID
        CONTENT --> HYBRID
    end

    subgraph "Menu"
        MENU[Menu Database]
        POPULAR[Popularity]

        MENU --> POPULAR
    end

    subgraph "Output"
        REC[Top 5-10]
        EXPLAIN[Explanation]
    end

    HYBRID --> REC
    POPULAR --> REC
    REC --> EXPLAIN
```

# ==========================================
# 12. STATE DIAGRAM - Table Status
# ==========================================

```mermaid
stateDiagram-v2
    [*] --> Available : Tạo mới
    Available --> Reserved : Đặt bàn
    Reserved --> Occupied : Check-in
    Reserved --> Available : Hủy đặt
    Available --> Occupied : Check-in trực tiếp
    Occupied --> Available : Check-out
    Occupied --> Maintenance : Báo hỏng
    Maintenance --> Available : Sửa xong
    Maintenance --> Occupied : Sửa xong<br/>có khách chờ

    note right of Available
        Bàn trống,
        có thể đặt hoặc check-in
    end note

    note right of Reserved
        Đã có người đặt,
        chờ check-in
    end note

    note right of Occupied
        Đang có khách chơi,
        đếm giờ
    end note
```

# ==========================================
# 13. STATE DIAGRAM - Order Status
# ==========================================

```mermaid
stateDiagram-v2
    [*] --> Pending : Tạo order
    Pending --> Confirmed : Xác nhận
    Confirmed --> Paid : Thanh toán
    Confirmed --> Cancelled : Hủy
    Pending --> Cancelled : Hủy
    Paid --> Refunded : Hoàn tiền

    note right of Pending
        Chờ xác nhận
    end note

    note right of Confirmed
        Đang phục vụ,
        có thể thêm món
    end note

    note right of Paid
        Hoàn tất,
        tích điểm
    end note
```

# ==========================================
# CÁCH SỬ DỤNG
# ==========================================

Hướng dẫn sử dụng các diagram:

1. **Mermaid Live Editor**: https://mermaid.live
   - Paste code vào editor bên trái
   - Xem preview bên phải
   - Export as PNG/SVG

2. **draw.io (diagrams.net)**:
   - Insert > Advanced > Mermaid
   - Paste code
   - OK

3. **VS Code**:
   - Cài extension "Mermaid Markdown Syntax Highlighting"
   - Preview Markdown với Mermaid

4. **Lucidchart**:
   - Import > Mermaid
   - Paste code

5. **PlantUML**:
   - Cần cài Java và Graphviz
   - Sử dụng plugin cho IDE
