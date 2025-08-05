import axios from "axios";
import { getToken, logout } from "./auth";

const API_BASE = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  resp => resp,
  err => {
    if (err.response && err.response.status === 401) {
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;