import { getUsername, getHex } from "./config.js";


document.getElementById('greetingText').textContent = `Welcome ${getUsername()}!`
document.getElementById('account-name').textContent = `Name: ${getUsername()}`;
document.getElementById('color-box').style.backgroundColor = getHex();
document.getElementById('color-picker').value = getHex();
