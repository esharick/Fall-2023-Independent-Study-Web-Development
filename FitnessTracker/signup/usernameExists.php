<?php

include "../global_scripts\database.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = connectToDatabase();

    $username = testInput($_POST["username"]);

    if (checkUsername($conn, $username))
        echo "taken";
    else
        echo "available";
    

    $conn->close();
}

?>