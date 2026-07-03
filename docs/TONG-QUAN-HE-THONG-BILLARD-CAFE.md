# TỔNG QUAN HỆ THỐNG ỨNG DỤNG QUẢN LÝ BILLARD CAFE

## 1. Giới thiệu đề tài

### 1.1. Tên đề tài
**Xây dựng hệ thống quản lý quán Billiard Cafe**

### 1.2. Bối cảnh và lý do chọn đề tài
Trong mô hình kinh doanh quán billiard kết hợp cafe, chủ quán cần quản lý đồng thời nhiều nghiệp vụ như:
- quản lý bàn chơi và thời gian sử dụng bàn,
- bán hàng đồ uống, đồ ăn kèm,
- quản lý đơn hàng và thanh toán,
- quản lý khách hàng thân thiết,
- quản lý đặt bàn trước,
- quản lý nhân viên và ca làm việc,
- quản lý hàng tồn kho,
- theo dõi báo cáo doanh thu.

Nếu các nghiệp vụ trên được xử lý thủ công bằng sổ sách hoặc các công cụ rời rạc, quá trình vận hành sẽ dễ phát sinh sai sót, tốn thời gian và khó tổng hợp dữ liệu. Vì vậy, việc xây dựng một hệ thống quản lý tập trung là cần thiết để nâng cao hiệu quả quản lý, tối ưu vận hành và hỗ trợ ra quyết định.

### 1.3. Mục tiêu của hệ thống
Hệ thống được xây dựng nhằm đạt các mục tiêu sau:
- Tin học hóa quy trình quản lý quán billiard cafe.
- Quản lý trạng thái bàn chơi theo thời gian thực.
- Hỗ trợ bán hàng nhanh tại quầy và gắn đơn hàng với bàn.
- Quản lý sản phẩm, khách hàng, voucher, hàng tồn kho.
- Theo dõi doanh thu, đơn hàng, sản phẩm bán chạy.
- Hỗ trợ quản lý nhân viên, ca làm việc và phân quyền tài khoản.
- Tạo nền tảng để mở rộng thêm các tính năng thông minh trong tương lai.

---

## 2. Tổng quan về ứng dụng

### 2.1. Mô tả chung
Ứng dụng là một **hệ thống quản lý quán billiard cafe chạy trên nền web**, cho phép người quản lý và nhân viên thao tác thông qua giao diện trình duyệt. Hệ thống bao gồm frontend để hiển thị giao diện người dùng, backend để xử lý nghiệp vụ và cơ sở dữ liệu để lưu trữ thông tin.

Ứng dụng hỗ trợ các nhóm người dùng chính:
- **Quản trị viên (Admin)**: quản lý toàn bộ hệ thống.
- **Nhân viên (Staff)**: thao tác nghiệp vụ thường ngày như bàn chơi, đặt bàn, chấm công.
- **Thu ngân / người bán hàng**: thực hiện bán hàng, tạo đơn và thanh toán.

### 2.2. Phạm vi chức năng của ứng dụng
Hệ thống hiện tại bao gồm các phân hệ chính:
- Đăng nhập và xác thực người dùng.
- Dashboard thống kê tổng quan.
- Quản lý bàn billiard.
- Bán hàng/POS.
- Quản lý thực đơn.
- Quản lý khách hàng.
- Quản lý đặt bàn.
- Quản lý đơn hàng.
- Quản lý nhân viên và ca làm việc.
- Quản lý kho và nhập hàng.
- Quản lý voucher.
- Quản lý thông báo.
- Báo cáo doanh thu.
- Cài đặt hệ thống.
- Hỗ trợ AI insight/chat ở mức tích hợp API.

### 2.3. Đối tượng sử dụng
- Chủ quán hoặc quản lý quán billiard cafe.
- Nhân viên phục vụ.
- Thu ngân.
- Người quản trị hệ thống.

---

## 3. Công nghệ được sử dụng trong ứng dụng

## 3.1. Công nghệ frontend
Frontend được xây dựng theo mô hình SPA (Single Page Application), giúp trải nghiệm người dùng mượt hơn và không cần tải lại toàn bộ trang khi chuyển màn hình.

Các công nghệ chính:
- **React**: xây dựng giao diện người dùng theo component.
- **Vite**: công cụ build và chạy môi trường phát triển nhanh.
- **React Router DOM**: điều hướng giữa các trang trong ứng dụng.
- **Tailwind CSS**: xây dựng giao diện nhanh, hiện đại, responsive.
- **Framer Motion**: tạo hiệu ứng chuyển động mượt mà.
- **Lucide React**: bộ icon cho giao diện.
- **Sonner**: hiển thị thông báo toast.
- **Context API**: quản lý trạng thái dùng chung như xác thực, theme, toast.

### 3.2. Công nghệ backend
Backend được xây dựng theo kiến trúc RESTful API, chịu trách nhiệm xử lý logic nghiệp vụ, xác thực, kiểm tra dữ liệu đầu vào và làm việc với cơ sở dữ liệu.

Các công nghệ chính:
- **Node.js**: môi trường chạy JavaScript phía server.
- **Express.js**: framework xây dựng API.
- **JWT (jsonwebtoken)**: xác thực và phân quyền người dùng.
- **bcryptjs**: mã hóa mật khẩu.
- **express-rate-limit**: giới hạn tần suất request để tăng an toàn.
- **helmet**: tăng cường bảo mật HTTP header.
- **cors**: cấu hình truy cập giữa frontend và backend.
- **cookie-parser**: hỗ trợ xử lý cookie.
- **dotenv**: quản lý biến môi trường.

### 3.3. Công nghệ cơ sở dữ liệu
- **SQLite**: hệ quản trị cơ sở dữ liệu nhẹ, dễ triển khai, phù hợp với đồ án và hệ thống vừa/nhỏ.
- **better-sqlite3**: thư viện kết nối và thao tác SQLite hiệu năng tốt, đơn giản.

### 3.4. Các kỹ thuật và thành phần hỗ trợ
- **Phân quyền theo vai trò**: admin và staff.
- **Realtime polling**: tự động làm mới trạng thái bàn theo chu kỳ.
- **Lazy loading**: tải trang theo nhu cầu để tối ưu tốc độ.
- **Validation middleware**: kiểm tra dữ liệu đầu vào cho các API.
- **Backup dữ liệu**: lưu bản sao dữ liệu dưới dạng file JSON.
- **Giao diện dark mode / light mode**: nâng cao trải nghiệm người dùng.

---

## 4. Kiến trúc tổng thể hệ thống

### 4.1. Mô hình kiến trúc
Hệ thống được thiết kế theo mô hình **3 lớp**:

1. **Lớp giao diện (Presentation Layer)**
   - Là frontend React.
   - Hiển thị dữ liệu, tiếp nhận thao tác người dùng.
   - Gửi request đến backend qua HTTP API.

2. **Lớp xử lý nghiệp vụ (Business Logic Layer)**
   - Là backend Node.js + Express.
   - Tiếp nhận request, xác thực token, kiểm tra quyền.
   - Xử lý logic nghiệp vụ như mở bàn, tính tiền, đặt bàn, nhập kho.

3. **Lớp dữ liệu (Data Layer)**
   - Là cơ sở dữ liệu SQLite.
   - Lưu toàn bộ dữ liệu của hệ thống.

### 4.2. Kiến trúc triển khai
Luồng giao tiếp tổng quát:
- Người dùng thao tác trên trình duyệt.
- Frontend gửi request đến backend qua API.
- Backend xử lý và truy vấn cơ sở dữ liệu.
- Kết quả được trả về frontend để hiển thị.

### 4.3. Cấu trúc thành phần chính
- **Frontend**: Dashboard, Tables, POS, Menu, Customers, Bookings, Orders, Staff, Inventory, Reports, Settings, Notifications, Vouchers.
- **Backend API**: auth, tables, orders, products, customers, bookings, staff, inventory, reports, settings, vouchers, notifications, ai.
- **Database**: users, tables, products, categories, orders, order_items, customers, bookings, vouchers, suppliers, purchases, purchase_items, staff_shifts, notifications, settings.

---

## 5. Luồng hoạt động tổng quát của hệ thống

## 5.1. Luồng đăng nhập
1. Người dùng nhập tên đăng nhập và mật khẩu.
2. Frontend gửi thông tin đến API đăng nhập.
3. Backend kiểm tra tài khoản trong bảng `users`.
4. Mật khẩu được so sánh bằng `bcryptjs`.
5. Nếu hợp lệ, hệ thống tạo `JWT token`.
6. Token được lưu phía client để dùng cho các request tiếp theo.
7. Người dùng được chuyển đến giao diện chính của hệ thống.

### 5.2. Luồng sử dụng hệ thống sau đăng nhập
1. Người dùng truy cập các phân hệ theo quyền được cấp.
2. Frontend gọi API tương ứng để lấy dữ liệu.
3. Backend kiểm tra token và vai trò người dùng.
4. Dữ liệu được lấy từ SQLite và trả về giao diện.
5. Khi người dùng thêm, sửa, xóa hoặc thực hiện nghiệp vụ, frontend gửi request mới để backend cập nhật dữ liệu.

### 5.3. Luồng quản lý bàn và bán hàng
Một luồng nghiệp vụ điển hình như sau:
1. Nhân viên chọn một bàn còn trống.
2. Hệ thống bắt đầu phiên chơi cho bàn đó.
3. Nhân viên có thể thêm đồ uống/đồ ăn cho bàn hoặc tạo đơn POS.
4. Khi khách kết thúc, hệ thống tính tiền bàn dựa trên thời gian chơi.
5. Hệ thống cộng thêm tiền đồ uống/phụ phí nếu có.
6. Thu ngân xác nhận thanh toán.
7. Trạng thái bàn được chuyển về trống.
8. Dữ liệu đơn hàng, doanh thu và khách hàng được cập nhật vào hệ thống.

### 5.4. Luồng đặt bàn
1. Nhân viên nhập thông tin khách đặt bàn.
2. Chọn bàn, thời gian bắt đầu và kết thúc dự kiến.
3. Hệ thống lưu đặt bàn với trạng thái chờ.
4. Khi khách đến, nhân viên xác nhận hoặc bắt đầu phiên bàn từ booking.
5. Trạng thái booking và bàn được cập nhật.

### 5.5. Luồng nhập kho
1. Quản lý hoặc nhân viên kho nhập thông tin phiếu nhập.
2. Chọn nhà cung cấp và danh sách mặt hàng.
3. Hệ thống tạo phiếu nhập và chi tiết phiếu nhập.
4. Số lượng tồn kho của sản phẩm được cộng thêm tương ứng.

### 5.6. Luồng báo cáo
1. Người quản lý truy cập phân hệ báo cáo.
2. Hệ thống tổng hợp dữ liệu từ đơn hàng, sản phẩm, bàn chơi.
3. Trả về các chỉ số như doanh thu, số đơn, sản phẩm bán chạy, trạng thái bàn.
4. Người quản lý theo dõi số liệu để đưa ra quyết định vận hành.

---

## 6. Phân tích chi tiết từng chức năng

## 6.1. Chức năng đăng nhập và xác thực
### Mục đích
Đảm bảo chỉ người dùng hợp lệ mới truy cập được hệ thống.

### Dữ liệu liên quan
- Bảng `users`

### Mô tả hoạt động
- Người dùng đăng nhập bằng `username` và `password`.
- Hệ thống xác minh thông tin đăng nhập.
- Sinh token phiên đăng nhập có thời hạn.
- Kiểm tra token ở các API cần bảo vệ.
- Hỗ trợ phân biệt quyền `admin` và `staff`.

### Vai trò
- Admin
- Staff

---

## 6.2. Chức năng dashboard tổng quan
### Mục đích
Cung cấp góc nhìn tổng quát về tình hình hoạt động của quán.

### Thông tin hiển thị
- Doanh thu hôm nay.
- Số đơn hàng hôm nay.
- Số khách hàng.
- Tổng giờ hoạt động.
- Biểu đồ doanh thu theo ngày.
- Tỷ lệ trạng thái bàn.
- Sản phẩm bán chạy.
- AI insight hỗ trợ phân tích.

### Giá trị mang lại
- Giúp quản lý nắm bắt nhanh hiệu suất hoạt động.
- Hỗ trợ đánh giá tình hình kinh doanh theo thời gian thực.

---

## 6.3. Chức năng quản lý bàn billiard
### Mục đích
Theo dõi và vận hành trạng thái các bàn chơi trong quán.

### Chức năng chính
- Xem danh sách bàn.
- Xem trạng thái bàn: trống, đang chơi, đặt trước, bảo trì.
- Bắt đầu phiên chơi.
- Kết thúc phiên chơi.
- Đặt bàn / hủy đặt bàn.
- Thêm đồ uống vào bàn.
- Xem trước số tiền thanh toán của bàn.
- Tự động làm mới trạng thái bàn theo chu kỳ.

### Ý nghĩa nghiệp vụ
Đây là phân hệ cốt lõi vì quán billiard cần tính giờ chơi chính xác và biết ngay bàn nào đang được sử dụng.

---

## 6.4. Chức năng bán hàng POS
### Mục đích
Hỗ trợ bán đồ uống, đồ ăn và tạo đơn nhanh tại quầy.

### Chức năng chính
- Hiển thị danh sách sản phẩm.
- Lọc theo nhóm sản phẩm.
- Tìm kiếm sản phẩm.
- Thêm sản phẩm vào giỏ hàng.
- Chọn bàn để gắn đơn hàng hoặc bán lẻ không gắn bàn.
- Cập nhật số lượng sản phẩm trong giỏ.
- Tạo đơn hàng và hoàn tất bán hàng.

### Ý nghĩa nghiệp vụ
Phân hệ này giúp quy trình bán hàng nhanh, trực quan và hạn chế sai sót khi ghi nhận món khách sử dụng.

---

## 6.5. Chức năng quản lý thực đơn
### Mục đích
Quản lý danh sách sản phẩm phục vụ trong quán.

### Chức năng chính
- Xem danh sách sản phẩm.
- Thêm sản phẩm mới.
- Sửa thông tin sản phẩm.
- Xóa sản phẩm.
- Quản lý danh mục sản phẩm.
- Quản lý giá bán, giá nhập, tồn kho, đơn vị tính, hình ảnh.

### Dữ liệu liên quan
- `categories`
- `products`

---

## 6.6. Chức năng quản lý khách hàng
### Mục đích
Lưu trữ thông tin khách hàng và hỗ trợ chăm sóc khách hàng thân thiết.

### Chức năng chính
- Thêm khách hàng.
- Sửa thông tin khách hàng.
- Tìm kiếm khách hàng.
- Xem lịch sử và thông tin tích điểm.
- Cộng điểm thưởng.
- Theo dõi hạng khách hàng.

### Dữ liệu liên quan
- `customers`

### Lợi ích
- Tăng khả năng chăm sóc khách hàng cũ.
- Hỗ trợ các chương trình ưu đãi và loyalty.

---

## 6.7. Chức năng quản lý đặt bàn
### Mục đích
Giúp quán chủ động tiếp nhận và quản lý các lượt đặt trước.

### Chức năng chính
- Tạo booking.
- Xem danh sách booking.
- Xác nhận booking.
- Hủy booking.
- Bắt đầu sử dụng bàn từ booking.

### Dữ liệu liên quan
- `bookings`
- `tables`

### Ý nghĩa nghiệp vụ
Giảm trùng lịch đặt bàn, giúp nhân viên chuẩn bị bàn và phục vụ tốt hơn.

---

## 6.8. Chức năng quản lý đơn hàng
### Mục đích
Quản lý thông tin các giao dịch bán hàng phát sinh trong quán.

### Chức năng chính
- Tạo đơn hàng mới.
- Xem danh sách đơn hàng.
- Xem chi tiết đơn hàng.
- Xem lịch sử đơn hàng.
- Hủy đơn hàng.
- Tính tổng tiền, giảm giá, thuế và phương thức thanh toán.

### Dữ liệu liên quan
- `orders`
- `order_items`

### Vai trò
Là trung tâm ghi nhận doanh thu và kết nối tới các phân hệ khách hàng, báo cáo, thanh toán.

---

## 6.9. Chức năng quản lý nhân viên và ca làm việc
### Mục đích
Hỗ trợ theo dõi nhân sự và thời gian làm việc.

### Chức năng chính
- Xem danh sách nhân viên.
- Xem danh sách ca làm việc.
- Xem ca đang hoạt động.
- Chấm công vào ca.
- Chấm công ra ca.
- Xem thống kê ca làm việc.

### Dữ liệu liên quan
- `users`
- `staff_shifts`

### Ý nghĩa
Giúp quản lý dễ theo dõi nhân sự, lịch sử làm việc và trạng thái hoạt động của nhân viên.

---

## 6.10. Chức năng quản lý kho và nhập hàng
### Mục đích
Kiểm soát số lượng tồn kho và lịch sử nhập hàng.

### Chức năng chính
- Xem tồn kho sản phẩm.
- Điều chỉnh số lượng tồn kho.
- Xem danh sách nhà cung cấp.
- Tạo phiếu nhập hàng.
- Xem lịch sử phiếu nhập.
- Tăng tồn kho khi nhập hàng thành công.

### Dữ liệu liên quan
- `products`
- `suppliers`
- `purchases`
- `purchase_items`

### Ý nghĩa
Hạn chế thiếu hàng, hỗ trợ kiểm kê và tối ưu việc nhập hàng.

---

## 6.11. Chức năng quản lý voucher
### Mục đích
Quản lý các chương trình giảm giá cho khách hàng.

### Chức năng chính
- Tạo voucher.
- Kích hoạt / tắt voucher.
- Xóa voucher.
- Quản lý mã giảm giá, loại giảm giá, giá trị, ngày hết hạn, số lượt sử dụng.

### Dữ liệu liên quan
- `vouchers`

---

## 6.12. Chức năng quản lý thông báo
### Mục đích
Hỗ trợ hiển thị các thông báo vận hành trong hệ thống.

### Chức năng chính
- Xem danh sách thông báo.
- Xem bản xem trước thông báo.
- Tạo thông báo.
- Đánh dấu đã đọc.
- Đánh dấu đã đọc tất cả.
- Xóa thông báo.

### Dữ liệu liên quan
- `notifications`

---

## 6.13. Chức năng báo cáo và thống kê
### Mục đích
Hỗ trợ nhà quản lý theo dõi hiệu quả hoạt động kinh doanh.

### Chức năng chính
- Xem KPI tổng quan.
- Xem doanh thu theo thời gian.
- Xem báo cáo sản phẩm.
- Xem sản phẩm bán chạy.
- Xuất báo cáo.

### Giá trị mang lại
- Đưa ra quyết định nhập hàng.
- Đánh giá hiệu quả bán hàng.
- Theo dõi tăng trưởng kinh doanh.

---

## 6.14. Chức năng cài đặt hệ thống
### Mục đích
Cho phép cấu hình các tham số vận hành của quán.

### Chức năng chính
- Cài đặt thông tin doanh nghiệp/quán.
- Cài đặt giá và chính sách tính phí.
- Cài đặt giờ hoạt động.
- Cài đặt loyalty.
- Quản lý tài khoản người dùng.
- Đổi mật khẩu.
- Sao lưu dữ liệu.

### Dữ liệu liên quan
- `settings`
- `users`

---

## 6.15. Chức năng tìm kiếm toàn cục
### Mục đích
Giúp truy xuất nhanh thông tin từ nhiều phân hệ.

### Chức năng tìm kiếm
- Bàn chơi.
- Sản phẩm.
- Khách hàng.
- Đơn hàng.

### Ý nghĩa
Giảm thời gian thao tác và hỗ trợ nhân viên tra cứu nhanh.

---

## 6.16. Chức năng AI hỗ trợ
### Mục đích
Tăng khả năng phân tích dữ liệu và hỗ trợ người quản lý.

### Chức năng hiện có
- Lấy AI insights từ hệ thống.
- Gửi yêu cầu chat đến API AI.

### Tiềm năng phát triển
- Gợi ý nhập hàng.
- Dự đoán doanh thu.
- Phân tích xu hướng tiêu dùng.
- Hỗ trợ hỏi đáp vận hành.

---

## 7. Cơ sở dữ liệu của hệ thống

### 7.1. Danh sách bảng chính
Hệ thống hiện sử dụng các bảng sau:
- `users`
- `staff_shifts`
- `tables`
- `categories`
- `products`
- `customers`
- `orders`
- `order_items`
- `bookings`
- `vouchers`
- `suppliers`
- `purchases`
- `purchase_items`
- `notifications`
- `settings`

### 7.2. Một số quan hệ dữ liệu chính
- Một danh mục có nhiều sản phẩm.
- Một đơn hàng có nhiều chi tiết đơn hàng.
- Một sản phẩm có thể xuất hiện trong nhiều chi tiết đơn hàng.
- Một nhà cung cấp có nhiều phiếu nhập.
- Một phiếu nhập có nhiều chi tiết nhập.
- Một người dùng có thể có nhiều ca làm việc.
- Một bàn có thể liên quan đến nhiều đơn hàng và nhiều lượt đặt bàn.
- Một khách hàng có thể phát sinh nhiều đơn hàng.

### 7.3. Đặc điểm dữ liệu
- Dữ liệu được lưu trên SQLite nên triển khai đơn giản.
- Có seed dữ liệu ban đầu cho tài khoản, danh mục, sản phẩm, bàn.
- Có hỗ trợ backup dưới dạng file JSON.

---

## 8. Ưu điểm của hệ thống

### 8.1. Về mặt nghiệp vụ
- Bao phủ khá đầy đủ quy trình vận hành của quán billiard cafe.
- Kết hợp được quản lý bàn và bán hàng trong cùng một hệ thống.
- Có hỗ trợ quản lý khách hàng, tồn kho, voucher và báo cáo.

### 8.2. Về mặt kỹ thuật
- Công nghệ hiện đại, dễ triển khai.
- Giao diện web trực quan, dễ sử dụng.
- Tách biệt frontend và backend rõ ràng.
- Có xác thực, phân quyền và validation dữ liệu.
- Dễ mở rộng thêm chức năng sau này.

### 8.3. Về mặt học thuật
- Phù hợp làm đồ án/chuyên đề tốt nghiệp.
- Có đủ nội dung để trình bày về phân tích hệ thống, thiết kế, cơ sở dữ liệu và triển khai phần mềm.
- Có thể kết hợp với các sơ đồ UML, ERD, kiến trúc hệ thống để hoàn thiện báo cáo.

---

## 9. Hạn chế hiện tại và hướng phát triển

### 9.1. Hạn chế hiện tại
- Hệ thống hiện dùng SQLite nên phù hợp hơn với quy mô nhỏ và vừa.
- Chưa có triển khai realtime bằng WebSocket, mới dùng cơ chế tự động làm mới theo chu kỳ ở một số màn hình.
- Chưa tích hợp cổng thanh toán trực tuyến.
- Chưa có ứng dụng mobile riêng.
- AI mới ở mức tích hợp API cơ bản.

### 9.2. Hướng phát triển trong tương lai
- Chuyển sang SQL Server hoặc PostgreSQL khi cần mở rộng quy mô.
- Tích hợp WebSocket để cập nhật bàn và đơn hàng theo thời gian thực.
- Tích hợp mã QR cho bàn chơi và thanh toán.
- Xây dựng ứng dụng mobile cho quản lý hoặc nhân viên.
- Hoàn thiện module AI phân tích kinh doanh.
- Bổ sung nhật ký hoạt động người dùng và thống kê nâng cao.

---

## 10. Kết luận
Hệ thống quản lý Billiard Cafe là một ứng dụng web hỗ trợ quản lý toàn diện hoạt động của quán, từ quản lý bàn chơi, bán hàng, khách hàng, nhân viên, kho hàng đến báo cáo doanh thu. Hệ thống được xây dựng trên nền tảng công nghệ hiện đại gồm React, Node.js, Express và SQLite, đáp ứng tốt nhu cầu của một mô hình quán billiard cafe quy mô vừa và nhỏ.

Về mặt chuyên đề tốt nghiệp, đề tài có tính thực tiễn cao, có đầy đủ yếu tố để trình bày từ khảo sát bài toán, phân tích yêu cầu, thiết kế hệ thống, thiết kế cơ sở dữ liệu đến triển khai ứng dụng thực tế. Đây là nền tảng tốt để phát triển thêm các chức năng nâng cao trong tương lai.

---

## 11. Gợi ý sử dụng tài liệu này trong báo cáo chuyên đề
Bạn có thể dùng file này để làm:
- phần **Giới thiệu đề tài**,
- phần **Tổng quan hệ thống**,
- phần **Công nghệ sử dụng**,
- phần **Phân tích chức năng**,
- phần **Mô tả cơ sở dữ liệu**,
- phần **Đánh giá và hướng phát triển**.

Nếu cần, có thể tách tiếp tài liệu này thành các chương sau:
- **Chương 1: Khảo sát và phát biểu bài toán**
- **Chương 2: Phân tích và thiết kế hệ thống**
- **Chương 3: Thiết kế cơ sở dữ liệu**
- **Chương 4: Xây dựng và cài đặt chương trình**
- **Chương 5: Kiểm thử, đánh giá và hướng phát triển**
