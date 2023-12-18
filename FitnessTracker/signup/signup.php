<?php

include "../global_scripts\database.php";

session_start();

// Main code to handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = connectToDatabase();

    $username = testInput($_POST["username"]);
    $password = testInput($_POST["password"]);
    $password2 = testInput($_POST["confirm-password"]);

    if (checkUsername($conn, $username)) {
        header("Location: ./?status=user_exists_error");
    } else {
        if ($password == $password2)
        {
            if (registerUser($conn, $username, $password)) {
                $_SESSION['username'] = $username;
                setcookie("username", $username, time() + (30 * 24 * 60 * 60), "/");
                header("Location: ../home?status=new");
            } else {
                header("Location: ./?status=connection_error");
            }
        }
        else{
            header("Location: ./?status=pw_match_error");
        }
    }

    $conn->close();
    exit();
}
?>
