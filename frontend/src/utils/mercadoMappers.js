export function formatarMercadoDaApi(mercado) {
  return {
    id: mercado.id,
    nome: mercado.nome,
    tipo: mercado.tipoMercado || mercado.tipo || "NORMAL",
    cep: mercado.cep,
    numero: mercado.numero,
  };
}

export function formatarPedidoDaApi(pedido) {
  return {
    id: pedido.id,
    data: pedido.dataSolicitacao,
    valorTotal: pedido.valorTotal,
    valorPago: pedido.valorPago,
    valorAPagar: pedido.valorAPagar,
    statusPedido: pedido.statusPedido,
    mercado: {
      id: pedido.mercado?.id,
      nome: pedido.mercado?.nome,
      tipo: pedido.mercado?.tipoMercado,
    },
    itens: pedido.itens || [],
  };
}
