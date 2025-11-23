<?php
// get_logs.php
// API for App to get history
// https://bkuteam.site/upload/get_logs.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow App to access

$host = 'localhost';
$user = 'root';
$pass = '123456';
$db   = 'detect_db';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed"]);
    exit;
}

// Get latest 50 logs
$sql = "SELECT * FROM detection_logs ORDER BY id DESC LIMIT 50";
$result = $conn->query($sql);

$logs = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Ensure image URL is full path if it exists
        if (!empty($row['image_url']) && !filter_var($row['image_url'], FILTER_VALIDATE_URL)) {
             $row['image_url'] = "https://bkuteam.site/upload/" . $row['image_url'];
        }
        $logs[] = $row;
    }
}

echo json_encode($logs);

$conn->close();
?>
