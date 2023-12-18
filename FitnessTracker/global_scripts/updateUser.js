//Script to make call AJAX calls to a php script which will update the SQL database

function updateUser(column, value, isArray=false) {

    let params = 'username=' + encodeURIComponent(userObject.username) + '&';
    params += 'column=' + encodeURIComponent(column) + '&';
    params += 'value=' + encodeURIComponent(value) + '&';
    params += 'isArray=' + isArray;
    // AJAX request
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Handle the response here
                var response = xhr.responseText;
                console.log(response);
            } else {
                console.error('Request failed: ' + xhr.status);
            }
        }
    };
    xhr.open('POST', '/FitnessTracker/global_scripts/updateUser.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
}

function updateUserLog(column, key, value) {

    let params = 'username=' + encodeURIComponent(userObject.username) + '&';
    params += 'column=' + encodeURIComponent(column) + '&';
    params += 'key=' + encodeURIComponent(key) + '&';
    params += 'value=' + encodeURIComponent(value);
    console.log(params);
    // AJAX request
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Handle the response here
                var response = xhr.responseText;
                console.log(response);
            } else {
                console.error('Request failed: ' + xhr.status);
            }
        }
    };
    xhr.open('POST', '/FitnessTracker/global_scripts/updateUser.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
}

function updateUserWorkouts(column, value) {

    let params = 'username=' + encodeURIComponent(userObject.username) + '&';
    params += 'column=' + encodeURIComponent(column) + '&';
    params += 'value=' + encodeURIComponent(value) + '&';
    params += 'isJSON=true';
    // AJAX request
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Handle the response here
                var response = xhr.responseText;
                console.log(response);
            } else {
                console.error('Request failed: ' + xhr.status);
            }
        }
    };
    xhr.open('POST', '/FitnessTracker/global_scripts/updateUser.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
}
