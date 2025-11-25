<?php
// get_inventory.php
// API lấy trạng thái tồn kho các thùng
// https://bkuteam.site/upload/get_inventory.php?device_id=device_001

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

// Get device_id from query string (optional)
$device_id = isset($_GET['device_id']) ? $_GET['device_id'] : null;

if ($device_id) {
    $stmt = $conn->prepare("SELECT * FROM inventory WHERE device_id = ? ORDER BY bin_id");
    $stmt->bind_param("s", $device_id);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query("SELECT * FROM inventory ORDER BY device_id, bin_id");
}

$inventory = [];
$total_items = 0;
$total_capacity = 0;

while ($row = $result->fetch_assoc()) {
    $inventory[] = [
        "device_id" => $row['device_id'],
        "bin_id" => (int)$row['bin_id'],
        "bin_name" => $row['bin_name'],
        "current_count" => (int)$row['current_count'],
        "max_capacity" => (int)$row['max_capacity'],
        "fill_percentage" => round(($row['current_count'] / max($row['max_capacity'], 1)) * 100, 1),
        "is_full" => (bool)$row['is_full'],
        "last_item_class" => $row['last_item_class'],
        "last_updated" => $row['last_updated']
    ];
    $total_items += (int)$row['current_count'];
    $total_capacity += (int)$row['max_capacity'];
}

echo json_encode([
    "success" => true,
    "total_items" => $total_items,
    "total_capacity" => $total_capacity,
    "overall_fill_percentage" => $total_capacity > 0 ? round(($total_items / $total_capacity) * 100, 1) : 0,
    "bins" => $inventory
]);

$conn->close();
?>
