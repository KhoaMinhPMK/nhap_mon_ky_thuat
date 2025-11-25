// =======================================================
// ===== TEST CÔNG TẮC HÀNH TRÌNH (LIMIT SWITCHES) =====
// =======================================================

// ====== CẤU HÌNH CHÂN ======
#define Z_LIMIT_PIN 12    // SpnEn - Limit Z về đích
#define X_LIMIT_PIN 13    // SpnDir - Limit X về đích

void setup() {
  Serial.begin(9600);
  
  // Setup INPUT với PULLUP
  pinMode(Z_LIMIT_PIN, INPUT_PULLUP);
  pinMode(X_LIMIT_PIN, INPUT_PULLUP);
  
  Serial.println("Z_LIMIT(12) | X_LIMIT(13)");
  Serial.println("---------------------------");
}

void loop() {
  // Đọc giá trị
  int zLimit = digitalRead(Z_LIMIT_PIN);
  int xLimit = digitalRead(X_LIMIT_PIN);
  
  // In ra: Z_LIMIT | X_LIMIT
  Serial.print("    ");
  Serial.print(zLimit);
  Serial.print("      |      ");
  Serial.println(xLimit);
  
  delay(200);  // Delay 200ms giữa mỗi lần đọc
}
