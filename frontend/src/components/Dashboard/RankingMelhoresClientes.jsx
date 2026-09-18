import { ContentCard } from "../ContentCard";
import { formatarMoeda } from "../../utils/formatters";

export function RankingMelhoresClientes({ melhoresClientes }) {
  return (
    <ContentCard
      title="Melhores Clientes"
      subtitle="Lista dos clientes mais lucrativos"
    >
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        {melhoresClientes.map((c, i) => (
          <div
            key={c.id}
            className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0 gap-2"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-green-100 text-[#007d43] border border-green-300 flex items-center justify-center text-[13px] font-bold shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {c.nome}
                </p>
                <p className="text-[11px] text-gray-400 font-medium truncate">
                  {c.totalPedidos} pedidos no total
                </p>
              </div>
            </div>
            <div className="text-right shrink-0 whitespace-nowrap">
              <p className="text-sm font-bold text-gray-800">
                {formatarMoeda(c.valorTotal)}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">
                em compras
              </p>
            </div>
          </div>
        ))}
      </div>
    </ContentCard>
  );
}
