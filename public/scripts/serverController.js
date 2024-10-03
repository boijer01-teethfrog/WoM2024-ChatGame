let socket;

export function initializeWebSocket(ws) {
    socket = ws;
}

//skickar movement till servern
export function sendMovement(id, x, y, color) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const payload = `${id}:${x}:${y}:${color}`;
        socket.send(payload);
    }
}

//Skickar chatt till servern
export function sendChat(message) {
 if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    }
}