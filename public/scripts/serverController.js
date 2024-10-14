let socket;

export function initializeWebSocket(ws) {
    socket = ws;
}

// Skickar movement till servern
export function sendMovement(id, x, y, color) {
    const roomId = localStorage.getItem('roomId'); // Hämta roomId från localStorage
    if (!roomId) {
        console.error("Room ID är inte definierat.");
        return;
    }

    const payload = JSON.stringify({
        type: 'move',
        id,
        x,
        y,
        color,
        roomId
    });

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
    } else {
        console.warn("WebSocket är inte öppen. Kan inte skicka rörelse.");
    }
}

// Skickar chatt till servern
export function sendChat(message) {
    const roomId = localStorage.getItem('roomId'); // Hämta roomId från localStorage
    if (!roomId) {
        console.error("Room ID är inte definierat.");
        return;
    }

    const payload = JSON.stringify({
        type: 'chat',
        id: localPlayer.id, 
        roomId: roomId
    });

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
    } else {
        console.warn("WebSocket är inte öppen. Kan inte skicka chatt.");
    }
}
