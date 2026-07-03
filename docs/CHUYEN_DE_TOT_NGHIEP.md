# HỆ THỐNG QUẢN LÝ BIDA-CAFE TÍCH HỢP AI TƯ VẤN ĐẶT BÀN

**Chuyên đề tốt nghiệp**  
**Ngành:** Công nghệ thông tin  
**GVHD:** [Tên giảng viên hướng dẫn]  
**Sinh viên:** [Họ và tên] — [MSSV]  
**Thời gian thực hiện:** Học kỳ 2, năm học 2025 – 2026

---

# MỤC LỤC

**CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI**
1.1. Bối cảnh thực tế  
1.2. Tính cấp thiết của đề tài  
1.3. Mục tiêu nghiên cứu  
1.4. Phạm vi nghiên cứu  
1.5. Đối tượng và phương pháp nghiên cứu  

**CHƯƠNG 2. CƠ SỞ LÝ LUẬN VÀ CÔNG NGHỆ**
2.1. Tổng quan về hệ thống quản lý quán giải trí  
2.2. Các mô hình phát triển phần mềm  
2.3. Công nghệ và ngôn ngữ lập trình  
2.4. Công nghệ AI và tích hợp LLM  
2.5. Các chuẩn thiết kế hệ thống  
2.6. Cơ sở dữ liệu và hệ quản trị CSDL  

**CHƯƠNG 3. PHÂN TÍCH YÊU CẦU HỆ THỐNG**
3.1. Khảo sát thực tế nghiệp vụ  
3.2. Phân tích tác nghiệp  
3.3. Phân tích yêu cầu chức năng  
3.4. Phân tích yêu cầu phi chức năng  
3.5. Xác định Actor và Use Case tổng quát  

**CHƯƠNG 4. THIẾT KẾ HỆ THỐNG**
4.1. Kiến trúc tổng thể hệ thống  
4.2. Thiết kế cơ sở dữ liệu  
4.3. Thiết kế Use Case chi tiết  
4.4. Thiết kế Activity Diagram  
4.5. Thiết kế Sequence Diagram  
4.6. Thiết kế Class Diagram  
4.7. Thiết kế Component Diagram  
4.8. Thiết kế Deployment Diagram  
4.9. Thiết kế giao diện người dùng  
4.10. Thiết kế bảo mật hệ thống  

**CHƯƠNG 5. TRIỂN KHAI VÀ KẾT QUẢ**
5.1. Môi trường phát triển và công cụ  
5.2. Cấu trúc thư mục dự án  
5.3. Triển khai backend  
5.4. Triển khai frontend  
5.5. Tích hợp AI Assistant  
5.6. Công thức nghiệp vụ chính  
5.7. Kết quả đạt được  

**CHƯƠNG 6. ĐÁNH GIÁ, HẠN CHẾ VÀ HƯỚNG PHÁT TRIỂN**
6.1. Đánh giá hệ thống  
6.2. So sánh với các giải pháp hiện có  
6.3. Hạn chế của hệ thống  
6.4. Hướng phát triển tiếp theo  

**KẾT LUẬN**

**TÀI LIỆU THAM KHẢO**

**PHỤ LỤC**
Phụ lục A. Cấu trúc cơ sở dữ liệu chi tiết  
Phụ lục B. Danh mục API Endpoints  
Phụ lục C. Sơ đồ ERD đầy đủ  
Phụ lục D. Chi tiết các Use Case  
Phụ lục E. Công thức và quy tắc nghiệp vụ  
Phụ lục F. Bảng thuật ngữ  

---

# CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI

## 1.1. Bối cảnh thực tế

Trong những năm gần đây, ngành dịch vụ giải trí tại Việt Nam đã phát triển mạnh mẽ, trong đó quán bida kết hợp cafe là một mô hình kinh doanh phổ biến. Mô hình này không chỉ thu hút khách hàng bởi không gian giải trí mà còn bởi dịch vụ đồ uống, tạo nguồn thu nhập đa dạng. Tuy nhiên, phần lớn các quán bida vừa và nhỏ hiện nay vẫn duy trì hoạt động bằng phương pháp thủ công: sổ sách giấy, ghi chép tay, tính giờ và tính tiền bằng máy tính cơ bản, quản lý khách hàng bằng sổ tay. Cách làm này dẫn đến nhiều hạn chế như sai sót trong tính phí, mất mát dữ liệu, khó theo dõi tồn kho, không kiểm soát được doanh thu thực tế và thiếu công cụ phân tích kinh doanh.

Việc số hóa quy trình vận hành là yêu cầu tất yếu để nâng cao năng lực cạnh tranh, đồng thời tạo cơ sở dữ liệu để chủ quán đưa ra quyết định chiến lược. Đề tài “Hệ thống quản lý bida-cafe tích hợp AI tư vấn đặt bàn” ra đời nhằm giải quyết các vấn đề nêu trên thông qua một nền tảng phần mềm web tích hợp, tập trung dữ liệu, tự động hóa nghiệp vụ và hỗ trợ trí tuệ nhân tạo trong tương tác với khách hàng.

## 1.2. Tính cấp thiết của đề tài

Thực tế khảo sát cho thấy các hạn chế phổ biến trong quản lý thủ công:
- Tính tiền bàn theo giờ phụ thuộc vào nhân viên, dễ xảy ra tranh chấp.
- Quản lý đơn hàng và hóa đơn rời rạc, khó thống kê.
- Không có cơ chế theo dõi khách hàng thân thiết một cách chính xác.
- Thiếu công cụ dự báo và phân tích kinh doanh.
- Khách hàng không thể tiếp cận thông tin quán và đặt bàn từ xa một cách thuận tiện.

Một hệ thống phần mềm tập trung với khả năng AI tư vấn đặt bàn không chỉ giải quyết các vấn đề vận hành mà còn nâng cao trải nghiệm khách hàng, từ đó gia tăng lợi thế cạnh tranh cho quán.

## 1.3. Mục tiêu nghiên cứu

### Mục tiêu chung
Xây dựng hệ thống quản lý bida-cafe hoàn chỉnh trên nền tảng web, tích hợp AI tư vấn đặt bàn, đáp ứng toàn bộ nghiệp vụ quản lý nội bộ và tương tác khách hàng.

### Mục tiêu cụ thể
1. Phân tích và mô hình hóa nghiệp vụ quản lý quán bida-cafe theo chuẩn UML.
2. Thiết kế cơ sở dữ liệu quan hệ đảm bảo nhất quán và toàn vẹn dữ liệu.
3. Xây dựng hệ thống backend RESTful API với các module quản lý bàn, bán hàng, khách hàng, kho, nhân viên, báo cáo và cài đặt.
4. Xây dựng giao diện frontend hiện đại, responsive, hỗ trợ trực quan hóa dữ liệu.
5. Tích hợp Google Generative AI vào quy trình tư vấn đặt bàn và phân tích kinh doanh cho quản lý.
6. Đánh giá kết quả, hạn chế và đề xuất hướng phát triển.

## 1.4. Phạm vi nghiên cứu

- **Phạm vi nghiệp vụ:** Bao gồm quản lý bàn bida, bán hàng POS, đặt bàn, quản lý khách hàng loyalty, quản lý kho và nhập hàng, quản lý nhân viên và chấm công, báo cáo thống kê, cài đặt hệ thống và AI tư vấn.
- **Phạm vi người dùng:** Quản trị viên, nhân viên phục vụ, khách hàng.
- **Phạm vi công nghệ:** ReactJS, Node.js/Express, Microsoft SQL Server, Google Generative AI.
- **Phạm vi triển khai:** Hệ thống web nội bộ và trang công khai cho khách hàng; chưa bao gồm ứng dụng di động và tích hợp thanh toán online thực tế.

## 1.5. Đối tượng và phương pháp nghiên cứu

### Đối tượng nghiên cứu
- Quy trình vận hành thực tế của quán bida-cafe.
- Các mô hình quản lý hiện có.
- Kiến trúc phần mềm web full-stack.
- Công nghệ tích hợp AI cho hệ thống tư vấn.

### Phương pháp nghiên cứu
- **Phương pháp đọc tài liệu:** Tổng hợp lý thuyết về quản lý dịch vụ, thiết kế phần mềm và trí tuệ nhân tạo.
- **Phương pháp khảo sát thực tế:** Quan sát quy trình hoạt động tại quán bida-cafe thực tế.
- **Phương pháp phân tích thiết kế:** Sử dụng UML để mô hình hóa yêu cầu và kiến trúc hệ thống.
- **Phương pháp lập trình:** Phát triển theo mô hình Agile rút gọn, tập trung vào module chức năng cốt lõi.
- **Phương pháp đánh giá:** Đánh giá hệ thống dựa trên tiêu chí chức năng, hiệu năng và bảo mật.

---

# CHƯƠNG 2. CƠ SỞ LÝ LUẬN VÀ CÔNG NGHỆ

## 2.1. Tổng quan về hệ thống quản lý quán giải trí

Hệ thống quản lý quán bida-cafe là một loại phần mềm quản lý tích hợp nhiều nghiệp vụ: cho thuê bàn theo thời gian thực, bán hàng tại quầy, quản lý khách hàng, quản lý kho, quản lý nhân sự và phân tích kinh doanh. Trong các nghiên cứu và thực tiễn, hệ thống này thường được phân loại là Point of Sale (POS) chuyên biệt cho ngành dịch vụ giải trí, có điểm khác biệt so với POS truyền thống là cần theo dõi trạng thái tài nguyên theo thời gian thực, cụ thể là bàn chơi.

Một hệ thống quản lý quán hiệu quả cần đảm bảo các nhóm chức năng cốt lõi:
- Quản lý tài nguyên: theo dõi trạng thái bàn, thời gian thuê, giá thuê.
- Quản lý bán hàng: gọi món, tính tiền, áp dụng khuyến mãi.
- Quản lý khách hàng: thông tin liên hệ, lịch sử, chương trình loyalty.
- Quản lý vận hành: nhân viên, ca làm, tồn kho, nhập hàng.
- Quản lý thông tin: báo cáo, cài đặt, thông báo.
- Tương tác thông minh: AI tư vấn và đặt bàn tự động.

## 2.2. Các mô hình phát triển phần mềm

Trong phát triển phần mềm hiện đại, nhiều mô hình có thể được áp dụng như Waterfall, Agile, Spiral hay DevOps. Đối với đề tài này, do yêu cầu thay đổi linh hoạt trong quá trình phân tích và tích hợp AI, mô hình **Agile rút gọn** kết hợp **Prototyping** được lựa chọn. Mô hình này cho phép:
- Phát triển theo từng module chức năng độc lập.
- Tích hợp và kiểm thử AI sớm với dữ liệu thực.
- Điều chỉnh thiết kế CSDL khi yêu cầu nghiệp vụ thay đổi.

## 2.3. Công nghệ và ngôn ngữ lập trình

### 2.3.1. Frontend
- **React 18:** Thư viện giao diện dựa trên thành phần, hỗ trợ Hooks và Concurrent Rendering.
- **Vite:** Công cụ build với khởi động nhanh và HMR, phù hợp phát triển SPA.
- **Tailwind CSS 3:** Framework CSS theo hướng utility-first, giúp xây dựng giao diện nhất quán.
- **React Router v6:** Quản lý định tuyến client-side.
- **Framer Motion:** Thư viện animation, nâng cao trải nghiệm người dùng.
- **Recharts:** Thư viện biểu đồ cho React, dùng cho dashboard.
- **Axios:** HTTP client giao tiếp với backend.

### 2.3.2. Backend
- **Node.js:** Môi trường runtime JavaScript phía server.
- **Express.js:** Web framework tối giản, cung cấp hệ thống middleware và routing.
- **JWT:** Cơ chế xác thực không trạng thái, phù hợp cho RESTful API.
- **bcryptjs:** Hash mật khẩu nhằm bảo vệ thông tin người dùng.
- **Zod:** Thư viện validation schema, kiểm tra đầu vào trước khi xử lý.
- **Helmet:** Thiết lập HTTP security headers.
- **Multer:** Xử lý upload file, phục vụ lưu ảnh sản phẩm.

### 2.3.3. Cơ sở dữ liệu
- **Microsoft SQL Server:** Hệ quản trị CSDL quan hệ chính, lưu trữ dữ liệu nghiệp vụ.
- **better-sqlite3:** SQLite dùng làm fallback khi không kết nối được SQL Server, đảm bảo hệ thống vẫn chạy được trong môi trường phát triển.

### 2.3.4. AI và tích hợp LLM
- **Google Generative AI (Gemini):** Được sử dụng làm engine trả lời chat và phân tích kinh doanh. Gemini được lựa chọn do khả năng tích hợp dễ dàng, hỗ trợ function calling và phù hợp với kịch bản tư vấn tiếng Việt.

## 2.4. Công nghệ AI và tích hợp LLM

Trí tuệ nhân tạo đang thay đổi cách thức tương tác giữa doanh nghiệp và khách hàng. Đối với quán bida-cafe, AI có thể được ứng dụng ở hai cấp độ:
- **Tầng tương tác khách hàng:** Chatbot tự động trả lời câu hỏi thường gặp, tư vấn bàn trống, giới thiệu menu và hỗ trợ đặt bàn.
- **Tầng phân tích quản lý:** Phân tích dữ liệu doanh thu, cảnh báo tồn kho, đề xuất khuyến mãi và nhận diện xu hướng kinh doanh.

Trong đề tài, mô hình AI được triển khai theo hướng **AI Assistant có cấu trúc prompt rõ ràng và sử dụng tool use** để truy cập dữ liệu thực của hệ thống thay vì trả lời dựa trên kiến thức chung. Điều này giúp AI đưa ra câu trả lời chính xác, liên quan đến tình trạng bàn, giá, menu và đặt bàn thực tế.

## 2.5. Các chuẩn thiết kế hệ thống

Để đảm bảo tính nhất quán và dễ bảo trì, đề tài tuân theo các chuẩn thiết kế sau:
- **RESTful API:** Các endpoint được thiết kế theo phương thức HTTP phù hợp, sử dụng trạng thái và tài nguyên rõ ràng.
- **JWT Authentication:** Xác thực bằng token, phù hợp với kiến trúc không trạng thái.
- **UML 2.x:** Dùng để mô hình hóa yêu cầu Use Case, luồng hoạt động, tương tác và cấu trúc hệ thống.
- **Prepared Statement:** Mọi thao tác CSDL đều sử dụng tham số hóa để phòng chống SQL injection.
- **Role-Based Access Control:** Phân quyền rõ ràng giữa admin và staff.

## 2.6. Cơ sở dữ liệu và hệ quản trị CSDL

Hệ thống sử dụng mô hình cơ sở dữ liệu quan hệ với **Microsoft SQL Server** làm nền tảng chính. SQL Server được lựa chọn do khả năng xử lý giao dịch tốt, hỗ trợ stored procedure, trigger và bảo mật ở mức doanh nghiệp. Việc thiết kế CSDL tuân theo mô hình ba lớp: lớp thực thể, lớp liên kết và lớp cấu hình. Hệ thống cũng tích hợp cơ chế **automatic failover** sang SQLite khi môi trường không có SQL Server, giúp tăng tính linh hoạt trong phát triển.

---

# CHƯƠNG 3. PHÂN TÍCH YÊU CẦU HỆ THỐNG

## 3.1. Khảo sát thực tế nghiệp vụ

Qua khảo sát tại các quán bida-cafe thực tế, nghiệp vụ vận hành được mô tả như sau:

### 3.1.1. Quy trình phục vụ khách tại quán
1. Khách đến quán → Nhân viên kiểm tra bàn trống → Chọn bàn → Bắt đầu tính giờ.
2. Trong quá trình chơi, khách gọi đồ uống → Nhân viên ghi order → Pha chế chuẩn bị → Mang đến bàn.
3. Khách kết thúc → Nhân viên tính tổng tiền bàn và tiền nước → Khách thanh toán.
4. Nếu khách là khách quen → Cập nhật điểm loyalty.

### 3.1.2. Quy trình đặt bàn
1. Khách gọi điện hoặc nhắn tin đặt bàn → Nhân viên ghi vào sổ.
2. Đến giờ → Nhân viên kiểm tra nếu bàn còn trống → Xác nhận giữ bàn.
3. Khách đến → Bắt đầu tính giờ. Quá giờ giữ bàn mà khách không đến → Hủy đặt.

### 3.1.3. Quy trình nhập hàng
1. Kho hàng cạn hoặc sắp hết → Quản lý gọi nhà cung cấp đặt hàng.
2. Hàng về → Nhập kho, cập nhật số lượng tồn, ghi chép vào sổ.

## 3.2. Phân tích tác nghiệp

Hệ thống phục vụ ba nhóm tác nghiệp chính:
- **Admin (Chủ quán):** Toàn quyền quản lý hệ thống, bao gồm quản lý nhân viên, xem báo cáo, cài đặt giá, sao lưu dữ liệu và theo dõi AI insights.
- **Staff (Nhân viên):** Vận hành trực tiếp: quản lý bàn, bán hàng POS, tạo đặt bàn, chấm công và theo dõi kho.
- **Customer (Khách hàng):** Tương tác với landing page công khai: xem thông tin quán, xem trạng thái bàn, đặt bàn và chat với AI.

## 3.3. Phân tích yêu cầu chức năng

### 3.3.1. Module xác thực và phân quyền
- Đăng nhập bằng username và password.
- Phân quyền: Admin có toàn quyền; Staff chỉ truy cập chức năng vận hành.
- JWT token cho phiên làm việc với thời gian hết hạn cấu hình.
- Đổi mật khẩu.

### 3.3.2. Module quản lý bàn bida
- Hiển thị lưới bàn với trạng thái: Trống, Đang chơi, Đặt trước, Bảo trì.
- Bắt đầu/kết thúc phiên chơi, tự động tính phí theo giờ.
- Đặt bàn trước, giữ bàn, hủy đặt.
- Gán khách hàng vào bàn, tìm kiếm theo số điện thoại.
- Thêm đồ uống vào bàn đang chơi.
- Xem trước thanh toán với đầy đủ chi tiết.

### 3.3.3. Module POS — Bán hàng
- Giao diện grid sản phẩm theo danh mục.
- Tìm kiếm sản phẩm, quản lý giỏ hàng.
- Áp dụng voucher, giảm giá theo hạng thành viên, tính thuế VAT.
- Thanh toán bằng tiền mặt hoặc chuyển khoản.
- Tự động trừ tồn kho và cộng điểm loyalty.

### 3.3.4. Module quản lý thực đơn
- CRUD danh mục và sản phẩm.
- Upload hình ảnh sản phẩm.
- Soft delete sản phẩm.

### 3.3.5. Module quản lý khách hàng
- CRUD khách hàng, tìm kiếm theo tên hoặc SĐT.
- Hiển thị điểm, hạng thành viên, tổng chi tiêu.
- Tự động phân hạng dựa trên tổng chi tiêu: Bronze, Silver, Gold, Platinum.
- Progress bar tiến độ thăng hạng.

### 3.3.6. Module voucher và khuyến mãi
- CRUD voucher với kiểu percent hoặc fixed.
- Kiểm tra hạn, số lượt sử dụng, đơn tối thiểu, hạng thành viên yêu cầu.
- Copy mã nhanh, toggle trạng thái.

### 3.3.7. Module quản lý tồn kho
- Hiển thị tồn kho theo danh sách sản phẩm.
- Cảnh báo hết hàng và sắp hết.
- Điều chỉnh tồn kho thủ công.
- Xuất báo cáo tồn kho CSV.

### 3.3.8. Module nhập hàng và nhà cung cấp
- CRUD nhà cung cấp.
- Tạo đơn nhập hàng với nhiều sản phẩm.
- Tự động cộng tồn kho khi nhập hàng.

### 3.3.9. Module nhân viên và chấm công
- Danh sách nhân viên.
- Clock-in / Clock-out theo ca.
- Tự động tính số giờ làm.
- Lọc lịch sử ca theo nhân viên và ngày.

### 3.3.10. Module đặt bàn
- Tạo đặt bàn với tên khách, SĐT, bàn, giờ bắt đầu/kết thúc.
- Trạng thái đặt bàn: Chờ xác nhận, Đã xác nhận, Đang giữ, Đang chơi, Hoàn thành, Đã hủy, Không đến.
- Check-in khách, tự động tạo order và chuyển bàn sang Đang chơi.
- Lịch đặt bàn theo thời gian thực.

### 3.3.11. Module báo cáo và thống kê
- KPI Dashboard: doanh thu hôm nay, số đơn, khách mới, tổng giờ hoạt động.
- Biểu đồ doanh thu 7 ngày, trạng thái bàn, top sản phẩm.
- AI Insight: gợi ý kinh doanh từ Gemini.
- Xuất báo cáo CSV: tổng hợp, lịch sử đơn hàng, doanh thu theo ngày/tháng, sản phẩm bán chạy.

### 3.3.12. Module cài đặt
- Thông tin doanh nghiệp: tên, địa chỉ, SĐT, email.
- Cấu hình giá dịch vụ, giờ mở/đóng cửa.
- Cấu hình tích điểm.
- Quản lý hình ảnh, logo, Google Maps.
- Quản lý tài khoản và sao lưu dữ liệu.

### 3.3.13. Module thông báo
- Tạo thông báo nội bộ: info, warning, success, error.
- Đánh dấu đã đọc, đọc tất cả, xóa.

### 3.3.14. Module landing page
- Trang giới thiệu công khai.
- Danh sách bàn và trạng thái realtime.
- Google Maps embed.
- AI Chat widget và form đặt bàn online.

### 3.3.15. Module AI Assistant
- AI Chat công khai: trả lời câu hỏi thông thường về quán.
- AI Chat Admin: phân tích doanh thu, tồn kho, top sản phẩm thông qua các công cụ truy xuất dữ liệu.
- AI Insights: gợi ý dựa trên KPI hiện tại.

## 3.4. Phân tích yêu cầu phi chức năng

- **Hiệu năng:** Thời gian phản hồi API dưới 500ms với 95% yêu cầu.
- **Bảo mật:** Mật khẩu hash bcrypt, JWT, phân quyền rõ ràng, prepared statement chống SQL injection.
- **Tin cậy:** Dữ liệu nhất quán thông qua transaction trong các thao tác thanh toán và nhập hàng.
- **Khả năng sử dụng:** Giao diện trực quan, responsive trên desktop và tablet.
- **Khả năng mở rộng:** Kiến trúc module hóa, dễ thêm chức năng mới.
- **Dễ bảo trì:** Code theo convention, có comment, tách biệt route, service và data access.

## 3.5. Xác định Actor và Use Case tổng quát

Hệ thống có 3 actor chính và 4 actor hệ thống/phụ trợ:
- **Admin:** Quản trị viên.
- **Staff:** Nhân viên phục vụ.
- **Customer:** Khách hàng.
- **AI Chatbot, AI Recommender, Notification Service, Payment Gateway:** Các actor phụ trợ.

Các nhóm Use Case chính:
- Quản lý bàn bida
- Quản lý khách hàng
- Gọi món và thanh toán
- Quản lý menu
- Báo cáo và thống kê
- AI Services
- Quản lý nhân viên
- Cài đặt hệ thống

Tổng cộng hệ thống có hơn 45 use case chi tiết, được nhóm thành 15 nhóm chức năng chính.

---

# CHƯƠNG 4. THIẾT KẾ HỆ THỐNG

## 4.1. Kiến trúc tổng thể hệ thống

### 4.1.1. Kiến trúc logic

Hệ thống được thiết kế theo kiến trúc **Client-Server** ba tầng (Three-Tier Architecture), phù hợp với ứng dụng web full-stack:

- **Tầng trình bày (Presentation Layer):** React 18 SPA — giao diện người dùng, xử lý tương tác, routing phía client, gọi API qua Axios.
- **Tầng nghiệp vụ (Business Logic Layer):** Node.js/Express — RESTful API, middleware xác thực/phân quyền, validation, xử lý nghiệp vụ, tích hợp AI.
- **Tầng dữ liệu (Data Layer):** Microsoft SQL Server (chính) + SQLite (fallback) — lưu trữ dữ liệu quan hệ, transaction ACID, stored procedures.

### 4.1.2. Kiến trúc triển khai

Hệ thống triển khai theo mô hình **monolithic** gói gọn trong một server nội bộ:

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                     │
│           React SPA → http://localhost:5174             │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  SERVER API (Node.js)                   │
│              http://localhost:3002                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Routes → Middleware → Services → DB Access      │   │
│  └─────────────────────────────────────────────────┘   │
│         │                              │                │
│         ▼                              ▼                │
│  ┌──────────────┐          ┌──────────────────┐       │
│  │  AI Module   │          │  File Storage     │       │
│  │  (Gemini)    │          │  (uploads/)      │       │
│  └──────────────┘          └──────────────────┘       │
└───────────┬──────────────────────────┬────────────────┘
            │                          │
            ▼                          ▼
┌──────────────────┐         ┌──────────────────┐
│  SQL Server DB   │         │   Backup Files   │
│  (cafe.db)       │         │   (JSON)         │
└──────────────────┘         └──────────────────┘
```

### 4.1.3. Kiến trúc bảo mật

Hệ thống áp dụng mô hình bảo mật đa lớp:

1. **Network Layer:** Helmet.js thiết lập HTTP security headers (HSTS, X-Frame-Options, CSP).
2. **Transport Layer:** CORS whitelist, HTTPS-ready (qua reverse proxy).
3. **Application Layer:** JWT stateless authentication, bcrypt password hashing, Role-Based Access Control (RBAC).
4. **Data Layer:** Prepared statements (chống SQL injection), parameterised queries qua `better-sqlite3`.

## 4.2. Thiết kế cơ sở dữ liệu

### 4.2.1. Mô hình quan hệ (ERD)

Hệ thống gồm **15 bảng** chính được thiết kế theo mô hình Normal Form (3NF):

| Bảng | Mô tả | Khóa chính | Khóa ngoại |
|------|--------|------------|------------|
| `users` | Người dùng hệ thống | `id` | — |
| `settings` | Cấu hình hệ thống | `key` | — |
| `tables` | Bàn bida | `id` | `current_order_id` → `orders` |
| `categories` | Danh mục sản phẩm | `id` | — |
| `products` | Sản phẩm | `id` | `category_id` → `categories` |
| `customers` | Khách hàng | `id` | — |
| `vouchers` | Mã giảm giá | `id` | — |
| `orders` | Đơn hàng | `id` | `customer_id` → `customers`, `table_id` → `tables` |
| `order_items` | Chi tiết đơn hàng | `id` | `order_id` → `orders`, `product_id` → `products` |
| `suppliers` | Nhà cung cấp | `id` | — |
| `purchases` | Đơn nhập hàng | `id` | `supplier_id` → `suppliers` |
| `purchase_items` | Chi tiết nhập hàng | `id` | `purchase_id` → `purchases`, `product_id` → `products` |
| `shifts` | Ca làm việc | `id` | — |
| `bookings` | Đặt bàn | `id` | `table_id` → `tables` |
| `notifications` | Thông báo | `id` | — |

### 4.2.2. Lược đồ ERD chi tiết

```
┌────────────┐      ┌────────────┐
│   USERS    │      │  SETTINGS  │
├────────────┤      ├────────────┤
│ PK id      │      │ PK key     │
│   username │      │   value    │
│   password │      └────────────┘
│   role     │
│   created  │
└────────────┘

┌────────────┐       ┌────────────┐       ┌────────────┐
│  CATEGORY  │──1:N──│  PRODUCTS  │◄──N:1─│  ORDERS    │
├────────────┤       ├────────────┤       ├────────────┤
│ PK id      │       │ PK id      │       │ PK id      │
│   name     │       │ FK cat_id  │       │ FK cust_id │
└────────────┘       │   name     │       │ FK table_id│
                     │   price    │       │   total    │
                     │   stock    │       │   status   │
                     │   image    │       │   created  │
                     └────────────┘       └─────┬──────┘
                                                 │ 1:N
                                                 ▼
                     ┌────────────┐       ┌────────────┐
                     │  BOOKINGS  │◄──N:1─│ORDER_ITEMS │
                     ├────────────┤       ├────────────┤
                     │ PK id      │       │ PK id      │
                     │ FK table_id│      │ FK order_id│
                     │   start    │       │ FK prod_id │
                     │   end     │       │   qty      │
                     │   status  │       │   price    │
                     └────────────┘       └────────────┘

                     ┌────────────┐       ┌────────────┐
                     │ CUSTOMERS  │       │  VOUCHERS  │
                     ├────────────┤       ├────────────┤
                     │ PK id      │       │ PK id      │
                     │   name    │       │   code     │
                     │   phone   │       │   type     │
                     │   points  │       │   value    │
                     │   tier    │       │   expires  │
                     │   spent   │       │   active   │
                     └────────────┘       └────────────┘

                     ┌────────────┐       ┌────────────┐
                     │ SUPPLIERS  │──1:N──│ PURCHASES  │
                     ├────────────┤       ├────────────┤
                     │ PK id      │       │ PK id      │
                     │   name    │       │ FK supp_id │
                     │   phone   │       │   total    │
                     │   address │       │   created  │
                     └────────────┘       └─────┬──────┘
                                                 │ 1:N
                                                 ▼
                                         ┌────────────┐
                                         │PURCH_ITEMS │
                                         ├────────────┤
                                         │ PK id      │
                                         │ FK purch_id│
                                         │ FK prod_id │
                                         │   qty     │
                                         │   cost    │
                                         └────────────┘

                     ┌────────────┐       ┌────────────┐
                     │   TABLES   │──1:N──│   SHIFTS   │
                     ├────────────┤       ├────────────┤
                     │ PK id      │       │ PK id      │
                     │   name    │       │   staff    │
                     │   status  │       │   role     │
                     │   rate    │       │   start    │
                     │   session │       │   end      │
                     └────────────┘       └────────────┘

                     ┌────────────┐
                     │NOTIFICATIONS│
                     ├────────────┤
                     │ PK id      │
                     │   message  │
                     │   type     │
                     │   read     │
                     │   created  │
                     └────────────┘
```

### 4.2.3. Thiết kế bảng `settings` — Cấu hình linh hoạt

Bảng `settings` sử dụng mô hình Key-Value để lưu trữ cấu hình động, cho phép admin thay đổi không cần sửa code:

| Key | Mô tả | Ví dụ |
|-----|--------|-------|
| `business_name` | Tên quán | "Bida Cafe Hoa Mai" |
| `business_address` | Địa chỉ | "123 Đường ABC, Q1, TP.HCM" |
| `business_phone` | SĐT liên hệ | "0901234567" |
| `open_time` | Giờ mở cửa | "09:00" |
| `close_time` | Giờ đóng cửa | "23:00" |
| `default_table_rate` | Giá mặc định/giờ | "50000" |
| `loyalty_enabled` | Bật/tắt loyalty | "true" |
| `loyalty_rate` | Tỷ lệ tích điểm | "10" (1% giá trị) |
| `loyalty_tiers` | Cấu hình hạng | JSON tiers |
| `ai_api_key` | API key Gemini | "AIza..." |
| `ai_system_prompt` | System prompt AI | "Bạn là tư vấn viên..." |

### 4.2.4. Thiết kế bảng `tables` — Trạng thái bàn

Trạng thái bàn được thiết kế theo finite state machine:

```
┌────────┐   start()    ┌───────────┐   end()    ┌────────┐
│ EMPTY │──────────────│ OCCUPIED │─────────────│ EMPTY  │
└────────┘             └───────────┘            └────────┘
     ▲                      │
     │                      │ reserve()
     │                      ▼
     │               ┌───────────┐
     └───────────────│ RESERVED  │──cancel()
                     └───────────┘
```

Các trạng thái: `empty`, `occupied`, `reserved`, `maintenance`.

## 4.3. Thiết kế Use Case chi tiết

### 4.3.1. Use Case: Đặt bàn và bắt đầu chơi

| Thuộc tính | Chi tiết |
|-----------|----------|
| **ID** | UC-001 |
| **Tên** | Đặt bàn và bắt đầu phiên chơi |
| **Actor** | Staff, Customer |
| **Mục tiêu** | Tạo đặt bàn trước hoặc bắt đầu tính giờ ngay |
| **Tiền điều kiện** | Staff đã đăng nhập, có bàn trống |
| **Luồng chính** | 1. Staff chọn bàn trống → 2. Nhập thông tin khách → 3. Bắt đầu tính giờ → 4. Hệ thống tạo order, cập nhật trạng thái bàn |
| **Luồng rẽ nhánh** | 3a. Đặt trước → lưu giờ hẹn, bàn chuyển `reserved` |
| **Hậu điều kiện** | Bàn chuyển `occupied`, order tạo với `status='active'` |

### 4.3.2. Use Case: Gọi món vào bàn

| Thuộc tính | Chi tiết |
|-----------|----------|
| **ID** | UC-002 |
| **Tên** | Gọi đồ uống vào bàn đang chơi |
| **Actor** | Staff |
| **Mục tiêu** | Thêm sản phẩm vào order của bàn |
| **Luồng chính** | 1. Staff chọn bàn đang chơi → 2. Chọn sản phẩm, số lượng → 3. Xác nhận → 4. Hệ thống trừ tồn kho, cập nhật `drinks_total` |
| **Ngoại lệ** | Sản phẩm hết hàng → thông báo cảnh báo |

### 4.3.3. Use Case: Thanh toán

| Thuộc tính | Chi tiết |
|-----------|----------|
| **ID** | UC-003 |
| **Tên** | Thanh toán và kết thúc phiên |
| **Actor** | Staff |
| **Mục tiêu** | Tính tổng tiền, áp dụng khuyến mãi, xuất hóa đơn |
| **Luồng chính** | 1. Staff kết thúc phiên bàn → 2. Hệ thống tính tiền bida → 3. Áp dụng giảm giá loyalty → 4. Chọn voucher (tùy chọn) → 5. Tính thuế VAT → 6. Thanh toán tiền mặt/chuyển khoản → 7. Cập nhật điểm loyalty → 8. Bàn về `empty` |
| **Tính tiền bida** | `(thời gian phút / 60) * rate_per_hour` |

### 4.3.4. Use Case: Quản lý loyalty

| Thuộc tính | Chi tiết |
|-----------|----------|
| **ID** | UC-004 |
| **Tên** | Tích điểm và thăng hạng khách hàng |
| **Actor** | Hệ thống (tự động) |
| **Mục tiêu** | Tự động cộng điểm và phân hạng sau thanh toán |
| **Công thức** | `points_earned = floor(total * loyalty_rate / 100)` |
| **Thăng hạng** | Bronze → Silver (500k) → Gold (2M) → Platinum (5M) |

### 4.3.5. Use Case: AI Chat tư vấn đặt bàn

| Thuộc tính | Chi tiết |
|-----------|----------|
| **ID** | UC-005 |
| **Tên** | AI Chatbot trả lời câu hỏi và tư vấn đặt bàn |
| **Actor** | Customer, AI Chatbot |
| **Mục tiêu** | Hỗ trợ khách xem thông tin và đặt bàn tự động |
| **Luồng chính** | 1. Khách nhắn tin hỏi → 2. AI phân tích intent → 3. Nếu hỏi bàn trống → truy vấn DB thực tế → 4. Trả lời kèm gợi ý đặt bàn |
| **Tool use** | `get_tables()`, `get_menu()`, `get_booking_info()` |

### 4.3.6. Use Case: Admin chat với AI phân tích

| Thuộc tính | Chi tiết |
|-----------|----------|
| **ID** | UC-006 |
| **Tên** | Admin trò chuyện với AI để phân tích kinh doanh |
| **Actor** | Admin, AI |
| **Mục tiêu** | Trả lời truy vấn phức tạp về doanh thu, tồn kho, top sản phẩm |
| **Tool use** | `get_revenue_report()`, `get_inventory()`, `get_top_products()` |

## 4.4. Thiết kế Activity Diagram

### 4.4.1. Activity: Quy trình phục vụ khách toàn trình

```
[Start] ──▶ (Khách đến quán)
                  │
                  ▼
         ┌───────────────┐     Không    ┌──────────────┐
         │ Bàn trống?   │──────────────▶│ Xếp chờ / Hủy │
         └───────┬───────┘              └──────────────┘
                 │ Có
                 ▼
        ┌────────────────┐
        │ Chọn bàn       │
        └───────┬────────┘
                ▼
     ┌──────────────────┐    ┌──────────────────┐
     │ Bắt đầu phiên    │───▶│ Tính giờ bắt đầu │
     └──────────────────┘    └──────────────────┘
                │
                ▼
     ┌──────────────────┐
     │ Gọi đồ uống?     │◀────┐
     └───────┬──────────┘     │
             │ Có             │ Lặp
             ▼                │
    ┌──────────────────┐      │
    │ Thêm vào order   │──────┘
    └──────────────────┘
             │
             ▼
     ┌──────────────────┐
     │ Khách kết thúc?   │
     └───────┬──────────┘
             │ Có
             ▼
    ┌──────────────────┐
    │ Kết thúc phiên   │
    │ Tính tiền bida   │
    └───────┬──────────┘
            ▼
    ┌──────────────────┐
    │ Thanh toán       │
    │ Áp dụng loyalty  │
    │ Cộng điểm KH     │
    └───────┬──────────┘
            ▼
    ┌──────────────────┐
    │ Bàn về trống     │
    └───────┬──────────┘
            ▼
        [End]
```

### 4.4.2. Activity: Check-in đặt bàn

```
[Start] ──▶ (Giờ hẹn đến)
                │
                ▼
        ┌────────────────┐
        │ Check-in đặt  │
        │ bàn            │
        └───────┬────────┘
                ▼
        ┌────────────────┐     Quá giờ
        │ Bàn còn trống? │───────────▶ [End: Hủy đặt]
        └───────┬────────┘
                │ Còn
                ▼
        ┌────────────────┐
        │ Bắt đầu phiên │
        │ Tạo order mới  │
        └───────┬────────┘
                ▼
        ┌────────────────┐
        │ Cập nhật bàn   │
        │ = occupied     │
        └───────┬────────┘
                ▼
            [End]
```

## 4.5. Thiết kế Sequence Diagram

### 4.5.1. Sequence: Thanh toán bàn

```
Staff          API Server           DB              Gemini
  │                │                 │                │
  │──POST /end────▶│                 │                │
  │                │──SELECT order──▶│                │
  │                │◀──order data────│                │
  │                │                 │                │
  │                │──SELECT cust───▶│                │
  │                │◀──customer──────│                │
  │                │                 │                │
  │                │──calc points───▶│                │
  │                │◀──update pts────│                │
  │                │                 │                │
  │                │──UPDATE order──▶│                │
  │                │◀──success───────│                │
  │                │                 │                │
  │                │──UPDATE table──▶│                │
  │                │◀──empty─────────│                │
  │◀──receipt──────│                 │                │
  │                │                 │                │
```

### 4.5.2. Sequence: AI Chat đặt bàn

```
Customer       API Server           DB              Gemini
  │                │                 │                │
  │──POST /chat───▶│                 │                │
  │  "Bàn trống   │                 │                │
  │   nào?"       │                 │                │
  │                │──gen content───▶│                │
  │                │                 │                │
  │                │◀──JSON config───│                │
  │                │                 │                │
  │                │──gemini.generate│────────────────▶│
  │                │  [system+ctx]  │                │
  │                │◀──response───────│                │
  │◀──text answer──│                 │                │
  │                │                 │                │
```

## 4.6. Thiết kế Class Diagram (Component Backend)

### 4.6.1. Backend Services

```
┌─────────────────────────────────────────────────────┐
│                    Server (index.js)                 │
│  - app: Express                                     │
│  - auth(): JWT middleware                            │
│  - adminOnly(): RBAC middleware                     │
└───────────────────────┬─────────────────────────────┘
                        │ uses
        ┌───────────────┼───────────────┬───────────────┐
        ▼               ▼               ▼               ▼
┌───────────────┐ ┌──────────┐ ┌───────────────┐ ┌──────────────┐
│ authRoutes    │ │tablesRoute│ │ordersRoutes  │ │productsRoute│
├───────────────┤ ├──────────┤ ├───────────────┤ ├──────────────┤
│ + login()     │ │+ get()   │ │+ create()    │ │+ getProd()  │
│ + register()  │ │+ start() │ │+ cancel()   │ │+ create()   │
│ + refresh()   │ │+ end()   │ │+ addItem()  │ │+ update()   │
│ + logout()    │ │+ addDrink│ │+ checkout() │ │+ delete()   │
└───────────────┘ └──────────┘ └───────────────┘ └──────────────┘

┌───────────────┐ ┌──────────┐ ┌───────────────┐ ┌──────────────┐
│customersRoute│ │bookings  │ │staffRoutes    │ │inventory    │
├───────────────┤ ├──────────┤ ├───────────────┤ ├──────────────┤
│+ get()       │ │+ create()│ │+ getStaff()   │ │+ getStock() │
│+ search()    │ │+ confirm│ │+ clockIn()    │ │+ adjust()   │
│+ addPoints() │ │+ checkIn│ │+ clockOut()   │ │+ purchase() │
│+ update()    │ │+ cancel │ │+ getShifts()  │ │+ supplier() │
└───────────────┘ └──────────┘ └───────────────┘ └──────────────┘

┌───────────────┐ ┌──────────┐ ┌───────────────┐ ┌──────────────┐
│reportsRoutes │ │settings  │ │vouchersRoute  │ │notifications │
├───────────────┤ ├──────────┤ ├───────────────┤ ├──────────────┤
│+ getKPI()    │ │+ get()   │ │+ validate()  │ │+ create()   │
│+ revenue()   │ │+ update()│ │+ apply()     │ │+ markRead() │
│+ export()    │ │+ backup()│ │+ toggle()    │ │+ delete()   │
└───────────────┘ └──────────┘ └───────────────┘ └──────────────┘

┌─────────────────────────────────────────────────────┐
│                   AI Module (routes/ai.js)            │
├─────────────────────────────────────────────────────┤
│ + publicChat(): Xử lý chat công khai                │
│ + adminChat(): Xử lý chat admin với tool use        │
│ + getInsights(): Tạo AI insights từ KPI            │
│ - buildSystemPrompt(): Xây dựng prompt theo ngữ cảnh│
│ - callGemini(): Gọi Gemini API                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│               Database Access (db.js)                 │
├─────────────────────────────────────────────────────┤
│ + prepare(sql): Tạo prepared statement              │
│ + transaction(fn): Thực thi transaction              │
│ + getBackup(): Xuất JSON backup                     │
│ + restore(json): Phục hồi từ backup                 │
└─────────────────────────────────────────────────────┘
```

### 4.6.2. Frontend Components

```
App
 └── ProtectedRoute
      └── AppLayout
           ├── Sidebar
           ├── Header
           │    ├── NotificationBell
           │    └── UserMenu
           └── Outlet
                ├── DashboardPage
                │    ├── KPIWidgets
                │    ├── RevenueChart
                │    └── AIInsightCard
                ├── TablesPage
                │    ├── TableGrid
                │    ├── TableCard
                │    └── StartSessionModal
                ├── POSPage
                │    ├── CategoryTabs
                │    ├── ProductGrid
                │    ├── CartPanel
                │    └── PaymentModal
                ├── MenuPage
                │    ├── CategoryList
                │    ├── ProductTable
                │    └── ProductForm
                ├── CustomersPage
                │    ├── CustomerTable
                │    ├── CustomerForm
                │    └── LoyaltyProgress
                ├── BookingsPage
                │    ├── BookingCalendar
                │    ├── BookingForm
                │    └── BookingList
                ├── StaffPage
                │    ├── StaffTable
                │    └── ShiftClock
                ├── InventoryPage
                │    ├── StockTable
                │    └── StockAlert
                ├── ReportsPage
                │    ├── DateRangePicker
                │    ├── RevenueChart
                │    └── ExportButtons
                ├── SettingsPage
                │    ├── BusinessInfoForm
                │    ├── PricingConfig
                │    ├── UserManagement
                │    └── BackupRestore
                ├── VouchersPage
                │    ├── VoucherTable
                │    └── VoucherForm
                ├── PurchasesPage
                │    ├── PurchaseTable
                │    └── PurchaseForm
                └── NotificationsPage
                     ├── NotificationList
                     └── FilterBar

LandingPage (Public)
 ├── HeroSection
 ├── TableStatusWidget
 ├── MenuPreview
 ├── AIChatWidget
 └── BookingForm
```

## 4.7. Thiết kế Component Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                         CLIENT (React SPA)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ AppRouter │ │  Axios   │ │Contexts  │ │ TailwindCSS      │  │
│  │(React    │ │(HTTP     │ │AuthCtx    │ │(Styling)         │  │
│  │ Router)  │ │ Client)  │ │ThemeCtx   │ │                  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
└───────────────────────────────┬────────────────────────────────┘
                                │ HTTP/REST + JSON
                                ▼
┌────────────────────────────────────────────────────────────────┐
│                        SERVER (Node.js)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     Express Application                    │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │   │
│  │  │Middleware  │ │  Routes    │ │ Services   │           │   │
│  │  │ - Helmet   │ │ - auth     │ │ (shared    │           │   │
│  │  │ - CORS     │ │ - tables   │ │  business  │           │   │
│  │  │ - JWT      │ │ - orders   │ │  logic)    │           │   │
│  │  │ - RateLimit│ │ - products │ │            │           │   │
│  │  │ - Validate │ │ - customers│ │            │           │   │
│  │  │ (Zod)      │ │ - bookings │ │            │           │   │
│  │  │ - Multer   │ │ - staff    │ │            │           │   │
│  │  └────────────┘ │ - inventory│ │            │           │   │
│  │                 │ - reports   │ │            │           │   │
│  │                 │ - settings  │ │            │           │   │
│  │                 │ - vouchers  │ │            │           │   │
│  │                 │ - notifs    │ │            │           │   │
│  │                 │ - ai        │ │            │           │   │
│  │                 └────────────┘ └────────────┘           │   │
│  └──────────────────────────────────────────────────────────┘   │
│         │                     │                    │            │
│         ▼                     ▼                    ▼            │
│  ┌────────────┐       ┌────────────┐       ┌────────────┐   │
│  │  AI Module │       │ File System│       │  Database   │   │
│  │ (Gemini    │       │ - uploads/ │       │  better-    │   │
│  │  API)      │       │ - backups/ │       │  sqlite3    │   │
│  └────────────┘       └────────────┘       └────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

## 4.8. Thiết kế Deployment Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPER MACHINE                         │
│                                                             │
│  ┌───────────────────┐     ┌──────────────────────────┐     │
│  │   Web Browser     │     │  VS Code / Cursor IDE   │     │
│  │   (Chrome)       │     │  - Client (Vite :5174)  │     │
│  │                   │     │  - Server (Node :3002)   │     │
│  └─────────┬─────────┘     └──────────┬───────────┘     │
│            │ http://localhost:5174      │                 │
│            │                           │                  │
└────────────┼───────────────────────────┼──────────────────┘
             │                           │
             ▼                           ▼
┌────────────────────────────────────────────────────────────┐
│                    LOCAL SERVER (Production)                 │
│  OS: Windows 10+                                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Node.js Process (pm2 or direct)                     │   │
│  │  ├── BilliardCafe Server :3002                       │   │
│  │  │   └── Express API                                 │   │
│  │  └── BilliardCafe Client (built static files)        │   │
│  │       └── served by Nginx / IIS or Vite preview     │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                    │                    │         │
│         ▼                    ▼                    ▼         │
│  ┌───────────┐       ┌───────────┐       ┌───────────────┐ │
│  │ SQL Server│       │ File Store│       │  Google Gemini│ │
│  │ / SQLite  │       │ (uploads/ │       │  API Service  │ │
│  │ (cafe.db) │       │  backups/)│       │               │ │
│  └───────────┘       └───────────┘       └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 4.9. Thiết kế giao diện người dùng

### 4.9.1. Layout tổng thể (Admin/Staff)

Giao diện sử dụng **AppLayout** với sidebar cố định bên trái và content area chính:

```
┌──────────────────────────────────────────────────────┐
│ Header: Logo | Search | Notifications | User  │
├────────────┬─────────────────────────────────────────┤
│            │                                         │
│  Sidebar   │         Main Content Area              │
│  ────────  │         ─────────────────              │
│  Dashboard│        [Page content here]           │
│  Bàn      │                                         │
│  POS      │                                         │
│  Menu     │                                         │
│  Khách    │                                         │
│  Đặt bàn  │                                         │
│  Orders   │                                         │
│  Nhân sự  │                                         │
│  Kho       │                                         │
│  Báo cáo  │                                         │
│  Voucher  │                                         │
│  Thông báo│                                         │
│  Cài đặt  │                                         │
│            │                                         │
└────────────┴─────────────────────────────────────────┘
```

### 4.9.2. Trang Dashboard

- **KPI Cards (4 ô):** Doanh thu hôm nay, Số đơn hàng, Khách mới, Tổng giờ chơi.
- **Biểu đồ:** Doanh thu 7 ngày (Recharts Bar Chart).
- **AI Insight Card:** Gợi ý kinh doanh từ Gemini.
- **Trạng thái bàn:** Mini grid 4 ô vuông màu (xanh=trống, đỏ=đang chơi, vàng=đặt trước).

### 4.9.3. Trang Quản lý Bàn

- **Layout:** Grid 4 cột responsive.
- **Mỗi TableCard hiển thị:** Tên bàn, giá/giờ, trạng thái (màu), thời gian đang chơi (nếu occupied).
- **Actions:** Bắt đầu / Kết thúc / Đặt bàn / Thêm đồ uống / Thanh toán.

### 4.9.4. Trang POS (Point of Sale)

- **Layout 2 cột:** Bên trái (menu sản phẩm), Bên phải (cart + thanh toán).
- **Menu:** Tabs theo danh mục (Bia, Nước uống, Đồ ăn), grid sản phẩm với hình ảnh.
- **Cart:** Danh sách items, tổng phụ, voucher, giảm giá, VAT, tổng cộng.
- **Thanh toán:** Chọn phương thức (tiền mặt / chuyển khoản), xác nhận.

### 4.9.5. Landing Page (Public)

- **Hero:** Hình ảnh quán, tagline, nút "Đặt bàn ngay".
- **Trạng thái bàn realtime:** Grid màu với số bàn.
- **AI Chat Widget:** Floating button góc phải dưới, mở rộng thành chat window.
- **Form đặt bàn:** Tên, SĐT, ngày, giờ, ghi chú.

### 4.9.6. Thiết kế màu sắc

| Màu | Hex | Ý nghĩa |
|-----|-----|---------|
| Primary (Blue) | `#3b82f6` | Nút chính, link, accent |
| Success (Green) | `#22c55e` | Bàn trống, thành công |
| Warning (Amber) | `#f59e0b` | Bàn đặt trước, cảnh báo |
| Danger (Red) | `#ef4444` | Bàn đang chơi, lỗi |
| Background | `#f8fafc` | Nền chính |
| Card | `#ffffff` | Card, modal |
| Text | `#1e293b` | Văn bản chính |

## 4.10. Thiết kế bảo mật hệ thống

### 4.10.1. Xác thực (Authentication)

- **Phương thức:** JWT (JSON Web Token) Bearer token.
- **Thời gian hết hạn:** 24 giờ (configurable).
- **Lưu trữ:** `localStorage` (hoặc `sessionStorage`).
- **Header:** `Authorization: Bearer <token>`.
- **Password:** Hash bằng bcrypt (cost factor 10).

### 4.10.2. Phân quyền (Authorization)

| Role | Quyền |
|------|-------|
| `admin` | Toàn quyền: quản lý users, settings, backup, xem tất cả báo cáo |
| `staff` | Vận hành: quản lý bàn, order, kho, shift — KHÔNG có settings/backup |

### 4.10.3. Bảo vệ API

- **Rate Limiting:** 100 req/15 phút/client IP.
- **Input Validation:** Zod schemas cho mọi endpoint POST/PUT.
- **SQL Injection:** 100% prepared statements.
- **File Upload:** Chỉ chấp nhận ảnh, giới hạn 5MB, kiểm tra MIME type.
- **CORS:** Whitelist domains cụ thể.

### 4.10.4. Sao lưu dữ liệu

- **Cơ chế:** Export JSON toàn bộ dữ liệu (users, orders, products, customers...).
- **Thư mục:** `backups/` với timestamp filename.
- **Phục hồi:** Import JSON qua endpoint riêng.
- **Lịch sự:** Admin chủ động backup thủ công hoặc qua cron job bên ngoài.

---

# CHƯƠNG 5. TRIỂN KHAI VÀ KẾT QUẢ

## 5.1. Môi trường phát triển và công cụ

### 5.1.1. Phần cứng và hệ điều hành

| Thành phần | Yêu cầu |
|-----------|---------|
| CPU | Intel Core i5 trở lên |
| RAM | 8GB trở lên |
| Ổ cứng | 256GB SSD trở lên |
| Hệ điều hành | Windows 10/11 hoặc macOS |
| Mạng | LAN nội bộ hoặc Internet |

### 5.1.2. Phần mềm

| Công cụ | Phiên bản | Vai trò |
|---------|-----------|---------|
| Node.js | 18+ LTS | Runtime backend |
| npm | 9+ | Package manager |
| VS Code / Cursor | Latest | IDE phát triển |
| Git | 2.40+ | Version control |
| Chrome DevTools | Latest | Debug frontend |

### 5.1.3. Dependencies Backend

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "better-sqlite3": "^9.4.3",
  "multer": "^1.4.5-lts.1",
  "zod": "^3.22.4",
  "dotenv": "^16.4.1",
  "cookie-parser": "^1.4.6",
  "express-rate-limit": "^7.1.5"
}
```

### 5.1.4. Dependencies Frontend

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.0",
  "axios": "^1.6.7",
  "framer-motion": "^11.0.6",
  "recharts": "^2.12.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.1"
}
```

## 5.2. Cấu trúc thư mục dự án

```
billard-coffe/
│
├── server-api/                    # Backend Node.js API
│   ├── src/
│   │   ├── index.js              # Entry point, route registration
│   │   ├── db.js                 # Database connection (SQLite/SQL Server)
│   │   ├── routes/               # API route handlers
│   │   │   ├── auth.js
│   │   │   ├── tables.js
│   │   │   ├── orders.js
│   │   │   ├── products.js
│   │   │   ├── customers.js
│   │   │   ├── bookings.js
│   │   │   ├── staff.js
│   │   │   ├── inventory.js
│   │   │   ├── reports.js
│   │   │   ├── settings.js
│   │   │   ├── vouchers.js
│   │   │   ├── notifications.js
│   │   │   └── ai.js             # AI Chat & Insights
│   │   ├── middleware/
│   │   │   └── validate.js       # Zod validation schemas
│   │   ├── services/             # Shared business logic (if any)
│   │   └── utils/               # Helper utilities
│   ├── migrations/              # DB schema migrations
│   ├── scripts/                 # Utility scripts
│   ├── package.json
│   └── .env
│
├── client/                       # Frontend React SPA
│   ├── src/
│   │   ├── main.jsx             # React DOM entry
│   │   ├── App.jsx             # Router & protected routes
│   │   ├── index.css           # Tailwind + custom CSS
│   │   ├── api/                # Axios API calls
│   │   ├── components/
│   │   │   ├── layout/         # AppLayout, Sidebar, Header
│   │   │   ├── ui/             # Reusable UI (Button, Modal, Card...)
│   │   │   └── ...
│   │   ├── pages/              # Page components
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TablesPage.jsx
│   │   │   ├── POSPage.jsx
│   │   │   ├── MenuPage.jsx
│   │   │   ├── CustomersPage.jsx
│   │   │   ├── BookingsPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── StaffPage.jsx
│   │   │   ├── InventoryPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   ├── VouchersPage.jsx
│   │   │   ├── PurchasesPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── LandingPage.jsx
│   │   ├── contexts/           # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/              # Custom React hooks
│   │   └── lib/                # Utilities (cn, format...)
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── uploads/                     # Uploaded images
├── backups/                    # JSON backups
├── data/                       # Data files
├── diagrams/                   # UML diagrams (drawio)
├── docs/                       # Documentation
│   └── CHUYEN_DE_TOT_NGHIEP.md
├── .env                        # Environment variables
├── package.json               # Root package (scripts)
└── README.md
```

## 5.3. Triển khai Backend

### 5.3.1. Database Connection (db.js)

Hệ thống hỗ trợ dual-database:

```javascript
// db.js - Kết nối SQLite với fallback từ .env
import Database from 'better-sqlite3';
import path from 'path';

// Ưu tiên SQL Server nếu có, fallback SQLite
const DB_TYPE = process.env.DB_TYPE || 'sqlite';
const DB_PATH = process.env.DB_PATH || './cafe.db';

let db;

if (DB_TYPE === 'sqlite') {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
} else {
  // SQL Server connection via tedious (if configured)
  // ... (production setup)
}

export default db;
```

### 5.3.2. Khởi tạo Database

Schema được khởi tạo tự động khi server start (trong `setup-db.js` hoặc inline trong `index.js`):

```javascript
// Tạo bảng nếu chưa tồn tại
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'staff',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'empty',
    rate_per_hour REAL DEFAULT 50000,
    current_session_start DATETIME,
    current_order_id INTEGER,
    drinks_total REAL DEFAULT 0,
    billiard_total REAL DEFAULT 0
  );

  -- ... (15 bảng còn lại)
`);

// Tạo admin mặc định nếu chưa có
const adminExists = db.prepare("SELECT id FROM users WHERE role='admin'").get();
if (!adminExists) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)").run('admin', hash, 'admin');
}
```

## 5.4. Triển khai Frontend

### 5.4.1. Cấu hình Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### 5.4.2. API Service (Axios)

```javascript
// api/index.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

## 5.5. Tích hợp AI Assistant

### 5.5.1. Cấu hình Gemini

```javascript
// server-api/src/routes/ai.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function publicChat(req, res) {
  const { message } = req.body;

  // Lấy settings để xây dựng system prompt
  const rows = await db.prepare('SELECT [key], [value] FROM settings').all();
  const settings = Object.fromEntries(rows.map(r => [r.key, r.value]));

  const systemPrompt = `Bạn là tư vấn viên thân thiện của ${settings.business_name || 'Bida Cafe'}.
- Địa chỉ: ${settings.business_address || 'N/A'}
- Giờ mở cửa: ${settings.open_time || '09:00'} - ${settings.close_time || '23:00'}
- Giá bàn: ${settings.default_table_rate || '50000'}đ/giờ
Trả lời ngắn gọn, thân thiện bằng tiếng Việt.`;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent([systemPrompt, message]);
  const response = await result.response;

  res.json({ success: true, reply: response.text() });
}
```

### 5.5.2. Admin Chat với Tool Use

```javascript
export async function adminChat(req, res) {
  const { message } = req.body;

  // Tool definitions (schema)
  const tools = [
    {
      name: 'get_revenue_report',
      description: 'Lấy báo cáo doanh thu',
      parameters: { type: 'object', properties: {} }
    },
    {
      name: 'get_inventory',
      description: 'Lấy danh sách tồn kho',
      parameters: { type: 'object', properties: {} }
    },
    {
      name: 'get_top_products',
      description: 'Lấy top sản phẩm bán chạy',
      parameters: { type: 'object', properties: {} }
    }
  ];

  // Xây dựng context từ DB
  const context = await buildContext();

  const systemPrompt = `Bạn là trợ lý phân tích kinh doanh cho quản lý Bida Cafe.
Dữ liệu hiện tại:
${JSON.stringify(context, null, 2)}

Khi khách hỏi về doanh thu, kho, sản phẩm:
1. Gọi tool phù hợp
2. Đợi kết quả
3. Phân tích và trả lời bằng tiếng Việt`;

  // Gọi Gemini với tools (sử dụng function calling nếu model hỗ trợ)
  // ...
}
```

## 5.6. Công thức nghiệp vụ chính

### 5.6.1. Tính tiền bida

```javascript
// Tính phí theo giờ (làm tròn lên)
function calculateBilliardTotal(startTime, ratePerHour) {
  const now = new Date();
  const start = new Date(startTime);
  const diffMs = now - start; // milliseconds
  const diffHours = diffMs / (1000 * 60 * 60);
  const roundedHours = Math.ceil(diffHours * 4) / 4; // Làm tròn 15 phút
  return roundedHours * ratePerHour;
}
```

### 5.6.2. Tính điểm Loyalty

```javascript
// Cộng điểm sau mỗi thanh toán
function calculateLoyaltyPoints(totalSpent, rate) {
  // Mặc định: 1% giá trị (rate=10 nghĩa là 10 điểm / 1000đ)
  return Math.floor(totalSpent * rate / 1000);
}

// Xác định hạng dựa trên tổng chi tiêu
function getTier(totalSpent) {
  if (totalSpent >= 5000000) return 'Platinum';
  if (totalSpent >= 2000000) return 'Gold';
  if (totalSpent >= 500000) return 'Silver';
  return 'Bronze';
}
```

### 5.6.3. Áp dụng giảm giá Loyalty

```javascript
// Giảm giá theo hạng (không áp dụng cho tiền bida)
const TIER_DISCOUNTS = {
  'Bronze': 0,
  'Silver': 0.05,  // 5%
  'Gold': 0.10,    // 10%
  'Platinum': 0.15 // 15%
};

function applyTierDiscount(subtotal, tier) {
  const rate = TIER_DISCOUNTS[tier] || 0;
  return subtotal * rate;
}
```

### 5.6.4. Tính thuế VAT

```javascript
// Thuế VAT 8%
const VAT_RATE = 0.08;

function calculateVAT(subtotal, discount) {
  const taxable = subtotal - discount;
  return Math.round(taxable * VAT_RATE);
}
```

### 5.6.5. Validation Voucher

```javascript
function validateVoucher(voucher, cartTotal, customerTier) {
  const now = new Date();

  if (!voucher.active) return { valid: false, reason: 'Voucher đã bị vô hiệu hóa' };
  if (new Date(voucher.expires_at) < now) return { valid: false, reason: 'Voucher đã hết hạn' };
  if (voucher.used_count >= voucher.max_uses) return { valid: false, reason: 'Voucher đã hết lượt sử dụng' };
  if (cartTotal < voucher.min_order) return { valid: false, reason: `Đơn tối thiểu ${voucher.min_order}đ` };

  // Tính giảm giá
  let discount = 0;
  if (voucher.type === 'percent') {
    discount = cartTotal * (voucher.value / 100);
    if (voucher.max_discount) discount = Math.min(discount, voucher.max_discount);
  } else {
    discount = voucher.value;
  }

  return { valid: true, discount };
}
```

## 5.7. Kết quả đạt được

### 5.7.1. Chức năng đã triển khai

| Module | Chức năng | Trạng thái |
|--------|-----------|------------|
| **Auth** | Đăng nhập, JWT, RBAC | ✅ Hoàn thành |
| **Bàn** | Grid bàn, start/end/reserve, realtime | ✅ Hoàn thành |
| **POS** | Gọi món, cart, thanh toán, voucher | ✅ Hoàn thành |
| **Menu** | CRUD sản phẩm, danh mục, hình ảnh | ✅ Hoàn thành |
| **Khách hàng** | CRUD, loyalty, thăng hạng tự động | ✅ Hoàn thành |
| **Đặt bàn** | Tạo, xác nhận, check-in, lịch | ✅ Hoàn thành |
| **Voucher** | CRUD, validation, copy code | ✅ Hoàn thành |
| **Kho** | Tồn kho, cảnh báo, điều chỉnh | ✅ Hoàn thành |
| **Nhập hàng** | CRUD đơn nhập, tự động +kho | ✅ Hoàn thành |
| **Nhân viên** | Danh sách, clock-in/out, lịch sử ca | ✅ Hoàn thành |
| **Báo cáo** | KPI dashboard, biểu đồ, export CSV | ✅ Hoàn thành |
| **AI Chat** | Public chatbot, admin insights | ✅ Hoàn thành |
| **Thông báo** | CRUD, đánh dấu đã đọc | ✅ Hoàn thành |
| **Cài đặt** | Thông tin DN, pricing, backup | ✅ Hoàn thành |
| **Landing Page** | Trang công khai, AI chat widget | ✅ Hoàn thành |

### 5.7.2. Giao diện

- **Dashboard:** 4 KPI cards, biểu đồ doanh thu 7 ngày, AI insight.
- **Tables:** Grid 4 cột, màu trạng thái theo quy ước.
- **POS:** 2 cột layout, tabs danh mục, cart tích hợp.
- **Reports:** Recharts biểu đồ, export CSV.
- **Landing:** Hero section, table status, AI chat floating button.
- **Responsive:** Hỗ trợ màn hình desktop và tablet.

### 5.7.3. Hiệu năng

- **Thời gian phản hồi API:** Trung bình < 200ms (SQLite local).
- **Thời gian tải trang:** < 2 giây (first load có code splitting).
- **Bundle size:** ~150KB JS (gzipped) cho client.

### 5.7.4. Bảo mật

- ✅ JWT authentication với bcrypt hashing.
- ✅ RBAC phân quyền admin/staff.
- ✅ Input validation với Zod schemas.
- ✅ 100% prepared statements (SQL injection protection).
- ✅ Rate limiting trên API.
- ✅ Helmet security headers.
- ✅ File upload validation (MIME + extension).

### 5.7.5. Khả năng mở rộng

- **Database:** Dễ dàng chuyển từ SQLite sang SQL Server bằng config.
- **AI:** Gemini API key dễ thay đổi qua settings.
- **Module:** Kiến trúc route-based, thêm module mới không ảnh hưởng code cũ.

---

# CHƯƠNG 6. ĐÁNH GIÁ, HẠN CHẾ VÀ HƯỚNG PHÁT TRIỂN

## 6.1. Đánh giá hệ thống

### 6.1.1. Đánh giá theo tiêu chí chức năng

| Tiêu chí | Kết quả | Ghi chú |
|---------|---------|---------|
| Đáp ứng yêu cầu | **Đạt 95%** | 15/16 module chính hoàn thành. Module thanh toán online chưa tích hợp thực tế. |
| Tính đúng đắn | **Đạt** | Các nghiệp vụ tính tiền, loyalty, voucher hoạt động đúng theo thiết kế. |
| Tính nhất quán | **Đạt** | Dữ liệu nhất quán qua transaction trong thanh toán và nhập hàng. |
| Tính an toàn | **Đạt** | Không phát hiện lỗi bảo mật nghiêm trọng trong quá trình test. |

### 6.1.2. Đánh giá hiệu năng

| Chỉ số | Mục tiêu | Thực tế |
|--------|---------|---------|
| Response time API | < 500ms | ~150ms (SQLite) |
| Page load (first) | < 3s | ~1.5s |
| Concurrent users | > 10 | > 20 (ước tính) |

### 6.1.3. Đánh giá bảo mật

| Kiểm tra | Kết quả |
|---------|---------|
| SQL Injection | ✅ Pass — 100% prepared statements |
| XSS | ✅ Pass — React tự escape output |
| CSRF | ✅ Pass — JWT không dùng cookie cho sensitive ops |
| Brute force | ✅ Pass — Rate limiting 100 req/15min |
| Password storage | ✅ Pass — bcrypt cost=10 |

## 6.2. So sánh với các giải pháp hiện có

### 6.2.1. Bảng so sánh

| Tiêu chí | Giải pháp thủ công | Phần mềm POS thông thường | Hệ thống này |
|---------|-------------------|--------------------------|--------------|
| Quản lý bàn | Sổ giấy, dễ sai sót | Grid bàn cơ bản | Grid realtime, AI tư vấn |
| Tính tiền | Máy tính tay | Tự động tính giờ | Tự động, chính xác |
| Loyalty | Không có | Có (cơ bản) | Tự động, đa hạng |
| AI tích hợp | Không | Không | ✅ Chatbot + Insights |
| Báo cáo | Excel thủ công | Xuất file cơ bản | Dashboard + AI insights |
| Đặt bàn online | Gọi điện | Không | ✅ Form online + AI |
| Chi phí | Thấp (nhân công cao) | Cao (license) | Trung bình (open source) |

### 6.2.2. Điểm mạnh của hệ thống

1. **Tích hợp AI:** Chatbot tư vấn và insights phân tích — không có trong hầu hết giải pháp POS thông thường.
2. **Loyalty đa hạng:** Tự động thăng hạng, phần trăm giảm giá theo hạng.
3. **Landing page tích hợp:** Khách hàng có thể xem bàn trống và đặt bàn online mà không cần gọi điện.
4. **Open source:** Miễn phí license, dễ tùy chỉnh.

## 6.3. Hạn chế của hệ thống

1. **Chưa có ứng dụng di động:** Giao diện mobile chỉ ở mức responsive cơ bản, chưa tối ưu như native app.
2. **Thanh toán online chưa tích hợp:** Chưa kết nối cổng thanh toán (VNPay, MoMo, ZaloPay).
3. **AI phụ thuộc API bên thứ ba:** Cần Google API key, chi phí sử dụng Gemini theo usage.
4. **Không có notification push:** Khách đặt bàn online chưa nhận SMS/email xác nhận tự động.
5. **SQLite không phù hợp cho production lớn:** Chỉ phù hợp cho quán nhỏ (< 10 nhân viên đồng thời). SQL Server cần license.
6. **Chưa có multi-branch:** Không hỗ trợ quản lý nhiều chi nhánh.

## 6.4. Hướng phát triển tiếp theo

### 6.4.1. Ngắn hạn (1-3 tháng)

1. **Tích hợp thanh toán online:** Kết nối VNPay/MoMo/ZaloPay để khách có thể đặt bàn và thanh toán online.
2. **SMS/Email notification:** Gửi xác nhận đặt bàn qua Twilio SMS và SendGrid.
3. **Tối ưu giao diện mobile:** Cải thiện UX trên điện thoại, PWA (Progressive Web App).

### 6.4.2. Trung hạn (3-6 tháng)

4. **Ứng dụng di động:** React Native app cho nhân viên (check bàn, order nhanh) và khách hàng (đặt bàn, xem điểm).
5. **Multi-branch:** Hỗ trợ quản lý nhiều chi nhánh từ một dashboard.
6. **BI Dashboard nâng cao:** Tích hợp Metabase hoặc Power BI cho báo cáo chuyên sâu.

### 6.4.3. Dài hạn (6-12 tháng)

7. **AI nâng cao:** Dự báo doanh thu (forecasting), gợi ý khuyến mãi tự động, phân tích hành vi khách hàng.
8. **IoT tích hợp:** Kết nối cảm biến bàn (tự động phát hiện có người) để giảm thao tác staff.
9. **Loyalty app riêng:** App khách hàng với ví điểm, voucher cá nhân hóa.

---

# KẾT LUẬN

Trong quá trình thực hiện đề tài "Hệ thống quản lý bida-cafe tích hợp AI tư vấn đặt bàn", nhóm đã hoàn thành các mục tiêu đề ra:

1. **Phân tích và thiết kế hệ thống** theo chuẩn UML, đảm bảo tính logic và dễ bảo trì.
2. **Xây dựng backend RESTful API** với Node.js/Express, hỗ trợ đầy đủ 15 module nghiệp vụ.
3. **Xây dựng frontend React SPA** với giao diện hiện đại, responsive, sử dụng Tailwind CSS.
4. **Tích hợp Google Gemini AI** vào hai luồng: chatbot công khai và phân tích kinh doanh cho admin.
5. **Triển khai hệ thống loyalty** đa hạng với tích điểm và giảm giá tự động.
6. **Đảm bảo bảo mật** qua JWT, RBAC, prepared statements và validation.

Hệ thống đã được kiểm thử cơ bản và đáp ứng yêu cầu về chức năng, hiệu năng và bảo mật. Đề tài cung cấp giải pháp thực tế cho các quán bida-cafe vừa và nhỏ, góp phần số hóa quy trình vận hành và nâng cao trải nghiệm khách hàng thông qua tích hợp AI.

---

# TÀI LIỆU THAM KHẢO

1. Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson.
2. Fowler, M. (2003). *UML Distilled: A Brief Guide to the Standard Object Modeling Language* (3rd ed.). Addison-Wesley.
3. React Documentation. https://react.dev
4. Express.js Documentation. https://expressjs.com
5. Tailwind CSS Documentation. https://tailwindcss.com
6. better-sqlite3 Documentation. https://github.com/WiseLibs/better-sqlite3
7. Google Gemini API Documentation. https://ai.google.dev
8. JWT.io. https://jwt.io
9. OWASP Security Guidelines. https://owasp.org

---

# PHỤ LỤC

## Phụ lục A. Cấu trúc cơ sở dữ liệu chi tiết

### A.1. Bảng USERS

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'staff' CHECK(role IN ('admin', 'staff')),
    password_hint TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### A.2. Bảng TABLES

```sql
CREATE TABLE tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'empty' CHECK(status IN ('empty', 'occupied', 'reserved', 'maintenance')),
    rate_per_hour REAL DEFAULT 50000,
    current_session_start DATETIME,
    current_order_id INTEGER,
    current_customer_name TEXT,
    current_customer_phone TEXT,
    drinks_total REAL DEFAULT 0,
    billiard_total REAL DEFAULT 0,
    image_url TEXT,
    FOREIGN KEY (current_order_id) REFERENCES orders(id) ON DELETE SET NULL
);
```

### A.3. Bảng CUSTOMERS

```sql
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE,
    email TEXT,
    points INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'Bronze' CHECK(tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    total_spent REAL DEFAULT 0,
    visit_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### A.4. Bảng ORDERS

```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    customer_name TEXT,
    customer_phone TEXT,
    table_id INTEGER,
    subtotal REAL DEFAULT 0,
    discount REAL DEFAULT 0,
    tier_discount REAL DEFAULT 0,
    voucher_discount REAL DEFAULT 0,
    voucher_code TEXT,
    tax REAL DEFAULT 0,
    total REAL DEFAULT 0,
    payment_method TEXT CHECK(payment_method IN ('cash', 'transfer')),
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'paid', 'cancelled')),
    points_earned INTEGER DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL
);
```

### A.5. Bảng PRODUCTS

```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    cost_price REAL DEFAULT 0,
    stock REAL DEFAULT 0,
    unit TEXT DEFAULT 'phần',
    image_url TEXT,
    is_deleted INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

### A.6. Bảng BOOKINGS

```sql
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT,
    table_id INTEGER,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    status TEXT DEFAULT 'booked' CHECK(status IN ('booked', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL
);
```

### A.7. Bảng VOUCHERS

```sql
CREATE TABLE vouchers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    type TEXT CHECK(type IN ('percent', 'fixed')),
    value REAL NOT NULL,
    max_discount REAL,
    min_order REAL DEFAULT 0,
    expires_at DATETIME,
    max_uses INTEGER DEFAULT 100,
    used_count INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Phụ lục B. Danh mục API Endpoints

### B.1. Authentication

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| POST | `/api/auth/logout` | Đăng xuất | ✅ |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại | ✅ |

### B.2. Tables

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/tables` | Danh sách bàn | ✅ |
| GET | `/api/tables/public` | Danh sách bàn (public) | ❌ |
| GET | `/api/tables/:id` | Chi tiết bàn | ✅ |
| POST | `/api/tables` | Tạo bàn mới | ✅ |
| POST | `/api/tables/:id/start` | Bắt đầu phiên | ✅ |
| POST | `/api/tables/:id/end` | Kết thúc phiên | ✅ |
| POST | `/api/tables/:id/reserve` | Đặt bàn | ✅ |
| POST | `/api/tables/:id/add-drink` | Thêm đồ uống | ✅ |
| GET | `/api/tables/:id/payment-preview` | Xem trước thanh toán | ✅ |

### B.3. Orders

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/orders` | Danh sách đơn hàng | ✅ |
| GET | `/api/orders/history` | Lịch sử đơn hàng | ✅ |
| GET | `/api/orders/:id` | Chi tiết đơn | ✅ |
| POST | `/api/orders` | Tạo đơn hàng | ✅ |
| POST | `/api/orders/:id/cancel` | Hủy đơn | ✅ |

### B.4. Products & Categories

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/products` | Danh sách sản phẩm | ✅ |
| GET | `/api/products/public` | Danh sách sản phẩm (public) | ❌ |
| GET | `/api/products/:id` | Chi tiết sản phẩm | ✅ |
| POST | `/api/products` | Tạo sản phẩm | ✅ |
| PUT | `/api/products/:id` | Cập nhật sản phẩm | ✅ |
| DELETE | `/api/products/:id` | Xóa sản phẩm (soft) | ✅ |
| GET | `/api/categories` | Danh sách danh mục | ✅ |

### B.5. Customers

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/customers` | Danh sách khách hàng | ✅ |
| GET | `/api/customers/search` | Tìm kiếm KH | ✅ |
| GET | `/api/customers/:id` | Chi tiết KH | ✅ |
| POST | `/api/customers` | Tạo KH | ✅ |
| PUT | `/api/customers/:id` | Cập nhật KH | ✅ |
| POST | `/api/customers/:id/add-points` | Cộng điểm | ✅ |
| DELETE | `/api/customers/:id` | Xóa KH | ✅ |

### B.6. Bookings

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/bookings` | Danh sách đặt bàn | ✅ |
| GET | `/api/bookings/schedule` | Lịch đặt bàn | ✅ |
| POST | `/api/bookings` | Tạo đặt bàn | ✅ |
| POST | `/api/bookings/:id/confirm` | Xác nhận | ✅ |
| POST | `/api/bookings/:id/check-in` | Check-in | ✅ |
| POST | `/api/bookings/:id/cancel` | Hủy đặt | ✅ |

### B.7. Staff & Shifts

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/staff` | Danh sách nhân viên | ✅ |
| GET | `/api/shifts` | Lịch sử ca | ✅ |
| GET | `/api/shifts/active` | Ca đang hoạt động | ✅ |
| POST | `/api/shifts/clock-in` | Clock-in | ✅ |
| POST | `/api/shifts/:id/clock-out` | Clock-out | ✅ |

### B.8. Inventory & Purchases

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/inventory` | Danh sách tồn kho | ✅ |
| POST | `/api/inventory/:id/adjust` | Điều chỉnh tồn kho | ✅ |
| GET | `/api/purchases` | Danh sách đơn nhập | ✅ |
| POST | `/api/purchases` | Tạo đơn nhập | ✅ |
| GET | `/api/suppliers` | Danh sách NCC | ✅ |
| POST | `/api/suppliers` | Tạo NCC | ✅ |

### B.9. Reports

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/reports/kpi` | KPI dashboard | ✅ |
| GET | `/api/reports/revenue` | Báo cáo doanh thu | ✅ |
| GET | `/api/reports/products` | Top sản phẩm | ✅ |
| GET | `/api/reports/export` | Export CSV | ✅ |

### B.10. Settings

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/settings` | Lấy cài đặt | ✅ |
| POST | `/api/settings/business` | Cập nhật thông tin DN | ✅ |
| POST | `/api/settings/pricing` | Cấu hình giá | ✅ |
| POST | `/api/settings/loyalty` | Cấu hình loyalty | ✅ |
| POST | `/api/settings/backup` | Sao lưu dữ liệu | ✅ (Admin) |
| GET | `/api/settings/users` | Danh sách users | ✅ (Admin) |
| POST | `/api/settings/users` | Tạo user | ✅ (Admin) |

### B.11. Vouchers

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/vouchers` | Danh sách voucher | ✅ |
| GET | `/api/vouchers/eligible` | Voucher phù hợp | ✅ |
| POST | `/api/vouchers/validate` | Kiểm tra voucher | ✅ |
| POST | `/api/vouchers` | Tạo voucher | ✅ |
| POST | `/api/vouchers/:id/toggle` | Bật/tắt voucher | ✅ |
| DELETE | `/api/vouchers/:id` | Xóa voucher | ✅ |

### B.12. Notifications

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/notifications` | Danh sách thông báo | ✅ |
| POST | `/api/notifications` | Tạo thông báo | ✅ |
| POST | `/api/notifications/:id/read` | Đánh dấu đã đọc | ✅ |
| POST | `/api/notifications/mark-all-read` | Đọc tất cả | ✅ |
| DELETE | `/api/notifications/:id` | Xóa | ✅ |

### B.13. AI

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/ai/chat` | Chat công khai | ❌ |
| POST | `/api/admin/ai/chat` | Chat admin | ✅ |
| GET | `/api/ai/insights` | AI insights | ✅ |

## Phụ lục C. Sơ đồ ERD đầy đủ

(Xem file `docs/diagram/erd-diagram-clean.drawio`)

## Phụ lục D. Chi tiết các Use Case

(Xem Chương 4.3)

## Phụ lục E. Công thức và quy tắc nghiệp vụ

(Xem Chương 5.6)

## Phụ lục F. Bảng thuật ngữ

| Tiếng Việt | Tiếng Anh | Giải thích |
|-----------|-----------|------------|
| POS | Point of Sale | Hệ thống bán hàng |
| KPI | Key Performance Indicator | Chỉ số hiệu suất chính |
| JWT | JSON Web Token | Token xác thực |
| RBAC | Role-Based Access Control | Phân quyền theo vai trò |
| CRUD | Create, Read, Update, Delete | Bốn thao tác cơ bản |
| SPA | Single Page Application | Ứng dụng một trang |
| AI | Artificial Intelligence | Trí tuệ nhân tạo |
| LLM | Large Language Model | Mô hình ngôn ngữ lớn |
| SQL | Structured Query Language | Ngôn ngữ truy vấn |
| VAT | Value Added Tax | Thuế giá trị gia tăng |
| API | Application Programming Interface | Giao diện lập trình ứng dụng |
| CSV | Comma-Separated Values | File dữ liệu phân cách bằng dấu phẩy |
| Loyalty | Loyalty Program | Chương trình khách hàng thân thiết |

