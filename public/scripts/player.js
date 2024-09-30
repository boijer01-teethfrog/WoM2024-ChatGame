var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var x = 100;
var y = 60;
var width = 50;
var height = 50;
var speed = 5;
var rect = {
    id: 'smoky',
    x: 100,
    y: 60,
    width: 50,
    height: 50,
    speed: 5
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
    ctx.fillStyle = "blue";
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = "black";
    ctx.font = "20px Courier New";
    ctx.textAlign = "center";
    ctx.fillText("smoky", rect.x + rect.width / 2, rect.y + 70);
}

draw();
