<?php
declare(strict_types=1);

/*
 * Shared PDO connection for StudentHub.
 * XAMPP defaults are host=localhost, user=root, empty password.
 * If your local MySQL credentials differ, update the values below.
 */
$host = 'localhost';
$dbname = 'studenthub_db';
$username = 'root';
$password = '';

$dsn = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    // Log technical details to the PHP error log; do not expose credentials/details.
    error_log('StudentHub database connection failed: ' . $e->getMessage());
    http_response_code(500);
    exit('Database connection failed. Check XAMPP/MySQL and the db.php settings.');
}
?>
