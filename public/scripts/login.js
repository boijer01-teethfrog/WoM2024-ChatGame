import { LOGIN_URL, SELECT_URL } from "./config.js";

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

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data received from server:", data);

    if (data.success === true) {
      localStorage.setItem("username", data.username);
      localStorage.setItem("hex", data.hex);
      localStorage.setItem("role", data.role);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("jwt", data.jwt);      
      localStorage.setItem("ws_token", data.wsToken); 
      window.location.href = SELECT_URL;
    } else {
      console.error("Login failed:", data.msg);
      alert(`Login failed: ${data.msg}`);
    }
  } catch (error) {
    alert("Something went wrong :'(", error);
  }
}


document.querySelector("#btn-signin").addEventListener("click", (event) => {
  event.preventDefault();

  const user = document.querySelector("#username").value.trim(); //trimmar bort extra space om man haft spacing i misstag
  const pass = document.querySelector("#password").value.trim();

  //extra kontroll
  if (user && pass) {
    register(user, pass);
  } else {
    alert("Please enter both username and password.");
  }
});
