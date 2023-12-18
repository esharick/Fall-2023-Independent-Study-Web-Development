<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="/Icons/php.png">
    <link rel="stylesheet" href="/main.css" />
    <title>Learning PHP</title>
</head>
<body>
    <ul class="topnav">
        <li><a href="/">Home</a></li>
        <li><a href="/LearningHTML">Learning HTML</a></li>
        <li><a href="/LearningCSS">Learning CSS</a></li>
        <li><a href="/LearningJavaScript">Learning JavaScript</a></li>
        <li><a href="/LearningBootstrap">Learning Bootstrap</a></li>
        <li><a href="/LearningPHP" class="active">Learning PHP</a></li>
        <li><a href="/ChatbotPage">Simple Chatbot</a></li>
        <li><a href="/FitnessTracker">Fitness Tracker</a></li>

</ul>
    <div class="content">
        <h1> PHP: Hypertext Preprocessor - Week 10 and 11 (10/30 and 11/6/2023)</h1>
        <hr />
        <h2>
            Learning PHP
        </h2>
    <p style="max-width:800px; margin:auto;">
            For this page, I am using PHP with HTML forms in order to save login information
            into a backend MySQL server. I am using the MySQLi library to assist with this. 
            I have done a few things on this page. <br />First of all, the user can register for a new account.
            During account creation, as the user types in a username, I use an AJAX request to call a php 
            script, which queries a SQL database to see if the username already is in the database. If it is,
            I notify the user. I have also put checks in place so that the username and password meet
            certain criteria through the use of regular expressions. I use JavaScript to notify the user
            if the password and confirm password fields don't match. If the user proceeds anyway, I redirect
            them back to the page and put an alert to notify them of their error. Finally, when the user 
            correctly registers for an account, I store their username and password in the SQL database. I do this
            using a php script which securely stores the password by hashing it.
            <br />After successfully creating an account, the user is redirected to a welcome page. If it's
            the first time on the page, the user will get a different message than if they are returning. I do this
            using php Session variables. When returning to the page, I use cookies to check to see if the user
            has previously logged in and if they have, the user is automatically logged in.
        </p>
    </div>
    <hr />

    <div class="content bordered-content" >
        <h3>
        <?php 

        session_start();
       
        if (isset($_SESSION['username'])) {
            $username = $_SESSION['username'];
        } else {
            header("Location: ./"); //redirect back to login
            exit();
        }
        $username = $_SESSION['username'];
        if (isset($_GET['status'])) {
            $status = $_GET['status'];
            if ($status === 'new') {
                echo "Welcome, " . $username;
            } else {
                echo "Welcome back, " . $username;
            }
        } else {
            echo "Welcome back, " . $username; // Default message if 'status' is not provided
        }
        
        ?>
        </h3>
        <a href="/LearningPHP/logout.php">Logout</a>
    </div>

</body>
</html>