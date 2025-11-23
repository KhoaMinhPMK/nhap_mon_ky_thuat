<?php
$servername = "localhost";
$username = "root";
$password = "123456";
$dbname = "detect_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully<br>";

// Array of sample data
$classes = ['type 1', 'type 2', 'type 3'];
$devices = ['MACHINE_01', 'MACHINE_02'];
$images = [
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Watermelon 1
    'https://images.unsplash.com/photo-1589593085624-755829c79f73?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Watermelon 2
    'https://plus.unsplash.com/premium_photo-1675366128357-783316977d36?q=80&w=2574&auto=format&fit=crop' // Watermelon 3
];

// Generate 50 random records
for ($i = 0; $i < 50; $i++) {
    $class = $classes[array_rand($classes)];
    $confidence = rand(70, 99) / 100;
    $device = $devices[array_rand($devices)];
    $image = $images[array_rand($images)];
    
    // Random timestamp within last 24 hours
    $timestamp = date('Y-m-d H:i:s', strtotime('-' . rand(0, 24) . ' hours'));

    $sql = "INSERT INTO detection_logs (class_name, confidence, device_id, image_url, timestamp)
            VALUES ('$class', $confidence, '$device', '$image', '$timestamp')";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully: $class at $timestamp<br>";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
