import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Pencil,
  Trash2,
  MapPin,
  ArrowLeft,
  DollarSign,
  Download,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { ContentCard } from "../components/ContentCard";
import { Table } from "../components/Table";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import api from "../provider/api";
import { useNotification } from "../components/notifications/NotificationContext";

const VIA_CEP_TIMEOUT_MS = 10000;

const MOCK_MERCADOS = [
  {
    id: 1001,
    nome: "MJ4",
    tipo: "NORMAL",
    cep: "08790110",
    numero: "101",
  },
  {
    id: 1002,
    nome: "MJ3",
    tipo: "NORMAL",
    cep: "08780120",
    numero: "88",
  },
  {
    id: 1003,
    nome: "MJ2",
    tipo: "NORMAL",
    cep: "08770130",
    numero: "45",
  },
  {
    id: 1004,
    nome: "Mercado São Paulo",
    tipo: "CONSIGNADO",
    cep: "01001000",
    numero: "150",
  },
  {
    id: 1005,
    nome: "Tropical",
    tipo: "NORMAL",
    cep: "08760140",
    numero: "77",
  },
  {
    id: 1006,
    nome: "Casa Verde",
    tipo: "CONSIGNADO",
    cep: "08750150",
    numero: "250",
  },
];

const PEDIDOS_TEMPLATE = [
  {
    id: 1,
    data: "2026-03-29",
    valorTotal: 541,
    valorPago: 0,
    valorAPagar: 541,
    statusPedido: "ATIVO",
  },
  {
    id: 2,
    data: "2026-03-23",
    valorTotal: 607,
    valorPago: 300,
    valorAPagar: 307,
    statusPedido: "ATIVO",
  },
  {
    id: 3,
    data: "2026-03-20",
    valorTotal: 333,
    valorPago: 231,
    valorAPagar: 102,
    statusPedido: "ATIVO",
  },
  {
    id: 4,
    data: "2026-03-27",
    valorTotal: 287,
    valorPago: 229,
    valorAPagar: 58,
    statusPedido: "ATIVO",
  },
  {
    id: 5,
    data: "2026-03-29",
    valorTotal: 567,
    valorPago: 385,
    valorAPagar: 182,
    statusPedido: "ATIVO",
  },
  {
    id: 6,
    data: "2026-03-18",
    valorTotal: 754,
    valorPago: 754,
    valorAPagar: 0,
    statusPedido: "FINALIZADO",
  },
  {
    id: 7,
    data: "2026-03-11",
    valorTotal: 420,
    valorPago: 420,
    valorAPagar: 0,
    statusPedido: "FINALIZADO",
  },
];

const ITENS_TEMPLATE = [
  {
    id: 1,
    nomeProduto: "Alface Crespa",
    quantidade: 5,
    tipoProduto: "NAO_LAVADO",
    precoUnitario: 9,
    subTotal: 54,
  },
  {
    id: 2,
    nomeProduto: "Alface Lisa",
    quantidade: 10,
    tipoProduto: "PRE_LAVADO",
    precoUnitario: 9,
    subTotal: 67,
  },
  {
    id: 3,
    nomeProduto: "Alface Americana",
    quantidade: 23,
    tipoProduto: "NAO_LAVADO",
    precoUnitario: 3,
    subTotal: 333,
  },
  {
    id: 4,
    nomeProduto: "Acelga",
    quantidade: 12,
    tipoProduto: "NAO_LAVADO",
    precoUnitario: 5,
    subTotal: 287,
  },
  {
    id: 5,
    nomeProduto: "Repolho",
    quantidade: 7,
    tipoProduto: "PRE_LAVADO",
    precoUnitario: 9,
    subTotal: 145,
  },
];

export function Mercados() {
  const notify = useNotification();
  const [viewMode, setViewMode] = useState("clientes");
  const [abaPedidosAtiva, setAbaPedidosAtiva] = useState("ativos");

  const [mercadosData, setMercadosData] = useState([]);
  const [modalAtivo, setModalAtivo] = useState(null);
  const [mercadoSelecionado, setMercadoSelecionado] = useState(null);
  const [mercadoEmFoco, setMercadoEmFoco] = useState(null);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [pedidosPorMercado, setPedidosPorMercado] = useState({});
  const [pedidosSelecionados, setPedidosSelecionados] = useState([]);
  const [valorPago, setValorPago] = useState(0);
  const [filtroAtivo, setFiltroAtivo] = useState("TODOS");

  const [endereco, setEndereco] = useState(null);
  const [loadingEndereco, setLoadingEndereco] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    tipo: "NORMAL",
    cep: "",
    numero: "",
  });

  const carregarMercados = useCallback(() => {
    /*
     * Não é mais necessário montar o cabeçalho Authorization.
     * O axios enviará o cookie JWT HttpOnly automaticamente.
     */
    api
      .get("/mercados")
      .then((response) => {
        if (response.data.length === 0) {
          setMercadosData(MOCK_MERCADOS);
        } else {
          const mercadosFormatados = response.data
            .map((mercado) => ({
              id: mercado.id,
              nome: mercado.nome,
              tipo: mercado.tipoMercado || mercado.tipo || "NORMAL",
              cep: mercado.cep,
              numero: mercado.numero,
            }))
            .sort((a, b) => a.nome.localeCompare(b.nome));

          setMercadosData(mercadosFormatados);
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar clientes:", error);
        setMercadosData(MOCK_MERCADOS);
        notify.warning(
          "Clientes carregados em modo de teste. Conecte o backend para dados reais.",
        );
      });
  }, [notify]);

  const criarItensMock = (pedidoId) =>
    ITENS_TEMPLATE.map((item, index) => ({
      ...item,
      id: pedidoId * 100 + index + 1,
    }));

  const criarPedidosMock = (mercado) =>
    PEDIDOS_TEMPLATE.map((pedido) => ({
      ...pedido,
      id: Number(`${mercado.id}${pedido.id}`),
      mercado: {
        id: mercado.id,
        nome: mercado.nome,
        tipo: mercado.tipo,
      },
      itens: criarItensMock(Number(`${mercado.id}${pedido.id}`)),
    }));

  const buscarEnderecoPorCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      VIA_CEP_TIMEOUT_MS,
    );

    try {
      setLoadingEndereco(true);
      setEndereco(null);

      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
        {
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        throw new Error(`ViaCEP respondeu com status HTTP ${response.status}.`);
      }

      const data = await response.json();

      const cepRetornado =
        typeof data.cep === "string" ? data.cep.replace(/\D/g, "") : "";
      if (data.erro || cepRetornado !== cepLimpo) {
        throw new Error("CEP inválido ou resposta inválida do ViaCEP.");
      }

      setEndereco({
        ...data,
        cep: cepRetornado,
        logradouro: String(data.logradouro || "")
          .trim()
          .slice(0, 120),
        bairro: String(data.bairro || "")
          .trim()
          .slice(0, 80),
        localidade: String(data.localidade || "")
          .trim()
          .slice(0, 80),
        uf: String(data.uf || "")
          .trim()
          .toUpperCase()
          .slice(0, 2),
      });
    } catch (err) {
      setEndereco(null);
      if (err.name === "AbortError") {
        notify.warning("A consulta de CEP demorou demais. Tente novamente.");
      } else {
        console.error("Erro ao consultar o ViaCEP:", err);
        notify.warning(
          "CEP não encontrado ou serviço indisponível. Verifique o valor digitado.",
        );
      }
    } finally {
      window.clearTimeout(timeoutId);
      setLoadingEndereco(false);
    }
  };

  useEffect(() => {
    /*
     * A chamada não depende mais da existência de um token no localStorage.
     * A ProtectedRoute já confirmou a sessão antes de renderizar esta página.
     */
    carregarMercados();
  }, [carregarMercados]);

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
      buscarEnderecoPorCep(alvo.cep);
    }

    if (tipo === "add") {
      setFormData({ nome: "", tipo: "NORMAL", cep: "", numero: "" });
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
    setEndereco(null);
    setModalAtivo(null);
    setMercadoSelecionado(null);
    setPedidoSelecionado((prev) => (viewMode === "itens" ? prev : null));
    setItemSelecionado(null);
    setValorPago(0);
  };

  function formatarCEP(valor) {
    return valor
      .replace(/\D/g, "") // remove tudo que não é número
      .replace(/(\d{5})(\d)/, "$1-$2") // adiciona o traço
      .slice(0, 9); // limita ao tamanho do CEP
  }

  const formatarData = (dataString) => {
    if (!dataString) return "";
    const [ano, mes, dia] = dataString.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleSalvar = async () => {
    const dadosDoForms = {
      nome: formData.nome,
      tipoMercado: formData.tipo,
      cep: formData.cep,
      numero: formData.numero,
    };

    try {
      if (modalAtivo === "add") {
        /*
         * O cookie JWT e o token CSRF são tratados automaticamente
         * pelo cliente api.
         */
        await api.post("/mercados", dadosDoForms);
      } else if (modalAtivo === "edit") {
        await api.put(`/mercados/${mercadoSelecionado.id}`, dadosDoForms);
      }

      carregarMercados();
      fecharModal();
    } catch {
      notify.error(
        "Não foi possível salvar o cliente. Verifique os dados e tente novamente.",
      );
    }
  };

  const handleExcluir = async () => {
    try {
      /*
       * O cookie de autenticação é enviado automaticamente.
       * O interceptor do api.js adiciona o token CSRF.
       */
      await api.delete(`/mercados/${mercadoSelecionado.id}`);

      setMercadosData((prev) =>
        prev.filter((mercado) => mercado.id !== mercadoSelecionado.id),
      );

      notify.success("Cliente excluído com sucesso.");
      fecharModal();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);

      notify.warning(
        "Não foi possível excluir. Este cliente pode ter pedidos vinculados.",
      );
    }
  };

  const abrirPedidosDoMercado = (mercado) => {
    setMercadoEmFoco(mercado);
    setViewMode("pedidos");
    setAbaPedidosAtiva("ativos");
    setPedidosSelecionados([]);

    setPedidosPorMercado((prev) => {
      if (prev[mercado.id]) return prev;
      return {
        ...prev,
        [mercado.id]: criarPedidosMock(mercado),
      };
    });
  };

  const voltarParaClientes = () => {
    setViewMode("clientes");
    setMercadoEmFoco(null);
    setPedidoSelecionado(null);
    setPedidosSelecionados([]);
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

  const pedidosDoMercado = useMemo(() => {
    if (!mercadoEmFoco) return [];
    return pedidosPorMercado[mercadoEmFoco.id] || [];
  }, [mercadoEmFoco, pedidosPorMercado]);

  const pedidosAtivos = useMemo(
    () => pedidosDoMercado.filter((pedido) => pedido.statusPedido === "ATIVO"),
    [pedidosDoMercado],
  );

  const pedidosFinalizados = useMemo(
    () =>
      pedidosDoMercado.filter((pedido) => pedido.statusPedido === "FINALIZADO"),
    [pedidosDoMercado],
  );

  const pedidosDaAba = abaPedidosAtiva === "ativos" ? pedidosAtivos : pedidosFinalizados;

  useEffect(() => {
    setPedidosSelecionados((prev) =>
      prev.filter((id) => pedidosDaAba.some((pedido) => pedido.id === id)),
    );
  }, [abaPedidosAtiva, mercadoEmFoco, pedidosDaAba]);

  const todosPedidosSelecionados =
    pedidosDaAba.length > 0 && pedidosSelecionados.length === pedidosDaAba.length;

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

  const atualizarPedidoNoMercado = (pedidoAtualizado) => {
    if (!mercadoEmFoco) return;

    setPedidosPorMercado((prev) => ({
      ...prev,
      [mercadoEmFoco.id]: (prev[mercadoEmFoco.id] || []).map((pedido) =>
        pedido.id === pedidoAtualizado.id ? pedidoAtualizado : pedido,
      ),
    }));
  };

  const handleExcluirPedido = () => {
    if (!mercadoEmFoco || !pedidoSelecionado) return;

    setPedidosPorMercado((prev) => ({
      ...prev,
      [mercadoEmFoco.id]: (prev[mercadoEmFoco.id] || []).filter(
        (pedido) => pedido.id !== pedidoSelecionado.id,
      ),
    }));

    setPedidosSelecionados((prev) =>
      prev.filter((pedidoId) => pedidoId !== pedidoSelecionado.id),
    );

    if (viewMode === "itens") {
      voltarParaPedidos();
    }

    notify.success("Pedido excluído com sucesso.");
    fecharModal();
  };

  const handleRegistrarPagamento = () => {
    if (!pedidoSelecionado) return;

    const valorInformadoNum = parseFloat(String(valorPago).replace(",", "."));
    const valorAPagarNum = Number(pedidoSelecionado.valorAPagar || 0);

    if (isNaN(valorInformadoNum) || valorInformadoNum <= 0) {
      notify.warning("Insira um valor válido para continuar.");
      return;
    }

    if (valorInformadoNum > valorAPagarNum) {
      notify.warning("O valor informado é maior que o valor restante a pagar.");
      return;
    }

    const novoValorPago = Number(pedidoSelecionado.valorPago || 0) + valorInformadoNum;
    const novoValorAPagar = Math.max(
      0,
      Number(pedidoSelecionado.valorTotal || 0) - novoValorPago,
    );

    const pedidoAtualizado = {
      ...pedidoSelecionado,
      valorPago: novoValorPago,
      valorAPagar: novoValorAPagar,
      statusPedido: novoValorAPagar === 0 ? "FINALIZADO" : "ATIVO",
    };

    atualizarPedidoNoMercado(pedidoAtualizado);
    setPedidoSelecionado(pedidoAtualizado);

    notify.success(
      novoValorAPagar === 0
        ? "Pagamento concluído com sucesso."
        : "Pagamento registrado com sucesso.",
    );

    fecharModal();
  };

  const handleRemoverItemPedido = () => {
    if (!pedidoSelecionado || !itemSelecionado) return;

    const itensRestantes = (pedidoSelecionado.itens || []).filter(
      (item) => item.id !== itemSelecionado.id,
    );

    if (itensRestantes.length === 0) {
      setPedidosPorMercado((prev) => ({
        ...prev,
        [mercadoEmFoco.id]: (prev[mercadoEmFoco.id] || []).filter(
          (pedido) => pedido.id !== pedidoSelecionado.id,
        ),
      }));

      notify.info("Último item removido. O pedido foi encerrado no sistema.");
      fecharModal();
      voltarParaPedidos();
      return;
    }

    const novoValorTotal = itensRestantes.reduce(
      (acc, item) => acc + Number(item.subTotal || 0),
      0,
    );

    const novoValorAPagar = Math.max(
      0,
      novoValorTotal - Number(pedidoSelecionado.valorPago || 0),
    );

    const pedidoAtualizado = {
      ...pedidoSelecionado,
      itens: itensRestantes,
      valorTotal: novoValorTotal,
      valorAPagar: novoValorAPagar,
      statusPedido: novoValorAPagar === 0 ? "FINALIZADO" : "ATIVO",
    };

    atualizarPedidoNoMercado(pedidoAtualizado);
    setPedidoSelecionado(pedidoAtualizado);
    notify.success("Item removido com sucesso.");
    fecharModal();
  };

  const handleExportarPedidos = () => {
    if (!mercadoEmFoco) return;

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
      mercadoId: mercadoEmFoco.id,
      tipo: abaPedidosAtiva,
      idsPedidos: pedidosParaExportar.map((pedido) => pedido.id),
    };

    console.log("Payload mock de exportação PDF:", payloadExportacao);

    if (pedidosSelecionados.length > 0) {
      notify.success(`Exportação iniciada para ${pedidosParaExportar.length} pedido(s).`);
      return;
    }

    notify.success(
      `Exportação iniciada para todos os pedidos ${
        abaPedidosAtiva === "ativos" ? "ativos" : "finalizados"
      }.`,
    );
  };

  // LÓGICA DOS FILTROS
  const mercadosFiltrados = mercadosData.filter((mercado) => {
    if (filtroAtivo === "TODOS") return true;
    return mercado.tipo.toUpperCase() === filtroAtivo;
  });

  const FiltroClientes = (
    <div className="flex flex-col items-start gap-1 text-sm sm:items-end">
      <span className="mb-1 text-xs font-medium text-gray-500">
        Tipo de Cliente
      </span>
      <div className="flex flex-wrap gap-2">
        {["TODOS", "NORMAL", "CONSIGNADO"].map((f) => (
          <button
            key={f}
            onClick={() => setFiltroAtivo(f)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              filtroAtivo === f
                ? "bg-[#00a859] text-white border-[#00a859]"
                : "bg-white text-gray-600 border-gray-400 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );

  const trilhaNavegacao =
    viewMode === "clientes"
      ? "Clientes"
      : viewMode === "pedidos"
        ? "Clientes > Pedidos"
        : "Clientes > Pedidos > Itens do Pedido";

  const handleVoltarPelaTrilha = () => {
    if (viewMode === "itens") {
      voltarParaPedidos();
      return;
    }

    if (viewMode === "pedidos") {
      voltarParaClientes();
    }
  };

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {viewMode === "clientes" && (
        <div className="animate-in fade-in duration-300 flex flex-col flex-1 min-h-0 pb-4 overflow-hidden">
          <div className="shrink-0">
            <PageHeader
              title="Clientes"
              subtitle="Gerencie os clientes parceiros da Alto Tietê"
              buttonText="Adicionar Cliente"
              onButtonClick={() => abrirModal("add")}
            />
          </div>

          <div className="flex-1 min-h-0">
            <ContentCard
              title={`Todos os Clientes`}
              count={mercadosFiltrados.length}
              subtitle="Selecione um Cliente para ver seus pedidos"
              filters={FiltroClientes}
            >
              <div className="max-h-[calc(100vh-18rem)] overflow-y-auto pr-2 pb-4">
                <div className="space-y-3 md:hidden">
                  {mercadosFiltrados.map((mercado) => (
                    <article
                      key={mercado.id}
                      onClick={() => abrirPedidosDoMercado(mercado)}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold text-gray-800">
                            {mercado.nome}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            CEP {formatarCEP(mercado.cep)}
                          </p>
                        </div>
                        <Badge text={mercado.tipo} />
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModal("edit", mercado);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <Pencil size={14} /> Editar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModal("viewAddress", mercado);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                        >
                          <MapPin size={14} /> Endereço
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModal("delete", mercado);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-600 bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                        >
                          <Trash2 size={14} /> Excluir
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="hidden md:block">
                  <Table headers={["Nome", "Tipo", "CEP"]}>
                    {mercadosFiltrados.map((mercado) => (
                      <tr
                        key={mercado.id}
                        onClick={() => abrirPedidosDoMercado(mercado)}
                        className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {mercado.nome}
                        </td>
                        <td className="px-6 py-4">
                          <Badge text={mercado.tipo} />
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatarCEP(mercado.cep)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirModal("edit", mercado);
                              }}
                              className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                              <Pencil size={14} /> Editar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirModal("viewAddress", mercado);
                              }}
                              className="flex items-center gap-1.5 rounded-md border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                            >
                              <MapPin size={14} /> Endereço
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirModal("delete", mercado);
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
          </div>
        </div>
      )}

      {viewMode === "pedidos" && mercadoEmFoco && (
        <div className="animate-in fade-in duration-300 flex flex-col flex-1 min-h-0 pb-4 overflow-hidden">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500 shrink-0">
            <button
              onClick={handleVoltarPelaTrilha}
              className="text-gray-600 transition-colors hover:text-gray-900"
              aria-label="Voltar para Clientes"
            >
              <ArrowLeft size={16} />
            </button>
            <p>{trilhaNavegacao}</p>
          </div>

          <div className="shrink-0 mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                Pedidos - {mercadoEmFoco.nome}
              </h1>
              <p className="text-gray-500 mt-1 font-medium">
                Visualize e gerencie os pedidos do cliente
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleExportarPedidos}
              className="w-full sm:w-auto"
            >
              <Download size={16} />
              {pedidosSelecionados.length > 0
                ? `Exportar (${pedidosSelecionados.length} selecionado${pedidosSelecionados.length > 1 ? "s" : ""})`
                : "Exportar todos"}
            </Button>
          </div>

          <div className="flex bg-white rounded-full p-1 mb-3 border border-gray-200 shadow-sm w-full shrink-0">
            <button
              onClick={() => {
                setAbaPedidosAtiva("ativos");
                setPedidosSelecionados([]);
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                abaPedidosAtiva === "ativos"
                  ? "bg-[#00a859] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Pedidos Ativos
            </button>
            <button
              onClick={() => {
                setAbaPedidosAtiva("finalizados");
                setPedidosSelecionados([]);
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                abaPedidosAtiva === "finalizados"
                  ? "bg-[#00a859] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Finalizados
            </button>
          </div>

          <div className="flex-1 min-h-0 pr-1">
            <ContentCard
              title={
                abaPedidosAtiva === "ativos" ? "Pedidos Ativos" : "Pedidos Finalizados"
              }
              subtitle={
                abaPedidosAtiva === "ativos"
                  ? "Pedidos em andamento que precisam de atenção"
                  : "Histórico de pedidos finalizados para consulta"
              }
              count={pedidosDaAba.length}
            >
              <div className="w-full max-h-[calc(100vh-22rem)] overflow-y-auto pr-2 pb-4">
                <div className="space-y-3 md:hidden">
                  {pedidosDaAba.map((pedido) => {
                    const selecionado = pedidosSelecionados.includes(pedido.id);
                    return (
                      <article
                        key={pedido.id}
                        onClick={() => abrirItensDoPedido(pedido)}
                        className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selecionado}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => alternarSelecaoPedido(pedido.id)}
                              className="h-4 w-4 rounded border-gray-300 text-[#00a859] focus:ring-[#00a859]/30"
                            />
                            <div>
                              <h3 className="truncate text-base font-semibold text-gray-800">
                                #{String(pedido.id).slice(-1)}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {formatarData(pedido.data)}
                              </p>
                            </div>
                          </div>
                          <Badge text={pedido.statusPedido} />
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
                          {abaPedidosAtiva === "ativos" && (
                            <Button
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirModal("pagamento", pedido);
                              }}
                              className="min-h-0 border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <DollarSign size={14} /> Pagar
                            </Button>
                          )}
                          <Button
                            variant="danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirModal("deletePedido", pedido);
                            }}
                            className="min-h-0 px-3 py-2 text-sm"
                          >
                            <Trash2 size={14} /> Excluir
                          </Button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="hidden md:block pr-1">
                  <Table
                    headers={[
                      <input
                        type="checkbox"
                        checked={todosPedidosSelecionados}
                        onChange={alternarSelecaoTodosPedidos}
                        className="h-4 w-4 rounded border-gray-300 text-[#00a859] focus:ring-[#00a859]/30"
                      />,
                      "ID",
                      "Data Solicitação",
                      "Valor Total",
                      "A pagar",
                    ]}
                  >
                    {pedidosDaAba.map((pedido) => (
                      <tr
                        key={pedido.id}
                        onClick={() => abrirItensDoPedido(pedido)}
                        className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={pedidosSelecionados.includes(pedido.id)}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => alternarSelecaoPedido(pedido.id)}
                            className="h-4 w-4 rounded border-gray-300 text-[#00a859] focus:ring-[#00a859]/30"
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          #{String(pedido.id).slice(-1)}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatarData(pedido.data)}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#00a859]">
                          {formatarMoeda(pedido.valorTotal)}
                        </td>
                        <td className="px-6 py-4 font-bold text-red-600">
                          {formatarMoeda(pedido.valorAPagar)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {abaPedidosAtiva === "ativos" && (
                              <Button
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  abrirModal("pagamento", pedido);
                                }}
                                className="min-h-0 border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <DollarSign size={14} /> Pagar
                              </Button>
                            )}
                            <Button
                              variant="danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirModal("deletePedido", pedido);
                              }}
                              className="min-h-0 px-3 py-1.5 text-sm"
                            >
                              <Trash2 size={14} /> Excluir
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Table>
                </div>
              </div>
            </ContentCard>
          </div>
        </div>
      )}

      {viewMode === "itens" && pedidoSelecionado && (
        <div className="animate-in fade-in duration-300 flex flex-col flex-1 min-h-0 pb-4 overflow-hidden">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500 shrink-0">
            <button
              onClick={handleVoltarPelaTrilha}
              className="text-gray-600 transition-colors hover:text-gray-900"
              aria-label="Voltar para Pedidos"
            >
              <ArrowLeft size={16} />
            </button>
            <p>{trilhaNavegacao}</p>
          </div>

          <div className="shrink-0 mb-4">
            <h1 className="text-3xl font-semibold text-gray-800">
              Detalhes do Pedido (#{String(pedidoSelecionado.id).slice(-1)})
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Data de Solicitação - {formatarData(pedidoSelecionado.data)}
            </p>
          </div>

          <div className="flex-1 min-h-0">
            <ContentCard
              title="Itens do Pedido"
              count={pedidoSelecionado.itens?.length || 0}
              subtitle="Produtos incluídos no pedido do cliente"
              filters={
                <div className="px-4 py-2 border-2 border-[#00a859] text-[#00a859] font-bold rounded-lg text-sm bg-white">
                  TOTAL: {formatarMoeda(pedidoSelecionado.valorTotal)}
                </div>
              }
            >
              <div className="w-full max-h-[calc(100dvh-20rem)] overflow-y-auto custom-scrollbar">
                <div className="space-y-3 md:hidden">
                  {(pedidoSelecionado.itens || []).map((item) => (
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

                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="danger"
                          onClick={() => abrirModal("deleteItem", item)}
                          className="min-h-0 px-3 py-2 text-sm"
                        >
                          <Trash2 size={14} /> Excluir
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="hidden md:block">
                  <Table headers={["Unidade", "Produto", "Tipo", "Preço", "Total"]}>
                    {(pedidoSelecionado.itens || []).map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-gray-800">{item.quantidade}</td>
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
                        <td className="px-6 py-4 font-bold text-[#00a859]">
                          {formatarMoeda(item.subTotal)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end">
                            <Button
                              variant="danger"
                              onClick={() => abrirModal("deleteItem", item)}
                              className="min-h-0 px-3 py-1.5 text-sm"
                            >
                              <Trash2 size={14} /> Excluir
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Table>
                </div>
              </div>
            </ContentCard>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalAtivo === "add" || modalAtivo === "edit"}
        onClose={fecharModal}
        title={
          modalAtivo === "add" ? "Adicionar Novo Cliente" : "Editar Cliente"
        }
        subtitle={
          modalAtivo === "add"
            ? "Insira os detalhes do novo cliente"
            : "Altere os detalhes do cliente selecionado."
        }
      >
        <Input
          label="Nome do Cliente:"
          placeholder="Ex: MJ4"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        />

        <Select
          label="Tipo:"
          options={["NORMAL", "CONSIGNADO"]}
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
        />

        <Input
          label="CEP:"
          placeholder="Ex: 01234-567"
          value={formatarCEP(formData.cep)}
          onChange={(e) => {
            const cep = e.target.value;
            setFormData({ ...formData, cep });
            buscarEnderecoPorCep(cep);
          }}
        />
        {loadingEndereco && (
          <p className="text-sm text-gray-500 mt-2">Buscando endereço...</p>
        )}

        {endereco && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input label="Logradouro" value={endereco.logradouro} disabled />
            <Input label="Bairro" value={endereco.bairro} disabled />
            <Input label="Cidade" value={endereco.localidade} disabled />
            <Input label="Estado" value={endereco.uf} disabled />
          </div>
        )}

        <Input
          label="Número:"
          placeholder="Ex: 123"
          value={formData.numero}
          maxLength={6}
          onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
        />

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSalvar}>
            {modalAtivo === "add" ? "Salvar" : "Salvar Alterações"}
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={modalAtivo === "viewAddress"}
        onClose={fecharModal}
        title="Endereço do Cliente"
        maxWidth="max-w-lg"
      >
        {loadingEndereco && (
          <p className="text-gray-500">Carregando endereço...</p>
        )}

        {!loadingEndereco && endereco && (
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <strong>CEP:</strong> {formatarCEP(endereco.cep) || "—"}
            </div>
            <div>
              <strong>Logradouro:</strong> {endereco.logradouro || "—"}
            </div>
            <div>
              <strong>Número:</strong> {mercadoSelecionado?.numero || "—"}
            </div>
            <div>
              <strong>Bairro:</strong> {endereco.bairro || "—"}
            </div>
            <div>
              <strong>Cidade:</strong> {endereco.localidade}
            </div>
            <div>
              <strong>Estado:</strong> {endereco.uf}
            </div>
          </div>
        )}

        {!loadingEndereco && !endereco && (
          <p className="text-red-500">Endereço não encontrado.</p>
        )}

        <div className="flex justify-end mt-6">
          <Button variant="secondary" onClick={fecharModal}>
            Fechar
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={modalAtivo === "delete"}
        onClose={fecharModal}
        title="Confirmar Exclusão"
        isDanger={true}
      >
        <p className="text-gray-700">
          Tem certeza que deseja excluir o cliente{" "}
          <span className="font-bold">{mercadoSelecionado?.nome}</span>?
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleExcluir}>
            Excluir Cliente
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={modalAtivo === "pagamento"}
        onClose={fecharModal}
        title="Valor Pago"
        subtitle="Insira quanto do valor do pedido já foi pago"
      >
        <Input
          label="Pago (R$)"
          placeholder="Ex: 100,00"
          value={valorPago}
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
            <Button variant="primary" onClick={handleRegistrarPagamento}>
              Registrar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalAtivo === "deletePedido"}
        onClose={fecharModal}
        title="Confirmar Exclusão"
        isDanger={true}
      >
        <p className="text-gray-700">
          Tem certeza que deseja excluir o pedido
          <span className="font-bold"> #{String(pedidoSelecionado?.id || "").slice(-1)}</span>?
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleExcluirPedido}>
            Excluir Pedido
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={modalAtivo === "deleteItem"}
        onClose={fecharModal}
        title="Excluir Item"
        subtitle="Esta ação removerá o item do pedido selecionado"
        isDanger={true}
      >
        <p className="text-gray-700">
          Deseja remover o item
          <span className="font-bold"> {itemSelecionado?.nomeProduto}</span> do pedido?
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleRemoverItemPedido}>
            Excluir Item
          </Button>
        </div>
      </Modal>
    </div>
  );
}
