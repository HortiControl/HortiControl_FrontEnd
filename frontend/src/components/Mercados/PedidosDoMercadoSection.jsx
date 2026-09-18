import { Download } from "lucide-react";
import { Button } from "../Button";
import { ContentCard } from "../ContentCard";
import { TrilhaNavegacao } from "./TrilhaNavegacao";
import { AbasPedidos } from "./AbasPedidos";
import { PedidosLista } from "./PedidosLista";

export function PedidosDoMercadoSection({
  mercadoEmFoco,
  trilhaNavegacao,
  onVoltarPelaTrilha,
  abaAtiva,
  onSelecionarAba,
  pedidos,
  carregando,
  pedidosSelecionados,
  todosSelecionados,
  onAbrirItens,
  onAlternarSelecao,
  onAlternarSelecaoTodos,
  onAbrirPagamento,
  onAbrirExclusao,
  onExportar,
}) {
  return (
    <div className="animate-in fade-in duration-300 flex flex-col flex-1 min-h-0 pb-4 overflow-hidden">
      <TrilhaNavegacao
        texto={trilhaNavegacao}
        onVoltar={onVoltarPelaTrilha}
        ariaLabel="Voltar para Clientes"
      />

      <div className="shrink-0 mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Pedidos - {mercadoEmFoco.nome}
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Visualize e gerencie os pedidos do cliente
          </p>
        </div>
        <Button variant="primary" onClick={onExportar} className="w-full sm:w-auto">
          <Download size={16} />
          {pedidosSelecionados.length > 0
            ? `Exportar (${pedidosSelecionados.length} selecionado${pedidosSelecionados.length > 1 ? "s" : ""})`
            : "Exportar todos"}
        </Button>
      </div>

      <AbasPedidos abaAtiva={abaAtiva} onSelecionarAba={onSelecionarAba} />

      <div className="flex-1 min-h-0 pr-1">
        <ContentCard
          title={abaAtiva === "ativos" ? "Pedidos Ativos" : "Pedidos Finalizados"}
          subtitle={
            abaAtiva === "ativos"
              ? "Pedidos em andamento que precisam de atenção"
              : "Histórico de pedidos finalizados para consulta"
          }
          count={pedidos.length}
        >
          <PedidosLista
            pedidos={pedidos}
            carregando={carregando}
            abaAtiva={abaAtiva}
            pedidosSelecionados={pedidosSelecionados}
            todosSelecionados={todosSelecionados}
            onAbrirItens={onAbrirItens}
            onAlternarSelecao={onAlternarSelecao}
            onAlternarSelecaoTodos={onAlternarSelecaoTodos}
            onAbrirPagamento={onAbrirPagamento}
            onAbrirExclusao={onAbrirExclusao}
          />
        </ContentCard>
      </div>
    </div>
  );
}
