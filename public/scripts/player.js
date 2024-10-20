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

localStorage.setItem('rectData', JSON.stringify({
    id: localPlayer.id,
    x: localPlayer.x,
    y: localPlayer.y,
    width: localPlayer.width,
    height: localPlayer.height,
    color: localPlayer.color
}));

let socket;

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    //Draw local player
    ctx.fillStyle = localPlayer.color;
    ctx.fillRect(localPlayer.x, localPlayer.y, localPlayer.width, localPlayer.height);
    ctx.fillStyle = "black";
    ctx.font = "20px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(localPlayer.id, localPlayer.x + localPlayer.width / 2, localPlayer.y + 70);

    //Draw other players
    for (const id in otherPlayers) {
        const player = otherPlayers[id];
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = "black";
        ctx.fillText(player.id, player.x + player.width / 2, player.y + 70);
    }

    //Draw chat messages
    for (const id in chatMessages) {
        const messageData = chatMessages[id];
        if (messageData) {
            const textWidth = ctx.measureText(messageData.message).width;
            const bubblePadding = 10;
            const bubbleWidth = textWidth + bubblePadding * 2;
            const bubbleHeight = 30;

            ctx.fillStyle = "#d6d6d6";
            ctx.fillRect(
                messageData.x - bubbleWidth / 2,
                messageData.y - bubbleHeight - 40,
                bubbleWidth,
                bubbleHeight
            );

            ctx.fillStyle = "black";
            ctx.fillText(
                messageData.message,
                messageData.x,
                messageData.y - bubbleHeight - 20
            );
        }
    }
}

export function changePlayerSize(w, h) {
    localPlayer.width = w;
    localPlayer.height = h;
    sendMovement(localPlayer.id, localPlayer.x, localPlayer.y, localPlayer.width, localPlayer.height, localPlayer.color);
    draw();
}

//Movement logic, also makes sure player won't go outside the room width/height
function handleMovement(event) {
    let moved = false;
    switch (event.key) {
        case 'ArrowUp':
            if (localPlayer.y - localPlayer.speed >= 0) {
                localPlayer.y -= localPlayer.speed;
                moved = true;
            }
            break;
        case 'ArrowDown':
            if (localPlayer.y + localPlayer.height + localPlayer.speed <= c.height) {
                localPlayer.y += localPlayer.speed;
                moved = true;
            }
            break;
        case 'ArrowLeft':
            if (localPlayer.x - localPlayer.speed >= 0) {
                localPlayer.x -= localPlayer.speed;
                moved = true;
            }
            break;
        case 'ArrowRight':
            if (localPlayer.x + localPlayer.width + localPlayer.speed <= c.width) {
                localPlayer.x += localPlayer.speed;
                moved = true;
            }
            break;
    }

    //Updates player data
    if (moved) {
        localStorage.setItem('rectData', JSON.stringify({
            id: localPlayer.id,
            x: localPlayer.x,
            y: localPlayer.y,
            width: localPlayer.width,
            height: localPlayer.height,
            color: localPlayer.color
        }));

        if (chatMessages[localPlayer.id]) {
            chatMessages[localPlayer.id].x = localPlayer.x;
            chatMessages[localPlayer.id].y = localPlayer.y;
        }

        draw();
    }
}

document.addEventListener('keydown', handleMovement);

//Function to send movement updates at 60fps
function sendMovementUpdateLoop() {
    sendMovement(localPlayer.id, localPlayer.x, localPlayer.y, localPlayer.width, localPlayer.height, localPlayer.color);
    requestAnimationFrame(sendMovementUpdateLoop); // Continue the loop to send movement updates at ~60fps
}

// WebSocket stuff
const WS_TOKEN = localStorage.getItem('ws_token');
console.log("ws token: ", WS_TOKEN);
const roomId = localStorage.getItem('roomId');

function connectWebSocket() {
    socket = new WebSocket(`wss://wom-websocket.azurewebsites.net/?token=${WS_TOKEN}&roomId=${roomId}`);//production
    //const socket = new WebSocket(`ws://localhost:5000/?token=${WS_TOKEN}&roomId=${roomId}`);

    initializeWebSocket(socket);

    socket.onopen = function () {
        console.log("Connected to WebSocket server");
        sendMovement(localPlayer.id, localPlayer.x, localPlayer.y, localPlayer.width, localPlayer.height, localPlayer.color);
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'move') {
            const { id, x, y, width, height, color, left } = data;
            if (left) {
                delete otherPlayers[id];
            } else {
                if (id !== localPlayer.id) {
                    otherPlayers[id] = { id, x, y, width, height, color };
                }

                if (chatMessages[id]) {
                    chatMessages[id].x = x;
                    chatMessages[id].y = y;
                }
            }
            draw();
        } else if (data.type === 'chat') {
            const { id, message } = data;
            const player = otherPlayers[id] || localPlayer;
            const timestamp = Date.now();

            chatMessages[id] = { x: player.x, y: player.y, message: message, timestamp: timestamp };

            //message is active for 5000ms, then deletes it
            setTimeout(() => {
                if (chatMessages[id] && Date.now() - chatMessages[id].timestamp >= 5000) {
                    delete chatMessages[id];
                    draw();
                }
            }, 5000);
        }

        draw();
    };

    socket.onclose = () => {
        console.log("Disconnected from WebSocket server, attempting to reconnect...");
        setTimeout(connectWebSocket, 1000);
    };

    socket.onerror = (error) => {
        console.error("Error :(", error);
    };
}

connectWebSocket();

//Start sending movement updates at 60Hz
requestAnimationFrame(sendMovementUpdateLoop);

//Game loop
function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop); //updates at ~60 Hz
}

gameLoop();
