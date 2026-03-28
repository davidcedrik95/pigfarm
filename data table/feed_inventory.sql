CREATE TABLE feed_inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feed_type VARCHAR(50),
  movement_type ENUM('in','out'),
  quantity DECIMAL(6,2),
  date DATE,
  notes TEXT
);
