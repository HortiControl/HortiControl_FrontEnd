import { useState, useEffect } from "react";
import { DollarSign, Trash2, ArrowLeft, Printer } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { ContentCard } from "../components/ContentCard";
import { Table } from "../components/Table";
import { Badge } from "../components/Badge";
import { Modal } from "../components/Modal";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import api from "../provider/api";
import { useNotification } from "../components/notifications/NotificationContext";

export function GerenciamentoPedidos() {
  const notify = useNotification();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousHeight = document.body.style.height;

    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.height = previousHeight;
    };
  }, []);

  const [abaAtiva, setAbaAtiva] = useState("ativos");
  const [viewMode, setViewMode] = useState("lista");

  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalAtivo, setModalAtivo] = useState(null);

  const [finalizadosData, setfinalizadosData] = useState([]);
  const [pedidosAtivosData, setPedidosAtivosData] = useState([]);
  const [valorPago, setValorPago] = useState(0);

  const [tamanhoFinalizado, setTamanhoFinalizado] = useState(null);

  const formatarData = (dataString) => {
    if (!dataString) return "";
    const [ano, mes, dia] = dataString.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const formatarMoeda = (valor) => {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const carregarPedidosAtivos = () => {
    /*
     * O JWT não é mais recuperado pelo JavaScript.
     * O navegador envia o cookie HttpOnly automaticamente.
     */
    api
      .get("/pedidos/ativos")
      .then((response) => {
        if (response.data.length === 0) {
          setPedidosAtivosData([]);
          return;
        } else {
          const pedidosAtivosFormatado = response.data
            .map((ativo) => ({
              id: ativo.id,
              data: formatarData(ativo.dataSolicitacao),
              valorTotal: ativo.valorTotal,
              statusPedido: ativo.statusPedido,
              valorPago: ativo.valorPago,
              valorAPagar: ativo.valorAPagar,
              mercado: {
                nome: ativo.mercado.nome,
                tipo: ativo.mercado.tipoMercado,
              },
              itens: ativo.itens,
            }))
            .sort((a, b) => b.id - a.id);

          setPedidosAtivosData(pedidosAtivosFormatado);
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar pedidos ativos:", error);
        notify.error("Não foi possível carregar os pedidos ativos.");
      });
  };

  const carregarPedidosFinalizados = () => {
    api
      .get("/pedidos/historico")
      .then((response) => {
        if (response.data.length === 0) {
          setfinalizadosData([]);
          setTamanhoFinalizado(0);
          return;
        } else {
          const finalizadosFormatado = response.data
            .map((finalizado) => ({
              id: finalizado.id,
              data: formatarData(finalizado.dataSolicitacao),
              valorTotal: finalizado.valorTotal,
              statusPedido: finalizado.statusPedido,
              valorPago: finalizado.valorPago,
              valorAPagar: finalizado.valorAPagar,
              mercado: {
                nome: finalizado.mercado.nome,
                tipo: finalizado.mercado.tipoMercado,
              },
              itens: finalizado.itens,
            }))
            .sort((a, b) => b.id - a.id);

          setfinalizadosData(finalizadosFormatado);
          setTamanhoFinalizado(finalizadosFormatado.length);
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar pedidos finalizados:", error);

        notify.error("Não foi possível carregar o histórico de pedidos.");
      });
  };

  useEffect(() => {
    /*
     * A página já está protegida pela ProtectedRoute.
     * Por isso, não verificamos mais token no localStorage.
     */
    carregarPedidosAtivos();
    carregarPedidosFinalizados();
  }, []);

  const handleExcluir = async () => {
    if (!pedidoSelecionado) return;

    try {
      await api.delete(`/pedidos/${pedidoSelecionado.id}`);

      if (abaAtiva === "ativos") {
        setPedidosAtivosData((prev) =>
          prev.filter((pedido) => pedido.id !== pedidoSelecionado.id),
        );
      } else {
        setfinalizadosData((prev) =>
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
      await api.delete(
        `/pedidos/${pedidoSelecionado.id}/itens/${itemSelecionado.id}`,
      );

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
      /*
       * Não enviamos mais o JWT no cabeçalho Authorization.
       * O cookie e o token CSRF são tratados pelo api.js.
       */
      await api.patch(
        `/pedidos/${pedidoSelecionado.id}/pagamento?valor=${valorInformadoNum}`,
        {},
      );

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

  const abrirDetalhes = (pedido) => {
    setPedidoSelecionado(pedido);
    setViewMode("detalhes");
  };

  const abrirModalItem = (item) => {
    setItemSelecionado(item);
    setModalAtivo("deleteItem");
  };

  const voltarParaLista = () => {
    setViewMode("lista");
    setPedidoSelecionado(null);
  };

  const abrirModal = (tipo, pedido) => {
    setPedidoSelecionado(pedido);
    setModalAtivo(tipo);
  };

  const fecharModal = () => {
    setModalAtivo(null);
  };

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {viewMode === "detalhes" && pedidoSelecionado ? (
        <div className="animate-in fade-in duration-300 flex flex-col flex-1 min-h-0 pb-4 overflow-hidden">
          <button
            onClick={voltarParaLista}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium mb-6 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft size={16} /> Voltar aos Pedidos
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between shrink-0">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                {pedidoSelecionado.mercado.nome}
              </h1>
              <p className="text-gray-500 mt-1 font-medium">
                Data de Solicitação - {pedidoSelecionado.data}
              </p>
            </div>
            <Button variant="primary" icon={Printer}>
              Imprimir
            </Button>
          </div>

          <div className="flex-1 min-h-0 pr-2">
            <ContentCard
              title={`Itens do Pedido (${pedidoSelecionado.itens?.length || 0})`}
              subtitle="Produtos incluídos no pedido do cliente"
              filters={
                <div className="px-4 py-2 border-2 border-[#00a859] text-[#00a859] font-bold rounded-lg text-sm bg-white">
                  TOTAL: {formatarMoeda(pedidoSelecionado.valorTotal)}
                </div>
              }
            >
              <div className="w-full max-h-[calc(100dvh-280px)] overflow-y-auto custom-scrollbar">
                <div className="space-y-3 md:hidden">
                  {pedidoSelecionado.itens?.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold text-gray-800">
                            {item.nomeProduto}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Unidades: {item.quantidade}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            item.tipoProduto === "PRE_LAVADO"
                              ? "bg-[#00a859] text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {item.tipoProduto === "PRE_LAVADO"
                            ? "Pré-Lavado"
                            : "Não Lavado"}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs font-medium uppercase text-gray-400">
                            Preço
                          </p>
                          <p className="font-semibold text-gray-800">
                            {formatarMoeda(item.precoUnitario)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium uppercase text-gray-400">
                            Total
                          </p>
                          <p className="font-semibold text-[#00a859]">
                            {formatarMoeda(item.subTotal)}
                          </p>
                        </div>
                      </div>

                      {abaAtiva === "ativos" && (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => abrirModalItem(item)}
                            className="inline-flex items-center gap-1.5 rounded-md border border-red-600 bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                          >
                            <Trash2 size={14} /> Excluir
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>

                <div className="hidden md:block">
                  <table className="relative min-w-[52rem] w-full border-collapse text-left">
                    <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                      <tr className="border-b border-gray-200 text-sm text-gray-500">
                        <th className="px-6 py-4 font-medium">Unidade</th>
                        <th className="px-6 py-4 font-medium">Produto</th>
                        <th className="px-6 py-4 font-medium">Tipo</th>
                        <th className="px-6 py-4 font-medium">Preço</th>
                        <th className="px-6 py-4 font-medium text-right">
                          Total
                        </th>
                        {abaAtiva === "ativos" && (
                          <th className="px-6 py-4 font-medium text-right">
                            Ações
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pedidoSelecionado.itens?.map((item) => (
                        <tr
                          key={item.id}
                          className="transition-colors hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 text-gray-800">
                            {item.quantidade}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-800">
                            {item.nomeProduto}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                item.tipoProduto === "PRE_LAVADO"
                                  ? "bg-[#00a859] text-white"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {item.tipoProduto === "PRE_LAVADO"
                                ? "Pré-Lavado"
                                : "Não Lavado"}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-800">
                            {formatarMoeda(item.precoUnitario)}
                          </td>
                          <td className="px-6 py-4 font-bold text-[#00a859] text-right">
                            {formatarMoeda(item.subTotal)}
                          </td>
                          {abaAtiva === "ativos" && (
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end">
                                <button
                                  onClick={() => abrirModalItem(item)}
                                  className="flex items-center gap-1.5 rounded-md border border-red-600 bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                                >
                                  <Trash2 size={14} /> Excluir
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ContentCard>
          </div>
        </div>
      ) : (
        /* ----------------------------------
           LISTA DE PEDIDOS
           ---------------------------------- */
        <div className="animate-in fade-in duration-300 flex flex-col flex-1 min-h-0 pb-4 overflow-hidden">
          <div className="shrink-0">
            <PageHeader
              title="Gerenciamento de Pedidos"
              subtitle="Visualize e gerencie todos os pedidos do sistema"
            />
          </div>

          <div className="flex bg-white rounded-full p-1 mb-0 border border-gray-200 shadow-sm w-full shrink-0">
            <button
              onClick={() => setAbaAtiva("ativos")}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                abaAtiva === "ativos"
                  ? "bg-[#00a859] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Pedidos Ativos ({pedidosAtivosData.length})
            </button>
            <button
              onClick={() => setAbaAtiva("finalizados")}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                abaAtiva === "finalizados"
                  ? "bg-[#00a859] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Finalizados ({tamanhoFinalizado})
            </button>
          </div>

          <div className="flex-1 min-h-0 pr-1">
            {abaAtiva === "ativos" ? (
              <ContentCard
                title="Pedidos Ativos"
                subtitle="Pedidos em andamento que precisam de atenção"
                count={pedidosAtivosData.length}
              >
                <div className="w-full max-h-[calc(100dvh-320px)] overflow-y-auto custom-scrollbar">
                  <div className="space-y-3 md:hidden">
                    {pedidosAtivosData.map((pedido) => (
                      <article
                        key={pedido.id}
                        onClick={() => abrirDetalhes(pedido)}
                        className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-semibold text-gray-800">
                              {pedido.mercado.nome}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {pedido.data}
                            </p>
                          </div>
                          <Badge text={pedido.mercado.tipo} />
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs font-medium uppercase text-gray-400">
                              Valor Total
                            </p>
                            <p className="font-bold text-[#00a859]">
                              {formatarMoeda(pedido.valorTotal)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium uppercase text-gray-400">
                              A pagar
                            </p>
                            <p className="font-bold text-red-600">
                              {formatarMoeda(pedido.valorAPagar)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirModal("pagamento", pedido);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <DollarSign size={14} /> Pagar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirModal("delete", pedido);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-md border border-red-600 bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                          >
                            <Trash2 size={14} /> Excluir
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="hidden md:block">
                    <Table
                      headers={[
                        "Cliente",
                        "Tipo",
                        "Data Solicitação",
                        "Valor Total",
                        "A pagar",
                      ]}
                    >
                      {pedidosAtivosData.map((pedido) => (
                        <tr
                          key={pedido.id}
                          onClick={() => abrirDetalhes(pedido)}
                          className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium text-gray-800">
                            {pedido.mercado.nome}
                          </td>
                          <td className="px-6 py-4">
                            <Badge text={pedido.mercado.tipo} />
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {pedido.data}
                          </td>
                          <td className="px-6 py-4 font-bold text-[#00a859]">
                            {formatarMoeda(pedido.valorTotal)}
                          </td>
                          <td className="px-6 py-4 font-bold text-red-600">
                            {formatarMoeda(pedido.valorAPagar)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  abrirModal("pagamento", pedido);
                                }}
                                className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                              >
                                <DollarSign size={14} /> Pagar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  abrirModal("delete", pedido);
                                }}
                                className="flex items-center gap-1.5 rounded-md border border-red-600 bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                              >
                                <Trash2 size={14} /> Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </Table>
                  </div>
                </div>
              </ContentCard>
            ) : (
              <ContentCard
                title="Pedidos Finalizados"
                subtitle="Histórico de pedidos concluídos para consulta"
                count={tamanhoFinalizado}
              >
                <div className="w-full max-h-[calc(100dvh-320px)] overflow-y-auto custom-scrollbar">
                  <div className="space-y-3 md:hidden">
                    {finalizadosData.map((pedido) => (
                      <article
                        key={pedido.id}
                        onClick={() => abrirDetalhes(pedido)}
                        className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-semibold text-gray-800">
                              {pedido.mercado.nome}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {pedido.data}
                            </p>
                          </div>
                          <Badge text={pedido.mercado.tipo} />
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs font-medium uppercase text-gray-400">
                              Valor Total
                            </p>
                            <p className="font-bold text-[#00a859]">
                              {formatarMoeda(pedido.valorTotal)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium uppercase text-gray-400">
                              Status
                            </p>
                            <Badge text={pedido.statusPedido} />
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirModal("delete", pedido);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-md border border-red-600 bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                          >
                            <Trash2 size={14} /> Excluir
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="hidden md:block">
                    <Table
                      headers={[
                        "Cliente",
                        "Tipo",
                        "Data Solicitação",
                        "Valor Total",
                        "Status",
                      ]}
                    >
                      {finalizadosData.map((pedido) => (
                        <tr
                          key={pedido.id}
                          onClick={() => abrirDetalhes(pedido)}
                          className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium text-gray-800">
                            {pedido.mercado.nome}
                          </td>
                          <td className="px-6 py-4">
                            <Badge text={pedido.mercado.tipo} />
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {pedido.data}
                          </td>
                          <td className="px-6 py-4 font-bold text-[#00a859]">
                            {formatarMoeda(pedido.valorTotal)}
                          </td>
                          <td className="px-6 py-4">
                            <Badge text={pedido.statusPedido} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  abrirModal("delete", pedido);
                                }}
                                className="flex items-center gap-1.5 rounded-md border border-red-600 bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                              >
                                <Trash2 size={14} /> Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </Table>
                  </div>
                </div>
              </ContentCard>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={modalAtivo === "pagamento"}
        onClose={fecharModal}
        title="Valor Pago"
        subtitle="Insira quanto do valor do pedido já foi pago"
      >
        <Input
          label="Pago (R$)"
          placeholder="Ex: 100,00"
          onChange={(e) => setValorPago(e.target.value)}
        />
        <div className="flex flex-row justify-between max-h-10 mt-7">
          <div className="flex flex-col gap-1 p-2 rounded-lg justify-center border-2 border-gray-300 bg-gray-100">
            <p className="text-gray-700 text-[12px] font-medium">
              Total: R${" "}
              {Number(pedidoSelecionado?.valorTotal || 0)
                .toFixed(2)
                .replace(".", ",")}
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handlePagarValor}>
              Registrar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalAtivo === "delete"}
        onClose={fecharModal}
        title="Confirmar Exclusão"
        isDanger={true}
      >
        <p className="text-gray-700">
          Tem certeza que deseja excluir o pedido de{" "}
          <span className="font-bold">{pedidoSelecionado?.mercado?.nome}</span>?
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleExcluir}>
            Excluir Pedido
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={modalAtivo === "deleteItem"}
        onClose={fecharModal}
        title="Confirmar Exclusão"
        isDanger={true}
      >
        <p className="text-gray-700">
          Tem certeza que deseja excluir o Item{" "}
          <span className="font-bold">{itemSelecionado?.nomeProduto}</span>?
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleRemoverItem}>
            Excluir Item
          </Button>
        </div>
      </Modal>
    </div>
  );
}
