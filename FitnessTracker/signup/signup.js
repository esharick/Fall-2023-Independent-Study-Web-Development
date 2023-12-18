const passwordMatch = document.getElementById("password-match");
const usernameMatch = document.getElementById("username-match");
const username = document.getElementById('username');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const registerButton = document.getElementById('register-button');
const passwordRequirementsPrompt = document.getElementById('pw-req-prompt')

let usernameTaken = true;
let passwordGood = false;
let passwordMatches = false;

function checkUsernameExists() {
    let user = username.value;
    const pattern = /^\S+$/;
    if (!pattern.test(user)) {
        usernameMatch.innerHTML = "Username cannot contain spaces";
        usernameTaken = true;
        return;
    }

    checkUsername(function (response) {
        if (response.trim().toLowerCase() === "taken") {
            usernameMatch.innerHTML = "Username already exists";
            usernameTaken = true;
            registerButton.disabled = true;
        } else {
            usernameMatch.innerHTML = "";
            usernameTaken = false;
            if (passwordGood && passwordMatches)
                registerButton.disabled = false;
        }
    }, user);


}

function checkUsername(callback, user) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = xhr.responseText;
                callback(response);
            } else {
                console.error('Request failed: ' + xhr.status);
            }
        }
    };
    xhr.open('POST', 'usernameExists.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('username=' + encodeURIComponent(user));
}



function checkPassword() {
    checkPasswordMatch();
    checkValidPassword();
}

function checkPasswordMatch() {
    let pw = password.value;
    let confirmPw = confirmPassword.value;
    if (pw != confirmPw) {
        passwordMatch.innerHTML = "Passwords don't match";
        passwordMatches = false;
        registerButton.disabled = true;

    }
    else {
        passwordMatch.innerHTML = "";
        passwordMatches = true;
        if (!usernameTaken && passwordGood)
            registerButton.disabled = false;

    }
}

function checkValidPassword() {
    let pw = password.value;
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!pattern.test(pw)) {
        passwordRequirementsPrompt.innerHTML = "Must be at least 8 characters, contain at least one lowercase letter, "+ 
                                                "one uppercase letter, one digit, and one special character '@$!%*?&amp;'";
        passwordGood = false;
        registerButton.disabled = true;
    }
    else {
        passwordRequirementsPrompt.innerHTML = "";
        passwordGood = true;
        if (!usernameTaken && passwordMatches)
            registerButton.disabled = false;

    }
}    

function authenticateUser() {
    const username = getCookie("username");
    if (username !== "") {
        window.location.href = "../home/"
    }
}

document.addEventListener('DOMContentLoaded', function () {
    authenticateUser();
});