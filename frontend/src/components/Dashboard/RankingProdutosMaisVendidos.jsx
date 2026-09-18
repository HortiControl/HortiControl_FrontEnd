import { ContentCard } from "../ContentCard";
import { formatarTipoProduto } from "../../utils/formatters";

export function RankingProdutosMaisVendidos({ produtosMaisVendidos }) {
  return (
    <ContentCard
      title="Produtos mais vendidos"
      subtitle="Lista de produtos mais vendidos no período"
    >
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        {produtosMaisVendidos.map((p, i) => (
          <div
            key={p.id}
            className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0 gap-2"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-green-100 text-[#007d43] border border-green-300 flex items-center justify-center text-[13px] font-bold shrink-0">
                {i + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-gray-800 mb-1 truncate mr-4">
                  {p.nome}
                </p>
                <span
                  className={`inline-block text-[9px] font-semibold px-2 py-1.5 rounded-2xl uppercase ${
                    p.tipo === "PRE_LAVADO"
                      ? "bg-[#00a859] text-white border-[#00a859]"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {formatarTipoProduto(p.tipo)}
                </span>
              </div>
            </div>

            <div className="bg-gray-200 px-2 py-1 rounded text-[13px] font-semibold text-gray-700 shrink-0 whitespace-nowrap">
              {p.quantidadeVendida} unidades
            </div>
          </div>
        ))}
      </div>
    </ContentCard>
  );
}
