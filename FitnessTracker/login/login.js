const loginIncorrectText = document.getElementById('login-incorrect-text')
checkStatus();

function checkStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    if (status === "failed_login") {
        loginIncorrectText.innerHTML = "Login failed, please try again.";
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
