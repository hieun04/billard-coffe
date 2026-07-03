# PlantUML Diagrams - Billiard Cafe AI System
# Copy and paste vào: https://www.plantuml.com/plantuml/uml/

# ==========================================
# 1. ARCHITECTURE DIAGRAM (PlantUML)
# ==========================================

@startuml Architecture
!include <cloud/aws>
!include <cloud/aws/storage/S3>
!include <cloud/aws/compute/EC2>

skinparam componentStyle uml2

package "Client Layer" {
  [Web Client\nReactJS] as WC
  [Mobile Client\nReact Native] as MC
}

package "Presentation Layer" {
  [Frontend Server\nNginx] as FE
}

package "Application Layer" {
  [API Gateway\nSpring Boot] as API
  [Auth Service] as AUTH
  [AI Service\nOpenAI] as AI
}

package "Business Logic Layer" {
  [Business Process\nManager] as BPM
  [Notification\nService] as NR
  [Report Service] as RS
}

package "Data Access Layer" {
  [Data Access\nObjects] as DAO
  [Repositories] as REPO
  [Redis Cache] as CACHE
}

database "Database Layer" {
  [(MySQL\nPrimary)] as MYSQL
  [(Redis\nCache)] as REDIS
  [Object Storage\nS3] as S3
}

cloud "External Services" {
  [OpenAI API\nGPT-4] as OPENAI
  [SMS Gateway] as SMS
  [Email Service] as EMAIL
  [Payment Gateway] as PAYMENT
}

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

@enduml

# ==========================================
# 2. USE CASE DIAGRAM (PlantUML)
# ==========================================

@startuml UseCase
left to right direction

skinparam packageStyle rectangle

actor "Quản trị viên" as ADMIN
actor "Nhân viên" as STAFF
actor "Khách hàng" as CUSTOMER
actor "AI Chatbot" as AI_BOT
actor "AI Recommender" as AI_REC

package "Quản lý Bàn" {
  usecase "Đặt bàn" as UC1
  usecase "Check-in bàn" as UC2
  usecase "Check-out bàn" as UC3
  usecase "Xem bàn trống" as UC4
  usecase "Cập nhật bàn" as UC5
}

package "Quản lý Khách hàng" {
  usecase "Đăng ký KH" as UC6
  usecase "Tra cứu KH" as UC7
  usecase "Tích điểm" as UC8
  usecase "Xem lịch sử" as UC9
}

package "Gọi món & Thanh toán" {
  usecase "Gọi món" as UC10
  usecase "Thanh toán" as UC11
  usecase "Xuất hóa đơn" as UC12
  usecase "Áp dụng KM" as UC13
}

package "Menu" {
  usecase "Thêm món" as UC14
  usecase "Sửa món" as UC15
  usecase "Xóa món" as UC16
  usecase "Xem menu" as UC17
}

package "AI Services" {
  usecase "Chat tư vấn" as UC21
  usecase "Gợi ý bàn" as UC22
  usecase "Gợi ý món" as UC23
  usecase "Kiểm tra bàn" as UC24
}

package "Báo cáo" {
  usecase "Báo cáo doanh thu" as UC18
  usecase "Dashboard" as UC19
  usecase "Xuất báo cáo" as UC20
}

package "Nhân viên" {
  usecase "Thêm nhân viên" as UC25
  usecase "Phân ca" as UC26
  usecase "Chấm công" as UC27
}

ADMIN --> UC1
ADMIN --> UC2
ADMIN --> UC3
ADMIN --> UC4
ADMIN --> UC5
ADMIN --> UC6
ADMIN --> UC7
ADMIN --> UC8
ADMIN --> UC9
ADMIN --> UC10
ADMIN --> UC11
ADMIN --> UC12
ADMIN --> UC13
ADMIN --> UC14
ADMIN --> UC15
ADMIN --> UC16
ADMIN --> UC17
ADMIN --> UC18
ADMIN --> UC19
ADMIN --> UC20
ADMIN --> UC25
ADMIN --> UC26
ADMIN --> UC27

STAFF --> UC1
STAFF --> UC2
STAFF --> UC3
STAFF --> UC4
STAFF --> UC10
STAFF --> UC11
STAFF --> UC12
STAFF --> UC13
STAFF --> UC6
STAFF --> UC7
STAFF --> UC27

CUSTOMER --> UC1
CUSTOMER --> UC4
CUSTOMER --> UC24
CUSTOMER --> UC21
CUSTOMER --> UC23
CUSTOMER --> UC9

AI_BOT --> UC21
AI_BOT --> UC24
AI_REC --> UC22
AI_REC --> UC23

@enduml

# ==========================================
# 3. CLASS DIAGRAM (PlantUML)
# ==========================================

@startuml ClassDiagram
skinparam classAttributeIconSize 0

abstract class User {
  {abstract} +Long id
  {abstract} +String username
  {abstract} +String email
  {abstract} +String phone
  {abstract} +String role
  {abstract} +authenticate()
  {abstract} +updateProfile()
}

class Admin {
  +String employeeId
  +BigDecimal salary
  +manageStaff()
  +manageMenu()
  +viewReports()
  +manageSettings()
}

class Staff {
  +String employeeId
  +String position
  +BigDecimal salary
  +checkInTable()
  +checkOutTable()
  +createOrder()
  +processPayment()
}

class Customer {
  +String name
  +String phone
  +Integer points
  +String tier
  +LocalDateTime lastVisit
  +makeReservation()
  +viewHistory()
  +redeemPoints()
}

class Table {
  +Long id
  +String tableNumber
  +String name
  +TableType type
  +TableStatus status
  +BigDecimal ratePerHour
  +String description
  +Integer capacity
  +checkAvailability()
  +startSession()
  +endSession()
}

class TableSession {
  +Long id
  +LocalDateTime startTime
  +LocalDateTime endTime
  +Integer durationMinutes
  +BigDecimal tableFee
  +calculateFee()
  +endSession()
}

class Category {
  +Long id
  +String name
  +String description
  +Integer sortOrder
}

class Product {
  +Long id
  +String name
  +String description
  +BigDecimal price
  +String imageUrl
  +Integer stock
  +updateStock()
}

class Order {
  +Long id
  +BigDecimal subtotal
  +BigDecimal discount
  +BigDecimal total
  +OrderStatus status
  +PaymentMethod paymentMethod
  +LocalDateTime createdAt
  +addItem()
  +removeItem()
  +applyDiscount()
  +calculateTotal()
  +complete()
}

class OrderItem {
  +Long id
  +Integer quantity
  +BigDecimal unitPrice
  +BigDecimal lineTotal
  +updateQuantity()
}

class Reservation {
  +Long id
  +LocalDateTime reservationTime
  +Integer numberOfGuests
  +ReservationStatus status
  +String notes
  +confirm()
  +cancel()
  +checkIn()
}

class Voucher {
  +Long id
  +String code
  +VoucherType type
  +BigDecimal discountValue
  +BigDecimal minOrderAmount
  +LocalDateTime validFrom
  +LocalDateTime validTo
  +Integer usageLimit
  +Integer usedCount
  +isValid()
  +applyDiscount()
}

class Payment {
  +Long id
  +BigDecimal amount
  +PaymentMethod method
  +PaymentStatus status
  +String transactionId
  +LocalDateTime paidAt
}

class AIConversation {
  +Long id
  +String sessionId
  +String userMessage
  +String aiResponse
  +String intent
  +LocalDateTime createdAt
}

class BusinessSettings {
  +Long id
  +String businessName
  +String address
  +String phone
  +String openTime
  +String closeTime
  +BigDecimal defaultTableRate
}

' Relationships
User <|-- Admin
User <|-- Staff
User <|-- Customer

Table "1" --> "0..*" TableSession : has
Table "1" --> "0..*" Reservation : reserved

Customer "1" --> "0..*" Reservation : makes
Customer "1" --> "0..*" Order : places
Customer "1" --> "0..*" AIConversation : has

TableSession "1" --> "0..1" Order : generates
TableSession "1" --> "0..*" OrderItem : contains
TableSession "1" --> "0..1" Customer : for
TableSession "1" --> "0..1" Staff : served_by

Staff "1" --> "0..*" TableSession : serves

Order "1" --> "0..*" OrderItem : contains
Order "1" --> "0..1" Payment : has
Order "1" --> "0..1" Voucher : uses

OrderItem "1" --> "1" Product : includes

Category "1" --> "0..*" Product : contains

@enduml

# ==========================================
# 4. SEQUENCE DIAGRAM - Đặt bàn (PlantUML)
# ==========================================

@startuml SequenceReserve
skinparam backgroundColor #FEFEFE
autonumber

actor "Khách hàng" as KH
participant "Frontend" as FE
participant "API Gateway" as API
participant "Reservation\nService" as RS
participant "Table\nService" as TS
participant "AI\nService" as AI
database "Database" as DB

KH -> FE : Chọn đặt bàn
FE -> API : GET /tables/available?date=...&time=...
API -> TS : getAvailableTables()
TS -> DB : SELECT * FROM tables WHERE status='available'
DB --> TS : List<Table>
TS --> API : List<Table>
API --> FE : availableTables
FE --> KH : Hiển thị bàn trống

KH -> FE : Chọn bàn và xác nhận
FE -> API : POST /reservations\n{message, tableId, ...}
API -> RS : createReservation()
RS -> DB : INSERT reservation
RS -> AI : getAIRecommendation()
AI -> DB : Lấy context
AI --> RS : recommendation
RS -> DB : UPDATE table SET status='reserved'
DB --> RS : updated
RS --> API : ReservationDTO
API --> FE : 201 Created
FE --> KH : Thông báo thành công

@enduml

# ==========================================
# 5. SEQUENCE DIAGRAM - AI Chatbot (PlantUML)
# ==========================================

@startuml SequenceChat
skinparam backgroundColor #FEFEFE
autonumber

actor "Khách hàng" as KH
participant "Frontend" as FE
participant "API Gateway" as API
participant "Chat\nService" as CS
participant "AI\nService" as AI
database "Database" as DB
participant "OpenAI\nAPI" as OA

KH -> FE : Nhắn tin hỏi chatbot
FE -> API : POST /ai/chat\n{message: "..."}
API -> CS : processMessage()
CS -> DB : Lấy business context\n(quán, bàn, giá, menu)
DB --> CS : BusinessContext

CS -> AI : analyzeAndRespond()
AI -> OA : Gọi GPT-4 với prompt
OA --> AI : AI Response

AI --> CS : FormattedResponse
CS --> API : ChatResponse
API --> FE : ResponseData
FE --> KH : Hiển thị tin nhắn AI

@enduml

# ==========================================
# 6. ACTIVITY DIAGRAM - Check-in/out (PlantUML)
# ==========================================

@startuml ActivityCheckIO
|Phía khách|
start
:Mở ứng dụng;
:Màn hình chính;
|Phía hệ thống|
:Sẵn sàng;
|Phía khách|
if (Có đặt bàn trước?) then (Có)
  :Xác nhận thông tin đặt bàn;
else (Không)
  :Chọn bàn trống;
  :Nhập số người;
endif

|Phía hệ thống|
:Check-in bàn;
:Bắt đầu đếm giờ;

|Phía khách|
:Bắt đầu chơi;
|Khách muốn gọi món?|

if (Có) then
  :Chọn món từ menu;
  |Phía hệ thống|
  :Tạo order;
  :Cập nhật hóa đơn;
  :In order đến bar;
endif

|Khách muốn thêm món?|
while (Có) is (Có)
  :Chọn thêm món;
  |Phía hệ thống|
  :Cập nhật hóa đơn;
  :In order đến bar;
endwhile (Không)

|Khách muốn kết thúc?|
if (Có) then (Có)
  |Phía hệ thống|
  :Kết thúc đếm giờ;
  :Tính tiền thuê bàn;
  :Tính tiền đồ đã gọi;
  
  if (Có voucher?) then (Có)
    :Áp dụng khuyến mãi;
  endif
  
  :Tính tổng tiền;
  
  |Phía khách|
  :Chọn phương thức thanh toán;
  :Thanh toán;
  
  |Phía hệ thống|
  :Xác nhận thanh toán;
  :Xuất hóa đơn;
  :Cập nhật điểm tích lũy;
  :Bàn chuyển sang available;
  
  stop
else (Không)
  :Tiếp tục chơi;
endif

@enduml

# ==========================================
# 7. COMPONENT DIAGRAM (PlantUML)
# ==========================================

@startuml Component
skinparam componentStyle uml2

package "Frontend" {
  [React Components] as RC
  [Redux Store] as STORE
  [API Client] as API
  [Socket Client] as SOCKET
}

package "Backend Controllers" {
  [AuthController] as AUTH_C
  [TableController] as TABLE_C
  [OrderController] as ORDER_C
  [CustomerController] as CUST_C
  [AIController] as AI_C
  [ReportController] as REP_C
}

package "Backend Services" {
  [AuthService] as AUTH_S
  [TableService] as TABLE_S
  [OrderService] as ORDER_S
  [CustomerService] as CUST_S
  [AIService] as AI_S
  [ReportService] as REP_S
  [NotificationService] as NOTI_S
  [PaymentService] as PAY_S
}

package "Repositories" {
  [UserRepository] as USER_R
  [TableRepository] as TABLE_R
  [OrderRepository] as ORDER_R
  [CustomerRepository] as CUST_R
  [VoucherRepository] as VOUCH_R
}

package "AI Layer" {
  [OpenAI Service] as OPENAI
  [Prompt Builder] as PROMPT
  [Intent Detector] as INTENT
  [Context Manager] as CTX
  [Response Parser] as RESP
}

database "Database" {
  [(MySQL)] as MYSQL
  [(Redis)] as REDIS
}

API --> AUTH_C
API --> TABLE_C
API --> ORDER_C
API --> CUST_C
API --> AI_C

AUTH_C --> AUTH_S
TABLE_C --> TABLE_S
ORDER_C --> ORDER_S
CUST_C --> CUST_S
AI_C --> AI_S

AUTH_S --> USER_R
TABLE_S --> TABLE_R
ORDER_S --> ORDER_R
CUST_S --> CUST_R

AI_S --> OPENAI
AI_S --> PROMPT
AI_S --> INTENT
AI_S --> CTX
AI_S --> RESP

USER_R --> MYSQL
TABLE_R --> MYSQL
ORDER_R --> MYSQL
CUST_R --> MYSQL

STORE --> REDIS
CTX --> REDIS

@enduml

# ==========================================
# 8. DEPLOYMENT DIAGRAM (PlantUML)
# ==========================================

@startuml Deployment
skinparam componentStyle uml2

node "Client Devices" {
  artifact "Web Browser" as BROWSER
  artifact "Mobile App" as MOBILE
}

node "Cloud Infrastructure" {
  node "CDN" {
    [CloudFront/CDN] as CDN
  }

  node "Load Balancer" {
    [Nginx/ALB] as LB
  }

  node "Application Tier" {
    node "Frontend Servers" {
      [Frontend Server 1] as FE1
      [Frontend Server 2] as FE2
    }

    node "API Servers" {
      [API Server 1] as API1
      [API Server 2] as API2
    }
  }

  node "AI Tier" {
    [AI Service] as AI_SRV
    [GPU Instance] as GPU
  }

  node "Database Tier" {
    database "MySQL Primary" as DB_P
    database "MySQL Replica" as DB_R
    database "Redis Cluster" as REDIS
  }

  node "Storage" {
    [S3 Bucket] as S3
  }
}

cloud "External Services" {
  [OpenAI API] as OPENAI
  [SMS Gateway] as SMS
  [Payment Gateway] as PAY
}

BROWSER --> CDN
MOBILE --> LB
CDN --> FE1
CDN --> FE2
LB --> FE1
LB --> FE2
FE1 --> API1
FE2 --> API2
API1 --> DB_P
API2 --> DB_P
API1 --> DB_R
API2 --> DB_R
API1 --> REDIS
API2 --> REDIS
API1 --> AI_SRV
API2 --> AI_SRV
AI_SRV --> GPU
AI_SRV --> OPENAI
AI_SRV --> SMS
API1 --> PAY

@enduml

# ==========================================
# 9. STATE DIAGRAM - Table (PlantUML)
# ==========================================

@startuml StateTable
skinparam backgroundColor #FEFEFE

[*] --> Available : Tạo mới

state Available {
  [*] --> idle
  idle --> ready : Chọn bàn
  ready --> idle : Hủy
}

Available --> Reserved : Đặt bàn\n(reserve)
Reserved --> Available : Hủy đặt\n(cancel)
Reserved --> Occupied : Check-in\n(checkIn)

Available --> Occupied : Check-in trực tiếp\n(directCheckIn)

state Occupied {
  [*] --> playing
  playing --> paused : Tạm dừng
  paused --> playing : Tiếp tục
}

Occupied --> Available : Check-out\n(checkOut)
Occupied --> Maintenance : Báo hỏng\n(reportIssue)

state Maintenance {
  [*] --> fixing
  fixing --> [*] : Sửa xong
}

Maintenance --> Available : Sửa xong\n(fixComplete)
Maintenance --> Occupied : Có khách chờ\n(restoreWithWait)

note right of Available
  Bàn trống, có thể đặt
  hoặc check-in trực tiếp
end note

note right of Reserved
  Đã có người đặt,
  chờ check-in
end note

note right of Occupied
  Đang có khách chơi,
  đếm giờ
end note

note right of Maintenance
  Đang bảo trì/sửa chữa
end note

@enduml

# ==========================================
# 10. USE CASE SPEC TEMPLATE (PlantUML)
# ==========================================

@startuml UseCaseSpec
skinparam activity {
  BackgroundColor #LightBlue
  BorderColor #DarkBlue
  FontSize 12
}

|Use Case ID:|UC-001|
|Use Case Name:|Đặt bàn|
|Primary Actor:|Khách hàng|
|Secondary Actor:|Nhân viên|
|Goal:|Cho phép khách đặt trước bàn bida|
|Priority:|High|
|Pre-condition:|Khách có thông tin liên hệ|
|Post-condition:|Bàn được đặt, gửi xác nhận|

|PHYE KHÁCH|
|Cửa hàng|
|Chương trình|
|Khách|

|PHYE KHÁCH|
start
:Chọn ngày giờ;
:Chọn số người;
:Kiểm tra bàn trống;
|Bàn trống?;
if (Có) then (Có)
  :Chọn bàn;
  :Xác nhận đặt bàn;
  |Cửa hàng|
  :Lưu reservation;
  :Gửi xác nhận SMS;
  :Cập nhật bàn = reserved;
  stop
else (Không)
  :Gợi ý thời gian khác;
endif

@enduml

# ==========================================
# CÁCH SỬ DỤNG PLANTUML
# ==========================================

Hướng dẫn sử dụng:

1. **Online PlantUML Viewer**: https://www.plantuml.com/plantuml/uml/
   - Paste code vào textarea
   - View rendered diagram

2. **VS Code Extension**:
   - Cài "PlantUML" extension
   - Preview trong markdown file

3. **IntelliJ IDEA**:
   - Cài PlantUML plugin
   - Right-click > Preview

4. **Command Line**:
   - Cài Java và Graphviz
   - java -jar plantuml.jar diagram.puml
   - Output: diagram.png

5. **draw.io**:
   - Insert > Advanced > PlantUML
   - Paste code
