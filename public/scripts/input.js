import { handleCommand, handleServerCommand } from './inputCommands.js';

function showModal() {
    const modal = document.getElementById('MyModal');
    modal.style.visibility = 'visible';
    focusInput(modal);
}

function focusInput(modal) {
    const input = modal.querySelector('input[type="text"]');
    input.focus();
}

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        const modal = document.getElementById('MyModal');
        if (modal.style.visibility !== 'visible') {
            event.preventDefault();
            showModal();
        }
    }
}

function handleSubmit(e) {
    e.preventDefault();
    const modal = document.getElementById('MyModal');
    if (!modal) {
        console.error('Modal element with ID "MyModal" not found.');
        return;
    }

    const form = document.querySelector('form');
    if (!form) {
        console.error('Form element not found.');
        return;
    }

    const formData = new FormData(form);
    const message = formData.get('message');
    console.log('Message sent from form:', message);

    const rectData = JSON.parse(localStorage.getItem('rectData'));
    if (!rectData) {
        console.error('rectData not found in localStorage');
        return;
    }

    if (message.startsWith('/')) {
        const command = message;
        console.log('Handling command:', command);
        handleCommand(command);
    }

    sendChatMessage(rectData.id, message);
    formResetAndHideModal(modal);
}

function formResetAndHideModal(modal) {
    const form = document.querySelector('form');
    if (form) {
        form.reset();
        console.log('Form has been reset.');
    } else {
        console.error('Form element not found during reset.');
    }

    modal.style.visibility = 'hidden';
    console.log('Modal is hidden');
}

document.addEventListener('keydown', handleKeyDown);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
        console.log('Form submit event listener added.');
    } else {
        console.error('Form element not found on DOMContentLoaded.');
    }
});

const WS_TOKEN = localStorage.getItem('ws_token');
const roomId = localStorage.getItem('roomId');
const socket = new WebSocket(`wss://wom-websocket.azurewebsites.net/?token=${WS_TOKEN}&roomId=${roomId}`);
//const socket = new WebSocket(`ws://localhost:5000/?token=${WS_TOKEN}&roomId=${roomId}`);

socket.onopen = function () {
    console.log("Connected to WebSocket server for chat");
};

socket.onerror = (error) => {
    console.error("WebSocket error:", error);
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'chat') {
        if (String(data.message).startsWith('/')) {
            const command = data.message;
            handleServerCommand(command);
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
    console.log('Chat message sent:', payload);
}
