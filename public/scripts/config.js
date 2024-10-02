//urls
export const REGISTER_URL = `/user/register`;
export const LOGIN_URL = `/user/login`;
export const ROOM_URL = `/room`;

//Getters
export function getUsername() {
  return localStorage.getItem("username") || "guest";
}

export function getHex() {
  return localStorage.getItem('hex') ? `#${localStorage.getItem('hex')}` : "blue";
}

export function getWindow() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}
