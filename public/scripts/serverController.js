//Websocket connection
const WS_TOKEN = localStorage.getItem('ws_token') || 'my-secret-token';
const socket = new WebSocket(`ws://localhost:5000?token=${WS_TOKEN}`);

socket.onopen = function (event) {
    console.log('Connected to WebSocket server');
};

export function sendMovement(data, direction) {
        socket.send(data, direction);
}