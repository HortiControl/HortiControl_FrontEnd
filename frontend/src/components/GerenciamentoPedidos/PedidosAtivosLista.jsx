import { DollarSign, Trash2 } from "lucide-react";
import { Badge } from "../Badge";
import { Table } from "../Table";
import { formatarMoeda } from "../../utils/formatters";

export function PedidosAtivosLista({
  pedidos,
  onAbrirDetalhes,
  onAbrirPagamento,
  onAbrirExclusao,
}) {
  return (
    <div className="w-full max-h-[calc(100dvh-320px)] overflow-y-auto custom-scrollbar">
      <div className="space-y-3 md:hidden">
        {pedidos.map((pedido) => (
          <article
            key={pedido.id}
            onClick={() => onAbrirDetalhes(pedido)}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-gray-800">
                  {pedido.mercado.nome}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{pedido.data}</p>
              </div>
              <Badge text={pedido.mercado.tipo} />
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAbrirPagamento(pedido);
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <DollarSign size={14} /> Pagar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAbrirExclusao(pedido);
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-red-600 bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <Table
          headers={["Cliente", "Tipo", "Data Solicitação", "Valor Total", "A pagar"]}
        >
          {pedidos.map((pedido) => (
            <tr
              key={pedido.id}
              onClick={() => onAbrirDetalhes(pedido)}
              className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
            >
              <td className="px-6 py-4 font-medium text-gray-800">
                {pedido.mercado.nome}
              </td>
              <td className="px-6 py-4">
                <Badge text={pedido.mercado.tipo} />
              </td>
              <td className="px-6 py-4 text-gray-600">{pedido.data}</td>
              <td className="px-6 py-4 font-bold text-[#00a859]">
                {formatarMoeda(pedido.valorTotal)}
              </td>
              <td className="px-6 py-4 font-bold text-red-600">
                {formatarMoeda(pedido.valorAPagar)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAbrirPagamento(pedido);
                    }}
                    className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <DollarSign size={14} /> Pagar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAbrirExclusao(pedido);
                    }}
                    className="flex items-center gap-1.5 rounded-md border border-red-600 bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    <Trash2 size={14} /> Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
