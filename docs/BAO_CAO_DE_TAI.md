# ĐẠI HỌC QUỐC GIA THÀNH PHỐ HỒ CHÍ MINH
# TRƯỜNG ĐẠI HỌC BÁCH KHOA
# KHOA KHOA HỌC ỨNG DỤNG

---

# BÁO CÁO NGÀY HỘI KỸ THUẬT
## Niên khóa 2024 - 2025

---

# **Đề tài: HỆ THỐNG PHÂN LOẠI DƯA HẤU SỬ DỤNG CÁNH TAY ROBOT TÍCH HỢP THỊ GIÁC MÁY TÍNH VÀ CHATBOT AI**

---

**GVHD:** ThS. Nguyễn Thái Hiền

**Lớp:** L02

**Nhóm:** Ngũ Lực Bách Khoa

---

**TP.HCM, 12/2024**

---

## DANH SÁCH THÀNH VIÊN

| STT | Thành viên nhóm | MSSV | Công việc |
|-----|-----------------|------|-----------|
| 1 | Lê Thị Nhã My | 2412138 | LaTeX, thuyết trình, tìm hiểu code |
| 2 | Lê Trung Nghĩa | 2412263 | Nội dung báo cáo |
| 3 | Dương Anh Khôi | 2411678 | Làm sản phẩm, tìm hiểu code, thiết kế mạch |
| 4 | Lâm Thanh Bình | 2410343 | Làm sản phẩm, tìm hiểu code |
| 5 | Nguyễn Võ Sơn Tùng | 2413879 | Tìm hiểu code, làm sản phẩm |
| 6 | Đặng Huỳnh Anh Bảo | 2410220 | Tìm hiểu code, PowerPoint |

---

## MỤC LỤC

1. [NHẬN XÉT CỦA GIÁO VIÊN](#nhận-xét-của-giáo-viên)
2. [DANH SÁCH HÌNH VẼ](#danh-sách-hình-vẽ)
3. [LỜI GIỚI THIỆU](#lời-giới-thiệu)
4. [LỜI CẢM ƠN](#lời-cảm-ơn)
5. [CHƯƠNG 1: MỞ ĐẦU](#chương-1-mở-đầu)
   - 1.1 Lí do chọn đề tài
   - 1.2 Mục tiêu
   - 1.3 Phạm vi nghiên cứu
6. [CHƯƠNG 2: CƠ SỞ LÝ THUYẾT](#chương-2-cơ-sở-lý-thuyết)
   - 2.1 Cánh tay robot công nghiệp
   - 2.2 Thị giác máy tính (Computer Vision)
   - 2.3 Học máy và mạng nơ-ron tích chập (CNN)
   - 2.4 Lập trình kéo thả Blockly
   - 2.5 Chatbot AI trong nông nghiệp
7. [CHƯƠNG 3: THIẾT KẾ HỆ THỐNG](#chương-3-thiết-kế-hệ-thống)
   - 3.1 Kiến trúc tổng quan
   - 3.2 Thiết kế phần cứng
   - 3.3 Thiết kế phần mềm
   - 3.4 Giao diện người dùng
8. [CHƯƠNG 4: TRIỂN KHAI VÀ THỰC HIỆN](#chương-4-triển-khai-và-thực-hiện)
   - 4.1 Phần cứng Arduino và CNC Shield
   - 4.2 Backend Flask Server
   - 4.3 Machine Learning Model
   - 4.4 Mobile App với Chatbot AI
9. [CHƯƠNG 5: KẾT QUẢ VÀ ĐÁNH GIÁ](#chương-5-kết-quả-và-đánh-giá)
   - 5.1 Kết quả thử nghiệm
   - 5.2 Đánh giá hiệu năng
   - 5.3 Ưu điểm và hạn chế
10. [CHƯƠNG 6: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN](#chương-6-kết-luận-và-hướng-phát-triển)
11. [TÀI LIỆU THAM KHẢO](#tài-liệu-tham-khảo)
12. [PHỤ LỤC](#phụ-lục)

---

## NHẬN XÉT CỦA GIÁO VIÊN

_________________________________________________________________________

_________________________________________________________________________

_________________________________________________________________________

_________________________________________________________________________

_________________________________________________________________________

_________________________________________________________________________

_________________________________________________________________________

_________________________________________________________________________

_________________________________________________________________________

_________________________________________________________________________

---

## DANH SÁCH HÌNH VẼ

| STT | Tên hình | Trang |
|-----|----------|-------|
| Hình 2.1 | Cấu trúc cánh tay robot công nghiệp | |
| Hình 2.2 | Quy trình xử lý ảnh trong Computer Vision | |
| Hình 2.3 | Kiến trúc mạng nơ-ron tích chập (CNN) | |
| Hình 2.4 | Giao diện lập trình Blockly | |
| Hình 3.1 | Kiến trúc tổng quan hệ thống PDscript | |
| Hình 3.2 | Sơ đồ kết nối phần cứng | |
| Hình 3.3 | Sơ đồ luồng hoạt động | |
| Hình 4.1 | Giao diện Web với Blockly Workspace | |
| Hình 4.2 | Giao diện Mobile App | |
| Hình 5.1 | Kết quả phân loại dưa hấu | |

---

## LỜI GIỚI THIỆU

Trong kỷ nguyên số, tự động hóa không chỉ giới hạn ở nhà máy mà đang trở thành chìa khóa vàng cho nông nghiệp. Thực tế đáng buồn là dưa hấu Việt Nam thường xuyên chịu cảnh giá thấp hoặc bị ép giá khi xuất khẩu do khâu phân loại thủ công thiếu sự đồng bộ về chất lượng. So với các hệ thống phân loại bằng băng chuyền truyền thống thường cồng kềnh và khó tùy biến, cánh tay robot nổi lên như một giải pháp thay thế ưu việt nhờ sự nhỏ gọn, linh hoạt và độ chính xác cao. Tuy nhiên, rào cản lớn nhất để đưa công nghệ này vào thực tiễn chính là sự phức tạp trong vận hành, đòi hỏi người nông dân phải có kiến thức chuyên sâu về lập trình và tự động hóa.

Giải quyết bài toán này, nhóm thực hiện đề tài: **"Hệ thống phân loại dưa hấu sử dụng cánh tay robot tích hợp Thị giác máy tính và Chatbot AI"**. Hệ thống sử dụng camera thông minh để nhận diện, phân loại dưa chuẩn xác, đảm bảo tiêu chuẩn xuất khẩu. Đặc biệt, việc tích hợp Chatbot AI giúp chuyển đổi các số liệu báo cáo khô khan thành ngôn ngữ tự nhiên, dễ hiểu, giúp người dùng phổ thông quản lý hiệu quả mà không cần am hiểu kỹ thuật.

Qua đó, nhóm mong muốn mang đến một giải pháp thực tiễn, vừa nâng cao giá trị kinh tế cho dưa hấu Việt, vừa thân thiện với người nông dân. Chúng em rất mong nhận được sự góp ý từ quý thầy cô và các bạn.

---

## LỜI CẢM ƠN

Là một tập thể sinh viên thuộc Trường Đại học Bách Khoa TP.HCM, mang trong mình niềm đam mê và khát vọng khám phá lĩnh vực tự động hóa, chúng em vô cùng biết ơn khi được Thầy Nguyễn Thái Hiền trao cơ hội thực hiện đề tài với chủ đề "Hệ thống phân loại dưa hấu sử dụng cánh tay robot tích hợp Thị giác máy tính và Chatbot AI."

Đây không chỉ là cơ hội để chúng em tiếp cận và hiểu rõ hơn về một trong những công nghệ tiên tiến của thời đại mà còn giúp chúng em rèn luyện kỹ năng làm việc nhóm, tư duy logic và khả năng nghiên cứu khoa học.

Trong quá trình thực hiện, chúng em không tránh khỏi những thiếu sót, do đây là lần đầu tiên chúng em tiếp cận chuyên sâu về lĩnh vực này cũng như làm việc trong môi trường học tập đòi hỏi tính chuyên môn cao. Vì vậy, chúng em rất mong nhận được những lời góp ý chân thành từ Thầy để bài báo cáo được hoàn thiện hơn, đồng thời giúp chúng em rút ra những bài học giá trị cho hành trình học tập và nghiên cứu sau này.

Chúng em xin chân thành cảm ơn sự hướng dẫn tận tình và những hỗ trợ quý báu từ Thầy. Những chia sẻ và góp ý của Thầy sẽ là hành trang quý giá giúp chúng em ngày càng trưởng thành hơn trên con đường chinh phục tri thức và phát triển bản thân.

**Nhóm sinh viên thực hiện**

---

## CHƯƠNG 1: MỞ ĐẦU

### 1.1 Lí do chọn đề tài

Nguyên nhân cốt lõi khiến dưa hấu Việt Nam thường xuyên bị ép giá khi xuất khẩu nằm ở sự thiếu đồng nhất về chất lượng, hệ quả của việc phụ thuộc vào phân loại thủ công. Để khắc phục, các dây chuyền băng tải công nghiệp đã ra đời, tuy nhiên giải pháp này lại quá cồng kềnh và đắt đỏ, không phù hợp với đặc thù sản xuất nhỏ lẻ của nông nghiệp trong nước.

Trong bối cảnh đó, cánh tay robot nổi lên như một giải pháp thay thế tối ưu nhờ sự linh hoạt và chi phí đầu tư hợp lý. Thế nhưng, một nghịch lý mới lại nảy sinh: **công nghệ càng hiện đại thì quy trình vận hành càng phức tạp**, tạo ra rào cản vô hình ngăn cản người nông dân tiếp cận và làm chủ kỹ thuật.

Để giải quyết mâu thuẫn giữa nhu cầu tự động hóa và khả năng vận hành, nhóm quyết định thực hiện đề tài với sự kết hợp công nghệ hoàn toàn mới:
- **Thị giác máy tính (Computer Vision):** Chuẩn hóa chất lượng dưa xuất khẩu chính xác hơn mắt người
- **Lập trình kéo thả Blockly:** Thay thế các bảng điều khiển phức tạp bằng giao diện trực quan
- **Chatbot AI:** "Bình dân hóa" công nghệ, giúp bất kỳ ai cũng có thể vận hành hệ thống hiệu quả

### 1.2 Mục tiêu

**Mục tiêu kỹ thuật:**
- Xây dựng thành công hệ thống cánh tay robot 3 trục (CNC) có khả năng phân loại dưa hấu tự động với độ chính xác cao
- Ứng dụng thuật toán xử lý ảnh và công nghệ Thị giác máy tính để:
  - Nhận diện chất lượng bề mặt
  - Đo đạc kích thước
  - Phát hiện các khuyết tật vỏ
- Đảm bảo sự đồng đều tuyệt đối đáp ứng các tiêu chuẩn khắt khe của thị trường xuất khẩu

**Mục tiêu về tương tác người-máy:**
- Phát triển phương thức tương tác thân thiện thông qua giao diện Blockly
- Xây dựng "trợ lý ảo" Chatbot AI có khả năng:
  - Tổng hợp dữ liệu sản lượng
  - Gửi báo cáo chất lượng bằng ngôn ngữ tự nhiên
- Xóa bỏ rào cản công nghệ, để người dùng phổ thông cũng có thể vận hành dễ dàng

**Mục tiêu lan tỏa:**
- Truyền tải thông điệp về "Nông nghiệp thông minh" hiện đại nhưng gần gũi
- Chứng minh tính khả thi của việc ứng dụng AI vào giải quyết bài toán thực tiễn của nông sản Việt Nam

### 1.3 Phạm vi nghiên cứu

**Phạm vi đề tài:**
- Phân loại dưa hấu thành 3 loại: Premium (Thượng hạng), Second-grade (Bình thường), Defective (Lỗi)
- Hệ thống hoạt động trong môi trường trong nhà với điều kiện ánh sáng ổn định
- Khối lượng xử lý phù hợp với quy mô nông hộ nhỏ và vừa

**Công nghệ sử dụng:**
- Phần cứng: Arduino Uno + CNC Shield V3 + Stepper Motor
- Phần mềm: Python Flask, TensorFlow, React Native
- Giao tiếp: WebSocket, Serial COM, REST API

---

## CHƯƠNG 2: CƠ SỞ LÝ THUYẾT

### 2.1 Cánh tay robot công nghiệp

#### 2.1.1 Định nghĩa

Cánh tay robot công nghiệp là một thiết bị hiện đại được lập trình để mô phỏng các chuyển động của cánh tay con người. Với thiết kế bao gồm các khớp linh hoạt di chuyển trên trục dọc và khả năng xoay theo nhiều hướng khác nhau, cánh tay robot có thể hoạt động chính xác và hiệu quả trong nhiều môi trường làm việc.

#### 2.1.2 Cấu tạo

Cấu tạo của cánh tay robot về cơ bản bao gồm các bộ phận sau:

**Tay máy (Manipulator):**
- Bao gồm khâu và khớp được cấu tạo mô phỏng với khả năng chuyển động cơ bản
- Bao gồm cổ tay cử động dễ dàng, bàn tay thực hiện những thao tác và trực tiếp hoàn thành công việc

**Hệ thống điều khiển:**
- Đảm bảo nhiệm vụ tiến hành những thao tác mỗi khi có tín hiệu
- Vận hành từ đơn giản đến phức tạp như tính toán động học, nội suy, xử lý lỗi, thiết lập quỹ đạo

**Phần mềm quản lý:**
- Là môi trường lập trình và phương tiện để người vận hành ra lệnh cho robot
- Cần có ngôn ngữ lập trình thích hợp, thân thiện và dễ dàng sử dụng

#### 2.1.3 Nguyên lý hoạt động

- Công việc của cánh tay chủ yếu là di chuyển sản phẩm, linh kiện từ nơi này sang nơi khác
- Bao gồm: nhặt, nâng lên, đặt xuống, tháo ra, hàn hoặc tất cả công việc đó
- Robot được lập trình tự động để hoàn thành công việc mà người dùng mong muốn

**Hai yếu tố quan trọng trong hệ thống cánh tay robot:**
1. **Bộ điều khiển:** Điều khiển hoạt động của robot
2. **Teach Pendant:** Giúp lập trình cho robot

#### 2.1.4 Ứng dụng trong nông nghiệp

Trong ngữ cảnh nông nghiệp, cánh tay robot được ứng dụng cho:
- **Gắp, thả sản phẩm:** Trang bị hệ thống nhận diện để xác định đồ vật, tự động nhặt và đặt theo vị trí định sẵn
- **Kiểm tra chất lượng:** Trang bị cảm biến, hệ thống nhận diện, camera và AI để xác định các bộ phận bị lỗi
- **Phân loại sản phẩm:** Tự động phân loại dựa trên đặc điểm nhận diện được

### 2.2 Thị giác máy tính (Computer Vision)

#### 2.2.1 Khái niệm

Thị giác máy tính là một lĩnh vực của trí tuệ nhân tạo cho phép máy tính "nhìn" và "hiểu" hình ảnh như con người. Công nghệ này sử dụng các thuật toán để:
- Thu nhận hình ảnh từ camera
- Phân tích và xử lý hình ảnh
- Trích xuất thông tin hữu ích
- Đưa ra quyết định dựa trên dữ liệu hình ảnh

#### 2.2.2 Ứng dụng trong phân loại nông sản

Theo nghiên cứu của RSIP Vision, robot phân loại và phân cấp (sorting and grading robots) sử dụng camera gắn trên cánh tay hoạt động phía trên băng chuyền. Nhờ camera, chúng có thể phân loại trái cây nhanh chóng và chính xác. Các thuật toán deep learning có khả năng:
- Nhận diện khuyết tật từ mọi góc độ
- Xử lý sự biến đổi lớn về màu sắc và hình dạng
- Thực hiện object detection để định vị trái cây
- Phân loại chất lượng sau khi định vị

### 2.3 Học máy và mạng nơ-ron tích chập (CNN)

#### 2.3.1 Mạng nơ-ron tích chập (CNN)

CNN (Convolutional Neural Network) là kiến trúc mạng nơ-ron được thiết kế đặc biệt cho các tác vụ phân loại hình ảnh. CNN bao gồm các thành phần chính:

**Lớp tích chập (Convolutional Layer):**
- Trích xuất các đặc trưng từ hình ảnh đầu vào
- Sử dụng các bộ lọc (filters) để phát hiện cạnh, góc, texture

**Lớp pooling:**
- Giảm kích thước dữ liệu
- Giữ lại các đặc trưng quan trọng nhất

**Lớp fully connected:**
- Kết hợp các đặc trưng để đưa ra dự đoán cuối cùng
- Phân loại hình ảnh vào các lớp định sẵn

#### 2.3.2 Ứng dụng trong phân loại trái cây

Theo nghiên cứu được công bố năm 2024 (Rybacki et al.), CNN đã được sử dụng thành công để phát triển mô hình phân loại tự động cho nhiều loại trái cây. Quy trình bao gồm:
1. Thu thập bộ dữ liệu hình ảnh đa dạng
2. Huấn luyện mạng nơ-ron để học và trích xuất đặc trưng
3. Tinh chỉnh và xác thực mô hình
4. Triển khai cho phân loại thời gian thực

### 2.4 Lập trình kéo thả Blockly

#### 2.4.1 Giới thiệu Blockly

Blockly là một thư viện JavaScript mã nguồn mở do Google phát triển, cho phép tạo giao diện lập trình kéo thả (visual programming). Đặc điểm:
- **Trực quan:** Các lệnh được biểu diễn bằng các khối màu sắc có thể ghép nối
- **Dễ sử dụng:** Không yêu cầu kiến thức lập trình truyền thống
- **Linh hoạt:** Có thể tùy chỉnh để tạo các khối lệnh chuyên biệt

#### 2.4.2 Ứng dụng trong điều khiển robot

Blockly đã trở thành nền tảng cho nhiều ứng dụng lập trình robot, bao gồm:
- mBot và các bộ kit robot giáo dục
- Dash & Dot robots
- Các hệ thống tự động hóa trong công nghiệp

Ưu điểm khi áp dụng cho hệ thống phân loại:
- Người dùng không cần biết lập trình
- Tạo kịch bản phân loại nhanh chóng
- Dễ dàng chỉnh sửa và thử nghiệm

### 2.5 Chatbot AI trong nông nghiệp

#### 2.5.1 Vai trò của Chatbot AI

Chatbot AI trong nông nghiệp đóng vai trò như một trợ lý thông minh, giúp:
- **Đơn giản hóa giao tiếp:** Chuyển đổi dữ liệu kỹ thuật thành ngôn ngữ tự nhiên
- **Hỗ trợ quyết định:** Cung cấp phân tích và gợi ý hành động
- **Giám sát từ xa:** Cập nhật tình trạng hệ thống real-time

#### 2.5.2 Công nghệ sử dụng

Hệ thống Chatbot AI trong đề tài sử dụng:
- **LLM (Large Language Model):** Groq API với model GPT
- **Context-aware:** Tự động thu thập dữ liệu tồn kho, cảnh báo, thống kê
- **Markdown rendering:** Hiển thị kết quả đẹp mắt, dễ đọc

---

## CHƯƠNG 3: THIẾT KẾ HỆ THỐNG

### 3.1 Kiến trúc tổng quan

Hệ thống PDscript (Product Detection & Script) được thiết kế theo mô hình client-server với các thành phần chính:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PDscript System                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │
│  │   Web UI    │    │ Mobile App  │    │  Arduino    │              │
│  │  (Blockly)  │◄──►│   (React    │    │   (CNC)     │              │
│  │             │    │   Native)   │    │             │              │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘              │
│         │                  │                  │                      │
│         │ WebSocket        │ REST API         │ Serial COM           │
│         ▼                  ▼                  ▼                      │
│  ┌─────────────────────────────────────────────────────┐            │
│  │              Flask Server (Python)                   │            │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │            │
│  │  │ Serial  │ │ Camera  │ │   ML    │ │  Bin    │   │            │
│  │  │Controller│ │Controller│ │Controller│ │Controller│ │            │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │            │
│  └─────────────────────────────────────────────────────┘            │
│                                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │
│  │ TensorFlow  │    │   MySQL     │    │   Gmail     │              │
│  │   Model     │    │  Database   │    │   SMTP      │              │
│  └─────────────┘    └─────────────┘    └─────────────┘              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Thiết kế phần cứng

#### 3.2.1 Danh sách linh kiện

| Linh kiện | Số lượng | Thông số kỹ thuật |
|-----------|----------|-------------------|
| Arduino Uno | 1 | ATmega328P, 16MHz, 5V |
| CNC Shield V3 | 1 | Hỗ trợ 4 driver A4988/DRV8825 |
| Stepper Motor | 3 | NEMA 17, 200 steps/rev |
| Driver A4988 | 3 | 1.5A max, Microstep |
| Limit Switch | 2 | Công tắc hành trình |
| IR Sensor | 2 | Cảm biến hồng ngoại |
| Relay Module | 1 | 5V, 10A |
| Camera | 1 | USB Webcam |
| Van hút chân không | 1 | 12V DC |

#### 3.2.2 Sơ đồ kết nối

**Motor Pins (CNC Shield V3):**
- Trục X: Step(2), Dir(5)
- Trục Y: Step(3), Dir(6)
- Trục Z: Step(4), Dir(7)
- Enable: Pin 8

**Cảm biến và cơ cấu chấp hành:**
- Limit Switch Z: Pin 12
- Limit Switch X: Pin 13
- IR Sensor 1: Pin 9
- IR Sensor 2: Pin 10
- Relay (Van hút): Pin 11

### 3.3 Thiết kế phần mềm

#### 3.3.1 Backend - Flask Server

**Cấu trúc thư mục:**
```
main/
├── app_ws.py              # Entry point với WebSocket
├── config.py              # Cấu hình hệ thống
├── controllers/           # Business Logic
│   ├── serial_controller.py    # Giao tiếp Arduino
│   ├── camera_controller.py    # Điều khiển Camera
│   ├── ml_controller.py        # AI/ML Predictions
│   ├── bin_controller.py       # Quản lý thùng chứa
│   ├── script_executor_ws.py   # Thực thi script
│   └── email_controller.py     # Gửi email thông báo
├── routes/                # API Endpoints
└── templates/             # HTML Templates
```

**Các tính năng chính:**
1. **WebSocket Real-time:** Cập nhật trạng thái liên tục
2. **Script Queue System:** Hàng đợi xử lý nhiều kịch bản
3. **Lazy Loading:** Tối ưu thời gian khởi động
4. **Cloud Sync:** Đồng bộ dữ liệu lên server từ xa

#### 3.3.2 Machine Learning Model

**Đặc điểm kỹ thuật:**
- Framework: TensorFlow SavedModel
- Input size: 224x224 RGB
- Output classes:
  1. Premium-grade watermelon (Loại 1)
  2. Second-grade watermelon (Loại 2)
  3. Defective watermelon (Lỗi)
  4. Nothing (Không có vật)

**Tối ưu hóa:**
- Lazy Loading: Model chỉ load khi cần
- Prediction Cache: Cache 0.5s tránh inference lặp
- Background pre-warming: Warm up model khi hệ thống idle

#### 3.3.3 Mobile App - React Native

**Các màn hình chính:**
| Screen | Chức năng |
|--------|-----------|
| LoginScreen | Đăng nhập hệ thống |
| ConnectScreen | Kết nối với thiết bị |
| DashboardScreen | Thống kê tổng quan |
| HistoryScreen | Lịch sử hoạt động |
| ChatbotScreen | Trợ lý AI |

### 3.4 Giao diện người dùng

#### 3.4.1 Web UI - Blockly Workspace

**Các khối lệnh có sẵn:**

| Khối | Mô tả | Thông số |
|------|-------|----------|
| 🟡 When Run | Điểm bắt đầu chương trình | - |
| 🔵 Move Motor | Di chuyển trục X/Y/Z | Trục, Hướng, Thời gian, Tốc độ |
| 🟢 Relay Control | Bật/Tắt relay (van hút) | ON/OFF |
| 🟢 Relay Pulse | Relay ON trong N giây | Trạng thái, Thời gian |
| 🟠 Wait | Tạm dừng N giây | Số giây |
| 🟣 Home Z/X | Về vị trí gốc | - |
| 🔴 Check Label | Kiểm tra nhãn từ camera | Premium/Second/Defective |
| 🔄 Repeat | Lặp lại N lần | Số lần, Các lệnh |
| ❓ If/Else | Điều kiện | Điều kiện, Then, Else |

**Ví dụ Script phân loại:**
```
When Run
├── Home X Axis
├── Repeat 10 times
│   ├── Move Z- 1000ms Speed 50
│   ├── Relay ON for 2 seconds
│   ├── Move Z+ 1000ms Speed 50
│   ├── If Check Label is "Premium Watermelon"
│   │   └── Move X+ 2000ms Speed 80
│   └── Else
│       └── Move X- 2000ms Speed 80
└── Home Z Axis
```

#### 3.4.2 Chatbot AI Interface

**Tính năng:**
- Trả lời bằng tiếng Việt tự nhiên
- Hiển thị Markdown (bold, bảng, danh sách)
- Quick Actions: Tồn kho, Cảnh báo, Thống kê
- Reasoning display: Hiển thị quá trình suy luận

**Context Data tự động thu thập:**
- Trạng thái tồn kho (bins)
- Lịch sử cảnh báo
- Thống kê theo ngày/tuần/tháng

---

## CHƯƠNG 4: TRIỂN KHAI VÀ THỰC HIỆN

### 4.1 Phần cứng Arduino và CNC Shield

#### 4.1.1 Code Arduino (main.ino)

**Khởi tạo hệ thống:**
```cpp
void setup() {
  Serial.begin(9600);
  
  // Setup Motor pins
  pinMode(en, OUTPUT);
  pinMode(stepPinX, OUTPUT); pinMode(dirPinX, OUTPUT);
  pinMode(stepPinY, OUTPUT); pinMode(dirPinY, OUTPUT);
  pinMode(stepPinZ, OUTPUT); pinMode(dirPinZ, OUTPUT);
  
  // Setup Input
  pinMode(Z_LIMIT_PIN, INPUT_PULLUP);
  pinMode(X_LIMIT_PIN, INPUT_PULLUP); 
  pinMode(IR_SENSOR_1, INPUT_PULLUP);
  pinMode(IR_SENSOR_2, INPUT_PULLUP);

  // Setup Relay
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);

  // Kích hoạt Driver
  digitalWrite(en, LOW); 
  Serial.println("READY");
}
```

**Giao thức lệnh Serial:**

| Lệnh | Format | Ví dụ | Mô tả |
|------|--------|-------|-------|
| Move | `M <X> <Y> <Z> <time> <speed>` | `M 1 0 0 1000 50` | Di chuyển X+ trong 1s ở 50 RPM |
| Relay | `R <state>` | `R 1` | Bật relay |
| Home Z | `H` | `H` | Về home trục Z |
| Home X | `HX` | `HX` | Về home trục X |
| Check | `C` | `C` | Đọc cảm biến |

#### 4.1.2 Hàm di chuyển motor

```cpp
void moveMotors(int dirX, int dirY, int dirZ, 
                unsigned long duration, float speedRpm) {
  
  if (speedRpm <= 0) speedRpm = 50;
  long localPeriod = 1000000 / (speedRpm / 60 * pulsePerRound);

  // Set hướng
  if (dirX != NO_MOVE) 
    digitalWrite(dirPinX, (dirX == X_POS ? HIGH : LOW));
  if (dirY != NO_MOVE) 
    digitalWrite(dirPinY, (dirY == Y_POS ? HIGH : LOW));
  if (dirZ != NO_MOVE) 
    digitalWrite(dirPinZ, (dirZ == Z_POS ? HIGH : LOW));

  unsigned long startTime = millis();
  
  while (millis() - startTime < duration) {
    if (dirX != NO_MOVE) digitalWrite(stepPinX, HIGH);
    if (dirY != NO_MOVE) digitalWrite(stepPinY, HIGH);
    if (dirZ != NO_MOVE) digitalWrite(stepPinZ, HIGH);
    delayMicroseconds(0.5 * localPeriod);

    if (dirX != NO_MOVE) digitalWrite(stepPinX, LOW);
    if (dirY != NO_MOVE) digitalWrite(stepPinY, LOW);
    if (dirZ != NO_MOVE) digitalWrite(stepPinZ, LOW);
    delayMicroseconds(0.5 * localPeriod);
  }
  Serial.println("DONE");
}
```

### 4.2 Backend Flask Server

#### 4.2.1 Serial Controller

```python
class SerialController:
    """Thread-safe serial communication controller"""
    
    def __init__(self):
        self.lock = threading.Lock()
        self.ser = None
        self.connect()

    def send_command(self, cmd):
        if not self.ser:
            return "Error: No Serial Connection"
        
        with self.lock:
            try:
                self.ser.write(f"{cmd}\n".encode('utf-8'))
                response = self.ser.readline().decode('utf-8').strip()
                return response
            except Exception as e:
                return f"Error: {e}"
```

#### 4.2.2 WebSocket Events

```python
@socketio.on('execute_script')
def handle_execute(data):
    script = data.get('script', [])
    priority = data.get('priority', False)
    
    if priority:
        success = executor.execute_priority(script)
    else:
        success = executor.enqueue(script)
    
    emit('script_queued', {
        'success': success,
        'queue_size': executor.queue_size()
    })

@socketio.on('get_status')
def handle_get_status():
    emit('status', {
        'serial_connected': arduino.is_connected(),
        'bins': bins.get_status(),
        'script_running': executor.is_running,
        'queue_size': executor.queue_size()
    })
```

### 4.3 Machine Learning Model

#### 4.3.1 ML Controller

```python
class MLController:
    """Machine Learning model controller with lazy loading"""
    
    def __init__(self):
        self.model_layer = None
        self.class_names = []
        self.is_loaded = False
        self._prediction_cache = {}
        self._cache_ttl = 0.5
    
    def predict_frame(self, frame):
        if not self.is_loaded:
            if not self.load_model():
                return -1, "Model Not Loaded", 0.0
        
        # Convert BGR to RGB
        image_cv = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image_pil = Image.fromarray(image_cv)
        
        # Preprocess
        data = self.preprocess_image(image_pil)
        
        # Predict
        prediction_dict = self.model_layer(data)
        prediction = list(prediction_dict.values())[0]
        
        index = np.argmax(prediction)
        class_name = self.class_names[index].strip()
        confidence_score = float(prediction[0][index])
        
        return (index, class_name, confidence_score)
```

#### 4.3.2 Nhãn phân loại (labels.txt)

```
0 Premium-grade watermelon
1 Second-grade watermelon
2 Defective watermelon
3 Nothing
```

### 4.4 Mobile App với Chatbot AI

#### 4.4.1 System Prompt cho Chatbot

```javascript
const SYSTEM_PROMPT = `Bạn là AI quản lý kho thông minh cho 
hệ thống phân loại dưa hấu tự động PDscript.

## VAI TRÒ:
- Trợ lý phân tích dữ liệu kho hàng
- Cung cấp thông tin tồn kho, cảnh báo, thống kê
- Trả lời bằng tiếng Việt, ngắn gọn, chuyên nghiệp

## THUẬT NGỮ:
- Premium Bin: Thùng chứa dưa loại 1 (thượng hạng)
- Second-grade Bin: Thùng chứa dưa loại 2
- Fill %: Phần trăm đầy của thùng
- Detection: Phát hiện/phân loại một quả dưa
`;
```

#### 4.4.2 Context Data Builder

```javascript
const buildContextString = () => {
    let ctx = "";
    
    // Inventory
    ctx += `\n### TỒN KHO\n`;
    ctx += `- Tổng: ${inv.total_items}/${inv.total_capacity}\n`;
    
    // Alerts
    ctx += `\n### CẢNH BÁO\n`;
    ctx += `- Chưa đọc: ${alerts.unread_count}\n`;
    
    // Analytics
    ctx += `\n### THỐNG KÊ HÔM NAY\n`;
    ctx += `- Đã xử lý: ${today.total_processed}\n`;
    
    return ctx;
};
```

---

## CHƯƠNG 5: KẾT QUẢ VÀ ĐÁNH GIÁ

### 5.1 Kết quả thử nghiệm

#### 5.1.1 Độ chính xác phân loại

| Loại dưa | Số mẫu | Đúng | Sai | Độ chính xác |
|----------|--------|------|-----|--------------|
| Premium | 100 | 95 | 5 | 95% |
| Second-grade | 100 | 92 | 8 | 92% |
| Defective | 50 | 48 | 2 | 96% |
| **Tổng** | **250** | **235** | **15** | **94%** |

#### 5.1.2 Thời gian xử lý

| Công đoạn | Thời gian |
|-----------|-----------|
| Chụp ảnh | ~50ms |
| Inference ML | ~200ms |
| Di chuyển robot | ~3s |
| **Tổng 1 chu kỳ** | **~3.5s** |

#### 5.1.3 Tốc độ phân loại

- Trung bình: **~15-17 quả/phút**
- Tương đương: **~900-1000 quả/giờ**

### 5.2 Đánh giá hiệu năng

#### 5.2.1 WebSocket Response Time

| Event | Latency |
|-------|---------|
| script_started | <10ms |
| script_progress | <5ms |
| prediction | <50ms |

#### 5.2.2 Chatbot AI Performance

| Metric | Giá trị |
|--------|---------|
| Response time | 1-3s |
| Context refresh | 30s/lần |
| Accuracy | Cao với dữ liệu cung cấp |

### 5.3 Ưu điểm và hạn chế

#### 5.3.1 Ưu điểm

**So với các sản phẩm hiện có:**
1. **Giao diện thân thiện:** Blockly cho phép lập trình không cần code
2. **Chatbot AI:** Chuyển đổi dữ liệu kỹ thuật thành ngôn ngữ tự nhiên
3. **Real-time monitoring:** WebSocket cập nhật trạng thái liên tục
4. **Mobile app:** Giám sát từ xa qua điện thoại
5. **Chi phí thấp:** Sử dụng Arduino và linh kiện phổ biến

**Tính ổn định và độ tin cậy:**
- Thread-safe serial communication
- Queue system với priority handling
- Lazy loading tối ưu tài nguyên
- Error handling và recovery

**Tính mới, sáng tạo:**
- Kết hợp 3 công nghệ: Robot + CV + AI Chatbot
- Visual programming cho robot nông nghiệp
- Chatbot với context-aware từ dữ liệu thực

#### 5.3.2 Hạn chế

1. **Điều kiện ánh sáng:** Model nhạy cảm với thay đổi ánh sáng
2. **Tốc độ:** Còn chậm so với dây chuyền công nghiệp
3. **Kích thước dưa:** Chưa xử lý đa dạng kích thước
4. **Kết nối Serial:** Phụ thuộc vào cáp USB, chưa có wireless

---

## CHƯƠNG 6: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 6.1 Kết luận

Đề tài "Hệ thống phân loại dưa hấu sử dụng cánh tay robot tích hợp Thị giác máy tính và Chatbot AI" đã hoàn thành các mục tiêu đề ra:

**✓ Về kỹ thuật:**
- Xây dựng thành công hệ thống CNC 3 trục điều khiển bằng Arduino
- Tích hợp model Machine Learning phân loại dưa hấu với độ chính xác 94%
- Phát triển backend Flask Server với WebSocket real-time

**✓ Về tương tác người-máy:**
- Giao diện Blockly cho phép lập trình kéo thả trực quan
- Chatbot AI cung cấp thông tin bằng ngôn ngữ tự nhiên tiếng Việt
- Mobile app giám sát từ xa với dashboard thống kê

**✓ Về ứng dụng thực tiễn:**
- Giải quyết bài toán phân loại thủ công của nông sản Việt Nam
- Chi phí đầu tư hợp lý với quy mô nông hộ
- Dễ sử dụng, không yêu cầu kiến thức lập trình

### 6.2 Hướng phát triển

**Ngắn hạn:**
1. Cải thiện model ML với dataset lớn hơn
2. Thêm tính năng đo kích thước dưa bằng computer vision
3. Tích hợp cân điện tử để phân loại theo khối lượng

**Trung hạn:**
1. Thay thế Arduino bằng ESP32 để có WiFi/Bluetooth
2. Phát triển phiên bản với nhiều trục hơn (4-6 DOF)
3. Tích hợp hệ thống băng chuyền tự động

**Dài hạn:**
1. Nhân rộng cho các loại nông sản khác (bưởi, cam, xoài...)
2. Phát triển thành sản phẩm thương mại
3. Tích hợp với hệ thống quản lý nông trại thông minh (Smart Farm)

---

## TÀI LIỆU THAM KHẢO

[1] RSIP Vision. (n.d.). *Robots using Machine Vision in Agriculture*. https://www.rsipvision.com/robots-using-machine-vision-agriculture/

[2] Rybacki, P. et al. (2024). *Convolutional Neural Network (CNN) Model for the Classification of Varieties of Date Palm Fruits*. Sensors, 24(2), 558.

[3] Google. (n.d.). *Blockly - A visual programming editor*. https://developers.google.com/blockly

[4] TensorFlow. (n.d.). *TensorFlow SavedModel*. https://www.tensorflow.org/guide/saved_model

[5] Flask-SocketIO. (n.d.). *Flask-SocketIO documentation*. https://flask-socketio.readthedocs.io/

[6] Arduino. (n.d.). *Arduino Uno Rev3*. https://www.arduino.cc/en/Main/ArduinoBoardUno

[7] CNC Shield V3 Documentation. https://blog.protoneer.co.nz/arduino-cnc-shield/

[8] React Native. (n.d.). *React Native documentation*. https://reactnative.dev/

[9] ivySCI. (2023). *Development of watermelon picking robot based on AioT*. https://www.ivysci.com/en/articles/10970472

[10] Last Minute Engineers. (n.d.). *Joystick and Servo Motor control*. https://lastminuteengineers.com

---

## PHỤ LỤC

### Phụ lục A: Cấu hình hệ thống (config.py)

```python
# ================= PATHS =================
MODEL_PATH = "../model.savedmodel"
LABELS_PATH = "../labels.txt"

# ================= SERIAL =================
SERIAL_PORT = "COM5"
BAUD_RATE = 9600
SERIAL_TIMEOUT = 1

# ================= CAMERA =================
CAMERA_INDEX = 1
CAMERA_FALLBACK_INDEX = 0

# ================= SERVER =================
SERVER_HOST = '0.0.0.0'
SERVER_PORT = 5000

# ================= BIN DETECTION =================
BIN_CHECK_SAMPLES = 30
BIN_CHECK_INTERVAL = 0.1
BIN_FULL_THRESHOLD = 0.9

# ================= ML MODEL =================
IMAGE_SIZE = (224, 224)
```

### Phụ lục B: REST API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/control | Gửi lệnh thủ công |
| GET | /api/sensors | Đọc cảm biến IR |
| GET | /api/bin_status | Trạng thái thùng chứa |
| POST | /api/reset_bins | Reset cờ thùng đầy |
| POST | /api/execute_script | Thực thi script |
| POST | /api/stop_script | Dừng script |
| GET | /api/status | Trạng thái hệ thống |
| GET | /api/history | Lịch sử hoạt động |
| GET | /api/history/stats | Thống kê |
| GET | /api/email/config | Cấu hình email |
| POST | /api/email/test | Gửi email test |

### Phụ lục C: Hướng dẫn cài đặt

**1. Cài đặt Dependencies:**
```powershell
cd main
pip install -r requirements.txt
```

**2. Upload code Arduino:**
- Mở Arduino IDE
- Upload `arduino_main/main.ino` lên Arduino Uno
- Ghi nhớ cổng COM

**3. Chạy Server:**
```powershell
python app_ws.py
```

**4. Truy cập:**
- Web UI: http://localhost:5000
- Tạo script với Blockly
- Nhấn **Run** để thực thi

---

**© 2024 Nhóm Ngũ Lực Bách Khoa - Trường Đại học Bách Khoa TP.HCM**
