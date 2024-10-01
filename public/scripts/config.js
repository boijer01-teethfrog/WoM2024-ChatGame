//Alla urls
export const URL = `http://localhost:8080`;
export const REGISTER_URL = `${URL}/user/register`;
export const LOGIN_URL = `${URL}/user/login`;
export const ROOM_URL = `${URL}/room`;

//Getters från localstorage
export function getUsername() {
  return localStorage.getItem("username") || "guest";
}

export function getHex() {
    return '#' + localStorage.getItem('hex') || "blue";
}

export function getWindow() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}