STUDENTHUB - PRACTICAL 8
========================

Files:
- schema.sql: creates studenthub_db, students, events, registrations, and sample rows
- db.php: reusable PDO connection with exception handling
- test_connection.php: displays students, events, and registrations; uses PDO prepared statements

SETUP ON WINDOWS WITH XAMPP
1. Extract this folder to C:\xampp\htdocs\StudentHub\
2. Start Apache and MySQL in XAMPP Control Panel.
3. Open http://localhost/phpmyadmin/
4. Select Import, choose schema.sql, and click Import/Go.
   If you already imported this exact schema, avoid repeated imports unless you intend to reset/reseed data.
5. Open http://localhost/StudentHub/test_connection.php

Default local XAMPP database credentials in db.php:
- host: localhost
- database: studenthub_db
- username: root
- password: (empty)

If your MySQL account has a password, edit db.php accordingly.

SUBMISSION SCREENSHOTS TO CAPTURE
1. phpMyAdmin showing studenthub_db and its three tables.
2. Table structure/relations for registrations showing both foreign keys.
3. Browser output from test_connection.php showing the success message and tables.

IMPORTANT
This project is a separate assignment-compliant version. It does not overwrite the original Event Management System.
The report contains screenshot placeholders; replace them with screenshots from your own running system before submission.
