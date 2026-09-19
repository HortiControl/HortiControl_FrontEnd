import { useCallback, useEffect, useState } from "react";
import {
  listarPedidosAtivos,
  listarPedidosHistorico,
  excluirPedido,
  removerItemPedido,
  registrarPagamento,
} from "../../services/pedidosService";
import { formatarPedidoGerenciamento } from "../../utils/GerenciamentoPedidos/pedidoGerenciamentoMappers";
import { useLockBodyScroll } from "../useLockBodyScroll";
import { useNotification } from "../../components/notifications/NotificationContext";

/** Orquestra estado e regra de negócio da tela de Gerenciamento de Pedidos. */
export function useGerenciamentoPedidosPageState() {
  useLockBodyScroll();

  const notify = useNotification();

  const [abaAtiva, setAbaAtiva] = useState("ativos");
  const [viewMode, setViewMode] = useState("lista");

  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalAtivo, setModalAtivo] = useState(null);

  const [pedidosAtivosData, setPedidosAtivosData] = useState([]);
  const [finalizadosData, setFinalizadosData] = useState([]);
  const [tamanhoFinalizado, setTamanhoFinalizado] = useState(null);
  const [valorPago, setValorPago] = useState(0);

  const carregarPedidosAtivos = useCallback(() => {
    listarPedidosAtivos()
      .then((data) => {
        if (data.length === 0) {
          setPedidosAtivosData([]);
          return;
        }

        const pedidosAtivosFormatado = data
          .map(formatarPedidoGerenciamento)
          .sort((a, b) => b.id - a.id);

        setPedidosAtivosData(pedidosAtivosFormatado);
      })
      .catch((error) => {
        console.error("Erro ao carregar pedidos ativos:", error);
        notify.error("Não foi possível carregar os pedidos ativos.");
      });
  }, [notify]);

  const carregarPedidosFinalizados = useCallback(() => {
    listarPedidosHistorico()
      .then((data) => {
        if (data.length === 0) {
          setFinalizadosData([]);
          setTamanhoFinalizado(0);
          return;
        }

        const finalizadosFormatado = data
          .map(formatarPedidoGerenciamento)
          .sort((a, b) => b.id - a.id);

        setFinalizadosData(finalizadosFormatado);
        setTamanhoFinalizado(finalizadosFormatado.length);
      })
      .catch((error) => {
        console.error("Erro ao carregar pedidos finalizados:", error);
        notify.error("Não foi possível carregar o histórico de pedidos.");
      });
  }, [notify]);

  useEffect(() => {
    carregarPedidosAtivos();
    carregarPedidosFinalizados();
  }, [carregarPedidosAtivos, carregarPedidosFinalizados]);

  const abrirDetalhes = (pedido) => {
    setPedidoSelecionado(pedido);
    setViewMode("detalhes");
  };

  const voltarParaLista = () => {
    setViewMode("lista");
    setPedidoSelecionado(null);
  };

  const abrirModal = (tipo, pedido) => {
    setPedidoSelecionado(pedido);
    setModalAtivo(tipo);
  };

  const abrirModalItem = (item) => {
    setItemSelecionado(item);
    setModalAtivo("deleteItem");
  };

  const fecharModal = () => {
    setModalAtivo(null);
  };

  const handleExcluir = async () => {
    if (!pedidoSelecionado) return;

    try {
      await excluirPedido(pedidoSelecionado.id);

      if (abaAtiva === "ativos") {
        setPedidosAtivosData((prev) =>
          prev.filter((pedido) => pedido.id !== pedidoSelecionado.id),
        );
      } else {
        setFinalizadosData((prev) =>
          prev.filter((pedido) => pedido.id !== pedidoSelecionado.id),
        );
      }

      if (viewMode === "detalhes") {
        voltarParaLista();
      }

      notify.success("Pedido excluído com sucesso.");

      carregarPedidosAtivos();
      carregarPedidosFinalizados();
      fecharModal();
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
      notify.error("Não foi possível excluir o pedido. Tente novamente.");
    }
  };

  const handleRemoverItem = async () => {
    if (!itemSelecionado) return;

    try {
      await removerItemPedido(pedidoSelecionado.id, itemSelecionado.id);

      const itensRestantes = pedidoSelecionado.itens.filter(
        (item) => item.id !== itemSelecionado.id,
      );

      if (itensRestantes.length === 0) {
        notify.info("Último item removido. O pedido foi encerrado no sistema.");
        voltarParaLista();
      } else {
        const novoValorTotal = itensRestantes.reduce(
          (acc, item) => acc + Number(item.subTotal),
          0,
        );

        setPedidoSelecionado({
          ...pedidoSelecionado,
          itens: itensRestantes,
          valorTotal: novoValorTotal,
        });

        notify.success("Item removido com sucesso.");
      }

      carregarPedidosAtivos();
      carregarPedidosFinalizados();
      fecharModal();
    } catch (error) {
      console.error("Erro ao remover item:", error);
      notify.error("Não foi possível remover o item do pedido.");
    }
  };

  const handlePagarValor = async () => {
    const valorInformadoNum = parseFloat(String(valorPago).replace(",", "."));
    const valorAPagarNum = parseFloat(pedidoSelecionado.valorAPagar);

    if (valorInformadoNum > valorAPagarNum) {
      notify.warning("O valor informado é maior que o valor restante a pagar.");
      return;
    }

    if (isNaN(valorInformadoNum) || valorInformadoNum <= 0) {
      notify.warning("Insira um valor válido para continuar.");
      return;
    }

    try {
      await registrarPagamento(pedidoSelecionado.id, valorInformadoNum);

      if (valorInformadoNum === valorAPagarNum) {
        notify.success("Pagamento concluído com sucesso.");
      } else {
        notify.success("Pagamento registrado com sucesso.");
      }

      carregarPedidosAtivos();
      carregarPedidosFinalizados();
      fecharModal();
      setValorPago(0);
    } catch (error) {
      console.error("Erro ao atualizar valor pago do pedido: ", error);
      notify.error(
        "Não foi possível atualizar o pagamento. Verifique os dados.",
      );
    }
  };

  const trilhaNavegacao =
    viewMode === "lista" ? "Pedidos" : "Pedidos > Itens do Pedido";

  return {
    abaAtiva,
    onSelecionarAba: setAbaAtiva,
    viewMode,
    trilhaNavegacao,

    pedidosAtivosData,
    finalizadosData,
    tamanhoFinalizado,

    pedidoSelecionado,
    itemSelecionado,
    modalAtivo,
    valorPago,
    onChangeValorPago: setValorPago,

    abrirDetalhes,
    voltarParaLista,
    abrirModal,
    abrirModalItem,
    fecharModal,
    handleExcluir,
    handleRemoverItem,
    handlePagarValor,
  };
}
