export function FiltroPeriodo({ periodos, periodoAtivo, onSelecionar }) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {periodos.map((p) => (
        <button
          key={p}
          onClick={() => onSelecionar(p)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            periodoAtivo === p
              ? "bg-[#00a859] text-white border-[#00a859]"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
