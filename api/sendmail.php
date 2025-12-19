<?php
header('Content-Type: application/json; charset=UTF-8');

// Sanitize input function
function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get and sanitize data
$name = isset($_POST['name']) ? sanitize($_POST['name']) : '';
$phone = isset($_POST['phone']) ? sanitize($_POST['phone']) : '';
$company = isset($_POST['company']) ? sanitize($_POST['company']) : '';
$message = isset($_POST['message']) ? sanitize($_POST['message']) : '';
$privacy = isset($_POST['privacy']) ? true : false;

// Validation
if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Имя и телефон обязательны']);
    exit;
}

if (!$privacy) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Необходимо согласие на обработку данных']);
    exit;
}

// Email settings
$to = 'info@alekan.ru';
$subject = 'Новая заявка с сайта Alekan';

$body = "Новая заявка с сайта:\n\n";
$body .= "Имя: {$name}\n";
$body .= "Телефон: {$phone}\n";
$body .= "Компания: {$company}\n";
$body .= "Сообщение: {$message}\n";

$headers = "From: noreply@alekan.ru\r\n";
$headers .= "Reply-To: noreply@alekan.ru\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mailSent = mail($to, $subject, $body, $headers);

if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка при отправке']);
}
?>
