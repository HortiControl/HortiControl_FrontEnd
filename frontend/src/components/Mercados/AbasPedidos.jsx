export function AbasPedidos({ abaAtiva, onSelecionarAba }) {
  return (
    <div className="flex bg-white rounded-full p-1 mb-3 border border-gray-200 shadow-sm w-full shrink-0">
      <button
        onClick={() => onSelecionarAba("ativos")}
        className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
          abaAtiva === "ativos"
            ? "bg-[#00a859] text-white shadow-sm"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        }`}
      >
        Pedidos Ativos
      </button>
      <button
        onClick={() => onSelecionarAba("finalizados")}
        className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
          abaAtiva === "finalizados"
            ? "bg-[#00a859] text-white shadow-sm"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        }`}
      >
        Finalizados
      </button>
    </div>
  );
}
