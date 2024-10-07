//urls
export const REGISTER_URL = `/user/register`;
export const LOGIN_URL = `/user/login`;
export const SELECT_URL = `/select`;
export const ROOM_URL = `/room`;
export const APPNAME = `Pixels`;
export const SOCKET_URL = `wss://wom-websocket.azurewebsites.net/?token=`

//Getters
export function getUsername() {
  return localStorage.getItem("username") || "guest";
}

export function getHex() {
  return localStorage.getItem('hex') ? `${localStorage.getItem('hex')}` : "#0000ff";
}

export function getWindow() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}
