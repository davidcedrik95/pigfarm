CREATE TABLE deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sow_id VARCHAR(20) NOT NULL,
  date DATE,
  litter_size INT,
  live_piglets INT,
  average_weight DECIMAL(4,2),
  notes TEXT,
  FOREIGN KEY (sow_id) REFERENCES pigs(id) ON DELETE CASCADE
);
