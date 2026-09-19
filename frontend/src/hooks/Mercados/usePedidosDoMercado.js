import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listarPedidosAtivos,
  listarPedidosHistorico,
  excluirPedido,
  registrarPagamento,
  removerItemPedido,
} from "../../services/pedidosService";
import { formatarPedidoDaApi } from "../../utils/mercadoMappers";
import { useNotification } from "../../components/notifications/NotificationContext";

/** Regra de negócio dos pedidos (ativos/finalizados) de um cliente. */
export function usePedidosDoMercado(mercadoId) {
  const notify = useNotification();
  const [pedidosPorMercado, setPedidosPorMercado] = useState({});
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);
  const [abaPedidosAtiva, setAbaPedidosAtiva] = useState("ativos");
  const [pedidosSelecionados, setPedidosSelecionados] = useState([]);

  const carregarPedidos = useCallback(
    (idAlvo) => {
      setCarregandoPedidos(true);

      return Promise.all([
        listarPedidosAtivos(idAlvo),
        listarPedidosHistorico(idAlvo),
      ])
        .then(([ativos, historico]) => {
          // 204 (sem conteúdo) chega com data vazio/não-array
          const listaAtivos = Array.isArray(ativos) ? ativos : [];
          const listaHistorico = Array.isArray(historico) ? historico : [];

          const pedidosFormatados = [...listaAtivos, ...listaHistorico]
            .map(formatarPedidoDaApi)
            .sort((a, b) => b.id - a.id);

          setPedidosPorMercado((prev) => ({
            ...prev,
            [idAlvo]: pedidosFormatados,
          }));

          return pedidosFormatados;
        })
        .catch((error) => {
          console.error("Erro ao carregar pedidos do cliente:", error);
          notify.error("Não foi possível carregar os pedidos deste cliente.");
          return [];
        })
        .finally(() => setCarregandoPedidos(false));
    },
    [notify],
  );

  useEffect(() => {
    if (!mercadoId) return;
    setAbaPedidosAtiva("ativos");
    setPedidosSelecionados([]);
    carregarPedidos(mercadoId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mercadoId]);

  const pedidosDoMercado = useMemo(() => {
    if (!mercadoId) return [];
    return pedidosPorMercado[mercadoId] || [];
  }, [mercadoId, pedidosPorMercado]);

  const pedidosAtivos = useMemo(
    () => pedidosDoMercado.filter((pedido) => pedido.statusPedido === "ATIVO"),
    [pedidosDoMercado],
  );

  const pedidosFinalizados = useMemo(
    () =>
      pedidosDoMercado.filter((pedido) => pedido.statusPedido === "CONCLUIDO"),
    [pedidosDoMercado],
  );

  const pedidosDaAba =
    abaPedidosAtiva === "ativos" ? pedidosAtivos : pedidosFinalizados;

  useEffect(() => {
    setPedidosSelecionados((prev) =>
      prev.filter((id) => pedidosDaAba.some((pedido) => pedido.id === id)),
    );
  }, [abaPedidosAtiva, mercadoId, pedidosDaAba]);

  const todosPedidosSelecionados =
    pedidosDaAba.length > 0 &&
    pedidosSelecionados.length === pedidosDaAba.length;

  const selecionarAba = (aba) => {
    setAbaPedidosAtiva(aba);
    setPedidosSelecionados([]);
  };

  const alternarSelecaoPedido = (pedidoId) => {
    setPedidosSelecionados((prev) =>
      prev.includes(pedidoId)
        ? prev.filter((id) => id !== pedidoId)
        : [...prev, pedidoId],
    );
  };

  const alternarSelecaoTodosPedidos = () => {
    if (todosPedidosSelecionados) {
      setPedidosSelecionados([]);
      return;
    }
    setPedidosSelecionados(pedidosDaAba.map((pedido) => pedido.id));
  };

  const handleExcluirPedido = async (pedido) => {
    if (!mercadoId || !pedido) return false;

    try {
      await excluirPedido(pedido.id);

      setPedidosSelecionados((prev) =>
        prev.filter((pedidoId) => pedidoId !== pedido.id),
      );

      notify.success("Pedido excluído com sucesso.");
      carregarPedidos(mercadoId);
      return true;
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
      notify.error("Não foi possível excluir o pedido. Tente novamente.");
      return false;
    }
  };

  const handleRegistrarPagamento = async (pedido, valorPago) => {
    if (!pedido || !mercadoId) return false;

    const valorInformadoNum = parseFloat(String(valorPago).replace(",", "."));
    const valorAPagarNum = Number(pedido.valorAPagar || 0);

    if (isNaN(valorInformadoNum) || valorInformadoNum <= 0) {
      notify.warning("Insira um valor válido para continuar.");
      return false;
    }

    if (valorInformadoNum > valorAPagarNum) {
      notify.warning("O valor informado é maior que o valor restante a pagar.");
      return false;
    }

    try {
      await registrarPagamento(pedido.id, valorInformadoNum);

      notify.success(
        valorInformadoNum === valorAPagarNum
          ? "Pagamento concluído com sucesso."
          : "Pagamento registrado com sucesso.",
      );

      carregarPedidos(mercadoId);
      return true;
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      notify.error(
        "Não foi possível registrar o pagamento. Verifique os dados.",
      );
      return false;
    }
  };

  const handleRemoverItemPedido = async (pedido, item) => {
    if (!pedido || !item || !mercadoId) {
      return { sucesso: false, pedidoEncerrado: false, pedidoAtualizado: null };
    }

    try {
      await removerItemPedido(pedido.id, item.id);

      const itensRestantes = (pedido.itens || []).filter(
        (itemPedido) => itemPedido.id !== item.id,
      );

      if (itensRestantes.length === 0) {
        notify.info("Último item removido. O pedido foi encerrado no sistema.");
        carregarPedidos(mercadoId);
        return { sucesso: true, pedidoEncerrado: true, pedidoAtualizado: null };
      }

      notify.success("Item removido com sucesso.");

      const pedidosAtualizados = await carregarPedidos(mercadoId);
      const pedidoAtualizado = pedidosAtualizados.find(
        (pedidoAtual) => pedidoAtual.id === pedido.id,
      );

      return { sucesso: true, pedidoEncerrado: false, pedidoAtualizado };
    } catch (error) {
      console.error("Erro ao remover item do pedido:", error);
      notify.error("Não foi possível remover o item do pedido.");
      return { sucesso: false, pedidoEncerrado: false, pedidoAtualizado: null };
    }
  };

  const handleExportarPedidos = () => {
    if (!mercadoId) return;

    if (pedidosDaAba.length === 0) {
      notify.warning(
        abaPedidosAtiva === "ativos"
          ? "Não há pedidos ativos para exportação."
          : "Não há pedidos finalizados para exportação.",
      );
      return;
    }

    const pedidosParaExportar =
      pedidosSelecionados.length > 0
        ? pedidosDaAba.filter((pedido) => pedidosSelecionados.includes(pedido.id))
        : pedidosDaAba;

    if (pedidosParaExportar.length === 0) {
      notify.warning("Os pedidos selecionados não pertencem à aba atual.");
      return;
    }

    const payloadExportacao = {
      mercadoId,
      tipo: abaPedidosAtiva,
      idsPedidos: pedidosParaExportar.map((pedido) => pedido.id),
    };

    console.log("Payload mock de exportação PDF:", payloadExportacao);

    if (pedidosSelecionados.length > 0) {
      notify.success(
        `Exportação iniciada para ${pedidosParaExportar.length} pedido(s).`,
      );
      return;
    }

    notify.success(
      `Exportação iniciada para todos os pedidos ${
        abaPedidosAtiva === "ativos" ? "ativos" : "finalizados"
      }.`,
    );
  };

  return {
    pedidosDaAba,
    carregandoPedidos,
    abaPedidosAtiva,
    selecionarAba,
    pedidosSelecionados,
    todosPedidosSelecionados,
    alternarSelecaoPedido,
    alternarSelecaoTodosPedidos,
    handleExcluirPedido,
    handleRegistrarPagamento,
    handleRemoverItemPedido,
    handleExportarPedidos,
  };
}
