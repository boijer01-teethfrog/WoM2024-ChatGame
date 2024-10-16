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
    handleMessageDisplay(rectData, message, modal);
}

function handleMessageDisplay(rectData, message, modal) {
    let currentMessageElement = document.querySelector('div[style*="position: absolute"]');

    if (currentMessageElement) {
        currentMessageElement.remove();
    }

    const messageElement = createMessageElement(message, rectData);
    if (messageElement) {
        document.body.appendChild(messageElement);
        currentMessageElement = messageElement;

        setTimeout(() => {
            hideMessage(currentMessageElement);
        }, 5000);
    } else {
        console.error('Failed to create message element.');
    }

    formResetAndHideModal(modal);
}

// Helper function to reset form and hide modal
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

function createMessageElement(message, rectData) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = `${rectData.x + 8}px`;
    div.style.top = `${rectData.y - 30}px`;
    div.textContent = message;
    return div;
}

function hideMessage(element) {
    if (element) {
        element.remove();
        console.log('Message element removed.');
    }
}

function updateMessagePosition() {
    const rectData = JSON.parse(localStorage.getItem('rectData'));
    if (rectData) {
        const messageElement = document.querySelector('div[style*="position: absolute"]');
        if (messageElement) {
            messageElement.style.left = `${rectData.x + 8}px`;
            messageElement.style.top = `${rectData.y - 30}px`;
            console.log('Message position updated.');
        }
    } else {
        console.log('rectData not found in localStorage');
    }
}

setInterval(updateMessagePosition, 1); 

// Event listener for keydown to show modal
document.addEventListener('keydown', handleKeyDown);

// Event listener for form submission after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
        console.log('Form submit event listener added.');
    } else {
        console.error('Form element not found on DOMContentLoaded.');
    }
});

const WS_TOKEN = localStorage.getItem('ws_token') || 'my-secret-token';
const roomId = localStorage.getItem('roomId');
const socket = new WebSocket(`wss://wom-websocket.azurewebsites.net/?token=${WS_TOKEN}&roomId=${roomId}`); 
/* const socket = new WebSocket(`ws://localhost:5000/?token=${WS_TOKEN}&roomId=${roomId}`); */



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

        if (String(data.message).startsWith('/')) {
            const command = data.message;
            handleServerCommand(command);
        }
        
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
    console.log('Chat message sent:', payload);
}
