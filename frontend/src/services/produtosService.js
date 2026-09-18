import api from "../provider/api";

export function listarProdutos(filtroNome = "") {
  const url = filtroNome
    ? `/produtos/busca?nome=${filtroNome}`
    : "/produtos";

  return api.get(url).then((response) => response.data);
}

export function criarProduto(dados) {
  return api.post("/produtos", dados).then((response) => response.data);
}

export function atualizarProduto(id, dados) {
  return api.put(`/produtos/${id}`, dados).then((response) => response.data);
}

export function excluirProduto(id) {
  return api.delete(`/produtos/${id}`);
}

export function reajustarPrecoGlobal(novoPreco) {
  return api.patch(`/produtos/reajuste-global?novoPreco=${novoPreco}`, {});
}

export function listarProdutosPreLavados() {
  return api.get("/produtos/pre-lavados").then((response) => response.data);
}

export function listarProdutosNaoLavados() {
  return api.get("/produtos/nao-lavados").then((response) => response.data);
}
