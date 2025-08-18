<?php

// Importar clases de PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Incluir archivos de la biblioteca PHPMailer
// La ruta es relativa a 'mail/contact.php'
require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';

// Validar que los datos del formulario no estén vacíos
if (empty($_POST['name']) || empty($_POST['subject']) || empty($_POST['message']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
  // Si los datos no son válidos, enviar un código de error 500
  http_response_code(500);
  exit();
}

// Limpiar los datos del formulario para prevenir inyecciones de código
$name = strip_tags(htmlspecialchars($_POST['name']));
$email = strip_tags(htmlspecialchars($_POST['email']));
$m_subject = strip_tags(htmlspecialchars($_POST['subject']));
$message = strip_tags(htmlspecialchars($_POST['message']));

// Crear una nueva instancia de PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP(); // Usar SMTP
    $mail->Host       = 'smtp.gmail.com'; // Servidor SMTP de Gmail
    $mail->SMTPAuth   = true; // Habilitar autenticación SMTP
    $mail->Username   = 'jvalenzuela.chulia@gmail.com'; // 📧 Reemplaza con tu dirección de Gmail
    $mail->Password   = 'tnmemulqnaxgvjdqr'; // 🔑 Reemplaza con la contraseña de aplicación de Google
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Habilitar encriptación TLS
    $mail->Port       = 587; // Puerto TCP para Gmail

    // Destinatarios del correo
    $mail->setFrom('jvalenzuela.chulia@gmail.com', 'Formulario Web'); // Correo del remitente (debe ser el mismo que el Username)
    $mail->addAddress('jvalenzuela.chulia@gmail.com'); // 📥 Dirección de correo donde recibirás el mensaje
    $mail->addReplyTo($email, $name); // Dirección para responder directamente al usuario

    // Contenido del correo
    $mail->isHTML(false); // No usar HTML, solo texto plano
    $mail->Subject = "Automato form - Formulario de contacto - $m_subject: $name";
    $mail->Body    = "Has recibido un nuevo mensaje desde el formulario de contacto de tu sitio web.\n\n"
                    . "Detalles:\n\nNombre: $name\n\nEmail: $email\n\nAsunto: $m_subject\n\nMensaje: $message";

    // Enviar el correo
    $mail->send();
    // Si el envío es exitoso, enviar una respuesta 200 (OK) al frontend
    http_response_code(200);
} catch (Exception $e) {
    // Si hay un error, enviar una respuesta 500
    http_response_code(500);
}

?>