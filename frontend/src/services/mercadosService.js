import api from "../provider/api";

export function listarMercados() {
  return api.get("/mercados").then((response) => response.data);
}

export function criarMercado(dados) {
  return api.post("/mercados", dados).then((response) => response.data);
}

export function atualizarMercado(id, dados) {
  return api.put(`/mercados/${id}`, dados).then((response) => response.data);
}

export function excluirMercado(id) {
  return api.delete(`/mercados/${id}`);
}
