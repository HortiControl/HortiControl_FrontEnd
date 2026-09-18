import { Minus, Plus } from "lucide-react";
import { EmbalagemBadge } from "./EmbalagemBadge";
import { formatarMoeda } from "../../utils/formatters";

export function CardProdutoMobile({
  produto,
  quantidade,
  onChangeQuantidade,
  onBlurQuantidade,
  onIncrementar,
  onDecrementar,
}) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="truncate text-base font-semibold text-gray-800">
            {produto.nome}
          </h4>
          <p className="mt-1 text-sm text-[#10b981] font-semibold">
            {formatarMoeda(produto.preco)}
          </p>
        </div>
        <EmbalagemBadge embalagem={produto.embalagem || produto.tipoEmbalagem} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onDecrementar}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <Minus size={14} />
          </button>
          <input
            type="text"
            inputMode="numeric"
            className="h-8 w-14 rounded-md border border-gray-200 bg-[#f8f9fa] text-center text-sm font-medium text-gray-700 outline-none"
            value={quantidade}
            onChange={(e) => onChangeQuantidade(e.target.value)}
            onBlur={onBlurQuantidade}
          />
          <button
            onClick={onIncrementar}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
