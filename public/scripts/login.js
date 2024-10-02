import { LOGIN_URL, ROOM_URL } from "./config.js";

async function register(respData, pass) {
  try {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: respData,
        password: pass,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    if (data.success === true) {
      alert("You are logged in!");

      //sparar userdatan i localstorage
      localStorage.setItem("username", data.username);
      localStorage.setItem("hex", data.hex);
      localStorage.setItem("role", data.role);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("jwt", data.jwt);
      window.location.href = ROOM_URL;
    } else {
      console.error("Login failed:", data.msg);
      alert(`Login failed: ${data.msg}`);
    }
  } catch (error) {
    console.error("Error: ", error);
    alert("Something went wrong :'(");
  }
}

document.querySelector("#btn-signin").addEventListener("click", (event) => {
  event.preventDefault();

  const user = document.querySelector("#username").value.trim(); //trimmar bort extra space om man gjort i misstag
  const pass = document.querySelector("#password").value.trim();

  //extra kontroll
  if (user && pass) {
    register(user, pass);
  } else {
    alert("Please enter both username and password.");
  }
});
