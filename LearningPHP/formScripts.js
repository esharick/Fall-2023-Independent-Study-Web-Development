checkStatus();
const passwordMatch = document.getElementById("password-match");
const usernameMatch = document.getElementById("username-match");
const username = document.getElementById('username');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');


function checkUsernameExists() {
    let user = username.value;
    // AJAX request
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Handle the response here
                var response = xhr.responseText;
                console.log(response);
                if (response == "taken") {
                    usernameMatch.innerHTML = "Username already exists";
                }
                else {
                    usernameMatch.innerHTML = "";
                }
            } else {
                console.error('Request failed: ' + xhr.status);
            }
        }
    };
    xhr.open('POST', 'check_username.php'); 
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('username=' + user); 

}

function checkPasswordMatch() {
    let pw = password.value;
    let confirmPw = confirmPassword.value;
    if (pw != confirmPw) {
        passwordMatch.innerHTML = "Passwords don't match";
    }
    else {
        passwordMatch.innerHTML = "";
    }
}

function checkStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    const status = urlParams.get('status');
    console.log(status);
    if (status === "user_exists_error") {
        alert("The user name already exists, please choose a different username!");
    } else if (status === "connection_error") {
        alert("Couldn't connect to database, please try again later.");
    } else if (status === "pw_match_error") {
        alert("Passwords didn't match, please try again.");
    } else if (status === "failed_login") {
        alert("Login information failed, please try again.");
    } 
}

function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}


function checkReturningUser() {
    const username = getCookie("username");
    if (username !== "") {
        window.location.href = "./success.php?status=existing";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    checkReturningUser();
});