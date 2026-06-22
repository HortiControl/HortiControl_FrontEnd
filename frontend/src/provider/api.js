import axios from "axios";

const api = axios.create({
    baseURL: "https://horticontrol-backend.onrender.com"
    // baseURL: "http://localhost:8080"
})

export default api;