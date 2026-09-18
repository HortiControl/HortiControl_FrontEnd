import { Minus, Plus } from "lucide-react";
import { EmbalagemBadge } from "./EmbalagemBadge";
import { formatarMoeda } from "../../utils/formatters";

export function LinhaProdutoDesktop({
  produto,
  quantidade,
  onChangeQuantidade,
  onBlurQuantidade,
  onIncrementar,
  onDecrementar,
}) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
      <td className="py-4 text-sm font-medium text-gray-700">{produto.nome}</td>
      <td className="py-4">
        <EmbalagemBadge embalagem={produto.embalagem || produto.tipoEmbalagem} />
      </td>
      <td className="py-4 text-sm font-semibold text-[#10b981]">
        {formatarMoeda(produto.preco)}
      </td>
      <td className="py-4">
        <div className="flex items-center gap-1.5 justify-end">
          <button
            onClick={onDecrementar}
            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Minus size={14} />
          </button>
          <input
            type="text"
            inputMode="numeric"
            className="w-10 h-7 text-center text-sm font-medium text-gray-700 border border-gray-200 bg-[#f8f9fa] rounded-md outline-none"
            value={quantidade}
            onChange={(e) => onChangeQuantidade(e.target.value)}
            onBlur={onBlurQuantidade}
          />
          <button
            onClick={onIncrementar}
            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
