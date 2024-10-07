import { getUsername, getHex } from "./config.js";
import { sendMovement, initializeWebSocket } from "./serverController.js";

const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
const otherPlayers = {};
const chatMessages = {};  

const localPlayer = {
    id: getUsername(),
    x: 100 + Math.floor(Math.random() * 1401),
    y: 60 + Math.floor(Math.random() * 601),
    width: 50,
    height: 50,
    color: getHex(),
    speed: 10
};

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.fillStyle = localPlayer.color;
    ctx.fillRect(localPlayer.x, localPlayer.y, localPlayer.width, localPlayer.height);
    ctx.fillStyle = "black";
    ctx.font = "20px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(localPlayer.id, localPlayer.x + localPlayer.width / 2, localPlayer.y + 70);

    for (const id in otherPlayers) {
        const player = otherPlayers[id];
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = "black";
        ctx.fillText(player.id, player.x + player.width / 2, player.y + 70);
    }

    for (const id in chatMessages) {
        const messageData = chatMessages[id];
        if (messageData) {
            ctx.fillStyle = "white";
            ctx.fillRect(messageData.x, messageData.y - 30, 100, 20); 
            ctx.fillStyle = "black";
            ctx.fillText(messageData.message, messageData.x + 50, messageData.y - 15);
        }
    }
}

export function changePlayerSize(w, h) {
    localPlayer.width = w;
    localPlayer.height = h;
    draw();
}

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

    if (moved) {
        sendMovement(localPlayer.id, localPlayer.x, localPlayer.y, localPlayer.color);
        localStorage.setItem('rectData', JSON.stringify({ id: localPlayer.id, x: localPlayer.x, y: localPlayer.y }));
    }
});
draw();

//WebSocket stuff
const WS_TOKEN = localStorage.getItem('ws_token') || 'my-secret-token';
const socket = new WebSocket(`wss://wom-websocket.azurewebsites.net/?token=${WS_TOKEN}`);

initializeWebSocket(socket);

socket.onopen = function () {
    console.log("Connected to WebSocket server");
    sendMovement(localPlayer.id, localPlayer.x, localPlayer.y, localPlayer.color); 
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'move') {
        const { id, x, y, color, left } = data;
        if (left) {
            delete otherPlayers[id];
        } else {
            if (id !== localPlayer.id) {
                otherPlayers[id] = { id, x, y, color, width: 50, height: 50 };
            }
        }
    }

    else if (data.type === 'chat') {
        const { id, message } = data;
        const player = otherPlayers[id] || localPlayer;

        chatMessages[id] = { x: player.x, y: player.y, message: message };

        setTimeout(() => {
            delete chatMessages[id];
            draw();
        }, 5000);
    }

    draw();  
};

socket.onclose = () => {
    console.log("Disconnected from WebSocket server");
};

socket.onerror = (error) => {
    console.error("Error :(", error);
};


//game loop
function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop); //updates 60hz i think
}

gameLoop();
