<?php

include "database.php";

session_start();

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $conn = connectToDatabase();
    $username = testInput($_POST["username"]);
    $response = "";
    if ($_SESSION['username'] == $username) { //Verify the user has been authenticated before updating
       $data = getUserInfo($conn, $username);
       if($data !== null)
            $response = $data;
       else
            $response = "couldn't find username in database";
    } else {
        $response = "invalid authorization";
    }

    $conn->close();
    echo $response;
    exit();
}

?>