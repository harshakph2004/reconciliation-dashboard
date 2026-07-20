import axios from "axios";

const api = axios.create({
  baseURL: "https://reconciliation-dashboard.onrender.com/api",
});

export default api;