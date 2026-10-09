import api from "../provider/api";

function normalizarPagina(data) {
  const pagina = data && !Array.isArray(data) ? data : {};
  const totalElements = pagina.totalElements ?? 0;
  const size = pagina.size ?? 0;

  return {
    items: Array.isArray(data) ? data : pagina.content || [],
    page: pagina.number ?? 0,
    size,
    totalElements,
    totalPages: pagina.totalPages ?? (size ? Math.ceil(totalElements / size) : 0),
    first: pagina.first ?? true,
    last: pagina.last ?? true,
  };
}

function obterParametrosPaginacao(paginacao) {
  if (!paginacao) return {};

  return {
    page: paginacao.page ?? 0,
    size: paginacao.size ?? 10,
    sort: paginacao.sort,
  };
}

function extrairResposta(response, paginacao) {
  const pagina = normalizarPagina(response.data);
  return paginacao ? pagina : pagina.items;
}

export function listarProdutos(filtroNome = "", paginacao = null) {
  const url = filtroNome ? "/produtos/busca" : "/produtos";
  const params = {
    ...(filtroNome ? { nome: filtroNome } : {}),
    ...obterParametrosPaginacao(paginacao),
  };

  return api.get(url, { params }).then((response) => extrairResposta(response, paginacao));
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

export function listarProdutosPreLavados(paginacao = null) {
  return api
    .get("/produtos/pre-lavados", { params: obterParametrosPaginacao(paginacao) })
    .then((response) => extrairResposta(response, paginacao));
}

export function listarProdutosNaoLavados(paginacao = null) {
  return api
    .get("/produtos/nao-lavados", { params: obterParametrosPaginacao(paginacao) })
    .then((response) => extrairResposta(response, paginacao));
}
