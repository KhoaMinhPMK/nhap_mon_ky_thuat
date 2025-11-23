// ==================================================
// ====== CODE TỔNG CNC 3 TRỤC + LIMIT + LOOP =======
// ====== UPDATE: CHECK SENSOR THEO TỪNG LOẠI =======
// ==================================================

// ====== CẤU HÌNH SỐ LẦN CHẠY KỊCH BẢN ======
#define SO_LAN_CHAY 1  

// ====== CẤU HÌNH CHÂN (CNC Shield V3) ======
const int en = 8; // Chân Enable

// --- TRỤC X ---
const int dirPinX = 5;
const int stepPinX = 2;

// --- TRỤC Y ---
const int dirPinY = 6;
const int stepPinY = 3;

// --- TRỤC Z ---
const int dirPinZ = 7;
const int stepPinZ = 4;

// --- CÔNG TẮC HÀNH TRÌNH & NÚT BẤM ---
#define LIMIT_PIN 13 
#define BTN_ACTION A2 
#define Z_LIMIT_PIN 12 // SpnEn (Limit Z về đích)

// --- CẢM BIẾN HỒNG NGOẠI ---
#define IR_SENSOR_1 9  // Cảm biến cho Loại 1
#define IR_SENSOR_2 10 // Cảm biến cho Loại 2

// --- CHÂN RELAY (Van) ---
#define RELAY_PIN 11 

// ====== HẰNG SỐ ======
#define DIR_POSITIVE HIGH
#define DIR_NEGATIVE LOW
#define X_POS 1
#define X_NEG -1
#define Y_POS 1
#define Y_NEG -1
#define Z_POS 1
#define Z_NEG -1
#define NO_MOVE 0

// ====== BIẾN TOÀN CỤC ======
bool lastButtonState = HIGH; 
long pulsePerRound = 200; // Mặc định step 1.8 độ

// Biến theo dõi thời gian vật cản
unsigned long obstacleFirstTime = 0; 

// Biến lưu loại dưa đang chạy (0=Loại 1, 1=Loại 2, 2=Loại 3)
int currentRunningType = -1; 

// ================= SETUP =================
void setup() {
  Serial.begin(9600);
  
  // 1. Setup Motor
  pinMode(en, OUTPUT);
  pinMode(stepPinX, OUTPUT); pinMode(dirPinX, OUTPUT);
  pinMode(stepPinY, OUTPUT); pinMode(dirPinY, OUTPUT);
  pinMode(stepPinZ, OUTPUT); pinMode(dirPinZ, OUTPUT);
  
  // 2. Setup Input
  pinMode(LIMIT_PIN, INPUT_PULLUP); 
  pinMode(BTN_ACTION, INPUT_PULLUP);
  pinMode(Z_LIMIT_PIN, INPUT_PULLUP); 
  
  // Setup Cảm biến IR
  pinMode(IR_SENSOR_1, INPUT_PULLUP);
  pinMode(IR_SENSOR_2, INPUT_PULLUP);

  // 3. Setup Relay
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Mặc định tắt

  // 4. Kích hoạt Driver
  digitalWrite(en, LOW); 

  Serial.println("--- HE THONG SAN SANG ---");
  Serial.println("Che do: Check sensor rieng biet cho tung loai");
}

// ================= HÀM CHECK SENSOR (RIÊNG BIỆT) =================
// Trả về true nếu cần phải bù giờ (đã pause), false nếu không
bool checkSensorAndPause() {
    bool isObstacle = false;

    // Chỉ check sensor tương ứng với loại đang chạy
    if (currentRunningType == 0) {
        // Đang chạy Loại 1 -> Chỉ check Sensor 1
        if (digitalRead(IR_SENSOR_1) == LOW) isObstacle = true;
    } 
    else if (currentRunningType == 1) {
        // Đang chạy Loại 2 -> Chỉ check Sensor 2
        if (digitalRead(IR_SENSOR_2) == LOW) isObstacle = true;
    }
    // Loại 3 (hoặc khác) không check sensor (hoặc chưa có sensor)

    if (isObstacle) {
        if (obstacleFirstTime == 0) {
            obstacleFirstTime = millis(); // Bắt đầu đếm
        } else {
            // Nếu đã đếm được hơn 2000ms (2 giây)
            if (millis() - obstacleFirstTime >= 2000) {
                Serial.print("!!! LOAI "); Serial.print(currentRunningType + 1);
                Serial.println(" DAY -> TAM DUNG 10s !!!");
                
                // Dừng 10 giây
                delay(10000); 
                
                Serial.println("!!! TIEP TUC !!!");
                
                // Reset lại bộ đếm
                obstacleFirstTime = 0; 
                return true; // Báo hiệu đã pause
            }
        }
    } else {
        // Nếu không còn vật cản -> Reset bộ đếm ngay lập tức
        obstacleFirstTime = 0;
    }
    return false;
}

// ================= HÀM DI CHUYỂN =================

void moveMotors(int dirX, int dirY, int dirZ, unsigned long duration, float speedRpm) {
  
  // Kiểm tra lệnh nghỉ
  if (dirX == NO_MOVE && dirY == NO_MOVE && dirZ == NO_MOVE) {
    unsigned long startDelay = millis();
    while (millis() - startDelay < duration) {
       checkSensorAndPause(); 
    }
    return;
  }

  // --- TÍNH TOÁN TỐC ĐỘ ---
  if (speedRpm <= 0) speedRpm = 50;
  long localPeriod = 1000000 / (speedRpm / 60 * pulsePerRound);

  // Set hướng
  if (dirX != NO_MOVE) digitalWrite(dirPinX, (dirX == X_POS ? DIR_POSITIVE : DIR_NEGATIVE));
  if (dirY != NO_MOVE) digitalWrite(dirPinY, (dirY == Y_POS ? DIR_POSITIVE : DIR_NEGATIVE));
  if (dirZ != NO_MOVE) digitalWrite(dirPinZ, (dirZ == Z_POS ? DIR_POSITIVE : DIR_NEGATIVE));

  unsigned long startTime = millis();
  
  // --- VÒNG LẶP CHẠY STEP ---
  while (millis() - startTime < duration) {
    
    // Check Sensor
    if (checkSensorAndPause()) {
        // Nếu hàm trả về true, nghĩa là đã delay 10s
        // Cần bù 10s vào startTime
        startTime += 10000;
    }

    // Bật xung
    if (dirX != NO_MOVE) digitalWrite(stepPinX, HIGH);
    if (dirY != NO_MOVE) digitalWrite(stepPinY, HIGH);
    if (dirZ != NO_MOVE) digitalWrite(stepPinZ, HIGH);
    delayMicroseconds(0.5 * localPeriod);

    // Tắt xung
    if (dirX != NO_MOVE) digitalWrite(stepPinX, LOW);
    if (dirY != NO_MOVE) digitalWrite(stepPinY, LOW);
    if (dirZ != NO_MOVE) digitalWrite(stepPinZ, LOW);
    delayMicroseconds(0.5 * localPeriod);
  }
}

// ================= HÀM VỀ HOME Z (THEO LIMIT) =================
void moveZHome() {
  Serial.println(">>> Z VE HOME (CHECK LIMIT SpnEn) <<<");
  
  digitalWrite(dirPinZ, DIR_POSITIVE); 

  float speedRpm = 80; 
  long localPeriod = 1000000 / (speedRpm / 60 * pulsePerRound);

  while (digitalRead(Z_LIMIT_PIN) == HIGH) {
      
      checkSensorAndPause(); // Check sensor trong khi về home

      digitalWrite(stepPinZ, HIGH);
      delayMicroseconds(0.5 * localPeriod);
      digitalWrite(stepPinZ, LOW);
      delayMicroseconds(0.5 * localPeriod);
  }
  
  Serial.println(">>> DA CHAM LIMIT Z -> DUNG !!!");
}

// ================= CÁC HÀM KỊCH BẢN =================

void dualoai1() {
  currentRunningType = 0; // Đánh dấu đang chạy Loại 1
  Serial.println(">>> CHAY KICH BAN: DUA LOAI 1");
  
  for (int i = 0; i < SO_LAN_CHAY; i++) {
    Serial.print("--- LAN: "); Serial.println(i + 1);

    // BƯỚC 1
    moveMotors(X_NEG, NO_MOVE, NO_MOVE, 930, 50); 
    moveMotors(NO_MOVE, Y_POS, NO_MOVE, 430, 80); 
    moveMotors(NO_MOVE, Y_NEG, NO_MOVE, 430, 80); 
    moveMotors(NO_MOVE, NO_MOVE, Z_NEG, 890, 80); 
    
    moveMotors(NO_MOVE, NO_MOVE, NO_MOVE, 500, 0); 

    moveMotors(X_NEG, NO_MOVE, NO_MOVE, 330, 80); 

    // BƯỚC 2: PHUN
    Serial.println("!!! MO VAN !!!");
    digitalWrite(RELAY_PIN, LOW); 
    moveMotors(NO_MOVE, NO_MOVE, NO_MOVE, 400, 0); 
    
    moveMotors(X_POS, NO_MOVE, NO_MOVE, 2400, 30); 

    digitalWrite(RELAY_PIN, HIGH); 
    Serial.println("!!! DONG VAN !!!");

    // BƯỚC 3: VỀ HOME Z THEO LIMIT
    moveZHome(); 

    Serial.println("--- Xong 1 chu trinh ---");
    moveMotors(NO_MOVE, NO_MOVE, NO_MOVE, 500, 0); 
  } 
}

void dualoai2() {
  currentRunningType = 1; // Đánh dấu đang chạy Loại 2
  Serial.println(">>> CHAY KICH BAN: DUA LOAI 2");

  for (int i = 0; i < SO_LAN_CHAY; i++) {
    moveMotors(X_NEG, NO_MOVE, NO_MOVE, 930, 50); 
    // ... Code loại 2 ...
    
    moveZHome();

    Serial.println("--- Xong 1 chu trinh ---");
    moveMotors(NO_MOVE, NO_MOVE, NO_MOVE, 500, 0);
  }
}

void dualoai3() {
  currentRunningType = 2; // Đánh dấu đang chạy Loại 3
  Serial.println(">>> CHAY KICH BAN: DUA LOAI 3");
  
  for (int i = 0; i < SO_LAN_CHAY; i++) {
    moveMotors(X_NEG, NO_MOVE, NO_MOVE, 930, 50); 
    // ... Code loại 3 ...
    moveMotors(NO_MOVE, NO_MOVE, Z_NEG, 930, 80); 

    // ...
    
    moveZHome();

    Serial.println("--- Xong 1 chu trinh ---");
    moveMotors(NO_MOVE, NO_MOVE, NO_MOVE, 500, 0);
  }
}


// ================= LOOP CHÍNH =================
void loop() {

  bool currentButtonState = digitalRead(BTN_ACTION);
  
  if (currentButtonState == LOW && lastButtonState == HIGH) {
    delay(50); 
    if (digitalRead(BTN_ACTION) == LOW) {
      
      Serial.println("REQ_PREDICT"); 
      
      unsigned long waitStart = millis();
      bool timeout = false;
      while (Serial.available() == 0) {
        if (millis() - waitStart > 5000) {
           Serial.println(">>> LOI: Timeout");
           timeout = true;
           break;
        }
      }
      
      if (timeout) {
        lastButtonState = currentButtonState;
        return; 
      }

      String data = Serial.readStringUntil('\n');
      data.trim(); 

      Serial.print("Lenh: "); Serial.println(data);

      if (data == "0") dualoai1();
      else if (data == "1") dualoai2();
      else if (data == "2") dualoai3();
      else if (data == "3") Serial.println(">>> KHONG CO GI");
      else Serial.println("Loi lenh!");

      Serial.println("===== HOAN TAT TOAN BO KICH BAN =====");
    }
  }
  lastButtonState = currentButtonState;
}
