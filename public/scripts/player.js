import { getUsername, getHex, getWindow } from "./config.js";
import { sendMovement, initializeWebSocket } from "./serverController.js";

const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

// Lokala spelarens data
const localPlayer = {
    id: getUsername(),
    x: 100 + Math.floor(Math.random() * 1401),
    y: 60 + Math.floor(Math.random() * 601),
    width: 50,
    height: 50,
    color: getHex(),
    speed: 10
};

export function changePlayerSize(w, h) {
    localPlayer.width = w;
    localPlayer.height = h;
    draw();
}

const otherPlayers = {};

//funktion för rita spelarna
function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    //Ritar lokala playerjn
    ctx.fillStyle = localPlayer.color;
    ctx.fillRect(localPlayer.x, localPlayer.y, localPlayer.width, localPlayer.height);
    ctx.fillStyle = "black";
    ctx.font = "20px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(localPlayer.id, localPlayer.x + localPlayer.width / 2, localPlayer.y + 70);

    //Loopar igenom andra spelaren å ritar ut varje spelare
    for (const id in otherPlayers) {
        const player = otherPlayers[id];
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = "black";
        ctx.fillText(player.id, player.x + player.width / 2, player.y + 70);
    }
}

//movement
document.addEventListener('keydown', function (event) {
    let moved = false;
    switch (event.key) {
        case 'ArrowUp':
            localPlayer.y -= localPlayer.speed;
            moved = true;
            break;
        case 'ArrowDown':
            localPlayer.y += localPlayer.speed;
            moved = true;
            break;
        case 'ArrowLeft':
            localPlayer.x -= localPlayer.speed;
            moved = true;
            break;
        case 'ArrowRight':
            localPlayer.x += localPlayer.speed;
            moved = true;
            break;
    }
    //Skickar ut till websocketen movement, färg å id
    if (moved) {
        sendMovement(localPlayer.id, localPlayer.x, localPlayer.y, localPlayer.color);
        localStorage.setItem('rectData', JSON.stringify({ id: localPlayer.id, x: localPlayer.x, y: localPlayer.y }));
    }
});
draw();


//websocket stuff

/*
TODO
Riktigt api key, lägga i localstorage från .env filen istället
*/
const WS_TOKEN = localStorage.getItem('ws_token') || 'my-secret-token';
const socket = new WebSocket(`wss://wom-websocket.azurewebsites.net/?token=${WS_TOKEN}`);


initializeWebSocket(socket);

socket.onopen = function (event) {
    console.log("Connected to WebSocket server");
    sendMovement(localPlayer.id, localPlayer.x, localPlayer.y, localPlayer.color);
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const { id, x, y, color, left } = data; //Uppdaterar massa olika vars med data från socket

    if (left) { //radera spelaren om han leava
        delete otherPlayers[id];
    } else {
        if (id !== localPlayer.id) { //om spelaren är annan så lägg till
            otherPlayers[id] = { id, x, y, color, width: 50, height: 50 };
        }
    }
    draw();
};

socket.onclose = () => {
    console.log("Disconnected from WebSocket server");
};

socket.onerror = (error) => {
    console.error("Error :(", error);
};

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop); //makes everything smooth i think
}

gameLoop();
