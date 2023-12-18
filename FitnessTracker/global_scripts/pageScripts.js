const logoutURL = window.location.origin + "/FitnessTracker/global_scripts/logout.php";
let userObject = null;

function authenticateUser() {
    const username = getCookie("username");
    console.log(username);
    if (username === "") {
        window.location.href = "/FitnessTracker/login/";
    }
    else {
        //get user data from local storage
        if (localStorage.getItem('user') !== null) {
            userObject = new User(JSON.parse(localStorage.getItem('user')));
            //verify correct user - in case of multiple logins on same browser/device
            if (userObject.username !== username) {
                console.log('New login detected.');
            }
            else {
                console.log('User data found:', userObject);
                return;
            }
        } else {
            // 'user' item does not exist in localStorage
            console.log('User data not found.');
        }

        //user data not found in local storage - user logged out or different user was previously logged in
        //generate a user data object from database
        getUserInfoFromServer(username, function (response) {
            if (response !== null) {
                console.log(response);
                response = JSON.parse(response);
                console.log(response);
                console.log('Retrieved user from database:', response.username);
                // Verify the retrieved user matches the expected user
                if (response.username === username) {
                    userObject = new User(response);
                    localStorage.setItem('user', JSON.stringify(userObject));
                    console.log('User data created and saved in local storage:', userObject);
                } else {
                    console.error('User mismatch - Unexpected user retrieved from the database.');
                    // Handle the situation where the retrieved user does not match the expected user
                }
            } else {
                console.error('Error fetching user info, database offline, try again later');
                // Handle situations where the database is offline or the request fails
            }
        });

        
    }
}


function logout() {
    localStorage.removeItem('user');
    console.log('User data removed from local storage');
    userObject = "";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Successful response received
                var data = xhr.responseText;
                console.log('Returned data:', data);
            } else {
                // Handle errors
                console.error('Request failed with status:', xhr.status);
            }
        }
    };
    xhr.open('GET', logoutURL, true);
    xhr.send();
}



document.addEventListener('DOMContentLoaded', function () {
    authenticateUser();
});

window.addEventListener('beforeunload', function (event) {
    if (userObject != "") {
        // Save the user object to localStorage
        localStorage.setItem('user', JSON.stringify(userObject));
    }
});