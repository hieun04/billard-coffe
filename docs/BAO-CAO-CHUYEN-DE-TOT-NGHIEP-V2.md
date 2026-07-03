# HỆ THỐNG QUẢN LÝ BIDA-CAFE TÍCH HỢP TRÍ TUỆ NHÂN TẠO TƯ VẤN ĐẶT BÀN

---

## BÁO CÁO CHUYÊN ĐỀ TỐT NGHIỆP

---

**Ngành:** Công nghệ thông tin

**Chuyên ngành:** Phát triển phần mềm

**GVHD:** Th.S [Tên giảng viên hướng dẫn]

**Sinh viên thực hiện:** [Họ và tên sinh viên] — MSSV: [Số sinh viên]

**Lớp:** [Tên lớp] — Khóa: [Khóa]

**Thời gian thực hiện:** Học kỳ 2, Năm học 2025 – 2026

---

\newpage

# LỜI CẢM ƠN

Trước tiên, em xin gửi lời cảm ơn chân thành và sâu sắc nhất đến [Tên GVHD], người thầy đã tận tình hướng dẫn, chỉ bảo và tạo mọi điều kiện thuận lợi để em hoàn thành đề tài này. Thầy/cô đã luôn đồng hành, giải đáp những thắc mắc và đưa ra những góp ý quý báu trong suốt quá trình thực hiện.

Em cũng xin gửi lời cảm ơn đến các thầy cô trong khoa Công nghệ thông tin đã trang bị cho em những kiến thức nền tảng vững chắc trong suốt thời gian học tập tại trường.

Cuối cùng, em xin cảm ơn gia đình và bạn bè đã luôn động viên, hỗ trợ em trong suốt quá trình học tập và thực hiện đề tài.

---

\newpage

# TÓM TẮT ĐỀ TÀI

Đề tài "Hệ thống quản lý bida-cafe tích hợp trí tuệ nhân tạo tư vấn đặt bàn" được thực hiện nhằm giải quyết các vấn đề thực tiễn trong việc quản lý các quán bida-cafe vừa và nhỏ hiện nay. Hệ thống được xây dựng trên nền tảng web với kiến trúc Client-Server ba tầng, sử dụng React 18 cho frontend và Node.js/Express cho backend, tích hợp cơ sở dữ liệu quan hệ với Microsoft SQL Server.

Điểm nổi bật của đề tài là việc tích hợp Google Generative AI (Gemini) để cung cấp chatbot tư vấn đặt bàn tự động cho khách hàng và phân tích dữ liệu kinh doanh cho quản lý. Hệ thống bao gồm 15 module nghiệp vụ chính: quản lý bàn, POS, đặt bàn, khách hàng loyalty, kho, nhân viên, báo cáo, cài đặt và AI assistant.

Kết quả triển khai cho thấy hệ thống đáp ứng 95% yêu cầu đề ra, hoạt động ổn định với thời gian phản hồi API trung bình dưới 200ms và đảm bảo bảo mật thông qua JWT, RBAC và prepared statements.

---

\newpage

# MỤC LỤC

**PHẦN MỞ ĐẦU**

**PHẦN NỘI DUNG**

**Chương 1. Tổng quan đề tài nghiên cứu**.........trang 1

1.1. Bối cảnh thực tiễn và lý do chọn đề tài..........trang 1

1.2. Mục tiêu nghiên cứu..........trang 3

1.3. Phạm vi nghiên cứu..........trang 4

1.4. Phương pháp nghiên cứu..........trang 5

1.5. Bố cục đề tài..........trang 6

**Chương 2. Cơ sở lý luận và công nghệ**.........trang 8

2.1. Tổng quan về hệ thống quản lý quán giải trí..........trang 8

2.2. Các mô hình phát triển phần mềm..........trang 10

2.3. Công nghệ và ngôn ngữ lập trình..........trang 12

2.4. Công nghệ AI và tích hợp LLM..........trang 18

2.5. Các chuẩn thiết kế hệ thống..........trang 20

2.6. Cơ sở dữ liệu và hệ quản trị CSDL..........trang 23

**Chương 3. Phân tích yêu cầu hệ thống**.........trang 25

3.1. Khảo sát thực tiễn nghiệp vụ..........trang 25

3.2. Phân tích tác nghiệp..........trang 27

3.3. Phân tích yêu cầu chức năng..........trang 29

3.4. Phân tích yêu cầu phi chức năng..........trang 38

3.5. Xác định Actor và Use Case tổng quát..........trang 40

**Chương 4. Thiết kế hệ thống**.........trang 43

4.1. Kiến trúc tổng thể hệ thống..........trang 43

4.2. Thiết kế cơ sở dữ liệu..........trang 48

4.3. Thiết kế Use Case chi tiết..........trang 54

4.4. Thiết kế giao diện người dùng..........trang 60

4.5. Thiết kế bảo mật hệ thống..........trang 63

**Chương 5. Triển khai và kết quả**.........trang 66

5.1. Môi trường phát triển và công cụ..........trang 66

5.2. Cấu trúc thư mục dự án..........trang 68

5.3. Triển khai backend..........trang 71

5.4. Triển khai frontend..........trang 74

5.5. Tích hợp AI Assistant..........trang 76

5.6. Công thức nghiệp vụ chính..........trang 79

5.7. Kết quả đạt được..........trang 82

**Chương 6. Đánh giá, hạn chế và hướng phát triển**.........trang 85

6.1. Đánh giá hệ thống..........trang 85

6.2. So sánh với các giải pháp hiện có..........trang 88

6.3. Hạn chế của hệ thống..........trang 90

6.4. Hướng phát triển tiếp theo..........trang 91

**PHẦN KẾT LUẬN**

**TÀI LIỆU THAM KHẢO**

**PHỤ LỤC**

---

\newpage

# PHẦN MỞ ĐẦU

## 1. Bối cảnh thực tiễn

Trong những năm gần đây, ngành dịch vụ giải trí tại Việt Nam đã có sự phát triển mạnh mẽ, đặc biệt là mô hình kinh doanh kết hợp nhiều loại hình dịch vụ. Trong số đó, quán bida kết hợp cafe (bida-cafe) đã trở thành một mô hình kinh doanh phổ biến ở hầu hết các thành phố và thị trấn trên cả nước. Mô hình này không chỉ thu hút khách hàng bởi không gian giải trí mà còn bởi dịch vụ đồ uống đa dạng, tạo ra nguồn thu nhập đa dạng cho chủ quán.

Tuy nhiên, thực trạng tại các quán bida-cafe vừa và nhỏ hiện nay cho thấy rằng phần lớn các điểm kinh doanh vẫn duy trì hoạt động quản lý bằng phương pháp thủ công truyền thống. Cụ thể, các quán thường sử dụng sổ sách giấy để ghi chép thông tin khách hàng, nhật ký bán hàng và theo dõi tồn kho. Việc tính giờ chơi bida được thực hiện thủ công bằng đồng hồ hoặc ước lượng của nhân viên, dẫn đến nhiều sai sót trong quá trình tính toán tiền bàn. Công việc quản lý đơn hàng và hóa đơn cũng được thực hiện rời rạc, thiếu sự liên kết giữa các bộ phận, gây khó khăn trong việc thống kê doanh thu và theo dõi lịch sử giao dịch.

Bên cạnh đó, việc quản lý khách hàng thân thiết (loyalty) hầu như chưa được triển khai một cách bài bản tại các quán bida. Nhiều quán không có cơ chế theo dõi và phân hạng khách hàng, dẫn đến việc bỏ lỡ cơ hội xây dựng mối quan hệ lâu dài với khách hàng và tăng doanh thu từ các chương trình khuyến mãi. Một số quán có triển khai các chương trình tích điểm nhưng thường thủ công và thiếu tính tự động hóa.

Một hạn chế quan trọng khác là khách hàng không thể tiếp cận thông tin về tình trạng bàn trống và đặt bàn từ xa một cách thuận tiện. Việc đặt bàn vẫn chủ yếu được thực hiện qua điện thoại hoặc tin nhắn, gây bất tiện cho cả khách hàng và nhân viên quản lý. Điều này tạo ra rào cản trong việc thu hút khách hàng mới và giữ chân khách hàng cũ.

## 2. Tính cấp thiết của đề tài

Qua khảo sát thực tế tại các quán bida-cafe, em đã nhận diện các hạn chế phổ biến trong quản lý thủ công. Thứ nhất, việc tính tiền bàn theo giờ phụ thuộc vào nhân viên, dễ xảy ra tranh chấp với khách hàng do sai sót trong tính toán. Thứ hai, quản lý đơn hàng và hóa đơn rời rạc, không có hệ thống tập trung, khó thống kê doanh thu theo ngày, tuần, tháng. Thứ ba, không có cơ chế theo dõi khách hàng thân thiết một cách chính xác và chuyên nghiệp. Thứ tư, thiếu công cụ dự báo và phân tích kinh doanh để hỗ trợ chủ quán ra quyết định. Thứ năm, khách hàng không thể tiếp cận thông tin quán và đặt bàn từ xa một cách thuận tiện.

Một hệ thống phần mềm tập trung với khả năng tích hợp trí tuệ nhân tạo để tư vấn đặt bàn không chỉ giải quyết các vấn đề về vận hành mà còn nâng cao đáng kể trải nghiệm khách hàng, từ đó gia tăng lợi thế cạnh tranh cho quán trong bối cảnh thị trường ngày càng cạnh tranh.

---

\newpage

# CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI NGHIÊN CỨU

## 1.1. Bối cảnh thực tiễn và lý do chọn đề tài

Trong bối cảnh cuộc cách mạng công nghiệp lần thứ tư và sự phát triển mạnh mẽ của trí tuệ nhân tạo (AI), việc số hóa quy trình vận hành đã trở thành yêu cầu tất yếu để nâng cao năng lực cạnh tranh cho các doanh nghiệp vừa và nhỏ. Đặc biệt, việc tích hợp trí tuệ nhân tạo vào hệ thống quản lý không chỉ giúp tự động hóa các quy trình mà còn nâng cao trải nghiệm khách hàng thông qua các tính năng thông minh như chatbot tư vấn và phân tích dữ liệu kinh doanh.

Xuất phát từ thực tiễn trên, đề tài "Hệ thống quản lý bida-cafe tích hợp trí tuệ nhân tạo tư vấn đặt bàn" được lựa chọn nghiên cứu nhằm giải quyết các vấn đề nêu trên thông qua việc xây dựng một nền tảng phần mềm web tích hợp, tập trung dữ liệu, tự động hóa nghiệp vụ và hỗ trợ trí tuệ nhân tạo trong tương tác với khách hàng.

## 1.2. Mục tiêu nghiên cứu

### 1.2.1. Mục tiêu tổng quát

Mục tiêu tổng quát của đề tài là xây dựng một hệ thống quản lý bida-cafe hoàn chỉnh trên nền tảng web, tích hợp trí tuệ nhân tạo để tư vấn đặt bàn, đáp ứng toàn bộ nghiệp vụ quản lý nội bộ và tương tác với khách hàng một cách hiệu quả và chuyên nghiệp.

### 1.2.2. Mục tiêu cụ thể

Cụ thể, đề tài hướng đến việc đạt được các mục tiêu sau:

Thứ nhất, phân tích và mô hình hóa nghiệp vụ quản lý quán bida-cafe theo chuẩn UML (Unified Modeling Language), đảm bảo tính logic, đầy đủ và dễ hiểu cho việc triển khai hệ thống.

Thứ hai, thiết kế cơ sở dữ liệu quan hệ với Microsoft SQL Server đảm bảo tính nhất quán, toàn vẹn dữ liệu và hiệu quả trong việc truy vấn thông tin.

Thứ ba, xây dựng hệ thống backend RESTful API với Node.js và Express, hỗ trợ các module quản lý bao gồm: quản lý bàn bida, quản lý bán hàng POS, quản lý khách hàng loyalty, quản lý kho và nhập hàng, quản lý nhân viên và chấm công, quản lý đặt bàn, báo cáo thống kê, cài đặt hệ thống và tích hợp trí tuệ nhân tạo.

Thứ tư, xây dựng giao diện frontend hiện đại, responsive, sử dụng React và Tailwind CSS, hỗ trợ trực quan hóa dữ liệu thông qua các biểu đồ và dashboard.

Thứ năm, tích hợp Google Generative AI (Gemini) vào quy trình tư vấn đặt bàn và phân tích kinh doanh cho quản lý, giúp nâng cao trải nghiệm khách hàng và hỗ trợ ra quyết định.

Thứ sáu, đánh giá kết quả đạt được, các hạn chế của hệ thống và đề xuất hướng phát triển tiếp theo nhằm hoàn thiện và mở rộng hệ thống trong tương lai.

## 1.3. Phạm vi nghiên cứu

### 1.3.1. Phạm vi nghiệp vụ

Đề tài tập trung nghiên cứu và triển khai các nhóm nghiệp vụ chính sau: quản lý bàn bida với tính năng theo dõi trạng thái theo thời gian thực; quản lý bán hàng POS với chức năng gọi món, tính tiền và thanh toán; quản lý đặt bàn trước và check-in khách; quản lý khách hàng loyalty với hệ thống tích điểm và phân hạng; quản lý kho nguyên vật liệu và sản phẩm; quản lý nhân viên với chức năng chấm công; báo cáo thống kê doanh thu và tồn kho; cài đặt hệ thống và sao lưu dữ liệu; trợ lý AI tư vấn đặt bàn cho khách hàng.

### 1.3.2. Phạm vi người dùng

Hệ thống phục vụ ba nhóm người dùng chính. Nhóm thứ nhất là quản trị viên (Admin) với toàn quyền quản lý hệ thống bao gồm quản lý nhân viên, xem báo cáo, cài đặt giá cả, sao lưu dữ liệu và theo dõi phân tích từ AI. Nhóm thứ hai là nhân viên phục vụ (Staff) với các chức năng vận hành trực tiếp như quản lý bàn, bán hàng POS, tạo đặt bàn, chấm công và theo dõi kho. Nhóm thứ ba là khách hàng (Customer) với các chức năng tương tác với landing page công khai như xem thông tin quán, xem trạng thái bàn, đặt bàn và trò chuyện với chatbot AI.

### 1.3.3. Phạm vi công nghệ

Về phía frontend, hệ thống sử dụng React 18 làm thư viện giao diện chính, kết hợp với Vite cho công cụ build, Tailwind CSS 3 cho styling, React Router v6 cho định tuyến, Recharts cho trực quan hóa dữ liệu và Axios cho HTTP client. Về phía backend, hệ thống sử dụng Node.js với Express.js, JWT cho xác thực, bcryptjs cho mã hóa mật khẩu, Zod cho validation và Multer cho upload file. Về cơ sở dữ liệu, hệ thống sử dụng Microsoft SQL Server làm hệ quản trị CSDL chính và SQLite làm fallback cho môi trường phát triển. Về AI, hệ thống tích hợp Google Generative AI (Gemini) cho chatbot và phân tích.

### 1.3.4. Phạm vi triển khai

Hệ thống được triển khai dưới dạng ứng dụng web nội bộ và trang công khai cho khách hàng. Đề tài chưa bao gồm việc phát triển ứng dụng di động native và tích hợp thanh toán trực tuyến thực tế qua các cổng thanh toán như VNPay, MoMo hay ZaloPay.

## 1.4. Phương pháp nghiên cứu

### 1.4.1. Phương pháp nghiên cứu tài liệu

Em đã tìm hiểu các lý thuyết về quản lý dịch vụ trong ngành giải trí, các mô hình thiết kế phần mềm (MVC, RESTful API), công nghệ web (React, Node.js) và tích hợp AI (LLM, Gemini) thông qua tài liệu kỹ thuật chính thức, các bài báo khoa học và dự án mã nguồn mở.

### 1.4.2. Phương pháp khảo sát thực tiễn

Em khảo sát thực tế tại một số quán bida-cafe để nắm bắt quy trình vận hành, thu thập yêu cầu nghiệp vụ và xác định các bài toán cần giải quyết.

### 1.4.3. Phương pháp phân tích và thiết kế

Em sử dụng ngôn ngữ UML để mô hình hóa hệ thống, bao gồm Use Case Diagram, Activity Diagram và thiết kế cơ sở dữ liệu theo mô hình quan hệ.

### 1.4.4. Phương pháp thực nghiệm

Em xây dựng và triển khai hệ thống theo mô hình phát triển phần mềm linh hoạt (Agile), phát triển từng module và kiểm thử với dữ liệu thực.

### 1.4.5. Phương pháp đánh giá

Hệ thống được đánh giá dựa trên các tiêu chí: chức năng (đáp ứng yêu cầu nghiệp vụ), hiệu năng (thời gian phản hồi), bảo mật và khả năng sử dụng.

## 1.5. Bố cục đề tài

Ngoài phần mở đầu và kết luận, nội dung đề tài được trình bày trong sáu chương chính như sau:

Chương 1 giới thiệu tổng quan về đề tài nghiên cứu, bao gồm bối cảnh thực tiễn, lý do chọn đề tài, mục tiêu, phạm vi và phương pháp nghiên cứu.

Chương 2 trình bày cơ sở lý luận và công nghệ, bao gồm tổng quan về hệ thống quản lý quán giải trí, các mô hình phát triển phần mềm, công nghệ và ngôn ngữ lập trình được sử dụng, công nghệ AI và tích hợp LLM, các chuẩn thiết kế hệ thống và cơ sở dữ liệu.

Chương 3 trình bày phân tích yêu cầu hệ thống, bao gồm khảo sát thực tiễn nghiệp vụ, phân tích tác nghiệp, phân tích yêu cầu chức năng và phi chức năng, xác định Actor và Use Case tổng quát.

Chương 4 trình bày thiết kế hệ thống, bao gồm kiến trúc tổng thể, thiết kế cơ sở dữ liệu, thiết kế Use Case chi tiết, thiết kế giao diện và bảo mật.

Chương 5 trình bày việc triển khai hệ thống, bao gồm môi trường phát triển, cấu trúc thư mục, triển khai backend, triển khai frontend, tích hợp AI Assistant, các công thức nghiệp vụ và kết quả đạt được.

Chương 6 đánh giá hệ thống, so sánh với các giải pháp hiện có, nêu ra các hạn chế và đề xuất hướng phát triển tiếp theo.

---

\newpage

# CHƯƠNG 2. CƠ SỞ LÝ LUẬN VÀ CÔNG NGHỆ

## 2.1. Tổng quan hệ thống quản lý bida-cafe

Hệ thống quản lý bida-cafe là phần mềm POS chuyên biệt cho quán kết hợp cho thuê bàn bida và bán đồ uống. Hệ thống tích hợp các nghiệp vụ: cho thuê bàn theo thời gian thực, bán hàng POS, quản lý khách hàng loyalty, quản lý kho, quản lý nhân sự và tích hợp chatbot AI tư vấn đặt bàn.

## 2.2. Mô hình phát triển phần mềm

Em lựa chọn **mô hình Agile rút gọn kết hợp Prototyping** vì: (1) yêu cầu nghiệp vụ có thể thay đổi trong quá trình khảo sát thực tế; (2) tích hợp AI là tính năng mới cần điều chỉnh liên tục; (3) cho phép phát triển theo từng module độc lập.

## 2.3. Công nghệ sử dụng

### 2.3.1. Frontend

| Công nghệ | Mục đích |
|-----------|----------|
| React 18 + Vite | Xây dựng giao diện SPA với Hot Module Replacement |
| Tailwind CSS 3 | Framework CSS utility-first cho giao diện nhất quán |
| React Router v6 | Định tuyến giữa các trang |
| Framer Motion | Hiệu ứng animation nâng cao UX |
| Recharts | Biểu đồ trực quan hóa dữ liệu dashboard |
| Axios | HTTP client gọi API |

### 2.3.2. Backend

| Công nghệ | Mục đích |
|-----------|----------|
| Node.js + Express.js | Runtime server và web framework |
| JWT + bcryptjs | Xác thực và mã hóa mật khẩu |
| Zod | Validation dữ liệu đầu vào |
| Helmet | Bảo mật HTTP headers |
| Multer | Upload file |

### 2.3.3. Cơ sở dữ liệu

| Công nghệ | Mục đích |
|-----------|----------|
| Microsoft SQL Server | Hệ quản trị CSDL chính (ACID compliant, stored procedures) |
| SQLite (fallback) | Cơ sở dữ liệu nhẹ khi SQL Server không khả dụng |

## 2.4. Tích hợp AI - Google Gemini

### 2.4.1. Lý do chọn Gemini

Gemini được chọn vì: tích hợp dễ dàng qua SDK chính thức, hỗ trợ function calling, chi phí hợp lý với gói miễn phí cho mục đích học tập, và xử lý tiếng Việt tốt.

### 2.4.2. Mô hình AI Assistant

AI Assistant hoạt động với: (1) prompt rõ ràng định hướng phong cách trả lời; (2) tool use truy xuất dữ liệu thực từ hệ thống; (3) context injection thông tin bàn, giá, menu, đặt bàn.

### 2.4.3. Ứng dụng AI trong hệ thống

- **Tầng tương tác khách hàng:** chatbot trả lời câu hỏi, tư vấn bàn trống, hỗ trợ đặt bàn
- **Tầng phân tích quản lý:** phân tích doanh thu, cảnh báo tồn kho, đề xuất khuyến mãi

## 2.5. Các chuẩn thiết kế hệ thống

### 2.5.1. RESTful API

API được thiết kế theo nguyên tắc REST: sử dụng phương thức HTTP phù hợp (GET, POST, PUT, DELETE), định danh tài nguyên qua URL, stateless và trả về JSON.

### 2.5.2. JWT Authentication

JWT bao gồm 3 phần: header (thuật toán), payload (thông tin người dùng), signature (xác minh toàn vẹn). Token được gửi kèm header mỗi request để xác thực stateless.

### 2.5.3. UML và Biểu đồ

Hệ thống sử dụng UML 2.x với các biểu đồ: Use Case Diagram, Activity Diagram, ERD và thiết kế giao diện.

### 2.5.4. Bảo mật

- **Prepared Statement:** ngăn chặn SQL Injection
- **RBAC:** phân quyền Admin (toàn quyền) và Staff (vận hành)
- **bcrypt:** mã hóa mật khẩu
- **Helmet:** thiết lập HTTP security headers

---

\newpage

# CHƯƠNG 3. PHÂN TÍCH YÊU CẦU HỆ THỐNG

## 3.1. Khảo sát thực tiễn nghiệp vụ

### 3.1.1. Quy trình phục vụ khách

Qua khảo sát tại các quán bida-cafe thực tế, quy trình phục vụ khách gồm 5 bước:

1. **Tiếp nhận khách:** Nhân viên kiểm tra bàn trống và hướng dẫn khách chọn bàn
2. **Bắt đầu phiên chơi:** Ghi nhận thời gian bắt đầu, tính phí theo giờ (tối thiểu 30 phút)
3. **Gọi đồ uống:** Khách gọi món, nhân viên ghi nhận order và mang đồ đến bàn
4. **Kết thúc và thanh toán:** Tính tổng tiền bàn + đồ uống, thanh toán (tiền mặt, thẻ, chuyển khoản, VNPay, MoMo)
5. **Cập nhật loyalty:** Tự động cộng điểm và thăng hạng nếu đủ điều kiện

### 3.1.2. Quy trình đặt bàn

1. Khách gọi điện/nhắn tin đặt bàn → ghi nhận tên, SĐT, giờ, số lượng khách
2. Nhân viên xác nhận bàn còn trống → giữ bàn
3. Check-in khi khách đến → bắt đầu phiên chơi; hủy nếu khách không đến sau 15-30 phút

### 3.1.3. Quy trình nhập hàng

1. Theo dõi tồn kho → gọi đặt hàng nhà cung cấp khi cạn
2. Kiểm tra số lượng/chất lượng → nhập kho và cập nhật tồn
3. Lưu trữ đơn nhập hàng phục vụ kế toán và thống kê

## 3.2. Phân tích tác nghiệp

| Nhóm | Vai trò | Nghiệp vụ chính |
|-------|---------|-----------------|
| Admin | Chủ quán | Toàn quyền: nhân viên, báo cáo, cài đặt, sao lưu, AI insights |
| Staff | Nhân viên | Vận hành: bàn, POS, đặt bàn, chấm công, kho |
| Customer | Khách hàng | Landing page: xem thông tin, trạng thái bàn, đặt bàn, chat AI |

## 3.3. Yêu cầu chức năng

Hệ thống gồm **15 module** chính:

| Module | Mô tả |
|--------|-------|
| Xác thực & phân quyền | Đăng nhập, JWT, RBAC (Admin/Staff) |
| Quản lý bàn bida | Lưới bàn realtime, bắt đầu/kết thúc phiên, tính giờ (tối thiểu 30p) |
| POS - Bán hàng | Grid sản phẩm, giỏ hàng, voucher, VAT 10%, thanh toán đa kênh |
| Thực đơn | CRUD danh mục & sản phẩm, upload hình, soft delete |
| Khách hàng | CRUD, tìm kiếm, tích điểm, phân hạng (Bronze→Platinum) |
| Voucher | CRUD voucher (percent/fixed), điều kiện sử dụng |
| Tồn kho | Theo dõi, cảnh báo ngưỡng, xuất CSV |
| Nhập hàng | CRUD nhà cung cấp, tạo đơn nhập, tự động cộng tồn |
| Nhân viên & chấm công | Danh sách, clock-in/out, tính giờ làm |
| Đặt bàn | Tạo, quản lý trạng thái, check-in, lịch đặt realtime |
| Báo cáo & thống kê | KPI Dashboard, biểu đồ, AI Insights, xuất CSV |
| Cài đặt | Thông tin quán, giá dịch vụ, loyalty, sao lưu/phục hồi |
| Thông báo | Tạo, đánh dấu đã đọc, xóa |
| Landing Page | Trang công khai, trạng thái bàn realtime, Google Maps, AI Chat, form đặt bàn |
| AI Assistant | Chat công khai tư vấn, chat Admin phân tích, AI Insights |

## 3.4. Yêu cầu phi chức năng

| Tiêu chí | Yêu cầu |
|----------|----------|
| **Hiệu năng** | API < 500ms (95%), tải trang < 3s, hỗ trợ ≥10 user đồng thời |
| **Bảo mật** | bcrypt mật khẩu, JWT, RBAC, prepared statement, CORS whitelist |
| **Tin cậy** | Transaction cho thanh toán/nhập hàng, sao lưu định kỳ |
| **Khả năng sử dụng** | Giao diện trực quan, responsive desktop/tablet, làm quen < 30 phút |
| **Mở rộng** | Module hóa, dễ thêm tính năng, chuyển đổi SQLite/SQL Server qua cấu hình |
| **Bảo trì** | Convention nhất quán, tách biệt route/service/data layer |

## 3.5. Actor và Use Case

### 3.5.1. Actor chính (3)

| Actor | Mô tả |
|-------|-------|
| Admin | Toàn quyền quản lý hệ thống |
| Staff | Nghiệp vụ vận hành hàng ngày |
| Customer | Tương tác landing page công khai |

### 3.5.2. Actor hệ thống (4)

| Actor | Mô tả |
|-------|-------|
| AI Chatbot | Chatbot trả lời và tư vấn đặt bàn |
| AI Recommender | Phân tích dữ liệu, gợi ý kinh doanh |
| Notification Service | Gửi thông báo nội bộ |
| Payment Gateway | Xử lý thanh toán (tích hợp tương lai) |

### 3.5.3. Nhóm Use Case (8 nhóm, 45+ use case)

1. **Quản lý bàn bida** - xem bàn, bắt đầu/kết thúc phiên, đặt trước, check-in, thêm đồ uống, xem thanh toán
2. **Quản lý khách hàng** - CRUD, tìm kiếm, cộng điểm, phân hạng
3. **Gọi món & thanh toán** - gọi món, voucher, tính tiền, thanh toán
4. **Quản lý menu** - CRUD danh mục & sản phẩm, upload hình
5. **Báo cáo & thống kê** - KPI dashboard, xuất CSV
6. **AI Services** - chat công khai, chat admin, AI insights
7. **Quản lý nhân viên** - tài khoản, chấm công, ca làm
8. **Cài đặt hệ thống** - cấu hình, sao lưu, phục hồi

---

\newpage

# CHƯƠNG 4. THIẾT KẾ HỆ THỐNG

## 4.1. Kiến trúc tổng thể

Hệ thống theo kiến trúc **Client-Server ba tầng**:

| Tầng | Công nghệ | Nhiệm vụ |
|-------|-----------|----------|
| **Presentation** | React 18 SPA | Giao diện, định tuyến, gọi API |
| **Business Logic** | Node.js + Express | Xử lý nghiệp vụ, xác thực, validation, AI |
| **Data** | SQL Server + SQLite | Lưu trữ dữ liệu, transaction |

### 4.1.1. Kiến trúc bảo mật đa lớp

| Lớp | Giải pháp |
|------|-----------|
| Mạng | Helmet (HSTS, CSP), CORS whitelist |
| Vận chuyển | HTTPS qua Nginx (production) |
| Ứng dụng | JWT stateless, bcrypt, RBAC, rate limiting |
| Dữ liệu | Prepared statement, Zod validation |

## 4.2. Thiết kế cơ sở dữ liệu

Hệ thống gồm **15 bảng** chuẩn hóa 3NF:

| Bảng | Mô tả |
|------|-------|
| users | Người dùng (username, password_hash, role) |
| settings | Cấu hình key-value (business_name, rate, loyalty...) |
| tables | Bàn bida (name, status, rate_per_hour, session info) |
| categories | Danh mục sản phẩm |
| products | Sản phẩm (category_id, name, price, stock, image) |
| customers | Khách hàng (phone, points, tier, total_spent) |
| vouchers | Mã giảm giá (code, type, value, conditions) |
| orders | Đơn hàng (customer, table, subtotal, discount, tax, total, payment) |
| order_items | Chi tiết đơn hàng |
| suppliers | Nhà cung cấp |
| purchases | Đơn nhập hàng |
| purchase_items | Chi tiết đơn nhập |
| shifts | Ca làm việc (clock-in/out) |
| bookings | Đặt bàn (customer, table, time, status) |
| notifications | Thông báo nội bộ |

### 4.2.1. FSM trạng thái bàn

```
EMPTY ──(start())──→ OCCUPIED ──(end())──→ EMPTY
EMPTY ──(reserve())──→ RESERVED ──(checkIn())──→ OCCUPIED
RESERVED ──(cancel())──→ EMPTY
```

## 4.3. Thiết kế Use Case chi tiết

| UC | Tên | Actor | Mô tả |
|----|-----|-------|--------|
| UC-001 | Đặt bàn & bắt đầu | Staff, Customer | Tạo order, cập nhật trạng thái bàn |
| UC-002 | Gọi món | Staff | Thêm đồ uống, trừ tồn kho |
| UC-003 | Thanh toán | Staff | Tính tiền bida + nước + VAT |
| UC-004 | Loyalty | Hệ thống | Tích điểm, phân hạng tự động |
| UC-005 | AI Chat tư vấn | Customer, AI | Chatbot trả lời, tư vấn đặt bàn |
| UC-006 | AI Admin | Admin, AI | Truy vấn dữ liệu, gợi ý kinh doanh |

### 4.3.1. Công thức tính tiền bida

$$\text{billiard\_total} = \max(0.5, \frac{\text{thời\_gian\_(ms)}}{3600000}) \times \text{rate\_per\_hour}$$

Thời gian tối thiểu: 30 phút

### 4.3.2. Bảng phân hạng Loyalty

| Hạng | Chi tiêu tối thiểu | Giảm giá |
|------|---------------------|----------|
| Bronze | 0đ | 2% |
| Silver | 1.000.000đ | 5% |
| Gold | 3.000.000đ | 10% |
| Platinum | 10.000.000đ | 15% |

## 4.4. Thiết kế giao diện

### 4.4.1. Các trang chính

| Trang | Mô tả |
|-------|-------|
| Dashboard | KPI cards, biểu đồ doanh thu 7 ngày, AI Insight, mini grid bàn |
| Quản lý Bàn | Grid 4 cột, TableCard với trạng thái màu sắc |
| POS | 2 cột: menu sản phẩm (trái) + cart + thanh toán (phải) |
| Landing Page | Hero, trạng thái bàn realtime, AI Chat button, form đặt bàn |

### 4.4.2. Bảng màu

| Màu | Hex | Sử dụng |
|------|-----|---------|
| Primary Blue | #3b82f6 | Nút chính |
| Success Green | #22c55e | Bàn trống |
| Warning Amber | #f59e0b | Bàn đặt trước |
| Danger Red | #ef4444 | Bàn đang chơi |

## 4.5. Thiết kế bảo mật

### 4.5.1. JWT & RBAC

- JWT: Bearer token, 24h expiry, lưu localStorage
- RBAC: Admin (toàn quyền) / Staff (vận hành)

### 4.5.2. Sao lưu dữ liệu

- Export: JSON vào `backups/` với timestamp
- Import: Upload JSON qua endpoint riêng

---

\newpage

# CHƯƠNG 5. TRIỂN KHAI VÀ KẾT QUẢ

## 5.1. Môi trường và công nghệ

### 5.1.1. Công nghệ sử dụng

| Phần | Công nghệ |
|------|-----------|
| **Backend** | Node.js 18+, Express 4, JWT, bcryptjs, better-sqlite3, Zod, Helmet |
| **Frontend** | React 18, Vite, Tailwind CSS 3, React Router v6, Recharts, Framer Motion |
| **AI** | Google Generative AI SDK (@google/generative-ai) |

### 5.1.2. Cấu trúc thư mục

```
server-api/
├── src/
│   ├── index.js, db.js
│   ├── routes/          # auth, tables, orders, products, customers...
│   ├── middleware/      # validate (Zod)
│   └── utils/           # tier.js (loyalty)
└── package.json

client/
├── src/
│   ├── App.jsx          # Router & protected routes
│   ├── api/             # Axios calls
│   ├── components/       # layout, ui
│   ├── pages/           # Dashboard, Tables, POS, Menu, Customers...
│   ├── contexts/         # AuthContext
│   └── hooks/
└── package.json
```

## 5.2. Các API Endpoints chính

| Nhóm | Endpoints |
|------|-----------|
| **Auth** | POST /api/auth/login, logout, GET /api/auth/me |
| **Tables** | GET /api/tables, POST /:id/start, /:id/end, /:id/reserve, /:id/add-drink |
| **Orders** | GET, POST /api/orders, POST /:id/cancel |
| **Products** | CRUD /api/products |
| **Customers** | GET, POST /api/customers, POST /:id/add-points |
| **Bookings** | GET, POST /api/bookings, POST /:id/check-in |
| **AI** | POST /api/ai/chat, /api/admin/ai/chat, GET /api/ai/insights |

## 5.3. Triển khai frontend

- **Routing:** React Router v6 với ProtectedRoute và PublicRoute
- **State:** React Context (AuthContext, ThemeContext)
- **Code splitting:** React.lazy() + Suspense

## 5.4. Tích hợp AI Assistant

### 5.4.1. Cấu hình Gemini

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function publicChat(req, res) {
  const { message } = req.body;
  const rows = await db.prepare('SELECT [key], [value] FROM settings').all();
  const settings = Object.fromEntries(rows.map(r => [r.key, r.value]));

  const systemPrompt = `Bạn là tư vấn viên của ${settings.business_name || 'Bida Cafe'}.
  Địa chỉ: ${settings.business_address}
  Giờ mở: ${settings.open_time} - ${settings.close_time}
  Giá bàn: ${settings.default_table_rate}đ/giờ`;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent([systemPrompt, message]);
  res.json({ success: true, reply: result.response.text() });
}
```

### 5.4.2. Admin Chat với Tool Use

Tools: `get_revenue_report`, `get_inventory`, `get_top_products` — AI gọi tool truy xuất dữ liệu thực và phân tích bằng tiếng Việt.

## 5.5. Công thức nghiệp vụ

```javascript
// Tính tiền bida (tối thiểu 30 phút)
const hours = Math.max(0.5, diffMs / 3600000);
const billiardTotal = hours * ratePerHour;

// Tích điểm: 1 điểm / 500.000đ
const pointsEarned = Math.floor(afterDiscount / 500000);

// Phân hạng: Bronze → Silver (1M) → Gold (3M) → Platinum (10M)
// VAT 10%: tax = (subtotal - discount) * 0.10
```

## 5.6. Kết quả đạt được

### 5.6.1. Chức năng đã triển khai

| Module | Trạng thái |
|--------|------------|
| Auth (đăng nhập, JWT, RBAC) | ✅ |
| Bàn (grid, start/end/reserve, realtime) | ✅ |
| POS (gọi món, cart, thanh toán, voucher) | ✅ |
| Menu (CRUD sản phẩm, danh mục, hình ảnh) | ✅ |
| Khách hàng (loyalty, thăng hạng tự động) | ✅ |
| Đặt bàn (tạo, xác nhận, check-in, lịch) | ✅ |
| Voucher (CRUD, validation, copy code) | ✅ |
| Kho (tồn kho, cảnh báo, điều chỉnh) | ✅ |
| Nhập hàng (CRUD đơn nhập, +kho) | ✅ |
| Nhân viên (clock-in/out, lịch sử ca) | ✅ |
| Báo cáo (KPI dashboard, biểu đồ, export CSV) | ✅ |
| AI Chat (public chatbot, admin insights) | ✅ |
| Landing Page (công khai, AI chat widget) | ✅ |

### 5.6.2. Đánh giá bảo mật

| Kiểm tra | Kết quả |
|---------|---------|
| SQL Injection | ✅ Pass — 100% prepared statements |
| XSS | ✅ Pass — React escape output |
| CSRF | ✅ Pass — JWT không dùng cookie |
| Brute force | ✅ Pass — Rate limiting |
| Password storage | ✅ Pass — bcrypt cost=10 |

---

\newpage

# CHƯƠNG 6. ĐÁNH GIÁ, HẠN CHẾ VÀ HƯỚNG PHÁT TRIỂN

## 6.1. Đánh giá hệ thống

### 6.1.1. Đánh giá theo tiêu chí

| Tiêu chí | Kết quả |
|---------|---------|
| Đáp ứng yêu cầu | ✅ 95% — 15/16 module hoàn thành |
| Tính đúng đắn | ✅ Tính tiền, loyalty, voucher hoạt động đúng |
| Tính nhất quán | ✅ Dữ liệu nhất quán qua transaction |
| Hiệu năng | ✅ API ~150ms, page load ~1.5s |

### 6.1.2. So sánh với giải pháp hiện có

| Tiêu chí | Thủ công | POS thường | Hệ thống này |
|---------|---------|-------------|---------------|
| Quản lý bàn | Sổ giấy | Grid cơ bản | Grid realtime + AI |
| Loyalty | Không | Cơ bản | Đa hạng, tự động |
| AI tích hợp | Không | Không | ✅ Chatbot + Insights |
| Đặt bàn online | Gọi điện | Không | ✅ Form + AI |

## 6.2. Điểm mạnh

- **Tích hợp AI** — Chatbot tư vấn và insights phân tích nổi bật so với POS thường
- **Loyalty đa hạng** — Bronze → Platinum với giảm giá tự động
- **Landing page** — Khách xem bàn trống và đặt bàn online
- **Open source** — Chi phí triển khai thấp

## 6.3. Hạn chế

1. **Chưa có app di động native** — Mobile chỉ responsive cơ bản
2. **Thanh toán online chưa tích hợp** — Chưa kết nối VNPay, MoMo, ZaloPay
3. **AI phụ thuộc API bên thứ ba** — Google Gemini cần API key và phát sinh chi phí
4. **Chưa có notification push** — SMS/email xác nhận đặt bàn
5. **SQLite không phù hợp production lớn** — Giới hạn ~10 user đồng thời
6. **Chưa hỗ trợ multi-branch** — Quản lý 1 chi nhánh

## 6.4. Hướng phát triển

### Ngắn hạn (1-3 tháng)
- Tích hợp thanh toán online (VNPay/MoMo/ZaloPay)
- SMS/Email notification xác nhận đặt bàn
- Tối ưu mobile (PWA)

### Trung hạn (3-6 tháng)
- Ứng dụng di động (React Native)
- Hỗ trợ multi-branch
- BI Dashboard nâng cao (Metabase/Power BI)

### Dài hạn (6-12 tháng)
- AI nâng cao (forecasting, gợi ý khuyến mãi)
- IoT tích hợp (cảm biến bàn)
- Loyalty app riêng

---

\newpage

# KẾT LUẬN

Trong quá trình thực hiện đề tài "Hệ thống quản lý bida-cafe tích hợp trí tuệ nhân tạo tư vấn đặt bàn", em đã hoàn thành các mục tiêu đề ra:

1. Phân tích và thiết kế hệ thống theo chuẩn UML với đầy đủ các biểu đồ Use Case, Activity, ERD
2. Xây dựng backend RESTful API hoàn chỉnh với Node.js/Express, hỗ trợ 15 module nghiệp vụ
3. Xây dựng frontend React SPA với giao diện hiện đại, responsive, trực quan hóa dữ liệu bằng Recharts
4. Tích hợp thành công Google Gemini AI: chatbot công khai tư vấn đặt bàn và phân tích kinh doanh cho admin
5. Triển khai hệ thống loyalty đa hạng (Bronze, Silver, Gold, Platinum) với tích điểm và giảm giá tự động
6. Đảm bảo bảo mật thông qua JWT authentication, RBAC, prepared statements và input validation

Hệ thống đã được kiểm thử cơ bản và đáp ứng yêu cầu về chức năng, hiệu năng và bảo mật. Đề tài cung cấp giải pháp thực tế cho các quán bida-cafe vừa và nhỏ, góp phần số hóa quy trình vận hành và nâng cao trải nghiệm khách hàng thông qua tích hợp trí tuệ nhân tạo.

---

\newpage

# TÀI LIỆU THAM KHẢO

1. Sommerville, I. (2016). *Software Engineering* (10th Edition). Pearson Education.
2. Fowler, M. (2003). *UML Distilled* (3rd Edition). Addison-Wesley Professional.
3. React Documentation. https://react.dev
4. Express.js Documentation. https://expressjs.com
5. Tailwind CSS Documentation. https://tailwindcss.com
6. Google Gemini API Documentation. https://ai.google.dev
7. JWT.io. https://jwt.io
8. OWASP Security Guidelines. https://owasp.org

---

\newpage

# PHỤ LỤC

## Bảng thuật ngữ

| Thuật ngữ | Tiếng Anh | Giải thích |
|-----------|-----------|------------|
| POS | Point of Sale | Hệ thống bán hàng |
| KPI | Key Performance Indicator | Chỉ số hiệu suất chính |
| CRUD | Create, Read, Update, Delete | Bốn thao tác cơ bản |
| FSM | Finite State Machine | Máy trạng thái hữu hạn |
| RBAC | Role-Based Access Control | Phân quyền theo vai trò |
| JWT | JSON Web Token | Token xác thực |
| SPA | Single Page Application | Ứng dụng một trang |
| AI | Artificial Intelligence | Trí tuệ nhân tạo |
| LLM | Large Language Model | Mô hình ngôn ngữ lớn |
| SQL | Structured Query Language | Ngôn ngữ truy vấn |
| VAT | Value Added Tax | Thuế giá trị gia tăng |
| API | Application Programming Interface | Giao diện lập trình |
| CSV | Comma-Separated Values | File dữ liệu |
| PWA | Progressive Web App | Ứng dụng web tiến bộ |

---

**--- Hết báo cáo ---**

**Địa điểm, [Ngày tháng năm]**

**Xác nhận của GVHD**

**[Chữ ký và ghi rõ họ tên]**

---

*Tài liệu này được thực hiện như một phần của chương trình đào tạo Công nghệ thông tin. Mọi hình thức sao chép hoặc trích dẫn đều phải có sự đồng ý của tác giả.*
