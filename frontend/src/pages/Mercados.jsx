import { useMercadosPageState } from "../hooks/useMercadosPageState";
import { ClientesSection } from "../components/Mercados/ClientesSection";
import { PedidosDoMercadoSection } from "../components/Mercados/PedidosDoMercadoSection";
import { ItensDoPedidoSection } from "../components/Mercados/ItensDoPedidoSection";
import { MercadoFormModal } from "../components/Mercados/MercadoFormModal";
import { EnderecoModal } from "../components/Mercados/EnderecoModal";
import { ExcluirClienteModal } from "../components/Mercados/ExcluirClienteModal";
import { PagamentoModal } from "../components/Mercados/PagamentoModal";
import { ExcluirPedidoModal } from "../components/Mercados/ExcluirPedidoModal";
import { ExcluirItemModal } from "../components/Mercados/ExcluirItemModal";

export function Mercados() {
  const {
    viewMode,
    trilhaNavegacao,
    handleVoltarPelaTrilha,
    abrirPedidosDoMercado,
    abrirItensDoPedido,

    mercadosFiltrados,
    filtroAtivo,
    onFiltrarPorTipo,

    mercadoEmFoco,
    pedidosDaAba,
    carregandoPedidos,
    abaPedidosAtiva,
    selecionarAba,
    pedidosSelecionados,
    todosPedidosSelecionados,
    alternarSelecaoPedido,
    alternarSelecaoTodosPedidos,
    handleExportarPedidos,

    pedidoSelecionado,

    modalAtivo,
    mercadoSelecionado,
    itemSelecionado,
    valorPago,
    onChangeValorPago,
    formData,
    onChangeCampoForm,
    onChangeCep,
    abrirModal,
    fecharModal,
    handleSalvar,
    handleExcluir,
    handleExcluirPedido,
    handleRegistrarPagamento,
    handleRemoverItemPedido,

    endereco,
    loadingEndereco,
  } = useMercadosPageState();

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {viewMode === "clientes" && (
        <ClientesSection
          mercados={mercadosFiltrados}
          filtroAtivo={filtroAtivo}
          onFiltrar={onFiltrarPorTipo}
          onAdicionar={() => abrirModal("add")}
          onAbrirPedidos={abrirPedidosDoMercado}
          onEditar={(mercado) => abrirModal("edit", mercado)}
          onVerEndereco={(mercado) => abrirModal("viewAddress", mercado)}
          onExcluir={(mercado) => abrirModal("delete", mercado)}
        />
      )}

      {viewMode === "pedidos" && mercadoEmFoco && (
        <PedidosDoMercadoSection
          mercadoEmFoco={mercadoEmFoco}
          trilhaNavegacao={trilhaNavegacao}
          onVoltarPelaTrilha={handleVoltarPelaTrilha}
          abaAtiva={abaPedidosAtiva}
          onSelecionarAba={selecionarAba}
          pedidos={pedidosDaAba}
          carregando={carregandoPedidos}
          pedidosSelecionados={pedidosSelecionados}
          todosSelecionados={todosPedidosSelecionados}
          onAbrirItens={abrirItensDoPedido}
          onAlternarSelecao={alternarSelecaoPedido}
          onAlternarSelecaoTodos={alternarSelecaoTodosPedidos}
          onAbrirPagamento={(pedido) => abrirModal("pagamento", pedido)}
          onAbrirExclusao={(pedido) => abrirModal("deletePedido", pedido)}
          onExportar={handleExportarPedidos}
        />
      )}

      {viewMode === "itens" && pedidoSelecionado && (
        <ItensDoPedidoSection
          pedido={pedidoSelecionado}
          trilhaNavegacao={trilhaNavegacao}
          onVoltarPelaTrilha={handleVoltarPelaTrilha}
          onExcluirItem={(item) => abrirModal("deleteItem", item)}
        />
      )}

      <MercadoFormModal
        isOpen={modalAtivo === "add" || modalAtivo === "edit"}
        isEdicao={modalAtivo === "edit"}
        formData={formData}
        onChangeCampo={onChangeCampoForm}
        onChangeCep={onChangeCep}
        endereco={endereco}
        loadingEndereco={loadingEndereco}
        onClose={fecharModal}
        onSalvar={handleSalvar}
      />

      <EnderecoModal
        isOpen={modalAtivo === "viewAddress"}
        onClose={fecharModal}
        endereco={endereco}
        loadingEndereco={loadingEndereco}
        numeroMercado={mercadoSelecionado?.numero}
      />

      <ExcluirClienteModal
        isOpen={modalAtivo === "delete"}
        mercado={mercadoSelecionado}
        onClose={fecharModal}
        onConfirmar={handleExcluir}
      />

      <PagamentoModal
        isOpen={modalAtivo === "pagamento"}
        pedido={pedidoSelecionado}
        valorPago={valorPago}
        onChangeValorPago={onChangeValorPago}
        onClose={fecharModal}
        onConfirmar={handleRegistrarPagamento}
      />

      <ExcluirPedidoModal
        isOpen={modalAtivo === "deletePedido"}
        pedido={pedidoSelecionado}
        onClose={fecharModal}
        onConfirmar={handleExcluirPedido}
      />

      <ExcluirItemModal
        isOpen={modalAtivo === "deleteItem"}
        item={itemSelecionado}
        onClose={fecharModal}
        onConfirmar={handleRemoverItemPedido}
      />
    </div>
  );
}
