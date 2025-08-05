export function getToken() {
  return localStorage.getItem("token");
}
export function isAuthenticated() {
  return !!getToken();
}
export function setToken(token) {
  localStorage.setItem("token", token);
}
export function logout() {
  localStorage.removeItem("token");
}