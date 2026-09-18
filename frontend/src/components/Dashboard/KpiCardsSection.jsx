import { DollarSign, Package, Inbox, Archive, ShoppingBag } from "lucide-react";
import { formatarMoeda } from "../../utils/formatters";

export function KpiCardsSection({ dados }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-6">
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-xs">
            Faturado
          </p>
          <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">
            {formatarMoeda(dados.faturadoTotal)}
          </h3>
        </div>
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#00a859]">
          <DollarSign size={24} />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-xs">
            Total de Pedidos
          </p>
          <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">
            {dados.totalPedidos}
          </h3>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
          <Package size={24} />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-xs">
            Consumo de Embalagens
          </p>
        </div>
        <div className="flex flex-wrap justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-50 text-orange-600 flex items-center justify-center rounded border border-orange-100">
              <Inbox size={16} />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-orange-600 sm:text-[10px]">
                Bandejas
              </p>
              <p className="font-bold leading-none text-gray-800">
                {dados.consumoEmbalagens?.bandejas ?? 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 flex items-center justify-center rounded border border-blue-100">
              <Archive size={16} />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-blue-600 sm:text-[10px]">
                Potes
              </p>
              <p className="font-bold leading-none text-gray-800">
                {dados.consumoEmbalagens?.potes ?? 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-50 text-green-600 flex items-center justify-center rounded border border-green-100">
              <ShoppingBag size={16} />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-green-600 sm:text-[10px]">
                Sacos
              </p>
              <p className="font-bold leading-none text-gray-800">
                {dados.consumoEmbalagens?.sacos ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
