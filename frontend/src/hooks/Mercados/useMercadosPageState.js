import { useState } from "react";
import { useMercados } from "./useMercados";
import { usePedidosDoMercado } from "./usePedidosDoMercado";
import { useEnderecoCep } from "./useEnderecoCep";
import { useLockBodyScroll } from "../useLockBodyScroll";

const FORM_DATA_INICIAL = { nome: "", tipo: "NORMAL", cep: "", numero: "" };

/**
 * Orquestra toda a regra de negócio e o estado da tela de Clientes/Mercados,
 * compondo os hooks especializados de mercados, pedidos e endereço (CEP).
 */
export function useMercadosPageState() {
  useLockBodyScroll();

  const mercados = useMercados();
  const endereco = useEnderecoCep();

  const [viewMode, setViewMode] = useState("clientes");
  const [modalAtivo, setModalAtivo] = useState(null);
  const [mercadoSelecionado, setMercadoSelecionado] = useState(null);
  const [mercadoEmFoco, setMercadoEmFoco] = useState(null);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [valorPago, setValorPago] = useState(0);
  const [formData, setFormData] = useState(FORM_DATA_INICIAL);

  const pedidos = usePedidosDoMercado(mercadoEmFoco?.id ?? null);

  const abrirModal = (tipo, alvo = null) => {
    setModalAtivo(tipo);

    if ((tipo === "edit" || tipo === "viewAddress" || tipo === "delete") && alvo) {
      setMercadoSelecionado(alvo);
    }

    if (tipo === "edit" && alvo) {
      setFormData({
        nome: alvo.nome,
        tipo: alvo.tipo,
        cep: alvo.cep || "",
        numero: alvo.numero,
      });
    }
    if (tipo === "viewAddress" && alvo) {
      endereco.buscarEnderecoPorCep(alvo.cep);
    }

    if (tipo === "add") {
      setFormData(FORM_DATA_INICIAL);
    }

    if (tipo === "pagamento" && alvo) {
      setPedidoSelecionado(alvo);
      setValorPago(alvo.valorAPagar || 0);
    }

    if (tipo === "deletePedido" && alvo) {
      setPedidoSelecionado(alvo);
    }

    if (tipo === "deleteItem" && alvo) {
      setItemSelecionado(alvo);
    }
  };

  const fecharModal = () => {
    endereco.limparEndereco();
    setModalAtivo(null);
    setMercadoSelecionado(null);
    setPedidoSelecionado((prev) => (viewMode === "itens" ? prev : null));
    setItemSelecionado(null);
    setValorPago(0);
  };

  const handleAlterarCep = (cep) => {
    setFormData((prev) => ({ ...prev, cep }));
    endereco.buscarEnderecoPorCep(cep);
  };

  const handleAlterarCampoForm = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSalvar = async () => {
    const sucesso = await mercados.salvarMercado(
      formData,
      modalAtivo === "edit" ? mercadoSelecionado?.id : null,
    );
    if (sucesso) fecharModal();
  };

  const handleExcluir = async () => {
    if (!mercadoSelecionado) return;
    const sucesso = await mercados.removerMercado(mercadoSelecionado.id);
    if (sucesso) fecharModal();
  };

  const abrirPedidosDoMercado = (mercado) => {
    setMercadoEmFoco(mercado);
    setViewMode("pedidos");
  };

  const voltarParaClientes = () => {
    setViewMode("clientes");
    setMercadoEmFoco(null);
    setPedidoSelecionado(null);
  };

  const abrirItensDoPedido = (pedido) => {
    setPedidoSelecionado(pedido);
    setViewMode("itens");
  };

  const voltarParaPedidos = () => {
    setViewMode("pedidos");
    setPedidoSelecionado(null);
    setItemSelecionado(null);
  };

  const handleVoltarPelaTrilha = () => {
    if (viewMode === "itens") {
      voltarParaPedidos();
      return;
    }
    if (viewMode === "pedidos") {
      voltarParaClientes();
    }
  };

  const trilhaNavegacao =
    viewMode === "clientes"
      ? "Clientes"
      : viewMode === "pedidos"
        ? "Clientes > Pedidos"
        : "Clientes > Pedidos > Itens do Pedido";

  const handleExcluirPedido = async () => {
    const sucesso = await pedidos.handleExcluirPedido(pedidoSelecionado);
    if (!sucesso) return;

    if (viewMode === "itens") voltarParaPedidos();
    fecharModal();
  };

  const handleRegistrarPagamento = async () => {
    const sucesso = await pedidos.handleRegistrarPagamento(
      pedidoSelecionado,
      valorPago,
    );
    if (sucesso) fecharModal();
  };

  const handleRemoverItemPedido = async () => {
    const resultado = await pedidos.handleRemoverItemPedido(
      pedidoSelecionado,
      itemSelecionado,
    );
    if (!resultado.sucesso) return;

    fecharModal();

    if (resultado.pedidoEncerrado) {
      voltarParaPedidos();
      return;
    }

    if (resultado.pedidoAtualizado) {
      setPedidoSelecionado(resultado.pedidoAtualizado);
    }
  };

  return {
    // navegação entre sub-telas (clientes -> pedidos -> itens)
    viewMode,
    trilhaNavegacao,
    handleVoltarPelaTrilha,
    abrirPedidosDoMercado,
    voltarParaClientes,
    abrirItensDoPedido,
    voltarParaPedidos,

    // listagem/filtro de clientes
    mercadosFiltrados: mercados.mercadosFiltrados,
    filtroAtivo: mercados.filtroAtivo,
    onFiltrarPorTipo: mercados.setFiltroAtivo,

    // pedidos do cliente em foco
    mercadoEmFoco,
    pedidosDaAba: pedidos.pedidosDaAba,
    carregandoPedidos: pedidos.carregandoPedidos,
    abaPedidosAtiva: pedidos.abaPedidosAtiva,
    selecionarAba: pedidos.selecionarAba,
    pedidosSelecionados: pedidos.pedidosSelecionados,
    todosPedidosSelecionados: pedidos.todosPedidosSelecionados,
    alternarSelecaoPedido: pedidos.alternarSelecaoPedido,
    alternarSelecaoTodosPedidos: pedidos.alternarSelecaoTodosPedidos,
    handleExportarPedidos: pedidos.handleExportarPedidos,

    // itens do pedido selecionado
    pedidoSelecionado,

    // modais e formulário
    modalAtivo,
    mercadoSelecionado,
    itemSelecionado,
    valorPago,
    onChangeValorPago: setValorPago,
    formData,
    onChangeCampoForm: handleAlterarCampoForm,
    onChangeCep: handleAlterarCep,
    abrirModal,
    fecharModal,
    handleSalvar,
    handleExcluir,
    handleExcluirPedido,
    handleRegistrarPagamento,
    handleRemoverItemPedido,

    // endereço (CEP)
    endereco: endereco.endereco,
    loadingEndereco: endereco.loadingEndereco,
  };
}
