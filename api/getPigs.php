<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // à restreindre en production

require_once 'db.php';

$search = isset($_GET['search']) ? $_GET['search'] : '';
$category = isset($_GET['category']) ? $_GET['category'] : '';
$status = isset($_GET['status']) ? $_GET['status'] : '';

$sql = "SELECT * FROM pigs WHERE 1=1";
$params = [];

if (!empty($search)) {
    $sql .= " AND (name LIKE :search OR ear_tag LIKE :search OR id LIKE :search)";
    $params[':search'] = "%$search%";
}
if (!empty($category)) {
    $sql .= " AND category = :category";
    $params[':category'] = $category;
}
if (!empty($status)) {
    $sql .= " AND status = :status";
    $params[':status'] = $status;
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$pigs = $stmt->fetchAll();

echo json_encode($pigs);
?>
