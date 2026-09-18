import { useGerenciamentoPedidosPageState } from "../hooks/useGerenciamentoPedidosPageState";
import { PageHeader } from "../components/PageHeader";
import { ContentCard } from "../components/ContentCard";
import { PagamentoModal } from "../components/Mercados/PagamentoModal";
import { AbasPedidosGlobais } from "../components/GerenciamentoPedidos/AbasPedidosGlobais";
import { PedidosAtivosLista } from "../components/GerenciamentoPedidos/PedidosAtivosLista";
import { PedidosFinalizadosLista } from "../components/GerenciamentoPedidos/PedidosFinalizadosLista";
import { DetalhesPedidoSection } from "../components/GerenciamentoPedidos/DetalhesPedidoSection";
import { ExcluirPedidoModal } from "../components/GerenciamentoPedidos/ExcluirPedidoModal";
import { ExcluirItemModal } from "../components/GerenciamentoPedidos/ExcluirItemModal";

export function GerenciamentoPedidos() {
  const {
    abaAtiva,
    onSelecionarAba,
    viewMode,
    trilhaNavegacao,

    pedidosAtivosData,
    finalizadosData,
    tamanhoFinalizado,

    pedidoSelecionado,
    itemSelecionado,
    modalAtivo,
    valorPago,
    onChangeValorPago,

    abrirDetalhes,
    voltarParaLista,
    abrirModal,
    abrirModalItem,
    fecharModal,
    handleExcluir,
    handleRemoverItem,
    handlePagarValor,
  } = useGerenciamentoPedidosPageState();

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {viewMode === "detalhes" && pedidoSelecionado ? (
        <DetalhesPedidoSection
          pedido={pedidoSelecionado}
          trilhaNavegacao={trilhaNavegacao}
          onVoltarParaLista={voltarParaLista}
          mostrarAcoesItem={abaAtiva === "ativos"}
          onExcluirItem={abrirModalItem}
        />
      ) : (
        <div className="animate-in fade-in duration-300 flex flex-col flex-1 min-h-0 pb-4 overflow-hidden">
          <div className="shrink-0">
            <PageHeader
              title="Gerenciamento de Pedidos"
              subtitle="Visualize e gerencie todos os pedidos do sistema"
            />
          </div>

          <AbasPedidosGlobais
            abaAtiva={abaAtiva}
            onSelecionarAba={onSelecionarAba}
            totalAtivos={pedidosAtivosData.length}
            totalFinalizados={tamanhoFinalizado}
          />

          <div className="flex-1 min-h-0 pr-1">
            {abaAtiva === "ativos" ? (
              <ContentCard
                title="Pedidos Ativos"
                subtitle="Pedidos em andamento que precisam de atenção"
                count={pedidosAtivosData.length}
              >
                <PedidosAtivosLista
                  pedidos={pedidosAtivosData}
                  onAbrirDetalhes={abrirDetalhes}
                  onAbrirPagamento={(pedido) => abrirModal("pagamento", pedido)}
                  onAbrirExclusao={(pedido) => abrirModal("delete", pedido)}
                />
              </ContentCard>
            ) : (
              <ContentCard
                title="Pedidos Finalizados"
                subtitle="Histórico de pedidos concluídos para consulta"
                count={tamanhoFinalizado}
              >
                <PedidosFinalizadosLista
                  pedidos={finalizadosData}
                  onAbrirDetalhes={abrirDetalhes}
                  onAbrirExclusao={(pedido) => abrirModal("delete", pedido)}
                />
              </ContentCard>
            )}
          </div>
        </div>
      )}

      <PagamentoModal
        isOpen={modalAtivo === "pagamento"}
        pedido={pedidoSelecionado}
        valorPago={valorPago}
        onChangeValorPago={onChangeValorPago}
        onClose={fecharModal}
        onConfirmar={handlePagarValor}
      />

      <ExcluirPedidoModal
        isOpen={modalAtivo === "delete"}
        pedido={pedidoSelecionado}
        onClose={fecharModal}
        onConfirmar={handleExcluir}
      />

      <ExcluirItemModal
        isOpen={modalAtivo === "deleteItem"}
        item={itemSelecionado}
        onClose={fecharModal}
        onConfirmar={handleRemoverItem}
      />
    </div>
  );
}
