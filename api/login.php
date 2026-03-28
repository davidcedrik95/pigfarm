<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['username']) || empty($input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Nom d\'utilisateur et mot de passe requis']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
$stmt->execute([':username' => $input['username']]);
$user = $stmt->fetch();

// En production, utilisez password_hash() et password_verify()
if ($user && $user['password'] === $input['password']) {
    unset($user['password']); // ne pas renvoyer le mot de passe
    echo json_encode(['success' => true, 'user' => $user]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Identifiants invalides']);
}
?>
