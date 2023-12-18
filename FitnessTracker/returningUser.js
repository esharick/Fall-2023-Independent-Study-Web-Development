function checkReturningUser() {
    const username = getCookie("username");
    if (username !== "") {
        window.location.href = "./home/";
    }
    else {
        window.location.href = "./login/"
    }
}

document.addEventListener('DOMContentLoaded', function () {
    checkReturningUser();
});