//urls
export const REGISTER_URL = `/user/register`;
export const LOGIN_URL = `/user/login`;
export const SELECT_URL = `/select`;
export const ROOM_URL = `/room`;
export const APPNAME = `Pixels`;

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
