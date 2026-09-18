import { Trash2 } from "lucide-react";
import { Button } from "../Button";
import { Table } from "../Table";
import { formatarMoeda } from "../../utils/formatters";

export function ItensPedidoLista({ itens, onExcluirItem }) {
  return (
    <div className="w-full max-h-[calc(100dvh-20rem)] overflow-y-auto custom-scrollbar">
      <div className="space-y-3 md:hidden">
        {itens.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-gray-800">
                  {item.nomeProduto}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Unidades: {item.quantidade}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  item.tipoProduto === "PRE_LAVADO"
                    ? "bg-[#00a859] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {item.tipoProduto === "PRE_LAVADO" ? "Pré-Lavado" : "Não Lavado"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-medium uppercase text-gray-400">
                  Preço
                </p>
                <p className="font-semibold text-gray-800">
                  {formatarMoeda(item.precoUnitario)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium uppercase text-gray-400">
                  Total
                </p>
                <p className="font-semibold text-[#00a859]">
                  {formatarMoeda(item.subTotal)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="danger"
                onClick={() => onExcluirItem(item)}
                className="min-h-0 px-3 py-2 text-sm"
              >
                <Trash2 size={14} /> Excluir
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <Table headers={["Unidade", "Produto", "Tipo", "Preço", "Total"]}>
          {itens.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-100 transition-colors hover:bg-gray-50"
            >
              <td className="px-6 py-4 text-gray-800">{item.quantidade}</td>
              <td className="px-6 py-4 font-medium text-gray-800">
                {item.nomeProduto}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item.tipoProduto === "PRE_LAVADO"
                      ? "bg-[#00a859] text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {item.tipoProduto === "PRE_LAVADO" ? "Pré-Lavado" : "Não Lavado"}
                </span>
              </td>
              <td className="px-6 py-4 font-bold text-gray-800">
                {formatarMoeda(item.precoUnitario)}
              </td>
              <td className="px-6 py-4 font-bold text-[#00a859]">
                {formatarMoeda(item.subTotal)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end">
                  <Button
                    variant="danger"
                    onClick={() => onExcluirItem(item)}
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
