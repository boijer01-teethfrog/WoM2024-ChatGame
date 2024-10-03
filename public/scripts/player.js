import { getUsername, getHex, getWindow } from "./config.js";
import { sendMovement, getServerResponse } from "./serverController.js";

const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");


//Player logic
const rect = {
    id: getUsername(),
    x: 100 + Math.floor(Math.random() * 1401),
    y: 60 + Math.floor(Math.random() * 601),
    width: 50,
    height: 50,
    speed: 10
};

document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            rect.y -= rect.speed;
            sendMovement(rect.y, "y");
            getServerResponse();
            break;
        case 'ArrowDown':
            rect.y += rect.speed;
            sendMovement(rect.y, "y");
            getServerResponse();

            break;
        case 'ArrowLeft':
            rect.x -= rect.speed;
            sendMovement(rect.x, "x");
            getServerResponse();

            break;
        case 'ArrowRight':
            rect.x += rect.speed;
            sendMovement(rect.x, "x");
            getServerResponse();

            break;
    }
    draw();
    localStorage.setItem('rectData', JSON.stringify({ id: rect.id, x: rect.x, y: rect.y }));
});

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = getHex();
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = "black";
    ctx.font = "20px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(getUsername(), rect.x + rect.width / 2, rect.y + 70);
}

draw();

const WS_TOKEN = localStorage.getItem('ws_token') || 'my-secret-token';
const socket = new WebSocket(`ws://localhost:5000?token=${WS_TOKEN}`);

socket.onmessage = (event) => {
    console.log(event.data);
};