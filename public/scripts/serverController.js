let socket;

export function initializeWebSocket(ws) {
    socket = ws;
}

export function sendMovement(id, x, y, color) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const payload = `${id}:${x}:${y}:${color}`;
        socket.send(payload);
    }
}
