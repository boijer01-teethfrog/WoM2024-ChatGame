import { getUsername, getHex } from "./config.js";


document.getElementById('greetingText').textContent = `Welcome ${getUsername()}!`
document.getElementById('account-name').textContent = `Name: ${getUsername()}`;
document.getElementById('color-picker').value = getHex();


let debounceTimer;

document.getElementById('color-picker').addEventListener('input', (event) => {
    const newColor = event.target.value;

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        (async () => {
            try {
                const response = await fetch('/user/updateColor', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: getUsername(),
                        hex: newColor,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log('Color update result:', result);
                localStorage.setItem('hex', newColor);
            } catch (error) {
                console.error('Error updating color:', error);
            }
        })();
    }, 500);
});

document.getElementById('join-room-button').addEventListener('click', (event) => {
    const roomId = document.getElementById('room-code').value;
    console.log(roomId);
    localStorage.setItem('roomId', roomId);
    window.location.href = `/room/`;
});