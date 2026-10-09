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

function listarPedidos(url, mercadoId, paginacao) {
  const params = {
    ...(mercadoId !== undefined ? { mercadoId } : {}),
    ...(paginacao
      ? {
          page: paginacao.page ?? 0,
          size: paginacao.size ?? 10,
          sort: paginacao.sort,
        }
      : {}),
  };

  return api
    .get(url, { params })
    .then((response) => {
      const pagina = normalizarPagina(response.data);
      return paginacao ? pagina : pagina.items;
    });
}

export function listarPedidosAtivos(mercadoId, paginacao = null) {
  return listarPedidos("/pedidos/ativos", mercadoId, paginacao);
}

export function listarPedidosHistorico(mercadoId, paginacao = null) {
  return listarPedidos("/pedidos/historico", mercadoId, paginacao);
}

export function excluirPedido(pedidoId) {
  return api.delete(`/pedidos/${pedidoId}`);
}

export function registrarPagamento(pedidoId, valor) {
  return api.patch(`/pedidos/${pedidoId}/pagamento?valor=${valor}`, {});
}

export function removerItemPedido(pedidoId, itemId) {
  return api.delete(`/pedidos/${pedidoId}/itens/${itemId}`);
}

export function criarPedido(dados) {
  return api.post("/pedidos", dados).then((response) => response.data);
}
