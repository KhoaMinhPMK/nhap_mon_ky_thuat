<?php
// get_alerts.php
// API lấy lịch sử cảnh báo
// https://bkuteam.site/upload/get_alerts.php?device_id=device_001&limit=50&unread_only=false

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

// Query parameters
$device_id = isset($_GET['device_id']) ? $_GET['device_id'] : null;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
$unread_only = isset($_GET['unread_only']) && $_GET['unread_only'] === 'true';
$severity = isset($_GET['severity']) ? $_GET['severity'] : null;

// Build query
$where = [];
$params = [];
$types = "";

if ($device_id) {
    $where[] = "device_id = ?";
    $params[] = $device_id;
    $types .= "s";
}

if ($unread_only) {
    $where[] = "is_read = FALSE";
}

if ($severity && in_array($severity, ['info', 'warning', 'critical'])) {
    $where[] = "severity = ?";
    $params[] = $severity;
    $types .= "s";
}

$sql = "SELECT * FROM alerts";
if (count($where) > 0) {
    $sql .= " WHERE " . implode(" AND ", $where);
}
$sql .= " ORDER BY created_at DESC LIMIT ?";
$params[] = $limit;
$types .= "i";

$stmt = $conn->prepare($sql);
if (count($params) > 0) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

$alerts = [];
$unread_count = 0;
$severity_counts = ['info' => 0, 'warning' => 0, 'critical' => 0];

while ($row = $result->fetch_assoc()) {
    $alerts[] = [
        "id" => (int)$row['id'],
        "device_id" => $row['device_id'],
        "alert_type" => $row['alert_type'],
        "bin_id" => $row['bin_id'] ? (int)$row['bin_id'] : null,
        "message" => $row['message'],
        "severity" => $row['severity'],
        "is_read" => (bool)$row['is_read'],
        "created_at" => $row['created_at']
    ];
    
    if (!$row['is_read']) $unread_count++;
    if (isset($severity_counts[$row['severity']])) {
        $severity_counts[$row['severity']]++;
    }
}

// Get total unread for this device
$unread_total = 0;
if ($device_id) {
    $unread_result = $conn->query("SELECT COUNT(*) as cnt FROM alerts WHERE device_id = '$device_id' AND is_read = FALSE");
    $unread_total = $unread_result->fetch_assoc()['cnt'];
}

echo json_encode([
    "success" => true,
    "total_returned" => count($alerts),
    "unread_count" => (int)$unread_total,
    "severity_breakdown" => $severity_counts,
    "alerts" => $alerts
]);

$conn->close();
?>
