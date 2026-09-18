import { formatarData } from "./formatters";

export function formatarPedidoGerenciamento(pedido) {
  return {
    id: pedido.id,
    data: formatarData(pedido.dataSolicitacao),
    valorTotal: pedido.valorTotal,
    statusPedido: pedido.statusPedido,
    valorPago: pedido.valorPago,
    valorAPagar: pedido.valorAPagar,
    mercado: {
      nome: pedido.mercado.nome,
      tipo: pedido.mercado.tipoMercado,
    },
    itens: pedido.itens,
  };
}
