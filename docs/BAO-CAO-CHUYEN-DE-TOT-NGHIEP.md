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

Qua khảo sát thực tế tại các quán bida-cafe, nhóm nghiên cứu đã nhận diện các hạn chế phổ biến trong quản lý thủ công. Thứ nhất, việc tính tiền bàn theo giờ phụ thuộc vào nhân viên, dễ xảy ra tranh chấp với khách hàng do sai sót trong tính toán. Thứ hai, quản lý đơn hàng và hóa đơn rời rạc, không có hệ thống tập trung, khó thống kê doanh thu theo ngày, tuần, tháng. Thứ ba, không có cơ chế theo dõi khách hàng thân thiết một cách chính xác và chuyên nghiệp. Thứ tư, thiếu công cụ dự báo và phân tích kinh doanh để hỗ trợ chủ quán ra quyết định. Thứ năm, khách hàng không thể tiếp cận thông tin quán và đặt bàn từ xa một cách thuận tiện.

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

Nhóm nghiên cứu đã tiến hành tổng hợp các lý thuyết về quản lý dịch vụ trong ngành giải trí, các mô hình thiết kế phần mềm hiện đại như MVC, RESTful API, và các công nghệ trí tuệ nhân tạo, đặc biệt là các mô hình ngôn ngữ lớn (LLM). Các nguồn tài liệu bao gồm sách chuyên ngành, tài liệu kỹ thuật từ các nhà phát triển công nghệ, các bài báo khoa học và các dự án mã nguồn mở liên quan.

### 1.4.2. Phương pháp khảo sát thực tiễn

Nhóm đã thực hiện khảo sát thực tế tại một số quán bida-cafe trên địa bàn để nắm bắt quy trình vận hành, các yêu cầu nghiệp vụ cụ thể và những khó khăn mà chủ quán cũng như nhân viên đang gặp phải trong việc quản lý hàng ngày.

### 1.4.3. Phương pháp phân tích và thiết kế

Nhóm sử dụng ngôn ngữ mô hình hóa UML phiên bản 2.x để phân tích yêu cầu và thiết kế kiến trúc hệ thống. Các biểu đồ được xây dựng bao gồm Use Case Diagram, Activity Diagram, Sequence Diagram, Class Diagram, Component Diagram và Deployment Diagram.

### 1.4.4. Phương pháp lập trình

Đề tài được phát triển theo mô hình Agile rút gọn kết hợp với Prototyping. Phương pháp này cho phép phát triển theo từng module chức năng độc lập, tích hợp và kiểm thử AI sớm với dữ liệu thực, đồng thời điều chỉnh thiết kế khi yêu cầu nghiệp vụ thay đổi.

### 1.4.5. Phương pháp đánh giá

Hệ thống được đánh giá dựa trên các tiêu chí về chức năng (đáp ứng yêu cầu nghiệp vụ), hiệu năng (thời gian phản hồi, tốc độ xử lý), bảo mật (bảo vệ dữ liệu, ngăn chặn truy cập trái phép) và khả năng sử dụng (giao diện thân thiện, dễ thao tác).

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

## 2.1. Tổng quan về hệ thống quản lý quán giải trí

### 2.1.1. Khái niệm và vai trò

Hệ thống quản lý quán bida-cafe là một loại phần mềm quản lý tích hợp được thiết kế đặc biệt cho các điểm kinh doanh kết hợp giữa dịch vụ cho thuê bàn bida và bán đồ uống. Hệ thống này tích hợp nhiều nghiệp vụ bao gồm: cho thuê bàn theo thời gian thực, bán hàng tại quầy, quản lý khách hàng, quản lý kho, quản lý nhân sự và phân tích kinh doanh.

Trong các nghiên cứu và thực tiễn, hệ thống này thường được phân loại là Point of Sale (POS) chuyên biệt cho ngành dịch vụ giải trí. Điểm khác biệt quan trọng so với POS truyền thống trong ngành bán lẻ là hệ thống cần theo dõi trạng thái tài nguyên theo thời gian thực, cụ thể là bàn chơi bida, với các trạng thái như trống, đang sử dụng, đặt trước hoặc bảo trì.

### 2.1.2. Các thành phần chức năng cốt lõi

Một hệ thống quản lý quán bida-cafe hiệu quả cần đảm bảo các nhóm chức năng cốt lõi sau:

Nhóm chức năng quản lý tài nguyên bao gồm theo dõi trạng thái bàn, tính giờ thuê tự động, quản lý giá thuê và các dịch vụ đi kèm. Hệ thống cần cập nhật trạng thái bàn theo thời gian thực để nhân viên và khách hàng có thể nắm bắt được tình hình.

Nhóm chức năng quản lý bán hàng bao gồm gọi món tại bàn, tính tiền, áp dụng khuyến mãi và các hình thức thanh toán khác nhau. Hệ thống cần kết nối liền mạch giữa đơn hàng đồ uống và tiền thuê bàn.

Nhóm chức năng quản lý khách hàng bao gồm lưu trữ thông tin liên hệ, theo dõi lịch sử giao dịch và triển khai các chương trình loyalty. Việc phân hạng khách hàng và tích điểm tự động giúp tăng sự gắn bó của khách hàng với quán.

Nhóm chức năng quản lý vận hành bao gồm quản lý nhân viên và ca làm, theo dõi tồn kho nguyên vật liệu và sản phẩm, quản lý nhập hàng từ nhà cung cấp. Hệ thống cần đưa ra các cảnh báo khi tồn kho giảm xuống dưới ngưỡng an toàn.

Nhóm chức năng quản lý thông tin bao gồm báo cáo doanh thu, thống kê sản phẩm bán chạy, xuất báo cáo theo các kỳ khác nhau. Đặc biệt, hệ thống hiện đại cần tích hợp các công cụ phân tích để hỗ trợ chủ quán ra quyết định kinh doanh.

Nhóm chức năng tương tác thông minh bao gồm chatbot trả lời câu hỏi thường gặp của khách hàng, tư vấn đặt bàn tự động và phân tích dữ liệu kinh doanh bằng trí tuệ nhân tạo.

## 2.2. Các mô hình phát triển phần mềm

### 2.2.1. Mô hình Waterfall

Mô hình Waterfall là mô hình cổ điển trong phát triển phần mềm với các giai đoạn tuần tự: yêu cầu, thiết kế, triển khai, kiểm thử, bảo trì. Mỗi giai đoạn phải hoàn thành hoàn toàn trước khi chuyển sang giai đoạn tiếp theo. Mô hình này phù hợp với các dự án có yêu cầu rõ ràng và ít thay đổi.

### 2.2.2. Mô hình Agile

Mô hình Agile là tập hợp các phương pháp phát triển dựa trên việc phát triển increment (gia tăng), trong đó yêu cầu và giải pháp phát triển thông qua sự cộng tác giữa các team tự quản. Mô hình này cho phép thích nghi nhanh với thay đổi và phù hợp với các dự án cần sự linh hoạt trong quá trình phát triển.

### 2.2.3. Lựa chọn mô hình cho đề tài

Đối với đề tài này, nhóm lựa chọn mô hình Agile rút gọn kết hợp Prototyping với các lý do chính sau. Thứ nhất, yêu cầu nghiệp vụ có thể thay đổi trong quá trình phân tích và thiết kế khi tiếp tục khảo sát thực tế. Thứ hai, việc tích hợp AI là một tính năng mới cần được thử nghiệm và điều chỉnh liên tục. Thứ ba, mô hình cho phép phát triển theo từng module chức năng độc lập, dễ dàng kiểm thử và triển khai.

## 2.3. Công nghệ và ngôn ngữ lập trình

### 2.3.1. Công nghệ phía Client (Frontend)

**React 18** là thư viện giao diện người dùng được phát triển bởi Meta, cho phép xây dựng giao diện bằng cách kết hợp các thành phần (components). React 18 hỗ trợ Hooks cho phép sử dụng state và các tính năng khác của React mà không cần class, và Concurrent Rendering giúp cải thiện hiệu năng render giao diện.

**Vite** là công cụ build thế hệ mới với ưu điểm khởi động nhanh (near-instant server start) và Hot Module Replacement (HMR) giúp cập nhật mã nguồn tức thì trong quá trình phát triển. Vite đặc biệt phù hợp cho việc phát triển Single Page Application (SPA).

**Tailwind CSS 3** là framework CSS theo hướng utility-first, cho phép xây dựng giao diện nhất quán và hiện đại một cách nhanh chóng. Thay vì viết CSS tùy chỉnh, Tailwind cung cấp các class có sẵn như "flex", "text-center", "bg-blue-500" giúp tăng tốc độ phát triển.

**React Router v6** là thư viện định tuyến chính thức cho React, cho phép điều hướng giữa các trang trong SPA mà không cần tải lại trang.

**Framer Motion** là thư viện animation cho React, cung cấp các API đơn giản để tạo các hiệu ứng chuyển động mượt mà, nâng cao trải nghiệm người dùng.

**Recharts** là thư viện biểu đồ được xây dựng trên React và SVG, cung cấp các loại biểu đồ phổ biến như Line, Bar, Pie, Area phù hợp cho việc trực quan hóa dữ liệu kinh doanh trên dashboard.

**Axios** là HTTP client cho phép thực hiện các yêu cầu HTTP từ trình duyệt đến server API, hỗ trợ interceptor cho việc xử lý request và response.

### 2.3.2. Công nghệ phía Server (Backend)

**Node.js** là môi trường runtime JavaScript phía server, cho phép chạy mã JavaScript bên ngoài trình duyệt. Node.js nổi tiếng với kiến trúc event-driven và non-blocking I/O, phù hợp cho các ứng dụng cần xử lý nhiều kết nối đồng thời.

**Express.js** là web framework tối giản cho Node.js, cung cấp hệ thống middleware linh hoạt và routing mạnh mẽ. Express được sử dụng rộng rãi trong cộng đồng và có hệ sinh thái phong phú với nhiều middleware hỗ trợ.

**JSON Web Token (JWT)** là chuẩn mở (RFC 7519) cho việc tạo token xác thực, cho phép xác thực người dùng một cách stateless (không trạng thái), phù hợp với kiến trúc RESTful API.

**bcryptjs** là thư viện để mã hóa mật khẩu bằng thuật toán bcrypt, đảm bảo mật khẩu được lưu trữ an toàn ngay cả khi cơ sở dữ liệu bị tấn công.

**Zod** là thư viện validation schema cho TypeScript và JavaScript, cho phép định nghĩa schema cho dữ liệu đầu vào và tự động kiểm tra tính hợp lệ.

**Helmet** là middleware cho Express giúp thiết lập các HTTP security headers như HSTS, X-Frame-Options, Content-Security-Policy, giúp bảo vệ ứng dụng khỏi các tấn công phổ biến.

**Multer** là middleware Node.js để xử lý multipart/form-data, chủ yếu được sử dụng cho việc upload file như hình ảnh sản phẩm.

### 2.3.3. Cơ sở dữ liệu

**Microsoft SQL Server** là hệ quản trị cơ sở dữ liệu quan hệ do Microsoft phát triển, nổi tiếng với khả năng xử lý giao dịch tốt (ACID compliant), hỗ trợ stored procedures, triggers và tính năng bảo mật ở mức doanh nghiệp. SQL Server là lựa chọn phổ biến cho các ứng dụng doanh nghiệp vừa và lớn.

**better-sqlite3** là thư viện SQLite cho Node.js với hiệu năng cao và API đồng bộ đơn giản. SQLite là cơ sở dữ liệu nhẹ, không cần server, phù hợp cho môi trường phát triển và các ứng dụng nhỏ. Trong đề tài này, SQLite được sử dụng làm fallback khi SQL Server không khả dụng.

## 2.4. Công nghệ AI và tích hợp LLM

### 2.4.1. Tổng quan về AI trong kinh doanh dịch vụ

Trí tuệ nhân tạo đang thay đổi cách thức tương tác giữa doanh nghiệp và khách hàng một cách sâu sắc. Trong ngành dịch vụ, AI có thể được ứng dụng ở nhiều cấp độ khác nhau, từ chatbot trả lời câu hỏi cơ bản đến phân tích dữ liệu phức tạp hỗ trợ ra quyết định chiến lược.

Đối với quán bida-cafe, AI có thể được ứng dụng ở hai cấp độ chính. Cấp độ thứ nhất là tầng tương tác với khách hàng, bao gồm chatbot tự động trả lời câu hỏi thường gặp, tư vấn bàn trống, giới thiệu menu và hỗ trợ đặt bàn. Cấp độ thứ hai là tầng phân tích quản lý, bao gồm phân tích dữ liệu doanh thu, cảnh báo tồn kho, đề xuất khuyến mãi và nhận diện xu hướng kinh doanh.

### 2.4.2. Google Generative AI (Gemini)

Google Generative AI (Gemini) là nền tảng AI của Google cho phép tích hợp các mô hình ngôn ngữ lớn vào ứng dụng. Gemini được lựa chọn cho đề tài này vì nhiều ưu điểm: khả năng tích hợp dễ dàng thông qua SDK chính thức, hỗ trợ function calling cho phép gọi các hàm từ trong prompt, chi phí sử dụng hợp lý với gói miễn phí đủ cho mục đích học tập, và khả năng xử lý ngôn ngữ tiếng Việt tốt.

### 2.4.3. Mô hình AI Assistant có cấu trúc

Trong đề tài này, mô hình AI được triển khai theo hướng AI Assistant có cấu trúc với các đặc điểm sau. Thứ nhất, prompt rõ ràng được thiết kế cẩn thận để định hướng AI trả lời đúng ngữ cảnh và phong cách. Thứ hai, tool use cho phép AI truy cập dữ liệu thực từ hệ thống thay vì trả lời dựa trên kiến thức chung. Thứ ba, context injection cho phép truyền thông tin về trạng thái bàn, giá cả, menu và đặt bàn thực tế vào prompt.

## 2.5. Các chuẩn thiết kế hệ thống

### 2.5.1. RESTful API

REST (Representational State Transfer) là kiến trúc thiết kế API phổ biến nhất hiện nay. Các endpoint API được thiết kế theo các nguyên tắc REST: sử dụng phương thức HTTP phù hợp (GET, POST, PUT, DELETE), định danh tài nguyên rõ ràng thông qua URL, không lưu trữ trạng thái phía server (stateless), và trả về response theo chuẩn JSON.

### 2.5.2. JWT Authentication

JSON Web Token là chuẩn mở cho việc tạo token xác thực. JWT bao gồm ba phần: header chứa thuật toán mã hóa, payload chứa các claim (thông tin người dùng, thời gian hết hạn), và signature để xác minh tính toàn vẹn. JWT được lưu trữ phía client (thường là localStorage hoặc sessionStorage) và gửi kèm trong header của mỗi request.

### 2.5.3. UML 2.x

UML (Unified Modeling Language) là ngôn ngữ mô hình chuẩn được sử dụng rộng rãi trong phát triển phần mềm. UML 2.x bao gồm nhiều loại biểu đồ phục vụ cho các giai đoạn khác nhau của quy trình phát triển. Trong đề tài này, các biểu đồ được sử dụng bao gồm Use Case Diagram, Activity Diagram, Sequence Diagram, Class Diagram, Component Diagram và Deployment Diagram.

### 2.5.4. Prepared Statement

Prepared Statement là kỹ thuật sử dụng tham số hóa trong truy vấn SQL, giúp ngăn chặn SQL Injection - một trong những lỗ hổng bảo mật phổ biến nhất. Thay vì nối chuỗi SQL trực tiếp với dữ liệu đầu vào, Prepared Statement sử dụng placeholders (?) và truyền giá trị riêng biệt, đảm bảo dữ liệu không bao giờ được thực thi như mã SQL.

### 2.5.5. Role-Based Access Control (RBAC)

RBAC là mô hình kiểm soát truy cập trong đó quyền truy cập được gán cho vai trò, và người dùng được gán một hoặc nhiều vai trò. Trong hệ thống này, hai vai trò chính được định nghĩa: Admin với toàn quyền truy cập và Staff với quyền truy cập hạn chế hơn.

## 2.6. Cơ sở dữ liệu và hệ quản trị CSDL

### 2.6.1. Mô hình cơ sở dữ liệu quan hệ

Hệ thống sử dụng mô hình cơ sở dữ liệu quan hệ với Microsoft SQL Server làm nền tảng chính. Mô hình này tổ chức dữ liệu thành các bảng hai chiều (hàng và cột), với các mối quan hệ được thiết lập thông qua khóa ngoại (foreign key). Ưu điểm của mô hình quan hệ bao gồm: tính nhất quán dữ liệu cao thông qua các ràng buộc toàn vẹn, khả năng truy vấn linh hoạt bằng SQL, và hỗ trợ transaction đảm bảo tính nguyên tử của các thao tác.

### 2.6.2. Thiết kế ba lớp

Việc thiết kế cơ sở dữ liệu tuân theo mô hình ba lớp. Lớp thực thể (Entity Layer) chứa các bảng đại diện cho các đối tượng nghiệp vụ như Users, Tables, Products, Customers, Orders. Lớp liên kết (Relationship Layer) chứa các bảng trung gian thể hiện mối quan hệ nhiều-nhiều như OrderItems, PurchaseItems. Lớp cấu hình (Configuration Layer) chứa các bảng lưu trữ cấu hình hệ thống như Settings.

### 2.6.3. Cơ chế Failover

Hệ thống tích hợp cơ chế automatic failover sang SQLite khi môi trường không có SQL Server. Điều này giúp tăng tính linh hoạt trong phát triển và thử nghiệm, đồng thời đảm bảo hệ thống vẫn có thể chạy được trong trường hợp SQL Server không khả dụng.

---

\newpage

# CHƯƠNG 3. PHÂN TÍCH YÊU CẦU HỆ THỐNG

## 3.1. Khảo sát thực tiễn nghiệp vụ

### 3.1.1. Quy trình phục vụ khách tại quán

Qua khảo sát tại các quán bida-cafe thực tế, quy trình phục vụ khách được mô tả như sau:

**Bước 1 - Tiếp nhận khách:** Khách hàng đến quán, nhân viên kiểm tra tình trạng bàn trống. Nếu có bàn trống, nhân viên hướng dẫn khách chọn bàn phù hợp.

**Bước 2 - Bắt đầu phiên chơi:** Sau khi khách chọn bàn, nhân viên bắt đầu tính giờ cho bàn đó. Hệ thống ghi nhận thời gian bắt đầu và tính phí theo giờ.

**Bước 3 - Gọi đồ uống:** Trong quá trình chơi, khách có thể gọi đồ uống. Nhân viên ghi nhận order, pha chế chuẩn bị và mang đồ đến bàn cho khách.

**Bước 4 - Kết thúc và thanh toán:** Khi khách kết thúc, nhân viên tính tổng tiền bao gồm tiền thuê bàn (tính theo giờ) và tiền đồ uống đã gọi. Khách thanh toán bằng tiền mặt hoặc chuyển khoản.

**Bước 5 - Cập nhật loyalty:** Nếu khách là khách quen đã có tài khoản loyalty, hệ thống tự động cập nhật điểm tích lũy và cập nhật hạng thành viên nếu đủ điều kiện thăng hạng.

### 3.1.2. Quy trình đặt bàn

**Bước 1 - Tiếp nhận đặt bàn:** Khách hàng gọi điện hoặc nhắn tin để đặt bàn trước. Nhân viên ghi nhận thông tin đặt bàn bao gồm tên khách, số điện thoại, thời gian mong muốn và số lượng khách.

**Bước 2 - Xác nhận đặt bàn:** Đến thời điểm đặt, nhân viên kiểm tra xem bàn có còn trống không. Nếu bàn còn trống, nhân viên xác nhận đặt bàn và giữ bàn cho khách.

**Bước 3 - Check-in:** Khi khách đến đúng giờ hẹn, nhân viên check-in và bắt đầu phiên chơi. Nếu khách không đến sau một khoảng thời gian nhất định (thường là 15-30 phút), nhân viên hủy đặt bàn và giải phóng bàn.

### 3.1.3. Quy trình nhập hàng

**Bước 1 - Theo dõi tồn kho:** Quản lý theo dõi số lượng tồn kho nguyên vật liệu và sản phẩm. Khi kho hàng cạn hoặc sắp hết, quản lý gọi điện đặt hàng với nhà cung cấp.

**Bước 2 - Tiếp nhận hàng:** Khi hàng về, nhân viên kiểm tra số lượng và chất lượng hàng hóa, sau đó nhập kho và cập nhật số lượng tồn trong hệ thống.

**Bước 3 - Lưu trữ hồ sơ:** Đơn nhập hàng được lưu trữ trong hệ thống để phục vụ mục đích kế toán và thống kê.

## 3.2. Phân tích tác nghiệp

### 3.2.1. Nhóm tác nghiệp Admin (Chủ quán)

Người dùng nhóm Admin có toàn quyền quản lý hệ thống. Các nghiệp vụ chính bao gồm: quản lý thông tin doanh nghiệp và cài đặt hệ thống, quản lý tài khoản nhân viên (thêm, sửa, xóa), cấu hình giá dịch vụ và chương trình loyalty, xem báo cáo thống kê doanh thu, tồn kho và hoạt động kinh doanh, theo dõi phân tích từ trí tuệ nhân tạo (AI insights), sao lưu và phục hồi dữ liệu khi cần thiết.

### 3.2.2. Nhóm tác nghiệp Staff (Nhân viên)

Người dùng nhóm Staff thực hiện các nghiệp vụ vận hành trực tiếp hàng ngày. Các nghiệp vụ chính bao gồm: quản lý bàn (kiểm tra, bắt đầu, kết thúc phiên chơi), quản lý bán hàng POS (gọi món, tính tiền, thanh toán), tạo và quản lý đặt bàn, chấm công (clock-in, clock-out) khi bắt đầu và kết thúc ca làm, theo dõi tồn kho và báo cáo khi hết hàng.

### 3.2.3. Nhóm tác nghiệp Customer (Khách hàng)

Người dùng nhóm Customer tương tác với hệ thống thông qua trang landing page công khai. Các nghiệp vụ chính bao gồm: xem thông tin về quán (địa chỉ, giờ mở cửa, giá dịch vụ), xem trạng thái các bàn (trống hoặc đang sử dụng), đặt bàn trước qua form trực tuyến, trò chuyện với chatbot AI để được tư vấn về dịch vụ và đặt bàn.

## 3.3. Phân tích yêu cầu chức năng

### 3.3.1. Module xác thực và phân quyền

Module xác thực đảm bảo chỉ những người dùng hợp lệ mới có thể truy cập hệ thống. Các chức năng chính bao gồm: đăng nhập bằng username và password, phân quyền rõ ràng giữa Admin (toàn quyền) và Staff (chức năng vận hành), xác thực bằng JWT token cho phiên làm việc với thời gian hết hạn có thể cấu hình, cho phép đổi mật khẩu.

### 3.3.2. Module quản lý bàn bida

Module quản lý bàn là phần quan trọng nhất của hệ thống. Các chức năng bao gồm: hiển thị lưới bàn với các trạng thái (Trống, Đang chơi, Đặt trước, Bảo trì), bắt đầu và kết thúc phiên chơi với tính phí tự động theo giờ, đặt bàn trước với chức năng giữ bàn và hủy đặt, gán thông tin khách hàng vào bàn đang chơi, tìm kiếm khách hàng theo số điện thoại, thêm đồ uống vào bàn đang chơi, xem trước thanh toán với đầy đủ chi tiết tiền bàn và tiền nước.

### 3.3.3. Module POS - Bán hàng

Module POS phục vụ việc bán hàng tại quầy và gọi món vào bàn. Các chức năng bao gồm: giao diện grid sản phẩm được tổ chức theo danh mục, tìm kiếm sản phẩm nhanh chóng, quản lý giỏ hàng với các thao tác thêm, sửa, xóa, áp dụng voucher giảm giá, áp dụng giảm giá theo hạng thành viên loyalty, tính thuế VAT theo quy định, thanh toán bằng tiền mặt hoặc chuyển khoản, tự động trừ tồn kho khi bán và cộng điểm loyalty cho khách hàng.

### 3.3.4. Module quản lý thực đơn

Module quản lý thực đơn cho phép quản lý danh mục và sản phẩm. Các chức năng bao gồm: CRUD danh mục sản phẩm (thêm, sửa, xóa, xem), CRUD sản phẩm với các thông tin tên, giá, hình ảnh, tồn kho, upload hình ảnh sản phẩm, soft delete sản phẩm (đánh dấu xóa thay vì xóa vĩnh viễn để giữ lịch sử).

### 3.3.5. Module quản lý khách hàng

Module quản lý khách hàng hỗ trợ chương trình loyalty. Các chức năng bao gồm: CRUD khách hàng với thông tin tên, số điện thoại, email, tìm kiếm khách hàng theo tên hoặc số điện thoại, hiển thị điểm tích lũy, hạng thành viên và tổng chi tiêu, tự động phân hạng dựa trên tổng chi tiêu (Bronze, Silver, Gold, Platinum), hiển thị progress bar tiến độ thăng hạng.

### 3.3.6. Module voucher và khuyến mãi

Module voucher quản lý các mã giảm giá. Các chức năng bao gồm: CRUD voucher với hai kiểu (percent - phần trăm và fixed - số tiền cố định), kiểm tra điều kiện sử dụng (hạn, số lượt, đơn tối thiểu, hạng thành viên yêu cầu), copy mã voucher nhanh chóng, bật/tắt trạng thái voucher.

### 3.3.7. Module quản lý tồn kho

Module quản lý tồn kho giúp theo dõi hàng hóa trong kho. Các chức năng bao gồm: hiển thị danh sách tồn kho theo sản phẩm, cảnh báo khi hết hàng hoặc sắp hết (dưới ngưỡng), điều chỉnh tồn kho thủ công khi cần, xuất báo cáo tồn kho ra file CSV.

### 3.3.8. Module nhập hàng và nhà cung cấp

Module nhập hàng quản lý việc mua hàng từ nhà cung cấp. Các chức năng bao gồm: CRUD nhà cung cấp (tên, số điện thoại, địa chỉ), tạo đơn nhập hàng với nhiều sản phẩm, tự động cộng tồn kho khi nhập hàng.

### 3.3.9. Module nhân viên và chấm công

Module nhân viên quản lý thông tin và chấm công. Các chức năng bao gồm: xem danh sách nhân viên, clock-in và clock-out theo ca làm việc, tự động tính số giờ làm trong ca, lọc lịch sử ca theo nhân viên và ngày.

### 3.3.10. Module đặt bàn

Module đặt bàn quản lý việc đặt trước của khách hàng. Các chức năng bao gồm: tạo đặt bàn với thông tin tên khách, SĐT, bàn, giờ bắt đầu và kết thúc, quản lý trạng thái đặt bàn (Chờ xác nhận, Đã xác nhận, Đang giữ, Đang chơi, Hoàn thành, Đã hủy, Không đến), check-in khách tự động tạo order và chuyển bàn sang trạng thái Đang chơi, hiển thị lịch đặt bàn theo thời gian thực.

### 3.3.11. Module báo cáo và thống kê

Module báo cáo cung cấp thông tin phân tích kinh doanh. Các chức năng bao gồm: KPI Dashboard hiển thị doanh thu hôm nay, số đơn hàng, khách hàng mới, tổng giờ hoạt động, biểu đồ doanh thu 7 ngày gần nhất, biểu đồ trạng thái bàn, top sản phẩm bán chạy, AI Insight cung cấp gợi ý kinh doanh từ Gemini, xuất báo cáo CSV (tổng hợp, lịch sử đơn hàng, doanh thu theo ngày/tháng, sản phẩm bán chạy).

### 3.3.12. Module cài đặt

Module cài đặt cho phép cấu hình hệ thống. Các chức năng bao gồm: quản lý thông tin doanh nghiệp (tên, địa chỉ, SĐT, email), cấu hình giá dịch vụ và giờ mở/đóng cửa, cấu hình chương trình tích điểm loyalty, quản lý hình ảnh và logo quán, quản lý tài khoản người dùng, sao lưu và phục hồi dữ liệu.

### 3.3.13. Module thông báo

Module thông báo quản lý các thông báo nội bộ. Các chức năng bao gồm: tạo thông báo với các loại (info, warning, success, error), đánh dấu đã đọc, đọc tất cả, xóa thông báo.

### 3.3.14. Module Landing Page

Landing Page là trang công khai dành cho khách hàng. Các chức năng bao gồm: trang giới thiệu công khai với thông tin quán, danh sách bàn và trạng thái realtime, Google Maps embed hiển thị vị trí, AI Chat widget cho phép khách trò chuyện, form đặt bàn online.

### 3.3.15. Module AI Assistant

Module AI là điểm nhấn của hệ thống. Các chức năng bao gồm: AI Chat công khai trả lời câu hỏi thông thường về quán và tư vấn đặt bàn, AI Chat Admin phân tích doanh thu, tồn kho, top sản phẩm thông qua các công cụ truy xuất dữ liệu, AI Insights tự động gợi ý dựa trên KPI hiện tại.

## 3.4. Phân tích yêu cầu phi chức năng

### 3.4.1. Yêu cầu về hiệu năng

Hệ thống cần đảm bảo thời gian phản hồi API dưới 500ms đối với 95% yêu cầu. Thời gian tải trang đầu tiên không quá 3 giây. Hệ thống cần hỗ trợ ít nhất 10 người dùng đồng thời mà không có sự suy giảm đáng kể về hiệu năng.

### 3.4.2. Yêu cầu về bảo mật

Mật khẩu người dùng phải được mã hóa bằng bcrypt trước khi lưu trữ. Xác thực người dùng bằng JWT với thời gian hết hạn hợp lý. Phân quyền rõ ràng giữa Admin và Staff. Tất cả các truy vấn cơ sở dữ liệu phải sử dụng prepared statement để phòng chống SQL injection. CORS được cấu hình chỉ cho phép các domain được chỉ định.

### 3.4.3. Yêu cầu về tin cậy

Dữ liệu phải nhất quán thông qua việc sử dụng transaction trong các thao tác thanh toán và nhập hàng. Hệ thống cần có cơ chế sao lưu dữ liệu định kỳ và khả năng phục hồi khi cần.

### 3.4.4. Yêu cầu về khả năng sử dụng

Giao diện phải trực quan, dễ sử dụng và thân thiện với người dùng. Hệ thống phải responsive, hỗ trợ tốt trên các thiết bị desktop và tablet. Thời gian làm quen cho người dùng mới không quá 30 phút.

### 3.4.5. Yêu cầu về khả năng mở rộng

Kiến trúc hệ thống phải module hóa, cho phép dễ dàng thêm chức năng mới mà không ảnh hưởng đến các module hiện có. Việc chuyển đổi giữa SQLite và SQL Server phải thực hiện đơn giản qua cấu hình.

### 3.4.6. Yêu cầu về dễ bảo trì

Mã nguồn phải tuân theo convention nhất quán, có comment giải thích các logic phức tạp. Kiến trúc phải tách biệt rõ ràng giữa route, service và data access layer.

## 3.5. Xác định Actor và Use Case tổng quát

### 3.5.1. Các Actor chính

Hệ thống có 3 actor chính và 4 actor hệ thống hoặc phụ trợ.

**Admin (Quản trị viên):** Người có toàn quyền quản lý hệ thống, bao gồm quản lý nhân viên, cài đặt, báo cáo và sao lưu dữ liệu.

**Staff (Nhân viên phục vụ):** Người thực hiện các nghiệp vụ vận hành hàng ngày như quản lý bàn, bán hàng và chấm công.

**Customer (Khách hàng):** Người tương tác với landing page công khai để xem thông tin và đặt bàn.

### 3.5.2. Các Actor hệ thống/phụ trợ

**AI Chatbot:** Hệ thống con trả lời câu hỏi của khách hàng và hỗ trợ đặt bàn tự động.

**AI Recommender:** Hệ thống con phân tích dữ liệu và đưa ra gợi ý kinh doanh cho admin.

**Notification Service:** Hệ thống con quản lý và gửi các thông báo nội bộ.

**Payment Gateway:** Hệ thống con xử lý thanh toán (tích hợp trong tương lai).

### 3.5.3. Các nhóm Use Case chính

Hệ thống được chia thành 8 nhóm Use Case chính với tổng cộng hơn 45 use case chi tiết:

Nhóm Use Case quản lý bàn bida bao gồm các chức năng xem danh sách bàn, bắt đầu/kết thúc phiên, đặt bàn trước, check-in đặt bàn, thêm đồ uống và xem thanh toán.

Nhóm Use Case quản lý khách hàng bao gồm CRUD khách hàng, tìm kiếm, cộng điểm và phân hạng tự động.

Nhóm Use Case gọi món và thanh toán bao gồm gọi món, áp dụng voucher, tính tiền và thanh toán.

Nhóm Use Case quản lý menu bao gồm CRUD danh mục và sản phẩm, upload hình ảnh.

Nhóm Use Case báo cáo và thống kê bao gồm xem dashboard KPI, xuất báo cáo CSV.

Nhóm Use Case AI Services bao gồm chat công khai, chat admin với dữ liệu và AI insights.

Nhóm Use Case quản lý nhân viên bao gồm quản lý tài khoản, chấm công và ca làm.

Nhóm Use Case cài đặt hệ thống bao gồm cấu hình thông tin, giá cả, loyalty, sao lưu và phục hồi.

---

\newpage

# CHƯƠNG 4. THIẾT KẾ HỆ THỐNG

## 4.1. Kiến trúc tổng thể hệ thống

### 4.1.1. Kiến trúc logic ba tầng

Hệ thống được thiết kế theo kiến trúc Client-Server ba tầng (Three-Tier Architecture), phù hợp với ứng dụng web full-stack hiện đại.

**Tầng trình bày (Presentation Layer):** Được xây dựng bằng React 18 với kiến trúc SPA (Single Page Application). Tầng này chịu trách nhiệm hiển thị giao diện người dùng, xử lý tương tác, quản lý định tuyến phía client và gọi API thông qua Axios. React Router v6 quản lý các tuyến đường (routes) trong ứng dụng, cho phép điều hướng mượt mà mà không cần tải lại trang. Tailwind CSS cung cấp các utility classes cho việc styling nhanh chóng và nhất quán.

**Tầng nghiệp vụ (Business Logic Layer):** Được xây dựng bằng Node.js với Express.js. Tầng này chứa toàn bộ logic nghiệp vụ của hệ thống, bao gồm: xử lý RESTful API endpoints, middleware xác thực và phân quyền, validation dữ liệu đầu vào bằng Zod, các nghiệp vụ tính toán (tính tiền bida, loyalty, VAT), tích hợp Google Gemini cho AI và quản lý file upload.

**Tầng dữ liệu (Data Layer):** Sử dụng Microsoft SQL Server làm hệ quản trị CSDL chính, với SQLite làm fallback. Tầng này chịu trách nhiệm lưu trữ và truy xuất dữ liệu, đảm bảo tính nhất quán thông qua transaction, và quản lý các ràng buộc toàn vẹn.

### 4.1.2. Kiến trúc triển khai

Hệ thống được triển khai theo mô hình monolithic gói gọn trong một server nội bộ. Ở môi trường phát triển, server API chạy trên cổng 3002 (http://localhost:3002) và client chạy trên cổng 5174 (http://localhost:5174) với Vite dev server có proxy sang API. Ở môi trường production, cả client và server có thể được triển khai trên cùng một máy chủ hoặc tách riêng tùy theo quy mô.

### 4.1.3. Kiến trúc bảo mật đa lớp

Hệ thống áp dụng mô hình bảo mật đa lớp (defense in depth) để bảo vệ against các mối đe dọa an ninh mạng.

**Lớp mạng (Network Layer):** Helmet.js thiết lập các HTTP security headers như HSTS (HTTP Strict Transport Security), X-Frame-Options (ngăn clickjacking), Content-Security-Policy (ngăn XSS). CORS được cấu hình whitelist chỉ cho phép các domain cụ thể truy cập API.

**Lớp vận chuyển (Transport Layer):** Hệ thống sử dụng HTTPS thông qua reverse proxy (Nginx) trong môi trường production. Cookie-parser xử lý cookies an toàn.

**Lớp ứng dụng (Application Layer):** JWT stateless authentication xác thực người dùng không trạng thái. bcryptjs mã hóa mật khẩu với salt. Role-Based Access Control (RBAC) phân quyền rõ ràng. Rate limiting giới hạn số lượng request trong một khoảng thời gian.

**Lớp dữ liệu (Data Layer):** Tất cả truy vấn SQL sử dụng prepared statements với tham số hóa, ngăn chặn SQL injection. Zod validation kiểm tra dữ liệu đầu vào trước khi xử lý.

## 4.2. Thiết kế cơ sở dữ liệu

### 4.2.1. Mô hình quan hệ và các bảng chính

Hệ thống gồm 15 bảng chính được thiết kế theo mô hình chuẩn hóa Normal Form (3NF), đảm bảo tính nhất quán dữ liệu và loại bỏ dư thừa.

**Bảng users** lưu trữ thông tin người dùng hệ thống với các cột: id (khóa chính), username (tên đăng nhập duy nhất), password_hash (mật khẩu đã mã hóa), role (vai trò admin hoặc staff), password_hint (gợi ý mật khẩu), created_at (thời gian tạo).

**Bảng settings** sử dụng mô hình Key-Value để lưu trữ cấu hình hệ thống động, cho phép admin thay đổi không cần sửa code. Các cặp key-value quan trọng bao gồm: business_name, business_address, open_time, close_time, default_table_rate, loyalty_rate, ai_api_key.

**Bảng tables** lưu trữ thông tin bàn bida với các cột: id, name, status (trạng thái: empty, occupied, reserved, maintenance), rate_per_hour (giá thuê/giờ), current_session_start (thời gian bắt đầu phiên), current_order_id (liên kết đến đơn hàng hiện tại), drinks_total (tổng tiền đồ uống), billiard_total (tổng tiền bida).

**Bảng categories** lưu trữ danh mục sản phẩm với id và name.

**Bảng products** lưu trữ sản phẩm với id, category_id (khóa ngoại đến categories), name, price, cost_price, stock, unit, image_url, is_deleted (soft delete).

**Bảng customers** lưu trữ thông tin khách hàng với id, name, phone (duy nhất), email, points (điểm tích lũy), tier (Bronze, Silver, Gold, Platinum), total_spent (tổng chi tiêu), visit_count (số lần ghé thăm), created_at.

**Bảng vouchers** lưu trữ mã giảm giá với id, code (duy nhất), type (percent hoặc fixed), value, max_discount, min_order, expires_at, max_uses, used_count, active.

**Bảng orders** lưu trữ đơn hàng với id, customer_id, customer_name, customer_phone, table_id, subtotal, discount, tier_discount, voucher_discount, voucher_code, tax, total, payment_method, status, points_earned, created_at, completed_at.

**Bảng order_items** lưu trữ chi tiết đơn hàng với id, order_id, product_id, quantity, unit_price, line_total.

**Bảng suppliers** lưu trữ nhà cung cấp với id, name, phone, address.

**Bảng purchases** lưu trữ đơn nhập hàng với id, supplier_id, total, created_at.

**Bảng purchase_items** lưu trữ chi tiết đơn nhập với id, purchase_id, product_id, quantity, unit_cost, line_total.

**Bảng shifts** lưu trữ ca làm việc với id, staff_name, role, start_time, end_time.

**Bảng bookings** lưu trữ thông tin đặt bàn với id, customer_name, phone, table_id, start_time, end_time, status (booked, confirmed, checked_in, completed, cancelled, no_show), notes, created_at.

**Bảng notifications** lưu trữ thông báo với id, message, type (info, warning, success, error), created_at, read_status.

### 4.2.2. Thiết kế trạng thái bàn với FSM

Trạng thái bàn được thiết kế theo mô hình Finite State Machine (FSM) với các trạng thái và chuyển đổi rõ ràng:

**Trạng thái EMPTY (Trống):** Bàn sẵn sàng cho khách mới. Chuyển sang OCCUPIED khi gọi hàm start() để bắt đầu phiên chơi, hoặc chuyển sang RESERVED khi có đặt bàn trước.

**Trạng thái OCCUPIED (Đang chơi):** Bàn đang được sử dụng. Chuyển về EMPTY khi gọi hàm end() để kết thúc phiên chơi.

**Trạng thái RESERVED (Đặt trước):** Bàn được giữ cho khách đặt trước. Chuyển sang OCCUPIED khi khách đến check-in (hàm checkIn()), hoặc chuyển về EMPTY nếu khách không đến sau thời gian chờ (hàm cancel()).

**Trạng thái MAINTENANCE (Bảo trì):** Bàn tạm thời không sử dụng được để bảo trì hoặc sửa chữa.

## 4.3. Thiết kế Use Case chi tiết

### 4.3.1. Use Case UC-001: Đặt bàn và bắt đầu chơi

**Mô tả:** Staff hoặc khách hàng đặt bàn trước hoặc bắt đầu tính giờ ngay cho khách đến trực tiếp.

**Actor:** Staff, Customer (khách hàng có thể đặt online qua landing page).

**Tiền điều kiện:** Staff đã đăng nhập hệ thống, có bàn trống hoặc khách đặt trước có bàn phù hợp.

**Luồng chính:**
1. Staff chọn bàn trống hoặc mở form đặt bàn.
2. Nhập thông tin khách hàng (tên, SĐT) hoặc chọn khách hàng đã có trong hệ thống.
3. Nếu khách đặt trước: xác nhận giữ bàn. Nếu khách đến trực tiếp: bắt đầu tính giờ ngay.
4. Hệ thống tạo order mới với trạng thái 'active', cập nhật trạng thái bàn thành 'occupied' hoặc 'reserved'.
5. Hệ thống ghi nhận thời gian bắt đầu phiên.

**Luồng rẽ nhánh:** Nếu đặt trước, bàn chuyển sang 'reserved' với thời gian hẹn được lưu. Khi khách đến, staff check-in để chuyển sang 'occupied'.

**Hậu điều kiện:** Bàn ở trạng thái 'occupied', order được tạo với status='active', current_session_start được ghi nhận.

### 4.3.2. Use Case UC-002: Gọi món vào bàn

**Mô tả:** Staff thêm đồ uống vào order của bàn đang chơi.

**Actor:** Staff.

**Tiền điều kiện:** Bàn đang ở trạng thái 'occupied' và có order active.

**Luồng chính:**
1. Staff chọn bàn đang chơi.
2. Mở danh mục sản phẩm và chọn sản phẩm cùng số lượng.
3. Xác nhận thêm vào order.
4. Hệ thống trừ tồn kho của sản phẩm, cập nhật drinks_total trong order.
5. Thông báo cập nhật cho staff.

**Ngoại lệ:** Nếu sản phẩm hết hàng (stock = 0), hệ thống hiển thị cảnh báo và không cho phép thêm.

### 4.3.3. Use Case UC-003: Thanh toán và kết thúc phiên

**Mô tả:** Staff kết thúc phiên chơi, tính tổng tiền và xử lý thanh toán.

**Actor:** Staff.

**Luồng chính:**
1. Staff chọn bàn đang chơi và nhấn "Kết thúc".
2. Hệ thống tính tiền bida: số giờ × giá/giờ (làm tròn lên 15 phút).
3. Hệ thống tính tổng tiền đồ uống từ order.
4. Áp dụng giảm giá loyalty theo hạng thành viên (nếu khách có tài khoản).
5. Cho phép nhập mã voucher và áp dụng giảm giá.
6. Tính thuế VAT 8% trên tổng sau giảm giá.
7. Staff chọn phương thức thanh toán (tiền mặt hoặc chuyển khoản).
8. Hệ thống cập nhật order thành 'paid', cập nhật điểm loyalty.
9. Bàn chuyển về trạng thái 'empty'.

**Công thức tính tiền bida:**
$$\text{billiard\_total} = \left\lceil \frac{\text{thời\_gian\_(phút)}}{15} \right\rceil \times \frac{\text{rate\_per\_hour}}{4}$$

### 4.3.4. Use Case UC-004: Quản lý Loyalty

**Mô tả:** Hệ thống tự động tích điểm và phân hạng khách hàng sau mỗi giao dịch.

**Actor:** Hệ thống (tự động).

**Công thức tích điểm:**
$$\text{points\_earned} = \left\lfloor \frac{\text{total} \times \text{loyalty\_rate}}{1000} \right\rfloor$$

**Quy tắc phân hạng:**

| Hạng | Tổng chi tiêu tối thiểu | Giảm giá |
|------|--------------------------|----------|
| Bronze | 0đ | 0% |
| Silver | 500.000đ | 5% |
| Gold | 2.000.000đ | 10% |
| Platinum | 5.000.000đ | 15% |

### 4.3.5. Use Case UC-005: AI Chat tư vấn đặt bàn

**Mô tả:** Khách hàng trò chuyện với chatbot AI để được tư vấn về quán và đặt bàn.

**Actor:** Customer, AI Chatbot.

**Luồng chính:**
1. Khách nhắn tin hỏi về thông tin quán, bàn trống hoặc đặt bàn.
2. Hệ thống phân tích intent từ câu hỏi.
3. Nếu câu hỏi cần dữ liệu thực (bàn trống, giá, menu), AI gọi tool để truy vấn database.
4. AI tổng hợp thông tin và trả lời bằng tiếng Việt thân thiện.
5. Nếu khách muốn đặt bàn, AI hướng dẫn điền form đặt bàn.

### 4.3.6. Use Case UC-006: AI Chat Admin phân tích kinh doanh

**Mô tả:** Admin trò chuyện với AI để phân tích dữ liệu kinh doanh và nhận gợi ý.

**Actor:** Admin, AI.

**Luồng chính:**
1. Admin nhập câu hỏi về doanh thu, tồn kho, sản phẩm.
2. AI xác định câu hỏi và gọi tool phù hợp (get_revenue_report, get_inventory, get_top_products).
3. AI truy vấn database thông qua tool.
4. AI phân tích dữ liệu và đưa ra nhận xét, gợi ý bằng tiếng Việt.

## 4.4. Thiết kế giao diện người dùng

### 4.4.1. Layout tổng thể ứng dụng

Ứng dụng sử dụng AppLayout với cấu trúc bao gồm: Header cố định phía trên với logo, thanh tìm kiếm, biểu tượng thông báo và thông tin người dùng; Sidebar cố định bên trái chứa menu điều hướng chính; Content Area chiếm phần còn lại hiển thị nội dung trang.

### 4.4.2. Các trang chính

**Trang Dashboard:** Hiển thị 4 KPI cards (doanh thu hôm nay, số đơn, khách mới, giờ hoạt động), biểu đồ doanh thu 7 ngày (Recharts Bar Chart), AI Insight Card với gợi ý từ Gemini, mini grid trạng thái bàn với màu sắc đại diện.

**Trang Quản lý Bàn:** Hiển thị grid 4 cột responsive, mỗi TableCard hiển thị tên bàn, giá/giờ, trạng thái (màu nền), thời gian đang chơi (nếu occupied), các action buttons (Bắt đầu/Kết thúc/Đặt/Thêm đồ/Thanh toán).

**Trang POS:** Layout 2 cột với bên trái là menu sản phẩm (tabs theo danh mục, grid sản phẩm với hình ảnh), bên phải là cart panel (danh sách items, tổng phụ, voucher, giảm giá, VAT, tổng cộng) và nút thanh toán.

**Trang Landing Page (Public):** Hero section với hình ảnh quán và CTA, trạng thái bàn realtime, AI Chat floating button góc phải dưới, form đặt bàn online, Google Maps embed.

### 4.4.3. Thiết kế màu sắc

| Màu sắc | Hex | Sử dụng |
|---------|-----|---------|
| Primary Blue | #3b82f6 | Nút chính, link, accent |
| Success Green | #22c55e | Bàn trống, thành công |
| Warning Amber | #f59e0b | Bàn đặt trước, cảnh báo |
| Danger Red | #ef4444 | Bàn đang chơi, lỗi |
| Background | #f8fafc | Nền chính |
| Card | #ffffff | Card, modal |
| Text Primary | #1e293b | Văn bản chính |

## 4.5. Thiết kế bảo mật hệ thống

### 4.5.1. Xác thực JWT

- Phương thức: Bearer token trong header Authorization
- Thời gian hết hạn: 24 giờ (configurable)
- Lưu trữ: localStorage phía client
- Middleware auth kiểm tra token ở mỗi request

### 4.5.2. Phân quyền RBAC

| Chức năng | Admin | Staff |
|-----------|-------|-------|
| Quản lý users | ✅ | ❌ |
| Cài đặt hệ thống | ✅ | ❌ |
| Sao lưu dữ liệu | ✅ | ❌ |
| Quản lý bàn | ✅ | ✅ |
| Bán hàng POS | ✅ | ✅ |
| Báo cáo | ✅ | ✅ |

### 4.5.3. Sao lưu dữ liệu

- Cơ chế: Export JSON toàn bộ dữ liệu
- Thư mục: backups/ với timestamp
- Phục hồi: Import JSON qua endpoint riêng

---

\newpage

# CHƯƠNG 5. TRIỂN KHAI VÀ KẾT QUẢ

## 5.1. Môi trường phát triển và công cụ

### 5.1.1. Phần cứng và hệ điều hành

Yêu cầu tối thiểu về phần cứng bao gồm CPU Intel Core i5 trở lên, RAM 8GB trở lên, ổ cứng 256GB SSD trở lên. Hệ điều hành hỗ trợ Windows 10/11 hoặc macOS. Kết nối mạng LAN nội bộ hoặc Internet.

### 5.1.2. Công nghệ sử dụng

**Backend:** Node.js 18+ LTS, Express 4.x, JWT, bcryptjs, better-sqlite3, Multer, Zod, Helmet, express-rate-limit.

**Frontend:** React 18, Vite, Tailwind CSS 3, React Router v6, Axios, Recharts, Framer Motion.

**AI:** Google Generative AI SDK (@google/generative-ai).

## 5.2. Cấu trúc thư mục dự án

### 5.2.1. Backend (server-api)

```
server-api/
├── src/
│   ├── index.js           # Entry point, route registration
│   ├── db.js              # Database connection
│   ├── routes/            # API route handlers
│   │   ├── auth.js
│   │   ├── tables.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   ├── customers.js
│   │   ├── bookings.js
│   │   ├── staff.js
│   │   ├── inventory.js
│   │   ├── reports.js
│   │   ├── settings.js
│   │   ├── vouchers.js
│   │   ├── notifications.js
│   │   └── ai.js
│   ├── middleware/
│   │   └── validate.js    # Zod schemas
│   ├── services/
│   └── utils/
├── migrations/
├── scripts/
├── package.json
└── .env
```

### 5.2.2. Frontend (client)

```
client/
├── src/
│   ├── main.jsx
│   ├── App.jsx              # Router & protected routes
│   ├── index.css
│   ├── api/                  # Axios API calls
│   ├── components/
│   │   ├── layout/          # AppLayout, Sidebar, Header
│   │   └── ui/              # Reusable UI components
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── TablesPage.jsx
│   │   ├── POSPage.jsx
│   │   ├── MenuPage.jsx
│   │   ├── CustomersPage.jsx
│   │   ├── BookingsPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── StaffPage.jsx
│   │   ├── InventoryPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── VouchersPage.jsx
│   │   ├── PurchasesPage.jsx
│   │   ├── NotificationsPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── LandingPage.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   └── lib/
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 5.3. Triển khai backend

### 5.3.1. Các API Endpoints chính

**Authentication:** POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me

**Tables:** GET /api/tables, POST /api/tables/:id/start, POST /api/tables/:id/end, POST /api/tables/:id/reserve, POST /api/tables/:id/add-drink, GET /api/tables/:id/payment-preview

**Orders:** GET /api/orders, POST /api/orders, POST /api/orders/:id/cancel

**Products:** GET /api/products, POST /api/products, PUT /api/products/:id, DELETE /api/products/:id

**Customers:** GET /api/customers, POST /api/customers, POST /api/customers/:id/add-points

**Bookings:** GET /api/bookings, POST /api/bookings, POST /api/bookings/:id/check-in

**AI:** POST /api/ai/chat (public), POST /api/admin/ai/chat, GET /api/ai/insights

## 5.4. Triển khai frontend

### 5.4.1. Routing

Sử dụng React Router v6 với ProtectedRoute cho các trang yêu cầu đăng nhập và PublicRoute cho trang đăng nhập. Code splitting được áp dụng với React.lazy() và Suspense để tối ưu hiệu năng tải trang.

### 5.4.2. State Management

Sử dụng React Context cho việc quản lý state toàn cục như AuthContext cho thông tin đăng nhập và ThemeContext cho cấu hình giao diện.

## 5.5. Tích hợp AI Assistant

### 5.5.1. Cấu hình Gemini

```javascript
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

  // Tool definitions
  const tools = [
    { name: 'get_revenue_report', description: 'Lấy báo cáo doanh thu', parameters: { type: 'object', properties: {} } },
    { name: 'get_inventory', description: 'Lấy danh sách tồn kho', parameters: { type: 'object', properties: {} } },
    { name: 'get_top_products', description: 'Lấy top sản phẩm bán chạy', parameters: { type: 'object', properties: {} } }
  ];

  // Xây dựng context từ DB
  const context = await buildContext();

  const systemPrompt = `Bạn là trợ lý phân tích kinh doanh cho quản lý Bida Cafe.
Dữ liệu hiện tại: ${JSON.stringify(context, null, 2)}

Khi khách hỏi về doanh thu, kho, sản phẩm:
1. Gọi tool phù hợp
2. Đợi kết quả
3. Phân tích và trả lời bằng tiếng Việt`;

  // Gọi Gemini với tools
}
```

## 5.6. Công thức nghiệp vụ chính

### 5.6.1. Tính tiền bida

```javascript
function calculateBilliardTotal(startTime, ratePerHour) {
  const now = new Date();
  const start = new Date(startTime);
  const diffMs = now - start;
  const diffHours = diffMs / (1000 * 60 * 60);
  const roundedHours = Math.ceil(diffHours * 4) / 4; // Làm tròn 15 phút
  return roundedHours * ratePerHour;
}
```

### 5.6.2. Tính điểm Loyalty

```javascript
function calculateLoyaltyPoints(totalSpent, rate) {
  return Math.floor(totalSpent * rate / 1000);
}

function getTier(totalSpent) {
  if (totalSpent >= 5000000) return 'Platinum';
  if (totalSpent >= 2000000) return 'Gold';
  if (totalSpent >= 500000) return 'Silver';
  return 'Bronze';
}
```

### 5.6.3. Tính thuế VAT

Thuế VAT được tính 8% trên tổng tiền sau giảm giá:
$$\text{tax} = \left\lfloor (\text{subtotal} - \text{discount}) \times 0.08 \right\rfloor$$

## 5.7. Kết quả đạt được

### 5.7.1. Chức năng đã triển khai

| Module | Chức năng | Trạng thái |
|--------|-----------|------------|
| Auth | Đăng nhập, JWT, RBAC | ✅ Hoàn thành |
| Bàn | Grid bàn, start/end/reserve, realtime | ✅ Hoàn thành |
| POS | Gọi món, cart, thanh toán, voucher | ✅ Hoàn thành |
| Menu | CRUD sản phẩm, danh mục, hình ảnh | ✅ Hoàn thành |
| Khách hàng | CRUD, loyalty, thăng hạng tự động | ✅ Hoàn thành |
| Đặt bàn | Tạo, xác nhận, check-in, lịch | ✅ Hoàn thành |
| Voucher | CRUD, validation, copy code | ✅ Hoàn thành |
| Kho | Tồn kho, cảnh báo, điều chỉnh | ✅ Hoàn thành |
| Nhập hàng | CRUD đơn nhập, tự động +kho | ✅ Hoàn thành |
| Nhân viên | Danh sách, clock-in/out, lịch sử ca | ✅ Hoàn thành |
| Báo cáo | KPI dashboard, biểu đồ, export CSV | ✅ Hoàn thành |
| AI Chat | Public chatbot, admin insights | ✅ Hoàn thành |
| Thông báo | CRUD, đánh dấu đã đọc | ✅ Hoàn thành |
| Cài đặt | Thông tin DN, pricing, backup | ✅ Hoàn thành |
| Landing Page | Trang công khai, AI chat widget | ✅ Hoàn thành |

### 5.7.2. Đánh giá bảo mật

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

### 6.1.1. Đánh giá theo tiêu chí chức năng

| Tiêu chí | Kết quả | Ghi chú |
|---------|---------|---------|
| Đáp ứng yêu cầu | Đạt 95% | 15/16 module hoàn thành |
| Tính đúng đắn | Đạt | Nghiệp vụ tính tiền, loyalty, voucher hoạt động đúng |
| Tính nhất quán | Đạt | Dữ liệu nhất quán qua transaction |
| Tính an toàn | Đạt | Không phát hiện lỗi bảo mật nghiêm trọng |

### 6.1.2. Đánh giá hiệu năng

| Chỉ số | Mục tiêu | Thực tế |
|--------|---------|---------|
| Response time API | < 500ms | ~150ms |
| Page load (first) | < 3s | ~1.5s |
| Concurrent users | > 10 | > 20 (ước tính) |

### 6.1.3. Đánh giá bảo mật

Hệ thống đã vượt qua các bài kiểm tra bảo mật cơ bản. SQL Injection được ngăn chặn hoàn toàn nhờ 100% prepared statements. XSS được phòng ngừa nhờ React tự động escape output. CSRF được ngăn chặn nhờ JWT không sử dụng cookie cho các thao tác nhạy cảm. Brute force được phòng ngừa nhờ rate limiting. Mật khẩu được lưu trữ an toàn với bcrypt cost=10.

## 6.2. So sánh với các giải pháp hiện có

| Tiêu chí | Thủ công | POS thường | Hệ thống này |
|---------|---------|-------------|--------------|
| Quản lý bàn | Sổ giấy | Grid cơ bản | Grid realtime + AI |
| Loyalty | Không | Cơ bản | Đa hạng, tự động |
| AI tích hợp | Không | Không | ✅ Chatbot + Insights |
| Đặt bàn online | Gọi điện | Không | ✅ Form + AI |
| Chi phí | Thấp (nhân công cao) | Cao (license) | Trung bình (open source) |

### 6.2.1. Điểm mạnh của hệ thống

Thứ nhất, tích hợp AI là điểm nổi bật nhất. Chatbot tư vấn và insights phân tích không có trong hầu hết các giải pháp POS thông thường trên thị trường.

Thứ hai, hệ thống loyalty đa hạng với tự động thăng hạng và phần trăm giảm giá theo hạng giúp tăng sự gắn bó của khách hàng.

Thứ ba, landing page tích hợp cho phép khách hàng xem bàn trống và đặt bàn online mà không cần gọi điện.

Thứ tư, là giải pháp open source với chi phí triển khai thấp, phù hợp cho các quán bida vừa và nhỏ.

## 6.3. Hạn chế của hệ thống

**Hạn chế thứ nhất:** Chưa có ứng dụng di động native. Giao diện mobile hiện chỉ ở mức responsive cơ bản, chưa tối ưu như một ứng dụng native, ảnh hưởng đến trải nghiệm người dùng di động.

**Hạn chế thứ hai:** Thanh toán online chưa được tích hợp. Hệ thống chưa kết nối với các cổng thanh toán như VNPay, MoMo hay ZaloPay, hạn chế khả năng thanh toán từ xa của khách hàng.

**Hạn chế thứ ba:** AI phụ thuộc vào API bên thứ ba. Việc sử dụng Google Gemini API yêu cầu API key và phát sinh chi phí theo usage, đồng thời phụ thuộc vào tình trạng sẵn sàng của dịch vụ bên ngoài.

**Hạn chế thứ tư:** Chưa có notification push. Khách hàng đặt bàn online chưa nhận được SMS hoặc email xác nhận tự động.

**Hạn chế thứ năm:** SQLite không phù hợp cho production lớn. Hệ thống chỉ phù hợp cho quán nhỏ với dưới 10 nhân viên làm việc đồng thời. SQL Server cần license doanh nghiệp cho các triển khai lớn hơn.

**Hạn chế thứ sáu:** Chưa hỗ trợ multi-branch. Không có khả năng quản lý nhiều chi nhánh từ một dashboard duy nhất.

## 6.4. Hướng phát triển tiếp theo

### 6.4.1. Ngắn hạn (1-3 tháng)

**Tích hợp thanh toán online:** Kết nối với các cổng thanh toán VNPay/MoMo/ZaloPay để khách hàng có thể đặt bàn và thanh toán online một cách tiện lợi.

**SMS/Email notification:** Triển khai hệ thống gửi xác nhận đặt bàn qua Twilio SMS và SendGrid, giúp khách hàng yên tâm hơn với việc đặt bàn trực tuyến.

**Tối ưu giao diện mobile:** Cải thiện UX trên thiết bị di động, phát triển PWA (Progressive Web App) để mang lại trải nghiệm gần với ứng dụng native.

### 6.4.2. Trung hạn (3-6 tháng)

**Ứng dụng di động:** Phát triển ứng dụng React Native cho nhân viên (check bàn, order nhanh) và khách hàng (đặt bàn, xem điểm loyalty).

**Hỗ trợ multi-branch:** Nâng cấp kiến trúc để hỗ trợ quản lý nhiều chi nhánh từ một dashboard trung tâm.

**BI Dashboard nâng cao:** Tích hợp các công cụ như Metabase hoặc Power BI để cung cấp báo cáo phân tích chuyên sâu hơn.

### 6.4.3. Dài hạn (6-12 tháng)

**AI nâng cao:** Phát triển các tính năng dự báo doanh thu (forecasting), gợi ý khuyến mãi tự động dựa trên xu hướng, và phân tích hành vi khách hàng để cá nhân hóa trải nghiệm.

**IoT tích hợp:** Kết nối với cảm biến bàn để tự động phát hiện có người hoặc không, giảm thiểu thao tác thủ công của nhân viên.

**Loyalty app riêng:** Phát triển ứng dụng riêng cho khách hàng với ví điểm, voucher cá nhân hóa và chương trình tích lũy hấp dẫn.

---

\newpage

# KẾT LUẬN

Trong quá trình thực hiện đề tài "Hệ thống quản lý bida-cafe tích hợp trí tuệ nhân tạo tư vấn đặt bàn", nhóm đã hoàn thành các mục tiêu đề ra:

Thứ nhất, phân tích và thiết kế hệ thống theo chuẩn UML với đầy đủ các biểu đồ Use Case, Activity, Sequence, Class, Component và Deployment, đảm bảo tính logic và dễ bảo trì.

Thứ hai, xây dựng backend RESTful API hoàn chỉnh với Node.js/Express, hỗ trợ 15 module nghiệp vụ với đầy đủ CRUD operations và xử lý nghiệp vụ phức tạp.

Thứ ba, xây dựng frontend React SPA với giao diện hiện đại, responsive, sử dụng Tailwind CSS và trực quan hóa dữ liệu bằng Recharts.

Thứ tư, tích hợp thành công Google Gemini AI vào hai luồng: chatbot công khai tư vấn đặt bàn và phân tích kinh doanh cho admin.

Thứ năm, triển khai hệ thống loyalty đa hạng (Bronze, Silver, Gold, Platinum) với tích điểm và giảm giá tự động.

Thứ sáu, đảm bảo bảo mật thông qua JWT authentication, RBAC phân quyền, prepared statements và input validation.

Hệ thống đã được kiểm thử cơ bản và đáp ứng yêu cầu về chức năng, hiệu năng và bảo mật. Đề tài cung cấp giải pháp thực tế cho các quán bida-cafe vừa và nhỏ, góp phần số hóa quy trình vận hành và nâng cao trải nghiệm khách hàng thông qua tích hợp trí tuệ nhân tạo.

---

\newpage

# TÀI LIỆU THAM KHẢO

1. Sommerville, I. (2016). *Software Engineering* (10th Edition). Pearson Education.

2. Fowler, M. (2003). *UML Distilled: A Brief Guide to the Standard Object Modeling Language* (3rd Edition). Addison-Wesley Professional.

3. React Documentation. https://react.dev

4. Express.js Documentation. https://expressjs.com

5. Tailwind CSS Documentation. https://tailwindcss.com

6. better-sqlite3 Documentation. https://github.com/WiseLibs/better-sqlite3

7. Google Gemini API Documentation. https://ai.google.dev

8. JWT.io. https://jwt.io

9. OWASP Security Guidelines. https://owasp.org

10. Node.js Documentation. https://nodejs.org

11. Microsoft SQL Server Documentation. https://docs.microsoft.com/en-us/sql/

---

\newpage

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

### A.2. Bảng CUSTOMERS

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

### A.3. Bảng ORDERS

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

## Phụ lục B. Bảng thuật ngữ

| Thuật ngữ | Tiếng Anh | Giải thích |
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
| API | Application Programming Interface | Giao diện lập trình |
| CSV | Comma-Separated Values | File dữ liệu |
| FSM | Finite State Machine | Máy trạng thái hữu hạn |
| PWA | Progressive Web App | Ứng dụng web tiến bộ |

---

\newpage

**--- Hết báo cáo ---**

**[Địa điểm], [Ngày tháng năm]**

**Xác nhận của GVHD**

**[Chữ ký và ghi rõ họ tên]**

---

*Tài liệu này được thực hiện như một phần của chương trình đào tạo Công nghệ thông tin tại [Tên trường]. Mọi hình thức sao chép hoặc trích dẫn đều phải có sự đồng ý của tác giả và nhà trường.*
