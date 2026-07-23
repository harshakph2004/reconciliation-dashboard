import axios from "axios";

const API = axios.create({
  baseURL: "https://reconciliation-dashboard.onrender.com/api",
});

export default api;