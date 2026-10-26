<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

$category = trim((string)($_GET['category'] ?? ''));
$allowedCategories = ['Workshop', 'Competition', 'Conference'];

try {
    // Prepared statement: the category value is bound separately from SQL.
    $sql = "SELECT event_id, title, event_date, location, category
            FROM events";
    if ($category !== '' && in_array($category, $allowedCategories, true)) {
        $sql .= " WHERE category = :category";
    }
    $sql .= " ORDER BY event_date ASC";

    $stmt = $pdo->prepare($sql);
    if ($category !== '' && in_array($category, $allowedCategories, true)) {
        $stmt->bindValue(':category', $category, PDO::PARAM_STR);
    }
    $stmt->execute();
    $events = $stmt->fetchAll();

    // Prepared statement with a named parameter for the registrations report.
    $registrationSql = "
        SELECT s.full_name, s.email, e.title AS event_title, r.registration_date
        FROM registrations r
        INNER JOIN students s ON s.student_id = r.student_id
        INNER JOIN events e ON e.event_id = r.event_id
        ORDER BY r.registration_id ASC";
    $registrationStmt = $pdo->prepare($registrationSql);
    $registrationStmt->execute();
    $registrations = $registrationStmt->fetchAll();

    $studentStmt = $pdo->prepare(
        "SELECT student_id, full_name, email, department FROM students ORDER BY student_id"
    );
    $studentStmt->execute();
    $students = $studentStmt->fetchAll();
} catch (PDOException $e) {
    error_log('StudentHub query failed: ' . $e->getMessage());
    http_response_code(500);
    exit('Unable to retrieve StudentHub data. Check the database schema and PHP error log.');
}

function h(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>StudentHub - PDO Connection Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 28px; color: #1f2937; }
        h1 { margin-bottom: 6px; }
        .success { padding: 12px 14px; border: 1px solid #86efac; background: #f0fdf4; color: #166534; border-radius: 6px; }
        table { border-collapse: collapse; width: 100%; margin: 14px 0 28px; }
        th, td { border: 1px solid #d1d5db; padding: 9px; text-align: left; }
        th { background: #f3f4f6; }
        form { margin: 16px 0; }
        select, button { padding: 7px; }
        .muted { color: #6b7280; }
    </style>
</head>
<body>
    <h1>StudentHub: PDO Connection Test</h1>
    <p class="success">Successfully connected to MySQL using PHP PDO. Prepared queries executed successfully.</p>

    <form method="get">
        <label for="category">Filter events by category: </label>
        <select name="category" id="category">
            <option value="">All categories</option>
            <?php foreach ($allowedCategories as $option): ?>
                <option value="<?= h($option) ?>" <?= $category === $option ? 'selected' : '' ?>>
                    <?= h($option) ?>
                </option>
            <?php endforeach; ?>
        </select>
        <button type="submit">Filter</button>
        <a href="test_connection.php">Reset</a>
    </form>

    <h2>Students (<?= count($students) ?>)</h2>
    <table>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Department</th></tr></thead>
        <tbody>
        <?php foreach ($students as $student): ?>
            <tr>
                <td><?= (int)$student['student_id'] ?></td>
                <td><?= h($student['full_name']) ?></td>
                <td><?= h($student['email']) ?></td>
                <td><?= h($student['department']) ?></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>

    <h2>Events (<?= count($events) ?>)</h2>
    <table>
        <thead><tr><th>ID</th><th>Title</th><th>Date</th><th>Location</th><th>Category</th></tr></thead>
        <tbody>
        <?php foreach ($events as $event): ?>
            <tr>
                <td><?= (int)$event['event_id'] ?></td>
                <td><?= h($event['title']) ?></td>
                <td><?= h($event['event_date']) ?></td>
                <td><?= h($event['location']) ?></td>
                <td><?= h($event['category']) ?></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>

    <h2>Registrations (<?= count($registrations) ?>)</h2>
    <table>
        <thead><tr><th>Student</th><th>Email</th><th>Event</th><th>Registered At</th></tr></thead>
        <tbody>
        <?php foreach ($registrations as $registration): ?>
            <tr>
                <td><?= h($registration['full_name']) ?></td>
                <td><?= h($registration['email']) ?></td>
                <td><?= h($registration['event_title']) ?></td>
                <td><?= h($registration['registration_date']) ?></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
    <p class="muted">Practical 8 — MySQL Schema Design, PDO Connectivity and Prepared Statements</p>
</body>
</html>
