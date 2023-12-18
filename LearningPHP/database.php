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
    $insert_query = "INSERT INTO users (username, password) VALUES ('$username', '$hashedPassword')";

    if ($conn->query($insert_query) === TRUE) {
        return true;
    } else {
        return false;
    }
}

// Function to verify matching password
function passwordsMatch($password, $password2)
{
    return $password == $password2;
}


function testInput($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data); //prevents Cross-siste scripting (XSS)
    return $data;
}

?>
