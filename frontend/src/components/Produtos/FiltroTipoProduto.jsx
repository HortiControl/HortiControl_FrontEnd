export function FiltroTipoProduto({ filtroAtivo, onFiltrar }) {
  return (
    <div className="flex flex-col items-start gap-1 text-sm sm:items-end">
      <span className="mb-1 text-xs font-medium text-gray-500">
        Tipo de Produto
      </span>
      <div className="flex flex-wrap gap-2">
        {["TODOS", "PRÉ-LAVADO", "NÃO LAVADO"].map((f) => (
          <button
            key={f}
            onClick={() => onFiltrar(f)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              filtroAtivo === f
                ? "bg-[#00a859] text-white border-[#00a859]"
                : "bg-white text-gray-600 border-gray-400 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
