<?php

include "../global_scripts\database.php";

session_start();

// Main code to handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = connectToDatabase();

    $username = testInput($_POST["username"]);
    $password = testInput($_POST["password"]);

    if (checkUsernamePasswordPair($conn, $username, $password)) {
        $_SESSION['username'] = $username;
        setcookie("username", $username, time() + (30 * 24 * 60 * 60), "/");
        header("Location: ../home/?status=existing");
    } else {
        header("Location: ./?status=failed_login");
    }

    $conn->close();
    exit();
}
?>
