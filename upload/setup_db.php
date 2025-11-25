<?php
// setup_db.php
// Upload to: wwwroot/bkuteam/upload/
// Run: https://bkuteam.site/upload/setup_db.php

ini_set('display_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$user = 'root';
$pass = '123456';
$db   = 'detect_db';

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "<h1>Database Setup</h1>";

// ==================== TABLE 1: detection_logs ====================
$sql1 = "CREATE TABLE IF NOT EXISTS `detection_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `timestamp` DATETIME NOT NULL,
    `device_id` VARCHAR(50) DEFAULT NULL,
    `class_name` VARCHAR(100) DEFAULT NULL,
    `class_id` INT DEFAULT NULL,
    `confidence` FLOAT DEFAULT NULL,
    `image_url` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

if ($conn->query($sql1) === TRUE) {
    echo "<p>✅ Table 'detection_logs' OK</p>";
} else {
    echo "<p>❌ Error creating detection_logs: " . $conn->error . "</p>";
}

// ==================== TABLE 2: inventory (tồn kho) ====================
$sql2 = "CREATE TABLE IF NOT EXISTS `inventory` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

if ($conn->query($sql2) === TRUE) {
    echo "<p>✅ Table 'inventory' OK</p>";
} else {
    echo "<p>❌ Error creating inventory: " . $conn->error . "</p>";
}

// ==================== TABLE 3: alerts (cảnh báo) ====================
$sql3 = "CREATE TABLE IF NOT EXISTS `alerts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `device_id` VARCHAR(50) NOT NULL,
    `alert_type` VARCHAR(50) NOT NULL,
    `bin_id` INT DEFAULT NULL,
    `message` TEXT,
    `severity` ENUM('info', 'warning', 'critical') DEFAULT 'info',
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

if ($conn->query($sql3) === TRUE) {
    echo "<p>✅ Table 'alerts' OK</p>";
} else {
    echo "<p>❌ Error creating alerts: " . $conn->error . "</p>";
}

// ==================== TABLE 4: device_status (trạng thái thiết bị) ====================
$sql4 = "CREATE TABLE IF NOT EXISTS `device_status` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `device_id` VARCHAR(50) NOT NULL UNIQUE,
    `device_name` VARCHAR(100) DEFAULT NULL,
    `is_online` BOOLEAN DEFAULT FALSE,
    `serial_connected` BOOLEAN DEFAULT FALSE,
    `script_running` BOOLEAN DEFAULT FALSE,
    `last_heartbeat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `ip_address` VARCHAR(50) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

if ($conn->query($sql4) === TRUE) {
    echo "<p>✅ Table 'device_status' OK</p>";
} else {
    echo "<p>❌ Error creating device_status: " . $conn->error . "</p>";
}

// ==================== INSERT DEFAULT DATA ====================
// Default inventory for bins
$sql_default = "INSERT IGNORE INTO `inventory` (`device_id`, `bin_id`, `bin_name`, `max_capacity`) VALUES 
    ('device_001', 1, 'Premium Bin', 50),
    ('device_001', 2, 'Second-grade Bin', 50);";
$conn->query($sql_default);

echo "<hr><h2>Setup Complete!</h2>";
echo "<p>Tables created: detection_logs, inventory, alerts, device_status</p>";

$conn->close();
?>
