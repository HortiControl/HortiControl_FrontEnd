import { Search, RefreshCw } from "lucide-react";
import { Button } from "../Button";

export function BuscaEReajustePrecos({ busca, onChangeBusca, onAbrirReajuste }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
      <div className="relative flex items-center w-full sm:w-64">
        <Search size={16} className="absolute left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome..."
          className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-md text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
          value={busca}
          onChange={(e) => onChangeBusca(e.target.value)}
        />
      </div>
      <Button variant="primary" icon={RefreshCw} onClick={onAbrirReajuste}>
        Reajustar Preços
      </Button>
    </div>
  );
}
