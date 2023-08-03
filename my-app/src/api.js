import axios from "axios";

export const BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
});

export const setToken = (token) => {
  api.defaults.headers.common["Authorization"] = token;
  localStorage.setItem("token", token);
}

export const removeToken = () => {
  delete api.defaults.headers.common["Authorization"];
  localStorage.removeItem("token");
}

export const loadToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    setToken(token);
  }
}

export default api;
