<?php

//clear cookies
// Set cookies to expire in the past, effectively deleting them
setcookie('username', '', time() - 3600, '/');



//redirect to LearningPHP
header('Location: ../login');
exit();


?>