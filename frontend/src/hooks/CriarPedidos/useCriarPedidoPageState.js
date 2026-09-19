import { useEffect, useState } from "react";
import { listarMercados } from "../../services/mercadosService";
import {
  listarProdutosPreLavados,
  listarProdutosNaoLavados,
} from "../../services/produtosService";
import { criarPedido } from "../../services/pedidosService";
import { formatarMercadoDaApi } from "../../utils/mercadoMappers";
import {
  formatarProdutoPreLavado,
  formatarProdutoNaoLavado,
} from "../../utils/produtoMappers";
import { useCarrinho } from "./useCarrinho";
import { useNotification } from "../../components/notifications/NotificationContext";

const MERCADO_PLACEHOLDER = "Selecione um mercado";

/** Orquestra estado e regra de negócio da tela de Criar Pedidos. */
export function useCriarPedidoPageState() {
  const notify = useNotification();
  const carrinhoState = useCarrinho();
  const { carrinho, limparCarrinho } = carrinhoState;

  const [mercadosData, setMercadosData] = useState([]);
  const [produtosData, setProdutosData] = useState({
    nao_lavados: [],
    pre_lavados: [],
  });
  const [mercadoSelecionado, setMercadoSelecionado] = useState(
    MERCADO_PLACEHOLDER,
  );
  const [abaAberta, setAbaAberta] = useState("");

  useEffect(() => {
    listarMercados()
      .then((data) => {
        if (data.length === 0) return;
        setMercadosData(data.map(formatarMercadoDaApi));
      })
      .catch((error) => {
        console.error("Erro ao carregar clientes:", error);
        notify.error("Não foi possível carregar os clientes.");
      });

    listarProdutosPreLavados()
      .then((data) => {
        if (data.length === 0) return;
        setProdutosData((prev) => ({
          ...prev,
          pre_lavados: data.map(formatarProdutoPreLavado),
        }));
      })
      .catch((error) => {
        console.error("Erro ao carregar clientes:", error);
        notify.error("Não foi possível carregar os produtos pré-lavados.");
      });

    listarProdutosNaoLavados()
      .then((data) => {
        if (data.length === 0) return;
        setProdutosData((prev) => ({
          ...prev,
          nao_lavados: data.map(formatarProdutoNaoLavado),
        }));
      })
      .catch((error) => {
        console.error("Erro ao carregar clientes:", error);
        notify.error("Não foi possível carregar os produtos não lavados.");
      });
  }, [notify]);

  const alternarSecao = (id) => {
    setAbaAberta((prev) => (prev === id ? "" : id));
  };

  const handleLancarPedido = () => {
    if (!mercadoSelecionado || mercadoSelecionado === MERCADO_PLACEHOLDER) {
      notify.warning("Selecione um mercado válido antes de lançar o pedido.");
      return;
    }

    if (carrinho.length === 0) {
      notify.warning("O carrinho está vazio. Adicione pelo menos um produto.");
      return;
    }

    const mercadoEncontrado = mercadosData.find(
      (mercado) => mercado.nome === mercadoSelecionado,
    );

    const novoPedido = {
      mercadoId: mercadoEncontrado ? mercadoEncontrado.id : null,
      itens: carrinho.map((item) => ({
        produtoId: item.id,
        quantidade: item.qtd,
      })),
    };

    criarPedido(novoPedido)
      .then(() => {
        notify.success("Pedido lançado com sucesso.");
        limparCarrinho();
        setMercadoSelecionado(MERCADO_PLACEHOLDER);
      })
      .catch((error) => {
        console.error("Erro ao registrar pedido:", error);
        notify.error("Não foi possível registrar o pedido. Tente novamente.");
      });
  };

  return {
    ...carrinhoState,
    mercadosData,
    produtosData,
    mercadoSelecionado,
    onSelecionarMercado: setMercadoSelecionado,
    abaAberta,
    onAlternarSecao: alternarSecao,
    handleLancarPedido,
  };
}
