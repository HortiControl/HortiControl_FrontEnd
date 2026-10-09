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

export function listarMercados(paginacao = null) {
  const params = paginacao
    ? {
        page: paginacao.page ?? 0,
        size: paginacao.size ?? 10,
        sort: paginacao.sort,
      }
    : {};

  return api.get("/mercados", { params }).then((response) => {
    const pagina = normalizarPagina(response.data);
    return paginacao ? pagina : pagina.items;
  });
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
