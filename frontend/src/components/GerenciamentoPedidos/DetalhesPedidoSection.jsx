import { Printer } from "lucide-react";
import { Button } from "../Button";
import { ContentCard } from "../ContentCard";
import { TrilhaNavegacao } from "../Mercados/TrilhaNavegacao";
import { ItensPedidoGerenciamento } from "./ItensPedidoGerenciamento";
import { formatarMoeda } from "../../utils/formatters";

export function DetalhesPedidoSection({
  pedido,
  trilhaNavegacao,
  onVoltarParaLista,
  mostrarAcoesItem,
  onExcluirItem,
}) {
  return (
    <div className="animate-in fade-in duration-300 flex flex-col flex-1 min-h-0 pb-4 overflow-hidden">
      <TrilhaNavegacao
        texto={trilhaNavegacao}
        onVoltar={onVoltarParaLista}
        ariaLabel="Voltar para Pedidos"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            {pedido.mercado.nome}
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Data de Solicitação - {pedido.data}
          </p>
        </div>
        <Button variant="primary" icon={Printer}>
          Imprimir
        </Button>
      </div>

      <div className="flex-1 min-h-0 pr-2">
        <ContentCard
          title={`Itens do Pedido (${pedido.itens?.length || 0})`}
          subtitle="Produtos incluídos no pedido do cliente"
          filters={
            <div className="px-4 py-2 border-2 border-[#00a859] text-[#00a859] font-bold rounded-lg text-sm bg-white">
              TOTAL: {formatarMoeda(pedido.valorTotal)}
            </div>
          }
        >
          <ItensPedidoGerenciamento
            itens={pedido.itens}
            mostrarAcoes={mostrarAcoesItem}
            onExcluirItem={onExcluirItem}
          />
        </ContentCard>
      </div>
    </div>
  );
}
