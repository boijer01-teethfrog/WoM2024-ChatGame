import { LOGIN_URL, ROOM_URL } from "./config.js";

async function register(respData, pass) {
    const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "name": respData,
            "password": pass
        })         
    });

    const data = await response.json();
    console.log(data);

    if (data.success == true) {
        alert("You are logged in!");

        // Save user data in localStorage
        localStorage.setItem('username', data.username);
        localStorage.setItem('hex', data.hex);
        localStorage.setItem('role', data.role);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('jwt', data.jwt);  // Save the JWT for future requests
        window.location.href = ROOM_URL;
    } else {
        console.error("Login failed:", data.msg);
    }
}

document.querySelector('#btn-signin').addEventListener('click', () => {
    event.preventDefault();

    const user = document.querySelector('#username').value;
    const pass = document.querySelector('#password').value;

    register(user, pass);
});
