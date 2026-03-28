CREATE TABLE vaccinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pig_id VARCHAR(20) NOT NULL,
  vaccine VARCHAR(100),
  date DATE,
  next_date DATE,
  veterinarian VARCHAR(100),
  notes TEXT,
  FOREIGN KEY (pig_id) REFERENCES pigs(id) ON DELETE CASCADE
);
