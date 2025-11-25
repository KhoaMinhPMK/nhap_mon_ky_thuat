// ==================================================
// ====== ARDUINO COMMAND LISTENER FOR PC CONTROL ===
// ==================================================

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
#define BTN_ACTION A2 
#define Z_LIMIT_PIN 12 // SpnEn (Limit Z về đích - D12)
#define X_LIMIT_PIN 13 // SpnDir (Limit X về đích - D13)

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
long pulsePerRound = 200; // Mặc định step 1.8 độ

// ================= SETUP =================
void setup() {
  Serial.begin(9600);
  
  // 1. Setup Motor
  pinMode(en, OUTPUT);
  pinMode(stepPinX, OUTPUT); pinMode(dirPinX, OUTPUT);
  pinMode(stepPinY, OUTPUT); pinMode(dirPinY, OUTPUT);
  pinMode(stepPinZ, OUTPUT); pinMode(dirPinZ, OUTPUT);
  
  // 2. Setup Input
  pinMode(BTN_ACTION, INPUT_PULLUP);
  pinMode(Z_LIMIT_PIN, INPUT_PULLUP);
  pinMode(X_LIMIT_PIN, INPUT_PULLUP); 
  
  // Setup Cảm biến IR
  pinMode(IR_SENSOR_1, INPUT_PULLUP);
  pinMode(IR_SENSOR_2, INPUT_PULLUP);

  // 3. Setup Relay
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Mặc định tắt

  // 4. Kích hoạt Driver
  digitalWrite(en, LOW); 

  Serial.println("READY");
}

// ================= HÀM DI CHUYỂN =================
void moveMotors(int dirX, int dirY, int dirZ, unsigned long duration, float speedRpm) {
  
  // Kiểm tra lệnh nghỉ
  if (dirX == NO_MOVE && dirY == NO_MOVE && dirZ == NO_MOVE) {
    delay(duration);
    Serial.println("DONE");
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
  Serial.println("DONE");
}

// ================= HÀM VỀ HOME Z (THEO LIMIT) =================
void moveZHome() {
  digitalWrite(dirPinZ, DIR_NEGATIVE); // Sửa: chạy về phía âm

  float speedRpm = 30; // Giảm tốc độ từ 80 xuống 30 RPM
  long localPeriod = 1000000 / (speedRpm / 60 * pulsePerRound);

  while (digitalRead(Z_LIMIT_PIN) == HIGH) {
      digitalWrite(stepPinZ, HIGH);
      delayMicroseconds(0.5 * localPeriod);
      digitalWrite(stepPinZ, LOW);
      delayMicroseconds(0.5 * localPeriod);
  }
  Serial.println("DONE");
}

// ================= HÀM VỀ HOME X (THEO LIMIT) =================
void moveXHome() {
  digitalWrite(dirPinX, DIR_POSITIVE); // Sửa: chạy về phía dương (ngược lại)

  float speedRpm = 30; // Giảm tốc độ từ 80 xuống 30 RPM
  long localPeriod = 1000000 / (speedRpm / 60 * pulsePerRound);

  while (digitalRead(X_LIMIT_PIN) == HIGH) {
      digitalWrite(stepPinX, HIGH);
      delayMicroseconds(0.5 * localPeriod);
      digitalWrite(stepPinX, LOW);
      delayMicroseconds(0.5 * localPeriod);
  }
  Serial.println("DONE");
}

// ================= LOOP CHÍNH =================
void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    
    // Parse Command
    // Format: M <dirX> <dirY> <dirZ> <duration> <speed>
    // Example: M 1 0 0 1000 50 (Move X+ for 1s at 50rpm)
    if (command.startsWith("M ")) {
      int dirX, dirY, dirZ;
      unsigned long duration;
      float speed;
      
      // Simple parsing (assuming correct format)
      int p1 = command.indexOf(' ', 2);
      int p2 = command.indexOf(' ', p1 + 1);
      int p3 = command.indexOf(' ', p2 + 1);
      int p4 = command.indexOf(' ', p3 + 1);
      
      if (p1 > 0 && p2 > 0 && p3 > 0 && p4 > 0) {
        dirX = command.substring(2, p1).toInt();
        dirY = command.substring(p1 + 1, p2).toInt();
        dirZ = command.substring(p2 + 1, p3).toInt();
        duration = command.substring(p3 + 1, p4).toInt();
        speed = command.substring(p4 + 1).toFloat();
        
        moveMotors(dirX, dirY, dirZ, duration, speed);
      } else {
        Serial.println("ERROR: Invalid M command");
      }
    }
    // Format: R <state> (0 or 1)
    else if (command.startsWith("R ")) {
      int state = command.substring(2).toInt();
      digitalWrite(RELAY_PIN, state == 1 ? LOW : HIGH); // Relay kích LOW active? Check setup: HIGH mặc định tắt -> LOW là bật
      Serial.println("DONE");
    }
    // Format: H (Home Z)
    else if (command == "H") {
      moveZHome();
    }
    // Format: HX (Home X)
    else if (command == "HX") {
      moveXHome();
    }
    // Format: C (Check Sensors)
    else if (command == "C") {
      Serial.print("S1:"); Serial.print(digitalRead(IR_SENSOR_1));
      Serial.print("|S2:"); Serial.println(digitalRead(IR_SENSOR_2));
    }
    else {
      // Serial.println("ERROR: Unknown command");
    }
  }
}
