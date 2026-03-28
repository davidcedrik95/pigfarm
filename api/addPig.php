<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);

// Validation basique
if (empty($input['name']) || empty($input['earTag'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Nom et numéro d\'oreille requis']);
    exit;
}

// Génération d'un ID unique (à adapter)
$id = 'P' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

$sql = "INSERT INTO pigs (id, name, ear_tag, breed, category, gender, birth_date, weight, location, health_status, feed_type, daily_feed, notes) 
        VALUES (:id, :name, :ear_tag, :breed, :category, :gender, :birth_date, :weight, :location, :health_status, :feed_type, :daily_feed, :notes)";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':id' => $id,
    ':name' => $input['name'],
    ':ear_tag' => $input['earTag'],
    ':breed' => $input['breed'] ?? null,
    ':category' => $input['category'] ?? 'grower',
    ':gender' => $input['gender'] ?? 'male',
    ':birth_date' => $input['birthDate'] ?? null,
    ':weight' => $input['weight'] ?? null,
    ':location' => $input['location'] ?? null,
    ':health_status' => $input['healthStatus'] ?? 'healthy',
    ':feed_type' => $input['feedType'] ?? null,
    ':daily_feed' => $input['dailyFeed'] ?? null,
    ':notes' => $input['notes'] ?? null,
]);

echo json_encode(['success' => true, 'id' => $id]);
?>
