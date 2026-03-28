CREATE TABLE weight_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pig_id VARCHAR(20) NOT NULL,
  weight DECIMAL(5,2),
  date DATE,
  operator VARCHAR(100),
  notes TEXT,
  FOREIGN KEY (pig_id) REFERENCES pigs(id) ON DELETE CASCADE
);
