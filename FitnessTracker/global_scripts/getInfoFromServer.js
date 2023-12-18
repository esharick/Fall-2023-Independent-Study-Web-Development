//Calls a php script to get all the information for a user from the SQL database
function getUserInfoFromServer(username, callback) {
    let params = 'username=' + encodeURIComponent(username);

    // AJAX request
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = xhr.responseText;
                callback(decodeURIComponent(response));
            } else {
                console.error('Request failed: ' + xhr.status);
                callback(null);
            }
        }
    };
    xhr.open('POST', '/FitnessTracker/global_scripts/getInfoFromServer.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
}