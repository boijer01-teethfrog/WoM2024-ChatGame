//Websocket connection
const WS_TOKEN = localStorage.getItem("ws_token") || "my-secret-token";
const socket = new WebSocket(`ws://localhost:5000?token=${WS_TOKEN}`);

socket.onopen = function (event) {
  console.log("Connected to WebSocket server");
};

export function sendMovement(data, direction) {
  const payload = `${data}:${direction}`;
  socket.send(payload);
}

socket.onmessage = function (event) {
  console.log(event.data);
};

export function getServerResponse() {
  console.log("getServerResponse");
}
