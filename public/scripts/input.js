import { handleCommand } from './inputCommands.js';

function showModal() {
    const modal = document.getElementById('MyModal');
    if (modal) {
        modal.style.visibility = 'visible';
    }
    focusInput(modal);
}

function focusInput(modal) {
    const input = modal.querySelector('input[type="text"]');
    input.focus();
}

function handleKeyDown(event) {
    const modal = document.getElementById('MyModal');
    if (event.key === 'Enter') {
        if (modal.style.visibility !== 'visible') {
            event.preventDefault();
        }
        showModal();
    }
}

function handleSubmit(e) {
    e.preventDefault();
    const modal = document.getElementById('MyModal');
    const formData = new FormData(document.querySelector('form'));
    const message = formData.get('message');
    console.log('Message sent from form:', message);

    const rectData = JSON.parse(localStorage.getItem('rectData'));
    if (!rectData) {
        console.error('rectData not found in localStorage');
        return;
    }

    if (message.startsWith('/')) {
        const command = message;
        console.log(command);
        handleCommand(command);
    }

    sendChatMessage(rectData.id, message);
    handleMessageDisplay(rectData, message, modal);
}

function handleMessageDisplay(rectData, message, modal) {
    let currentMessageElement = document.querySelector('div[style*="position: absolute"]');

    if (currentMessageElement) {
        currentMessageElement.remove();
    }

    const messageElement = createMessageElement(message, rectData);
    document.body.appendChild(messageElement);
    currentMessageElement = messageElement;

    setTimeout(() => {
        hideMessage(currentMessageElement);
    }, 5000);

    document.querySelector('form').reset();
    modal.style.visibility = 'hidden';
}

function updateMessagePosition() {
    const rectData = JSON.parse(localStorage.getItem('rectData'));
    if (rectData) {
        const messageElement = document.querySelector('div[style*="position: absolute"]');
        if (messageElement) {
            messageElement.style.left = `${rectData.x + 8}px`;
            messageElement.style.top = `${rectData.y - 30}px`;
        }
    } else {
        console.log('rectData not found in localStorage');
    }
}

setInterval(updateMessagePosition, 1);


document.addEventListener('keydown', handleKeyDown);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', handleSubmit);
});

setInterval(updateMessagePosition, 1);

//websocket stufff
const WS_TOKEN = localStorage.getItem('ws_token') || 'my-secret-token';
const socket = new WebSocket(`wss://wom-websocket.azurewebsites.net/?token=${WS_TOKEN}`);

socket.onopen = function () {
    console.log("Connected to WebSocket server for chat");
};

socket.onerror = (error) => {
    console.error("WebSocket error:", error);
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'chat') {
        const { id, chatMessage } = data;

        const rectData = JSON.parse(localStorage.getItem('rectData')) || {};
        if (rectData && rectData.id === id) {
            handleMessageDisplay(rectData, chatMessage, document.getElementById('MyModal'));
        }
    }
};

function sendChatMessage(id, message) {
    const payload = JSON.stringify({
        type: 'chat',
        id: id,
        chatMessage: message
    });
    socket.send(payload);
}