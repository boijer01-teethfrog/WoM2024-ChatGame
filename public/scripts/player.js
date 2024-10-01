 import { getUsername, getHex, getWindow } from "./config.js"; 

const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

/*const maxSizeX = getWindow().width - 20;
const maxSizeY = getWindow().height - 20;*/

const rect = {
    id: getUsername(),
    x: 100 + Math.floor(Math.random() * 1401),
    y: 60 + Math.floor(Math.random() * 601),
    width: 50,
    height: 50,
    speed: 10
};

document.addEventListener('keydown', function(event) {
    if(event.key === 'ArrowUp') {
            rect.y -= rect.speed;
            } else if(event.key === 'ArrowLeft') {
            rect.x -= rect.speed;
            } else if(event.key === 'ArrowDown') {
            rect.y += rect.speed;
            } else if(event.key === 'ArrowRight') {
            rect.x += rect.speed;
            }
            draw();
            localStorage.setItem('rectData', JSON.stringify({ id: rect.id, x: rect.x, y: rect.y }));
    });

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = getHex();
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = "black";
    ctx.font = "20px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(getUsername(), rect.x + rect.width / 2, rect.y + 70);
}

draw();
