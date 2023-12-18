<?php

// Function to establish a database connection
function connectToDatabase()
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "users";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}

// Function to check if username already exists
function checkUsername($conn, $username)
{
    $check_query = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($check_query);

    return ($result->num_rows > 0);
}

function checkUsernamePasswordPair($conn, $username, $password)
{
    // Retrieve the stored hashed password for the given username
    $storedPasswordQuery = "SELECT password FROM users WHERE username = '$username'";
    $result = $conn->query($storedPasswordQuery);

    // Check if the query was successful
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $storedHashedPassword = $row['password'];

        // Verify the entered password against the stored hashed password
        if (password_verify($password, $storedHashedPassword)) {
            return true;
        }
    }
}

// Function to register a new user
function registerUser($conn, $username, $password)
{
    //Hash password in dataabase
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $insert_query = "INSERT INTO users (username, password, currentWeight, dailyCalories, waterIntake, weightLog, calorieLog, waterLog, goals, workoutLog)".
        "VALUES ('$username', '$hashedPassword', '0', '0', '0', '{}', '{}', '{}', '\"\"', '[]')";

    if ($conn->query($insert_query) === TRUE) {
        return true;
    } else {
        return false;
    }
}


function testInput($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data); //prevents Cross-siste scripting (XSS)
    return $data;
}

//Function to update user information
function updateUser($conn, $username, $column, $value)
{
    $update_query = "UPDATE users SET $column = '$value' WHERE username = '$username'";

    if ($conn->query($update_query) === TRUE) {
        return true;
    } else {
        return false;
    }
}

//Function to update user information
function updateUserGoals($conn, $username, $column, $value)
{
    $value = json_encode($value);
    $update_query = "UPDATE users SET $column = '$value' WHERE username = '$username'";

    if ($conn->query($update_query) === TRUE) {
        return true;
    } else {
        return false;
    }
}


//Function to update user information
function updateUserWorkouts($conn, $username, $column, $value)
{
    // Prepare the SQL statement
    $stmt = $conn->prepare("UPDATE users SET $column = ? WHERE username = ?");

    // Bind parameters and execute the statement
    $stmt->bind_param("ss", json_encode($value), $username); // Assuming both are strings ('s')


    if ($stmt->execute() === TRUE) {
        return true;
    } else {
        return false;
    }
}


//Function to update Log
function updateUserLog($conn, $username, $column, $key, $value)
{
    // Fetch the current log for the user
    $select_query = "SELECT $column FROM users WHERE username = '$username'";
    $result = $conn->query($select_query);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $log = json_decode($row[$column], true); // Decoding the JSON string to an associative array

        $log[$key] = $value; //update $log with new weight

        // Encode the updated weightLog back to JSON
        $newLog = json_encode($log);

        // Update the user's weightLog in the database
        $update_query = "UPDATE users SET $column = '$newLog' WHERE username = '$username'";
        if ($conn->query($update_query) === TRUE) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}



//Function to get all user information from the database except for the password
function getUserInfo($conn, $username)
{
    $select_query = "SELECT username, currentWeight, dailyCalories, waterIntake, weightLog, calorieLog, waterLog, goals, workoutLog FROM users WHERE username = '$username'";
    $result = $conn->query($select_query);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return json_encode($row);
    } else {
        return null;
    }
}


?>

