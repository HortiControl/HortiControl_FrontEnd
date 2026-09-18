import { ChevronDown, ChevronUp, Leaf } from "lucide-react";

export function SecaoSanfonaProdutos({
  id,
  titulo,
  produtos,
  isAberta,
  onToggle,
  mobileItems,
  children,
}) {
  const totalProdutos = produtos?.length || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 transition-colors hover:bg-gray-50/50 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${id === "pre_lavados" ? "bg-[#a7f1ce] text-[#097140]" : "bg-[#e1e1e2] text-gray-600"}`}
          >
            <Leaf size={22} />
          </div>
          <div className="text-left">
            <span className="text-base font-semibold text-gray-800 block leading-tight">
              {titulo}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {totalProdutos} produtos
            </span>
          </div>
        </div>
        {isAberta ? (
          <ChevronUp className="text-gray-400" size={20} />
        ) : (
          <ChevronDown className="text-gray-400" size={20} />
        )}
      </button>

      {isAberta && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 sm:px-6 max-h-60">
          <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            <div className="space-y-3 md:hidden">{mobileItems}</div>

            <table className="hidden w-full border-collapse text-left md:table">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 font-semibold">Produto</th>
                  <th className="py-3 font-semibold">Embalagem</th>
                  <th className="py-3 font-semibold">Preço</th>
                  <th className="py-3 font-semibold text-right pr-2">
                    Quantidade
                  </th>
                </tr>
              </thead>
              <tbody>{children}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
