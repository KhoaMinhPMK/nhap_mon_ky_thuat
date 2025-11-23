<?php
// receive.php
// Place this file in: wwwroot/bkuteam/upload/

// Enable Error Reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ================= CONFIGURATION =================
$db_host = 'localhost';
$db_user = 'root';     
$db_pass = '123456'; 
$db_name = 'detect_db';

// 1. Basic Authentication
$valid_user = 'root';
$valid_pass = '123456';

if (!isset($_SERVER['PHP_AUTH_USER']) || 
    $_SERVER['PHP_AUTH_USER'] !== $valid_user || 
    $_SERVER['PHP_AUTH_PW'] !== $valid_pass) {
    
    header('WWW-Authenticate: Basic realm="My Realm"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Unauthorized';
    exit;
}

// 2. Receive Data (Multipart/Form-data)
// When sending files, $_POST contains fields, $_FILES contains files.
// If sending JSON as a field 'data', decode it.
$data = null;
if (isset($_POST['data'])) {
    $data = json_decode($_POST['data'], true);
} else {
    // Fallback for raw JSON body (if no file)
    $json_input = file_get_contents('php://input');
    $data = json_decode($json_input, true);
}

if ($data) {
    // 3. Handle Image Upload
    $image_url = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = 'images/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $filename = 'img_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
        $target_file = $upload_dir . $filename;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
            $image_url = $target_file; // Store relative path
        } else {
            // Log error but continue
            error_log("Failed to move uploaded file.");
        }
    }

    // 4. Connect to Database
    try {
        $conn = @new mysqli($db_host, $db_user, $db_pass, $db_name);
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }
    } catch (Exception $e) {
        http_response_code(200); 
        echo "DEBUG ERROR: " . $e->getMessage();
        exit;
    }

    // 5. Prepare and Bind
    $stmt = $conn->prepare("INSERT INTO detection_logs (timestamp, device_id, class_name, class_id, confidence, image_url) VALUES (?, ?, ?, ?, ?, ?)");
    
    $timestamp = $data['timestamp'] ?? date('Y-m-d H:i:s');
    $timestamp = str_replace('T', ' ', substr($timestamp, 0, 19));

    $device_id = $data['device_id'] ?? 'unknown';
    $class_name = $data['class_name'] ?? 'Unknown';
    $class_id = $data['class_id'] ?? -1;
    $confidence = $data['confidence'] ?? 0.0;

    $stmt->bind_param("sssids", $timestamp, $device_id, $class_name, $class_id, $confidence, $image_url);

    if ($stmt->execute()) {
        echo "Success: Data inserted into database.";
    } else {
        // Log SQL error to a file
        $error_msg = "SQL Error: " . $stmt->error . "\n";
        file_put_contents("debug_log.txt", $error_msg, FILE_APPEND);
        
        http_response_code(200);
        echo "DEBUG ERROR (SQL): " . $stmt->error;
    }

    $stmt->close();
    $conn->close();

} else {
    http_response_code(400);
    echo "Error: No data received.";
}
?>
