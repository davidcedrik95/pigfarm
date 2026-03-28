CREATE TABLE feed_consumption (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pig_id VARCHAR(20) NOT NULL,
  period VARCHAR(20), -- ex: 'Nov 2024'
  feed_type VARCHAR(50),
  quantity DECIMAL(6,2),
  cost DECIMAL(6,2),
  conversion DECIMAL(4,2),
  FOREIGN KEY (pig_id) REFERENCES pigs(id) ON DELETE CASCADE
);
