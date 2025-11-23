<?php
// get_stats.php
// API for App to get dashboard stats
// https://bkuteam.site/upload/get_stats.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

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

// Get stats for TODAY
$today = date('Y-m-d');
$sql = "SELECT class_name, COUNT(*) as count FROM detection_logs WHERE DATE(timestamp) = '$today' GROUP BY class_name";
$result = $conn->query($sql);

$stats = [];
$total = 0;

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $stats[] = $row;
        $total += $row['count'];
    }
}

echo json_encode([
    "date" => $today,
    "total" => $total,
    "breakdown" => $stats
]);

$conn->close();
?>
