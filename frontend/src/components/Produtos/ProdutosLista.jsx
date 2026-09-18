import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "../Badge";
import { Table } from "../Table";
import { formatarMoeda } from "../../utils/formatters";

export function ProdutosLista({ produtos, onEditar, onExcluir }) {
  return (
    <div className="max-h-[calc(100vh-18rem)] overflow-y-auto pr-2">
      <div className="space-y-3 md:hidden">
        {produtos.map((produto) => (
          <article
            key={produto.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-gray-800">
                  {produto.nome}
                </h3>
                <p className="mt-1 text-sm text-[#00a859] font-bold">
                  {formatarMoeda(produto.preco)}
                </p>
              </div>
              <Badge text={produto.embalagem} />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  produto.tipo === "PRE_LAVADO"
                    ? "bg-[#00a859] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {produto.tipo === "PRE_LAVADO" ? "Pré-Lavado" : "Não Lavado"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                onClick={() => onEditar(produto)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Pencil size={14} /> Editar
              </button>
              <button
                onClick={() => onExcluir(produto)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-600 bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <Table headers={["Nome", "Tipo", "Embalagem", "Preço"]}>
          {produtos.map((produto) => (
            <tr
              key={produto.id}
              className="border-b border-gray-100 transition-colors hover:bg-gray-50"
            >
              <td className="px-6 py-4 font-medium text-gray-800">
                {produto.nome}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    produto.tipo === "PRE_LAVADO"
                      ? "bg-[#00a859] text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {produto.tipo === "PRE_LAVADO" ? "Pré-Lavado" : "Não Lavado"}
                </span>
              </td>

              <td className="px-6 py-4">
                <Badge text={produto.embalagem} />
              </td>

              <td className="px-6 py-4 text-[#00a859] font-bold">
                {formatarMoeda(produto.preco)}
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEditar(produto)}
                    className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Pencil size={14} /> Editar
                  </button>
                  <button
                    onClick={() => onExcluir(produto)}
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
