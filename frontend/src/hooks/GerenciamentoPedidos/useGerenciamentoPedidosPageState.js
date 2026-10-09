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

const TAMANHO_PAGINA = 10;

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
  const [paginaAtivos, setPaginaAtivos] = useState(0);
  const [paginaFinalizados, setPaginaFinalizados] = useState(0);
  const [totalPaginasAtivos, setTotalPaginasAtivos] = useState(0);
  const [totalPaginasFinalizados, setTotalPaginasFinalizados] = useState(0);
  const [carregandoAtivos, setCarregandoAtivos] = useState(false);
  const [carregandoFinalizados, setCarregandoFinalizados] = useState(false);
  const [valorPago, setValorPago] = useState(0);

  const carregarPagina = useCallback(
    (tipo, pagina = 0) => {
      const setCarregando = tipo === "ativos"
        ? setCarregandoAtivos
        : setCarregandoFinalizados;
      setCarregando(true);

      const requisicao = tipo === "ativos"
        ? listarPedidosAtivos(undefined, { page: pagina, size: TAMANHO_PAGINA, sort: "dataSolicitacao,desc" })
        : listarPedidosHistorico(undefined, { page: pagina, size: TAMANHO_PAGINA, sort: "dataSolicitacao,desc" });

      return requisicao
        .then((data) => {
          const pedidosFormatados = (data?.items || [])
            .map(formatarPedidoGerenciamento)
            .sort((a, b) => b.id - a.id);
          if (tipo === "ativos") {
            setPedidosAtivosData(pedidosFormatados);
            setPaginaAtivos(data?.page ?? pagina);
            setTotalPaginasAtivos(data?.totalPages ?? 0);
          } else {
            setFinalizadosData(pedidosFormatados);
            setPaginaFinalizados(data?.page ?? pagina);
            setTamanhoFinalizado(data?.totalElements ?? pedidosFormatados.length);
            setTotalPaginasFinalizados(data?.totalPages ?? 0);
          }
        })
        .catch((error) => {
          console.error(`Erro ao carregar pedidos ${tipo}:`, error);
          notify.error(
            tipo === "ativos"
              ? "Não foi possível carregar os pedidos ativos."
              : "Não foi possível carregar o histórico de pedidos.",
          );
        })
        .finally(() => {
          setCarregando(false);
        });
    },
    [notify],
  );

  const irParaPaginaAtivos = useCallback(
    (pagina) => carregarPagina("ativos", pagina),
    [carregarPagina],
  );

  const irParaPaginaFinalizados = useCallback(
    (pagina) => carregarPagina("finalizados", pagina),
    [carregarPagina],
  );

  useEffect(() => {
    const carregamentoInicial = setTimeout(() => {
      irParaPaginaAtivos(0);
      irParaPaginaFinalizados(0);
    }, 0);
    return () => clearTimeout(carregamentoInicial);
  }, [irParaPaginaAtivos, irParaPaginaFinalizados]);

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

      irParaPaginaAtivos(paginaAtivos);
      irParaPaginaFinalizados(paginaFinalizados);
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

      irParaPaginaAtivos(paginaAtivos);
      irParaPaginaFinalizados(paginaFinalizados);
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

      irParaPaginaAtivos(paginaAtivos);
      irParaPaginaFinalizados(paginaFinalizados);
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
    carregandoAtivos,
    carregandoFinalizados,
    paginaAtivos,
    paginaFinalizados,
    totalPaginasAtivos,
    totalPaginasFinalizados,
    irParaPaginaAtivos,
    irParaPaginaFinalizados,

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
