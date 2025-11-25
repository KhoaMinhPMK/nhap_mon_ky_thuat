<?php
// get_analytics.php
// API thống kê nâng cao (theo ngày/tuần/tháng)
// https://bkuteam.site/upload/get_analytics.php?device_id=device_001&range=week

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
$range = isset($_GET['range']) ? $_GET['range'] : 'today'; // today, week, month, year

// Calculate date range
$today = date('Y-m-d');
$start_date = $today;

switch ($range) {
    case 'week':
        $start_date = date('Y-m-d', strtotime('-7 days'));
        break;
    case 'month':
        $start_date = date('Y-m-d', strtotime('-30 days'));
        break;
    case 'year':
        $start_date = date('Y-m-d', strtotime('-365 days'));
        break;
    default: // today
        $start_date = $today;
}

$where_device = $device_id ? "AND device_id = '$device_id'" : "";

// ==================== 1. TỔNG QUAN ====================
$sql_total = "SELECT COUNT(*) as total FROM detection_logs WHERE DATE(timestamp) >= '$start_date' $where_device";
$total = $conn->query($sql_total)->fetch_assoc()['total'];

// ==================== 2. BREAKDOWN BY CLASS ====================
$sql_breakdown = "SELECT class_name, COUNT(*) as count 
                  FROM detection_logs 
                  WHERE DATE(timestamp) >= '$start_date' $where_device 
                  GROUP BY class_name";
$breakdown_result = $conn->query($sql_breakdown);
$breakdown = [];
while ($row = $breakdown_result->fetch_assoc()) {
    $breakdown[] = [
        "class_name" => $row['class_name'],
        "count" => (int)$row['count'],
        "percentage" => $total > 0 ? round(($row['count'] / $total) * 100, 1) : 0
    ];
}

// ==================== 3. DAILY TREND ====================
$sql_daily = "SELECT DATE(timestamp) as date, COUNT(*) as count 
              FROM detection_logs 
              WHERE DATE(timestamp) >= '$start_date' $where_device 
              GROUP BY DATE(timestamp) 
              ORDER BY date ASC";
$daily_result = $conn->query($sql_daily);
$daily_trend = [];
while ($row = $daily_result->fetch_assoc()) {
    $daily_trend[] = [
        "date" => $row['date'],
        "count" => (int)$row['count']
    ];
}

// ==================== 4. HOURLY DISTRIBUTION (today only) ====================
$sql_hourly = "SELECT HOUR(timestamp) as hour, COUNT(*) as count 
               FROM detection_logs 
               WHERE DATE(timestamp) = '$today' $where_device 
               GROUP BY HOUR(timestamp) 
               ORDER BY hour ASC";
$hourly_result = $conn->query($sql_hourly);
$hourly_dist = array_fill(0, 24, 0); // Initialize 24 hours with 0
while ($row = $hourly_result->fetch_assoc()) {
    $hourly_dist[(int)$row['hour']] = (int)$row['count'];
}

// ==================== 5. AVERAGE PER DAY ====================
$days_count = max(1, (strtotime($today) - strtotime($start_date)) / 86400 + 1);
$avg_per_day = round($total / $days_count, 1);

// ==================== 6. PEAK HOUR ====================
$peak_hour = array_search(max($hourly_dist), $hourly_dist);
$peak_count = max($hourly_dist);

// ==================== 7. COMPARISON WITH PREVIOUS PERIOD ====================
$prev_start = date('Y-m-d', strtotime($start_date . ' -' . $days_count . ' days'));
$sql_prev = "SELECT COUNT(*) as total FROM detection_logs 
             WHERE DATE(timestamp) >= '$prev_start' AND DATE(timestamp) < '$start_date' $where_device";
$prev_total = $conn->query($sql_prev)->fetch_assoc()['total'];
$growth = $prev_total > 0 ? round((($total - $prev_total) / $prev_total) * 100, 1) : 0;

// ==================== 8. TOP CONFIDENCE ====================
$sql_top = "SELECT class_name, confidence, timestamp 
            FROM detection_logs 
            WHERE DATE(timestamp) >= '$start_date' $where_device 
            ORDER BY confidence DESC LIMIT 5";
$top_result = $conn->query($sql_top);
$top_confidence = [];
while ($row = $top_result->fetch_assoc()) {
    $top_confidence[] = [
        "class_name" => $row['class_name'],
        "confidence" => round((float)$row['confidence'] * 100, 1),
        "timestamp" => $row['timestamp']
    ];
}

// ==================== OUTPUT ====================
echo json_encode([
    "success" => true,
    "range" => $range,
    "start_date" => $start_date,
    "end_date" => $today,
    "device_id" => $device_id,
    
    "summary" => [
        "total_processed" => (int)$total,
        "average_per_day" => $avg_per_day,
        "peak_hour" => sprintf("%02d:00", $peak_hour),
        "peak_hour_count" => $peak_count,
        "growth_vs_previous" => $growth
    ],
    
    "breakdown_by_class" => $breakdown,
    "daily_trend" => $daily_trend,
    "hourly_distribution" => $hourly_dist,
    "top_confidence_detections" => $top_confidence,
    
    "comparison" => [
        "current_period" => (int)$total,
        "previous_period" => (int)$prev_total,
        "change_percentage" => $growth
    ]
]);

$conn->close();
?>
