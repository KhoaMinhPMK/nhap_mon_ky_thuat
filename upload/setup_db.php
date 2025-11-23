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

// SQL to create table
$sql = "CREATE TABLE IF NOT EXISTS `detection_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `timestamp` DATETIME NOT NULL,
    `device_id` VARCHAR(50) DEFAULT NULL,
    `class_name` VARCHAR(100) DEFAULT NULL,
    `class_id` INT DEFAULT NULL,
    `confidence` FLOAT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

if ($conn->query($sql) === TRUE) {
    echo "<h1>SUCCESS: Table 'detection_logs' created successfully.</h1>";
    echo "You can now run the curl test again.";
} else {
    echo "<h1>ERROR: Could not create table.</h1>";
    echo "Error message: " . $conn->error;
}

$conn->close();
?>
