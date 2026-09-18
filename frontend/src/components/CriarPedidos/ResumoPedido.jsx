import { ShoppingCart, Trash2, Minus, Plus, X } from "lucide-react";
import { formatarMoeda } from "../../utils/formatters";

export function ResumoPedido({
  carrinho,
  totalGeral,
  totalItens,
  onLimparCarrinho,
  onRemoverItem,
  onAtualizarQtd,
  onLancarPedido,
}) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-6 flex flex-col h-136 max-h-136 shadow-sm">
        <div className="flex items-center justify-between mb-5 pb-4 ">
          <div className="flex items-center gap-2.5">
            <ShoppingCart size={22} className="text-gray-800 mr-1" strokeWidth={2.5} />
            <h2 className="text-xl font-semibold text-gray-800">Resumo do Pedido</h2>
          </div>
          {carrinho.length > 0 && (
            <button
              onClick={onLimparCarrinho}
              className="bg-red-600 text-white font-semibold text-[11px] uppercase px-2.5 py-1.5 rounded-md flex items-center justify-center gap-1 hover:bg-red-700 transition-colors cursor-pointer"
            >
              <Trash2 size={14} /> Limpar
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-1 max-h-80 custom-scrollbar">
          {carrinho.length === 0 ? (
            <div className="h-full flex items-center justify-center py-16">
              <p className="text-center text-sm font-normal text-gray-400">
                Nenhum item adicionado.
              </p>
            </div>
          ) : (
            carrinho.map((item) => (
              <div
                key={item.id}
                className="relative group p-3 border border-gray-200 bg-white rounded-xl mb-3 flex flex-col justify-between"
              >
                <button
                  onClick={() => onRemoverItem(item.id)}
                  className="absolute top-2.5 right-2.5 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <X size={20} className="cursor-pointer" />
                </button>

                <div className="pr-7 w-full">
                  <div className="flex items-center gap-2 mb-1 w-full">
                    <h4 className="text-[16px] font-semibold text-gray-800 truncate min-w-0">
                      {item.nome}
                    </h4>
                    <span
                      className={`font-medium px-1.5 py-1 rounded text-[10px] min-w-fit ${item.tipoProduto === "PRE_LAVADO" ? "bg-[#00a859] text-white" : "bg-gray-200 text-gray-500"}`}
                    >
                      {item.tipoProduto === "PRE_LAVADO" ? "Pré-Lavado" : "Não Lavado"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed border-gray-200">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onAtualizarQtd(item.id, -1)}
                      className="w-5 h-5 flex items-center justify-center border border-gray-400 rounded text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-xs font-bold text-center text-gray-700 bg-gray-100 py-1 px-1.5 rounded w-max">
                      {item.qtd}
                    </span>
                    <button
                      onClick={() => onAtualizarQtd(item.id, 1)}
                      className="w-5 h-5 flex items-center justify-center border border-gray-400 rounded text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">
                    {formatarMoeda(item.preco * (Number(item.qtd) || 0))}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t-2 border-gray-200 pt-4 mt-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Total de itens:</span>
            <span className="font-bold text-gray-700">{totalItens}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-800">Total</span>
            <span className="text-lg font-extrabold text-[#10b981]">
              {formatarMoeda(totalGeral)}
            </span>
          </div>
          <button
            onClick={onLancarPedido}
            className="w-full bg-[#1f2937] hover:bg-black text-white py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-[0.99] cursor-pointer"
          >
            Lançar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
