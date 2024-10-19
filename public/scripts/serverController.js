let socket;

export function initializeWebSocket(ws) {
    socket = ws;
}

// Sends movement to the server
export function sendMovement(id, x, y, width, height, color) {

    const payload = JSON.stringify({
        type: 'move',
        id,
        x,
        y,
        width,
        height,
        color,
    });

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
    } else {
        console.warn("WebSocket not open");
    }
}

export function sendChat(chatMessage) { 
   
    if (!localPlayer || !localPlayer.id) {
        console.error("Local player ID is not defined.");
        return;
    }

    const payload = JSON.stringify({
        type: 'chat',
        id: localPlayer.id, 
        message: chatMessage, 
    });

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
    } else {
        console.warn("WebSocket not open");
    }
}
