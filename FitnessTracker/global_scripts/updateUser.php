<?php

include "database.php";

session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = connectToDatabase();

    $username = testInput($_POST["username"]);
    if ($_SESSION['username'] == $username){ //Verify the user has been authenticated before updating
        $column = testInput($_POST['column']);
        $value = testInput($_POST['value']);
        $key = isset($_POST['key']) ? testInput($_POST['key']) : null;
        $isArray = isset($_POST['isArray']) ? testInput($_POST['isArray']) : null;
        $isJSON = isset($_POST['isJSON']) ? testInput($_POST['isJSON']) : null;

        if($key === null){
            if($isArray === null){
                if($isJSON === null){
                    if (updateUser($conn, $username, $column, $value))
                        echo "successfully updated " . $column . " with the new value " . $value;
                    else
                        echo "invalid key or value";

                }
                else {
                    if (updateUserWorkouts($conn, $username, $column, $value))
                        echo "successfully updated " . $column . " with the new value " . $value;
                    else
                        echo "invalid key or value";
                }
            }
            else {
                if (updateUserGoals($conn, $username, $column, $value))
                    echo "successfully updated " . $column . " with the new value " . $value;
                else
                    echo "invalid key or value";
            }
        }else{
            if (updateUserLog($conn, $username, $column, $key, $value))
                echo "successfully updated " . $column . " with the new value { " . $key . ": ". $value . " }";
            else
                echo "invalid key or value";
        }

    } else {
        echo "invalid authorization";
    }

    $conn->close();
    exit();

}


?>
