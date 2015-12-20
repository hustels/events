CREATE TABLE users (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(30) NOT NULL,
firstname VARCHAR(30) NOT NULL,
lastname VARCHAR(30) ,
email VARCHAR(50),
createdAt TIMESTAMP
)



CREATE TABLE events (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30) NOT NULL,
description VARCHAR(100) NOT NULL,
owner VARCHAR(30) ,
createdAt TIMESTAMP,
FOREIGN KEY (owner) REFERENCES users(id)
)