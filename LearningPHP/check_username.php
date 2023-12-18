<?php

include 'database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = connectToDatabase();

    $username = testInput($_POST["username"]);

    $x = "available";
    if (checkUsername($conn, $username))
        $x = "taken";

    $conn->close();
    echo $x;
}


?>