import api from "../provider/api";

export function criarUsuario(dados) {
  return api.post("/usuarios", dados).then((response) => response.data);
}

export function atualizarPerfil(dados) {
  return api
    .put("/usuarios/me/perfil", dados)
    .then((response) => response.data);
}

export function atualizarSenha(dados) {
  return api
    .put("/usuarios/me/senha", dados)
    .then((response) => response.data);
}
