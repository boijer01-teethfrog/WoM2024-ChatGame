import {getWindow} from "./config.js";

function updateWindow() {
    const c = document.getElementById("myCanvas");
    console.log(getWindow())
    const newWidth = getWindow().width;
    const newHeight = getWindow().height;
    c.style.height = newHeight;
    c.style.width = newWidth;
}

window.addEventListener('resize', updateWindow);
updateWindow();