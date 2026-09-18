import api from "../provider/api";

export function listarPedidosAtivos(mercadoId) {
  return api
    .get("/pedidos/ativos", { params: { mercadoId } })
    .then((response) => response.data);
}

export function listarPedidosHistorico(mercadoId) {
  return api
    .get("/pedidos/historico", { params: { mercadoId } })
    .then((response) => response.data);
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
