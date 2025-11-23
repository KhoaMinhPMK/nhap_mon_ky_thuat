<?php
// update_db.php
// Run this once to update your database table
// https://bkuteam.site/upload/update_db.php

ini_set('display_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$user = 'root';
$pass = '123456';
$db   = 'detect_db';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Add image_url column
$sql = "ALTER TABLE `detection_logs` ADD COLUMN `image_url` VARCHAR(255) DEFAULT NULL AFTER `confidence`;";

if ($conn->query($sql) === TRUE) {
    echo "<h1>SUCCESS: Column 'image_url' added successfully.</h1>";
} else {
    // Check if error is "Duplicate column name"
    if (strpos($conn->error, "Duplicate column name") !== false) {
         echo "<h1>INFO: Column 'image_url' already exists.</h1>";
    } else {
        echo "<h1>ERROR: " . $conn->error . "</h1>";
    }
}

$conn->close();
?>
