// routes/feed.js
router.get('/summary', async (req, res) => {
  try {
    // Période : mois en cours (à adapter)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Consommation et coût sur le mois
    const [feedRows] = await db.query(`
      SELECT SUM(quantity) AS total_quantity, SUM(cost) AS total_cost
      FROM feed_consumption
      WHERE period BETWEEN ? AND ?
    `, [startOfMonth, endOfMonth]);

    const totalQuantity = feedRows[0].total_quantity || 0;
    const totalCost = feedRows[0].total_cost || 0;
    const daysInMonth = new Date(endOfMonth).getDate();
    const dailyConsumption = totalQuantity / daysInMonth;
    const dailyFeedCost = totalCost / daysInMonth;

    // Efficacité alimentaire moyenne (conversion)
    const [convRows] = await db.query(`
      SELECT AVG(conversion) AS avg_conversion
      FROM feed_consumption
      WHERE period BETWEEN ? AND ? AND conversion IS NOT NULL
    `, [startOfMonth, endOfMonth]);

    const feedEfficiency = convRows[0].avg_conversion || 2.8; // valeur par défaut

    // Stock (si table feed_inventory existe)
    const [stockRows] = await db.query(`SELECT current_stock FROM feed_inventory ORDER BY date DESC LIMIT 1`);
    const feedStock = stockRows[0].current_stock || 0;
    // const feedStock = 1500; // temporaire

    res.json({
      dailyConsumption: parseFloat(dailyConsumption.toFixed(1)),
      feedEfficiency: parseFloat(feedEfficiency.toFixed(2)),
      feedStock,
      dailyFeedCost: parseFloat(dailyFeedCost.toFixed(2))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du calcul des métriques alimentaires' });
  }
});