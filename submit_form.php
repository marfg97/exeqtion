<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $asusnto = htmlspecialchars($_POST['asunto']);
    $message = htmlspecialchars($_POST['message']);

  

    echo "Gracias, $name. Hemos recibido tu mensaje.";
}
?>
