
CREATE DATABASE IF NOT EXISTS book;

USE book;


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Insert an admin user (change the password before using in production)
INSERT IGNORE INTO users (name, surname, gender, username, email, password)
VALUES 
    ('Admin', 'Adminsoy', 'male', '4dm1n1str4t0r', 'admin@example.com', 'paroluunutdum1!');


