<?php
// push_data.php
// API để Flask server push data lên cloud
// Endpoint nhận inventory, alerts, device status từ server local
// https://bkuteam.site/upload/push_data.php

// Enable error reporting for debugging
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ================= CONFIGURATION =================
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '123456';
$db_name = 'detect_db';

// Basic Authentication
$valid_user = 'root';
$valid_pass = '123456';

if (!isset($_SERVER['PHP_AUTH_USER']) || 
    $_SERVER['PHP_AUTH_USER'] !== $valid_user || 
    $_SERVER['PHP_AUTH_PW'] !== $valid_pass) {
    
    header('WWW-Authenticate: Basic realm="Push API"');
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON", "raw" => substr($json, 0, 100)]);
    exit;
}

// Connect to database
$conn = @new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Auto-create tables if not exist
$conn->query("CREATE TABLE IF NOT EXISTS `inventory` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `device_id` VARCHAR(50) NOT NULL,
    `bin_id` INT NOT NULL,
    `bin_name` VARCHAR(100) DEFAULT NULL,
    `current_count` INT DEFAULT 0,
    `max_capacity` INT DEFAULT 100,
    `is_full` BOOLEAN DEFAULT FALSE,
    `last_item_class` VARCHAR(100) DEFAULT NULL,
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `device_bin` (`device_id`, `bin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

$conn->query("CREATE TABLE IF NOT EXISTS `alerts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `device_id` VARCHAR(50) NOT NULL,
    `alert_type` VARCHAR(50) NOT NULL,
    `bin_id` INT DEFAULT NULL,
    `message` TEXT,
    `severity` ENUM('info', 'warning', 'critical') DEFAULT 'info',
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

$conn->query("CREATE TABLE IF NOT EXISTS `device_status` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `device_id` VARCHAR(50) NOT NULL UNIQUE,
    `device_name` VARCHAR(100) DEFAULT NULL,
    `is_online` BOOLEAN DEFAULT FALSE,
    `serial_connected` BOOLEAN DEFAULT FALSE,
    `script_running` BOOLEAN DEFAULT FALSE,
    `last_heartbeat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `ip_address` VARCHAR(50) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

$results = [];
$type = isset($data['type']) ? $data['type'] : '';

// ==================== PUSH INVENTORY ====================
if ($type === 'inventory' || isset($data['inventory'])) {
    $inventory = isset($data['inventory']) ? $data['inventory'] : $data;
    $device_id = $inventory['device_id'] ?? 'unknown';
    
    foreach ($inventory['bins'] ?? [$inventory] as $bin) {
        $bin_id = $bin['bin_id'] ?? 1;
        $bin_name = $bin['bin_name'] ?? "Bin $bin_id";
        $current_count = $bin['current_count'] ?? 0;
        $max_capacity = $bin['max_capacity'] ?? 100;
        $is_full = $bin['is_full'] ?? false;
        $last_item_class = $bin['last_item_class'] ?? null;
        
        $stmt = $conn->prepare("INSERT INTO inventory 
            (device_id, bin_id, bin_name, current_count, max_capacity, is_full, last_item_class) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            bin_name = VALUES(bin_name),
            current_count = VALUES(current_count),
            max_capacity = VALUES(max_capacity),
            is_full = VALUES(is_full),
            last_item_class = VALUES(last_item_class),
            last_updated = CURRENT_TIMESTAMP");
        
        $is_full_int = $is_full ? 1 : 0;
        $stmt->bind_param("sisiiss", $device_id, $bin_id, $bin_name, $current_count, $max_capacity, $is_full_int, $last_item_class);
        $stmt->execute();
    }
    $results['inventory'] = 'updated';
}

// ==================== PUSH ALERT ====================
if ($type === 'alert' || isset($data['alert'])) {
    $alert = isset($data['alert']) ? $data['alert'] : $data;
    
    $device_id = $alert['device_id'] ?? 'unknown';
    $alert_type = $alert['alert_type'] ?? 'general';
    $bin_id = $alert['bin_id'] ?? null;
    $message = $alert['message'] ?? '';
    $severity = $alert['severity'] ?? 'info';
    
    $stmt = $conn->prepare("INSERT INTO alerts (device_id, alert_type, bin_id, message, severity) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssiss", $device_id, $alert_type, $bin_id, $message, $severity);
    $stmt->execute();
    
    $results['alert'] = 'inserted';
    $results['alert_id'] = $conn->insert_id;
}

// ==================== PUSH DEVICE STATUS ====================
if ($type === 'device_status' || isset($data['device_status'])) {
    $status = isset($data['device_status']) ? $data['device_status'] : $data;
    
    $device_id = $status['device_id'] ?? 'unknown';
    $device_name = $status['device_name'] ?? null;
    $is_online = $status['is_online'] ?? true;
    $serial_connected = $status['serial_connected'] ?? false;
    $script_running = $status['script_running'] ?? false;
    $ip_address = $status['ip_address'] ?? null;
    
    $stmt = $conn->prepare("INSERT INTO device_status 
        (device_id, device_name, is_online, serial_connected, script_running, ip_address) 
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        device_name = COALESCE(VALUES(device_name), device_name),
        is_online = VALUES(is_online),
        serial_connected = VALUES(serial_connected),
        script_running = VALUES(script_running),
        ip_address = VALUES(ip_address),
        last_heartbeat = CURRENT_TIMESTAMP");
    
    $is_online_int = $is_online ? 1 : 0;
    $serial_int = $serial_connected ? 1 : 0;
    $script_int = $script_running ? 1 : 0;
    
    $stmt->bind_param("ssiiis", $device_id, $device_name, $is_online_int, $serial_int, $script_int, $ip_address);
    $stmt->execute();
    
    $results['device_status'] = 'updated';
}

// ==================== PUSH DETECTION (với auto inventory update) ====================
if ($type === 'detection' || isset($data['detection'])) {
    $detection = isset($data['detection']) ? $data['detection'] : $data;
    
    $device_id = $detection['device_id'] ?? 'unknown';
    $class_name = $detection['class_name'] ?? 'Unknown';
    $class_id = $detection['class_id'] ?? -1;
    $confidence = $detection['confidence'] ?? 0;
    $bin_id = $detection['bin_id'] ?? null;
    $timestamp = $detection['timestamp'] ?? date('Y-m-d H:i:s');
    
    // Insert detection log
    $stmt = $conn->prepare("INSERT INTO detection_logs (timestamp, device_id, class_name, class_id, confidence) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssid", $timestamp, $device_id, $class_name, $class_id, $confidence);
    $stmt->execute();
    
    // Auto-update inventory if bin_id provided
    if ($bin_id) {
        $conn->query("UPDATE inventory 
            SET current_count = current_count + 1, 
                last_item_class = '$class_name',
                is_full = (current_count >= max_capacity)
            WHERE device_id = '$device_id' AND bin_id = $bin_id");
    }
    
    $results['detection'] = 'inserted';
    $results['detection_id'] = $conn->insert_id;
}

$conn->close();

echo json_encode([
    "success" => true,
    "results" => $results,
    "timestamp" => date('Y-m-d H:i:s')
]);
?>
