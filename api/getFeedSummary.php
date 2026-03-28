<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';  // inclus $pdo

try {
    // Mois en cours sous forme "Mar 2026"
    $currentMonth = date('M Y');

    // 1. Consommation et coût du mois
    $stmt = $pdo->prepare("SELECT SUM(quantity) AS total_quantity, SUM(cost) AS total_cost
                           FROM feed_consumption WHERE period = :period");
    $stmt->execute([':period' => $currentMonth]);
    $row = $stmt->fetch();
    $totalQuantity = $row['total_quantity'] ?? 0;
    $totalCost     = $row['total_cost'] ?? 0;
    $daysInMonth   = date('t');
    $dailyConsumption = $totalQuantity / $daysInMonth;
    $dailyFeedCost    = $totalCost / $daysInMonth;

    // 2. Efficacité alimentaire (moyenne de conversion)
    $stmt = $pdo->prepare("SELECT AVG(conversion) AS avg_conversion
                           FROM feed_consumption
                           WHERE period = :period AND conversion IS NOT NULL");
    $stmt->execute([':period' => $currentMonth]);
    $row = $stmt->fetch();
    $feedEfficiency = $row['avg_conversion'] ?? 2.8;

    // 3. Stock actuel (feed_inventory)
    $stmt = $pdo->query("SELECT SUM(CASE WHEN movement_type = 'in' THEN quantity ELSE -quantity END) AS current_stock
                         FROM feed_inventory");
    $row = $stmt->fetch();
    $feedStock = $row['current_stock'] ?? 0;

    echo json_encode([
        'dailyConsumption' => round($dailyConsumption, 1),
        'feedEfficiency'   => round($feedEfficiency, 2),
        'feedStock'        => round($feedStock, 0),
        'dailyFeedCost'    => round($dailyFeedCost, 2)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur base : ' . $e->getMessage()]);
}
?>
