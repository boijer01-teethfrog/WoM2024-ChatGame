import { LOGIN_URL, REGISTER_URL } from "./config.js";

async function register(user, pass) {
  try {
    const response = await fetch(REGISTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: user, password: pass }),
    });

    const respData = await response.json();

    if (response.ok && respData.success) {
      alert("Account successfully created! Redirecting to login...");
      window.location.href = LOGIN_URL;
    } else {
      alert(`Registration failed: ${respData.msg}`);
    }
  } catch (error) {
    alert("Error, pls try again :s");
  }
}

document.querySelector("#btn-signup").addEventListener("click", (event) => {
  event.preventDefault();
  const user = document.querySelector("#username").value.trim();
  const pass = document.querySelector("#password").value.trim();

  if (user && pass) {
    register(user, pass);
  } else {
    alert("Please enter both username and password.");
  }
});
