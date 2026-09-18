import { DollarSign, Trash2 } from "lucide-react";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { Table } from "../Table";
import { formatarData, formatarMoeda } from "../../utils/formatters";

export function PedidosLista({
  pedidos,
  carregando,
  abaAtiva,
  pedidosSelecionados,
  todosSelecionados,
  onAbrirItens,
  onAlternarSelecao,
  onAlternarSelecaoTodos,
  onAbrirPagamento,
  onAbrirExclusao,
}) {
  return (
    <div className="w-full max-h-[calc(100vh-22rem)] overflow-y-auto pr-2 pb-4">
      {carregando && pedidos.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-500">
          Carregando pedidos...
        </p>
      )}

      <div className="space-y-3 md:hidden">
        {pedidos.map((pedido) => {
          const selecionado = pedidosSelecionados.includes(pedido.id);
          return (
            <article
              key={pedido.id}
              onClick={() => onAbrirItens(pedido)}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selecionado}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => onAlternarSelecao(pedido.id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#00a859] focus:ring-[#00a859]/30"
                  />
                  <div>
                    <h3 className="truncate text-base font-semibold text-gray-800">
                      #{pedido.id}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatarData(pedido.data)}
                    </p>
                  </div>
                </div>
                <Badge text={pedido.statusPedido} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">
                    Valor Total
                  </p>
                  <p className="font-bold text-[#00a859]">
                    {formatarMoeda(pedido.valorTotal)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium uppercase text-gray-400">
                    A pagar
                  </p>
                  <p className="font-bold text-red-600">
                    {formatarMoeda(pedido.valorAPagar)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                {abaAtiva === "ativos" && (
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAbrirPagamento(pedido);
                    }}
                    className="min-h-0 border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <DollarSign size={14} /> Pagar
                  </Button>
                )}
                <Button
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAbrirExclusao(pedido);
                  }}
                  className="min-h-0 px-3 py-2 text-sm"
                >
                  <Trash2 size={14} /> Excluir
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden md:block pr-1">
        <Table
          headers={[
            <input
              type="checkbox"
              checked={todosSelecionados}
              onChange={onAlternarSelecaoTodos}
              className="h-4 w-4 rounded border-gray-300 text-[#00a859] focus:ring-[#00a859]/30"
            />,
            "ID",
            "Data Solicitação",
            "Valor Total",
            "A pagar",
          ]}
        >
          {pedidos.map((pedido) => (
            <tr
              key={pedido.id}
              onClick={() => onAbrirItens(pedido)}
              className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
            >
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={pedidosSelecionados.includes(pedido.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => onAlternarSelecao(pedido.id)}
                  className="h-4 w-4 rounded border-gray-300 text-[#00a859] focus:ring-[#00a859]/30"
                />
              </td>
              <td className="px-6 py-4 font-medium text-gray-800">
                #{pedido.id}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {formatarData(pedido.data)}
              </td>
              <td className="px-6 py-4 font-bold text-[#00a859]">
                {formatarMoeda(pedido.valorTotal)}
              </td>
              <td className="px-6 py-4 font-bold text-red-600">
                {formatarMoeda(pedido.valorAPagar)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  {abaAtiva === "ativos" && (
                    <Button
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAbrirPagamento(pedido);
                      }}
                      className="min-h-0 border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <DollarSign size={14} /> Pagar
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAbrirExclusao(pedido);
                    }}
                    className="min-h-0 px-3 py-1.5 text-sm"
                  >
                    <Trash2 size={14} /> Excluir
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
