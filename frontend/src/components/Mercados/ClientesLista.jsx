import { Pencil, MapPin, Trash2 } from "lucide-react";
import { Badge } from "../Badge";
import { Table } from "../Table";
import { formatarCEP } from "../../utils/formatters";

export function ClientesLista({
  mercados,
  onAbrirPedidos,
  onEditar,
  onVerEndereco,
  onExcluir,
}) {
  return (
    <div className="max-h-[calc(100vh-18rem)] overflow-y-auto pr-2 pb-4">
      <div className="space-y-3 md:hidden">
        {mercados.map((mercado) => (
          <article
            key={mercado.id}
            onClick={() => onAbrirPedidos(mercado)}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-gray-800">
                  {mercado.nome}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  CEP {formatarCEP(mercado.cep)}
                </p>
              </div>
              <Badge text={mercado.tipo} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditar(mercado);
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Pencil size={14} /> Editar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onVerEndereco(mercado);
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                <MapPin size={14} /> Endereço
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExcluir(mercado);
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-600 bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <Table headers={["Nome", "Tipo", "CEP"]}>
          {mercados.map((mercado) => (
            <tr
              key={mercado.id}
              onClick={() => onAbrirPedidos(mercado)}
              className="border-b border-gray-100 transition-colors hover:bg-gray-50"
            >
              <td className="px-6 py-4 font-medium text-gray-800">
                {mercado.nome}
              </td>
              <td className="px-6 py-4">
                <Badge text={mercado.tipo} />
              </td>
              <td className="px-6 py-4 text-gray-600">
                {formatarCEP(mercado.cep)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditar(mercado);
                    }}
                    className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Pencil size={14} /> Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onVerEndereco(mercado);
                    }}
                    className="flex items-center gap-1.5 rounded-md border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                  >
                    <MapPin size={14} /> Endereço
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onExcluir(mercado);
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
