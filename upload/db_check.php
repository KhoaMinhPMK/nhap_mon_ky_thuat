<?php
// db_check.php
// Upload this to the same folder as receive.php
// Access it via browser: https://bkuteam.site/upload/db_check.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>System Diagnostics</h1>";

// 1. Check PHP Version
echo "PHP Version: " . phpversion() . "<br>";

// 2. Check MySQLi Extension
if (!extension_loaded('mysqli')) {
    echo "<h2 style='color:red'>ERROR: mysqli extension is NOT loaded!</h2>";
    echo "Please enable php_mysqli.dll in your php.ini file.<br>";
    exit;
}
echo "<h2 style='color:green'>OK: mysqli extension is loaded.</h2>";

// 3. Check Database Connection
$host = 'localhost';
$user = 'root';
$pass = '123456';
$db   = 'detect_db';

echo "Attempting to connect to database '<b>$db</b>' with user '<b>$user</b>'...<br>";

try {
    $conn = new mysqli($host, $user, $pass, $db);
    
    if ($conn->connect_error) {
        echo "<h2 style='color:red'>CONNECTION FAILED: " . $conn->connect_error . "</h2>";
    } else {
        echo "<h2 style='color:green'>SUCCESS: Connected to database!</h2>";
        
        // Check if table exists
        $result = $conn->query("SHOW TABLES LIKE 'detection_logs'");
        if ($result && $result->num_rows > 0) {
            echo "OK: Table 'detection_logs' exists.<br>";
        } else {
            echo "<h2 style='color:orange'>WARNING: Table 'detection_logs' NOT found!</h2>";
            echo "Did you run the schema.sql?<br>";
        }
        
        $conn->close();
    }
} catch (Exception $e) {
    echo "<h2 style='color:red'>EXCEPTION: " . $e->getMessage() . "</h2>";
}
?>
