document.addEventListener('DOMContentLoaded', (event) => {
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.clear();
            console.log('User logged out');
            window.location.href = '../user/login';
        });
    } 
});

const backButton = document.getElementById('backButton');

if (backButton) {
    backButton.addEventListener('click', () => {
        window.history.back();
    });
}
