import { LOGIN_URL, REGISTER_URL } from './config.js';

async function register(user, pass) {
    console.log(user, pass);

    const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "name": user,
            "password": pass
        })         
    });

    const respData = await response.json();
    console.log(respData);

    if (respData.success == true) {
        alert("Account successfully created, redirecting to login")
        window.location.href = LOGIN_URL
    } else {
        console.error("Registration failed:", respData.msg);
    }
}

document.querySelector('#btn-signup').addEventListener('click', () => {
    event.preventDefault()

    const user = document.querySelector('#username').value;
    const pass = document.querySelector('#password').value;

    register(user, pass);
});