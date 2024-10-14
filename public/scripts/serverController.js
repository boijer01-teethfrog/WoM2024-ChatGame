let socket;

export function initializeWebSocket(ws) {
    socket = ws;
}

// Sends movement to the server
export function sendMovement(id, x, y, width, height, color) {
    const roomId = localStorage.getItem('roomId'); // Get roomId from localStorage
    if (!roomId) {
        console.error("Room ID är inte definierat.");
        return;
    }

    const payload = JSON.stringify({
        type: 'move',
        id,
        x,
        y,
        width,
        height,
        color,
        roomId
    });

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
    } else {
        console.warn("WebSocket är inte öppen. Kan inte skicka rörelse.");
    }
}

export function sendChat(chatMessage) { 
    const roomId = localStorage.getItem('roomId'); 
    if (!roomId) {
        console.error("Room ID är inte definierat.");
        return;
    }

    if (!localPlayer || !localPlayer.id) {
        console.error("Local player ID is not defined.");
        return;
    }

    const payload = JSON.stringify({
        type: 'chat',
        id: localPlayer.id, 
        message: chatMessage, 
        roomId: roomId
    });

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
    } else {
        console.warn("WebSocket är inte öppen. Kan inte skicka chatt.");
    }
}
