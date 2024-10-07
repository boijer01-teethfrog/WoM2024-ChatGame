let socket;

export function initializeWebSocket(ws) {
    socket = ws;
}

//skickar movement till servern
// serverController.js
export function sendMovement(id, x, y, color) {
    const payload = JSON.stringify({
        type: 'move',
        id,
        x,
        y,
        color
    });
    socket.send(payload);  
}


//Skickar chatt till servern
export function sendChat(message) {
 if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    }
}