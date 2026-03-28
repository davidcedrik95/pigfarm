CREATE TABLE health_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pig_id VARCHAR(20) NOT NULL,
  type ENUM('vaccination','treatment','checkup','weighing','observation','other'),
  title VARCHAR(200),
  notes TEXT,
  date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pig_id) REFERENCES pigs(id) ON DELETE CASCADE
);
