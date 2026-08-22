import axios from "axios";

const api = axios.create({
    baseURL: "https://horticontrol-backend.onrender.com"
    // baseURL: "http://localhost:8080"
})

// intercepta qualquer resposta 401 (token inválido, revogado ou expirado)
// e força o usuário de volta pro login em qualquer tela, não só na de logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;