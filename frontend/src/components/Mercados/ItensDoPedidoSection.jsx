import { TrilhaNavegacao } from "./TrilhaNavegacao";
import { ContentCard } from "../ContentCard";
import { ItensPedidoLista } from "./ItensPedidoLista";
import { formatarData, formatarMoeda } from "../../utils/formatters";

export function ItensDoPedidoSection({
  pedido,
  trilhaNavegacao,
  onVoltarPelaTrilha,
  onExcluirItem,
}) {
  return (
    <div className="animate-in fade-in duration-300 flex flex-col flex-1 min-h-0 pb-4 overflow-hidden">
      <TrilhaNavegacao
        texto={trilhaNavegacao}
        onVoltar={onVoltarPelaTrilha}
        ariaLabel="Voltar para Pedidos"
      />

      <div className="shrink-0 mb-4">
        <h1 className="text-3xl font-semibold text-gray-800">
          Detalhes do Pedido (#{pedido.id})
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          Data de Solicitação - {formatarData(pedido.data)}
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <ContentCard
          title="Itens do Pedido"
          count={pedido.itens?.length || 0}
          subtitle="Produtos incluídos no pedido do cliente"
          filters={
            <div className="px-4 py-2 border-2 border-[#00a859] text-[#00a859] font-bold rounded-lg text-sm bg-white">
              TOTAL: {formatarMoeda(pedido.valorTotal)}
            </div>
          }
        >
          <ItensPedidoLista itens={pedido.itens || []} onExcluirItem={onExcluirItem} />
        </ContentCard>
      </div>
    </div>
  );
}
