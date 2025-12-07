document.getElementById("login_button").onclick = checkUser;

function checkUser(e) {
    if (e) e.preventDefault();
    username_in = document.getElementById("username").value;
    password_in = document.getElementById("password").value;

    var localStorage = window.localStorage;
    if (!localStorage) {
        // local storage is not supported by this browser.
        // do nothing
    }
    else {
        numUsers = localStorage.numUsers;

        var login_success = false;
        if (numUsers != undefined) {
            // Check users
            for (i = 0; i < numUsers; i++) {
                username = localStorage["user" + i];
                password = localStorage["pass" + i];

                if (username_in == username && password_in == password) {
                    login_success = true;
                    break;
                }
            } // for 
        } // if

        if (login_success) {
            alert("Login Success!");
            localStorage.setItem("currentUser", username_in);
            window.location.href = "index.html";
        }
        else {
            alert("Username and password are not matched with our database!");
        }
    } // else
}
