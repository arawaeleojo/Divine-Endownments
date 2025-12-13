<?php
header("Content-Type: application/json");

// 1. Check request method
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
    exit;
}

// 2. Sanitize inputs
$name    = trim($_POST["name"]);
$email   = trim($_POST["email"]);
$subject = trim($_POST["subject"]);
$message = trim($_POST["message"]);

// 3. Validate
$errors = [];

if (empty($name)) {
    $errors[] = "Please enter your name.";
}

if (empty($email)) {
    $errors[] = "Please enter your email.";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format.";
}

if (empty($subject)) {
    $errors[] = "Please enter a subject.";
}

// If there are errors, return them
if (!empty($errors)) {
    echo json_encode(["status" => "error", "message" => $errors]);
    exit;
}

// 4. Email details
$to = "YOUR-ADMIN-EMAIL@example.com"; // ← replace this with your email
$email_subject = "New Contact Form Message: $subject";

$email_body = "
Name: $name
Email: $email

Message:
$message
";

// Additional headers
$headers  = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

// 5. Attempt sending
if (mail($to, $email_subject, $email_body, $headers)) {
    echo json_encode(["status" => "success", "message" => "Message sent successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Message could not be sent."]);
}
?>