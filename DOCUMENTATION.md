# 🍉 PDscript - Hệ thống Phân loại Dưa hấu Tự động

## 📋 Tổng quan

**PDscript** (Product Detection & Script) là một hệ thống phân loại dưa hấu tự động sử dụng trí tuệ nhân tạo (AI) và lập trình kéo thả trực quan (Visual Programming). Hệ thống kết hợp phần cứng CNC 3 trục, camera, và machine learning để nhận dạng và phân loại dưa hấu thành 3 loại: Premium, Second-grade, và Defective.

### 🎯 Mục tiêu

- **Tự động hóa** quy trình phân loại dưa hấu
- **Dễ sử dụng** với giao diện kéo thả Blockly
- **Chính xác** nhờ model Machine Learning
- **Linh hoạt** cho phép người dùng tùy chỉnh kịch bản phân loại
- **Thông báo thời gian thực** qua WebSocket và Email

---

## 🏗️ Kiến trúc Hệ thống

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
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐               │            │
│  │  │ Script  │ │ Email   │ │ History │               │            │
│  │  │Executor │ │Controller│ │Controller│              │            │
│  │  └─────────┘ └─────────┘ └─────────┘               │            │
│  └─────────────────────────────────────────────────────┘            │
│                                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │
│  │   TensorFlow │    │   MySQL     │    │   Gmail     │              │
│  │   Model     │    │   Database  │    │   SMTP      │              │
│  └─────────────┘    └─────────────┘    └─────────────┘              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu trúc Thư mục

```
nhap_mon_ky_thuat/
├── 📁 arduino_main/          # Code Arduino
│   ├── main.ino              # Chương trình chính Arduino
│   └── test_limit_switches.ino
│
├── 📁 main/                  # Flask Server (Backend)
│   ├── app_ws.py             # Entry point với WebSocket
│   ├── app.py                # Entry point cơ bản
│   ├── config.py             # Cấu hình hệ thống
│   ├── email_config.json     # Cấu hình email
│   │
│   ├── 📁 controllers/       # Business Logic
│   │   ├── serial_controller.py    # Giao tiếp Arduino
│   │   ├── camera_controller.py    # Điều khiển Camera
│   │   ├── ml_controller.py        # AI/ML Predictions
│   │   ├── bin_controller.py       # Quản lý thùng chứa
│   │   ├── script_executor_ws.py   # Thực thi script (WebSocket)
│   │   ├── email_controller.py     # Gửi email thông báo
│   │   └── history_controller.py   # Lịch sử hoạt động
│   │
│   ├── 📁 routes/            # API Endpoints
│   │   ├── api_routes.py     # REST API
│   │   └── main_routes.py    # Trang chính
│   │
│   ├── 📁 static/            # Frontend Assets
│   │   ├── css/              # Stylesheets
│   │   └── js/               # JavaScript modules
│   │       ├── blockly-config.js   # Cấu hình Blockly blocks
│   │       ├── blockly-workspace.js # Workspace management
│   │       ├── websocket-client.js  # WebSocket client
│   │       ├── email-settings.js    # Cài đặt email UI
│   │       └── ...
│   │
│   └── 📁 templates/         # HTML Templates
│       ├── base.html
│       ├── index.html
│       └── partials/
│
├── 📁 mobile_app/            # React Native App
│   ├── App.js
│   └── src/
│       ├── screens/          # Các màn hình
│       ├── api/              # API client
│       └── context/          # Auth context
│
├── 📁 model.savedmodel/      # TensorFlow Model
│   ├── saved_model.pb
│   └── variables/
│
├── 📁 upload/                # PHP Backend (Remote Database)
│   ├── receive.php           # Nhận dữ liệu từ app
│   ├── get_logs.php          # Lấy lịch sử
│   └── get_stats.php         # Lấy thống kê
│
└── labels.txt                # Nhãn cho ML model
```

---

## 🧩 Các Thành phần Chi tiết

### 1. 🎮 Web Interface (Blockly Visual Programming)

Giao diện web cho phép người dùng tạo kịch bản phân loại bằng cách kéo thả các khối lệnh.

#### Các khối lệnh có sẵn:

| Khối | Mô tả | Thông số |
|------|-------|----------|
| 🟡 **When Run** | Điểm bắt đầu chương trình | - |
| 🔵 **Move Motor** | Di chuyển trục X/Y/Z | Trục, Hướng (+/-), Thời gian (ms), Tốc độ (RPM) |
| 🟢 **Relay Control** | Bật/Tắt relay (van hút) | ON/OFF |
| 🟢 **Relay Pulse** | Relay ON trong N giây rồi OFF | Trạng thái, Thời gian |
| 🟠 **Wait** | Tạm dừng N giây | Số giây |
| 🟣 **Home Z/X** | Về vị trí gốc | - |
| 🔴 **Check Label** | Kiểm tra nhãn từ camera | Premium/Second/Defective |
| 🔄 **Repeat** | Lặp lại N lần | Số lần, Các lệnh bên trong |
| ❓ **If/Else** | Điều kiện | Điều kiện, Then, Else |

#### Ví dụ Script:

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

### 2. 🤖 Arduino CNC Controller

Arduino Uno + CNC Shield V3 điều khiển 3 trục stepper motor.

#### Giao tiếp Serial (9600 baud):

| Lệnh | Format | Ví dụ | Mô tả |
|------|--------|-------|-------|
| **Move** | `M <dirX> <dirY> <dirZ> <duration> <speed>` | `M 1 0 0 1000 50` | Di chuyển X+ trong 1s ở 50 RPM |
| **Relay** | `R <state>` | `R 1` | Bật relay |
| **Home Z** | `H` | `H` | Về home trục Z |
| **Home X** | `HX` | `HX` | Về home trục X |
| **Check Sensors** | `C` | `C` | Đọc cảm biến → `S1:1|S2:0` |

#### Phần cứng:

- **Motor Pins**: X(2,5), Y(3,6), Z(4,7)
- **Enable Pin**: 8
- **Limit Switches**: Z(12), X(13)
- **IR Sensors**: S1(9), S2(10)
- **Relay**: Pin 11

### 3. 🧠 Machine Learning Model

TensorFlow SavedModel được train để nhận dạng dưa hấu.

#### Classes:

1. `Premium-grade watermelon` - Loại 1 (Thượng hạng)
2. `Second-grade watermelon` - Loại 2 (Bình thường)
3. `Defective watermelon` - Loại lỗi
4. `Nothing` - Không có vật

#### Đặc điểm:

- **Input**: 224x224 RGB image
- **Model**: TFSMLayer (Keras)
- **Lazy Loading**: Model chỉ load khi cần (giảm thời gian khởi động)
- **Prediction Cache**: Cache 0.5s để tránh inference lặp lại

### 4. 📡 WebSocket Real-time Communication

Sử dụng Flask-SocketIO cho giao tiếp real-time.

#### Events:

| Event | Direction | Mô tả |
|-------|-----------|-------|
| `execute_script` | Client → Server | Gửi script để thực thi |
| `script_started` | Server → Client | Script bắt đầu chạy |
| `script_progress` | Server → Client | Cập nhật tiến trình (step x/y) |
| `script_completed` | Server → Client | Script hoàn thành |
| `script_error` | Server → Client | Lỗi trong quá trình chạy |
| `stop_script` | Client → Server | Dừng script đang chạy |
| `get_status` | Client → Server | Lấy trạng thái hệ thống |
| `prediction` | Server → Client | Kết quả nhận dạng từ camera |

### 5. 📧 Email Notification System

Tự động gửi email khi thùng chứa đầy.

#### Tính năng:

- **SMTP Gmail** với App Password
- **Cooldown 30 phút** tránh spam
- **Tùy chọn** bật/tắt thông báo cho từng thùng
- **UI hiện đại** để cấu hình email

#### Cấu hình mặc định:

```json
{
  "enabled": false,
  "smtp_server": "smtp.gmail.com",
  "smtp_port": 587,
  "sender_email": "cncsmartarm@gmail.com",
  "recipient_emails": [],
  "notify_bin1_full": true,
  "notify_bin2_full": true
}
```

### 6. 📱 Mobile App (React Native)

Ứng dụng di động để giám sát và điều khiển từ xa.

#### Màn hình:

| Screen | Chức năng |
|--------|-----------|
| **LoginScreen** | Đăng nhập hệ thống |
| **ConnectScreen** | Kết nối với thiết bị |
| **DashboardScreen** | Thống kê tổng quan, biểu đồ |
| **HistoryScreen** | Lịch sử hoạt động |
| **ChatbotScreen** | Trợ lý AI |

#### Tính năng:

- Haptic Feedback (rung phản hồi)
- Network Status indicator
- Pull-to-refresh
- Real-time statistics

### 7. 🗄️ PHP Backend (Remote Database)

API PHP kết nối MySQL để lưu trữ dữ liệu cloud.

#### Endpoints:

| File | Chức năng |
|------|-----------|
| `receive.php` | Nhận log từ hệ thống, upload ảnh |
| `get_logs.php` | Lấy lịch sử hoạt động |
| `get_stats.php` | Lấy thống kê theo ngày |
| `setup_db.php` | Khởi tạo database |

---

## 🔄 Luồng Hoạt động

### Luồng Phân loại Dưa hấu:

```
┌──────────────────────────────────────────────────────────────────────┐
│ 1. User tạo Script trên Blockly                                      │
│    └── Kéo thả các khối: Move, Check Label, If/Else, Relay...        │
│                                                                       │
│ 2. User nhấn "Run"                                                   │
│    └── Script được convert sang JSON và gửi qua WebSocket            │
│                                                                       │
│ 3. Server nhận và thực thi Script                                    │
│    ├── ScriptExecutorWS xử lý từng block                             │
│    ├── Gửi lệnh đến Arduino qua Serial                               │
│    └── Real-time progress updates qua WebSocket                      │
│                                                                       │
│ 4. Khi gặp block "Check Label"                                       │
│    ├── Camera chụp ảnh                                               │
│    ├── ML Model phân loại                                            │
│    ├── Kết quả: Premium / Second / Defective                         │
│    └── Script tiếp tục dựa trên If/Else                              │
│                                                                       │
│ 5. Dưa được đưa vào thùng tương ứng                                  │
│    ├── Cảm biến IR kiểm tra thùng đầy                                │
│    ├── Nếu đầy → Gửi email thông báo                                 │
│    └── Hiển thị cảnh báo trên UI                                     │
│                                                                       │
│ 6. Lịch sử được lưu                                                  │
│    ├── Local: history.json                                           │
│    └── Cloud: MySQL via PHP                                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Hướng dẫn Khởi động

### 1. Cài đặt Dependencies

```powershell
# Python dependencies
cd main
pip install -r requirements.txt

# Mobile app (nếu cần)
cd mobile_app
npm install
```

### 2. Kết nối Arduino

1. Upload `arduino_main/main.ino` lên Arduino Uno
2. Kết nối CNC Shield V3
3. Cắm cáp USB, ghi nhớ cổng COM (VD: COM5)
4. Cập nhật `config.py` với đúng cổng COM

### 3. Chạy Server

```powershell
cd main
python app_ws.py
```

Server sẽ chạy tại: `http://localhost:5000`

### 4. Sử dụng

1. Mở trình duyệt: `http://localhost:5000`
2. Kéo thả các khối Blockly để tạo script
3. Nhấn **Run** để thực thi
4. Xem kết quả real-time trên màn hình

---

## 📊 API Reference

### REST Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/control` | Gửi lệnh thủ công đến Arduino |
| GET | `/api/sensors` | Đọc cảm biến IR |
| GET | `/api/bin_status` | Trạng thái thùng chứa |
| POST | `/api/reset_bins` | Reset cờ thùng đầy |
| POST | `/api/execute_script` | Thực thi script (REST fallback) |
| POST | `/api/stop_script` | Dừng script |
| GET | `/api/status` | Trạng thái hệ thống |
| GET | `/api/history` | Lịch sử hoạt động |
| GET | `/api/history/stats` | Thống kê |
| GET | `/api/email/config` | Cấu hình email |
| POST | `/api/email/config` | Cập nhật cấu hình email |
| POST | `/api/email/recipients` | Thêm email nhận |
| DELETE | `/api/email/recipients` | Xóa email nhận |
| POST | `/api/email/test` | Gửi email test |

---

## 🔧 Cấu hình

### config.py

```python
# Serial
SERIAL_PORT = "COM5"
SERIAL_BAUDRATE = 9600

# Server
SERVER_HOST = "0.0.0.0"
SERVER_PORT = 5000
DEBUG_MODE = False

# Camera
CAMERA_INDEX = 0

# ML Model
MODEL_PATH = "../model.savedmodel"
LABELS_PATH = "../labels.txt"
IMAGE_SIZE = (224, 224)

# Bin Detection
BIN_CHECK_SAMPLES = 5
BIN_CHECK_INTERVAL = 0.1
BIN_FULL_THRESHOLD = 0.8
```

---

## 🎨 Giao diện

### Web UI Features:

- 🌙 **Dark Theme** - Dễ nhìn, chuyên nghiệp
- 📐 **Responsive** - Hoạt động trên mọi thiết bị
- 🧱 **Blockly Workspace** - Kéo thả trực quan
- 📹 **Camera Preview** - Xem camera real-time
- 📊 **Status Dashboard** - Trạng thái hệ thống
- 🔔 **Notifications** - Thông báo toast
- 📧 **Email Settings Modal** - Cài đặt email đẹp mắt

---

## 🛡️ Bảo mật

- HTTP Basic Auth cho PHP API
- App Password cho Gmail SMTP
- Password được ẩn khi hiển thị trên UI
- Không lưu credentials trên frontend

---

## 📝 Changelog

### v2.0 - WebSocket & Email (Current)
- ✅ WebSocket real-time communication
- ✅ Script queue system với priority
- ✅ Email notifications khi thùng đầy
- ✅ Mobile app React Native
- ✅ History logging
- ✅ Modern UI redesign

### v1.0 - Initial Release
- ✅ Basic Blockly integration
- ✅ Arduino serial control
- ✅ ML prediction
- ✅ REST API

---

## 👥 Đóng góp

Dự án được phát triển bởi nhóm BKU Team.

---

## 📄 License

© 2025 BKU Team. All rights reserved.
