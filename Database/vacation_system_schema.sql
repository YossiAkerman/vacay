-- 1. Create the database
CREATE DATABASE IF NOT EXISTS vacation_db;
USE vacation_db;

-- 2. Create the users table
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

-- 3. Create the vacations table
CREATE TABLE IF NOT EXISTS vacations (
  vacation_id INT AUTO_INCREMENT PRIMARY KEY,
  destination VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0 AND price <= 10000),
  image VARCHAR(255) NOT NULL
);

-- 4. Create the followers table
CREATE TABLE IF NOT EXISTS followers (
  user_id INT NOT NULL,
  vacation_id INT NOT NULL,
  PRIMARY KEY (user_id, vacation_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (vacation_id) REFERENCES vacations(vacation_id) ON DELETE CASCADE
);

-- 5. Insert sample vacations
INSERT INTO vacations (destination, description, start_date, end_date, price, image) VALUES
('Paris', 'Visit the Eiffel Tower and enjoy fine dining.', '2025-06-01', '2025-06-10', 2500.00, 'paris.jpg'),
('Tokyo', 'Explore the city and cherry blossoms.', '2025-07-15', '2025-07-25', 3200.00, 'tokyo.jpg'),
('New York', 'City that never sleeps!', '2025-08-01', '2025-08-10', 2000.00, 'nyc.jpg'),
('Rome', 'Ancient architecture and Italian food.', '2025-09-01', '2025-09-10', 2100.00, 'rome.jpg'),
('Bangkok', 'Temples, street food, and vibrant culture.', '2025-10-01', '2025-10-12', 1800.00, 'bangkok.jpg'),
('Sydney', 'See the Opera House and enjoy beaches.', '2025-11-05', '2025-11-15', 3400.00, 'sydney.jpg'),
('Cape Town', 'Mountains and coastal scenery.', '2025-12-01', '2025-12-10', 2700.00, 'capetown.jpg'),
('Barcelona', 'Architecture by Gaudi and great food.', '2025-06-15', '2025-06-25', 2300.00, 'barcelona.jpg'),
('Reykjavik', 'Northern lights and hot springs.', '2025-01-10', '2025-01-20', 3100.00, 'reykjavik.jpg'),
('Istanbul', 'Cultural blend of East and West.', '2025-04-01', '2025-04-10', 2200.00, 'istanbul.jpg'),
('Prague', 'Historic sites and beer culture.', '2025-03-01', '2025-03-08', 1900.00, 'prague.jpg'),
('Mexico City', 'Tacos, markets, and ruins.', '2025-02-10', '2025-02-20', 2000.00, 'mexico.jpg');


USE vacation_db;  
CREATE TABLE followers (
  user_id INT NOT NULL,
  vacation_id INT NOT NULL,
  PRIMARY KEY (user_id, vacation_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (vacation_id) REFERENCES vacations(vacation_id) ON DELETE CASCADE
);

