-- Insertion des 4 porcs
INSERT INTO pigs (
    id, name, ear_tag, breed, category, gender, birth_date, weight, age, location, color, health_status, feed_type, daily_feed, status, is_favorite, mother_id, notes, gestation_week, expected_delivery, created_at
) VALUES
('P001', 'Babe', '001', 'Large White', 'grower', 'male', '2023-08-15', 45, 4, 'Enclos A', 'Rose', 'healthy', 'Croissance', 2.5, 'active', TRUE, NULL, 'Porc en bonne santé, croissance normale', NULL, NULL, NOW()),
('P002', 'Rose', '002', 'Landrace', 'sow', 'female', '2022-01-10', 220, 24, 'Maternité', 'Blanc', 'pregnant', 'Gestation', 3.2, 'pregnant', FALSE, NULL, 'Truie gestante, 12ème semaine', 12, '2024-03-20', NOW()),
('P003', 'Max', '003', 'Pietrain', 'boar', 'male', '2021-11-05', 280, 30, 'Verratière', 'Tacheté', 'healthy', 'Reproduction', 3.5, 'active', FALSE, NULL, 'Verrat reproducteur, excellente génétique', NULL, NULL, NOW()),
('P004', 'Petit', '004', 'Large White', 'piglet', 'female', '2024-01-20', 8, 1, 'Nurserie', 'Rose clair', 'healthy', 'Porcelet', 0.8, 'active', TRUE, 'P002', 'Porcelet né le 20/01/2024', NULL, NULL, NOW());
