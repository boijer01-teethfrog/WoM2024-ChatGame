const API_URL = "http://localhost:80";

async function register(user, pass) {
    console.log(user, pass);

    const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "name": user,
            "password": pass
        })         
    });

    respData = await response.json();
    console.log(respData);

    if (respData.success == true) {
        alert("You are logged in!")
        localStorage.setItem('username', user.username);
        localStorage.setItem('hex', user.hex);
        localStorage.setItem('role', user.role);
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = "../room.html";
    } else {
        console.error("Login failed:", respData.msg);
    }
}

document.querySelector('#btn-signin').addEventListener('click', () => {
    event.preventDefault()

    const user = document.querySelector('#username').value;
    const pass = document.querySelector('#password').value;

    register(user, pass);
    


});