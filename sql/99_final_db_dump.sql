USE home_db;

-- Create user table
CREATE TABLE `user` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` varchar(100) DEFAULT NULL,
    `email` varchar(100) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- Create home table
CREATE TABLE `home` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `street_address` varchar(255) DEFAULT NULL,
    `state` varchar(50) DEFAULT NULL,
    `zip` varchar(10) DEFAULT NULL,
    `sqft` float DEFAULT NULL,
    `beds` int DEFAULT NULL,
    `baths` int DEFAULT NULL,
    `list_price` float DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


-- INSERT unique username and email value from user_home
INSERT INTO `user` (username, email)
SELECT DISTINCT username, email FROM user_home;

-- INSERT unique street address and its associated details value from user_home
INSERT INTO `home`( street_address, state, zip, sqft, beds, baths, list_price)
SELECT DISTINCT street_address, state, zip, sqft, beds, baths, list_price FROM user_home;

-- Create a table to many-to-many relations
CREATE TABLE `users_homes` (
	user_id INT,
    home_id INT,
    PRIMARY KEY (user_id, home_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (home_id) REFERENCES home(id)
)  ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


-- Connect the user and home table from data in user_home
INSERT INTO `users_homes` (user_id, home_id)
SELECT user.id, home.id 
FROM home
JOIN user_home ON home.street_address = user_home.street_address
JOIN user ON user_home.username = user.username
WHERE user.username IN (
    SELECT username FROM user
);


SELECT * FROM users_homes