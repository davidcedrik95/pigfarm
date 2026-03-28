CREATE TABLE matings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sow_id VARCHAR(20) NOT NULL,
  boar_id VARCHAR(20) NOT NULL,
  date DATE,
  result ENUM('successful','unsuccessful','pending'),
  notes TEXT,
  FOREIGN KEY (sow_id) REFERENCES pigs(id),
  FOREIGN KEY (boar_id) REFERENCES pigs(id)
);
