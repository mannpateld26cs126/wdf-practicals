-- Practical 8: StudentHub database
-- Run this file in phpMyAdmin (Import or SQL tab).
CREATE DATABASE IF NOT EXISTS studenthub_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE studenthub_db;

CREATE TABLE IF NOT EXISTS students (
    student_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS events (
    event_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    event_date DATE NOT NULL,
    location VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS registrations (
    registration_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    event_id INT UNSIGNED NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_registrations_student
        FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_registrations_event
        FOREIGN KEY (event_id) REFERENCES events(event_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT uq_student_event UNIQUE (student_id, event_id)
) ENGINE=InnoDB;

-- Sample data. IDs are specified for predictable demonstration output.
INSERT INTO students (student_id, full_name, email, department) VALUES
(1, 'Aarav Shah', 'aarav.shah@example.com', 'Computer Science'),
(2, 'Diya Patel', 'diya.patel@example.com', 'Information Technology'),
(3, 'Rohan Mehta', 'rohan.mehta@example.com', 'Computer Engineering')
ON DUPLICATE KEY UPDATE
full_name = VALUES(full_name),
email = VALUES(email),
department = VALUES(department);

INSERT INTO events (event_id, title, event_date, location, category) VALUES
(1, 'OSMANIA', '2026-11-20', 'A6 Building', 'Workshop'),
(2, 'CodingFest', '2027-07-12', 'Nadiad', 'Competition'),
(3, 'Tech Talk', '2026-12-05', 'Seminar Hall', 'Conference')
ON DUPLICATE KEY UPDATE
title = VALUES(title),
event_date = VALUES(event_date),
location = VALUES(location),
category = VALUES(category);

INSERT INTO registrations (registration_id, student_id, event_id) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 1),
(4, 3, 3)
ON DUPLICATE KEY UPDATE
student_id = VALUES(student_id),
event_id = VALUES(event_id);
