<?php
header('Content-Type: application/json');

// Configuration
$toEmail = 'info@alekan.ru'; // Replace with actual email
$subject = 'Новая заявка с сайта Alekan';

// Validations
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
$phone = htmlspecialchars(trim($_POST['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
$company = htmlspecialchars(trim($_POST['company'] ?? ''), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');

if (empty($name) || empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Required fields missing']);
    exit;
}

// Email Body construction
$emailBody = "Новая заявка:\n\n";
$emailBody .= "Имя: $name\n";
$emailBody .= "Телефон: $phone\n";
if ($company) $emailBody .= "Компания: $company\n";
if ($message) $emailBody .= "Сообщение: $message\n";

$headers = "From: website@alekan.ru\r\n";
$headers .= "Reply-To: $toEmail\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Sending logic
if (mail($toEmail, $subject, $emailBody, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Email sent']);
} else {
    // Fallback/Simulate success on local environments without mail server
    // For production, this should be false, but for user testing we oft return true if mail() is not configured
    // checking if mail returned false
    echo json_encode(['success' => false, 'message' => 'Mail server error']);
}
?>
