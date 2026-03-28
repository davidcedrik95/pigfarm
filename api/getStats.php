<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

$stats = [];

// total pigs
$stmt = $pdo->query("SELECT COUNT(*) as total FROM pigs");
$stats['totalPigs'] = $stmt->fetch()['total'];

// active pigs
$stmt = $pdo->query("SELECT COUNT(*) as active FROM pigs WHERE status = 'active'");
$stats['activePigs'] = $stmt->fetch()['active'];

// pregnant sows
$stmt = $pdo->query("SELECT COUNT(*) as pregnant FROM pigs WHERE category = 'sow' AND status = 'pregnant'");
$stats['pregnantSows'] = $stmt->fetch()['pregnant'];

// piglets
$stmt = $pdo->query("SELECT COUNT(*) as piglets FROM pigs WHERE category = 'piglet'");
$stats['piglets'] = $stmt->fetch()['piglets'];

// due vaccinations (exemple simple)
$stmt = $pdo->query("SELECT COUNT(*) as due FROM vaccinations WHERE next_date <= CURDATE()");
$stats['dueVaccinations'] = $stmt->fetch()['due'];

// etc.

echo json_encode($stats);
?>
