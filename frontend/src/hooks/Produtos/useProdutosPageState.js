import { useCallback, useEffect, useState } from "react";
import {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  excluirProduto,
  reajustarPrecoGlobal,
} from "../../services/produtosService";
import { formatarProdutoDaApi } from "../../utils/produtoMappers";
import { useNotification } from "../../components/notifications/NotificationContext";

const FORM_DATA_INICIAL = {
  preco: "",
  nome: "",
  embalagem: "BANDEJA",
  tipo: "PRE_LAVADO",
};

const BUSCA_DEBOUNCE_MS = 400;

/** Orquestra estado e regra de negócio da tela de Produtos. */
export function useProdutosPageState() {
  const notify = useNotification();

  const [produtosData, setProdutosData] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("TODOS");

  const [modalAtivo, setModalAtivo] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [formData, setFormData] = useState(FORM_DATA_INICIAL);
  const [valorGlobal, setValorGlobal] = useState(0);

  const carregarProdutos = useCallback(
    (filtro = "") => {
      listarProdutos(filtro)
        .then((data) => {
          if (!data || data.length === 0) {
            setProdutosData([]);
            return;
          }

          const produtosFormatados = data
            .map(formatarProdutoDaApi)
            .sort((a, b) => a.nome.localeCompare(b.nome));

          setProdutosData(produtosFormatados);
        })
        .catch((error) => {
          console.error("Erro ao carregar produtos: ", error);
          notify.error("Não foi possível carregar os produtos neste momento.");
        });
    },
    [notify],
  );

  useEffect(() => {
    if (busca.trim() === "") {
      carregarProdutos();
      return;
    }

    const delayDeBusca = setTimeout(() => {
      carregarProdutos(busca);
    }, BUSCA_DEBOUNCE_MS);

    return () => clearTimeout(delayDeBusca);
  }, [busca, carregarProdutos]);

  const abrirModal = (tipo, alvo = null) => {
    setModalAtivo(tipo);

    if (tipo === "edit" && alvo) {
      setProdutoSelecionado(alvo);
      setFormData({
        preco: alvo.preco,
        nome: alvo.nome,
        embalagem: alvo.embalagem,
        tipo: alvo.tipo,
      });
    }

    if (tipo === "add") {
      setFormData(FORM_DATA_INICIAL);
    }

    if (tipo === "delete" && alvo) {
      setProdutoSelecionado(alvo);
    }

    if (tipo === "reajustar") {
      setValorGlobal(0);
    }
  };

  const fecharModal = () => {
    setModalAtivo(null);
    setProdutoSelecionado(null);
  };

  const handleAlterarCampoForm = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSalvar = async () => {
    const precoFormatado = String(formData.preco).replace(",", ".");

    const dadosDoForms = {
      nome: formData.nome,
      preco: Number(precoFormatado),
      tipoEmbalagem: formData.embalagem,
      tipoProduto: formData.tipo,
    };

    try {
      if (modalAtivo === "add") {
        await criarProduto(dadosDoForms);
        notify.success("Produto adicionado com sucesso.");
      } else if (modalAtivo === "edit") {
        await atualizarProduto(produtoSelecionado.id, dadosDoForms);
        notify.success("Produto atualizado com sucesso.");
      }

      carregarProdutos();
      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar produto: ", error);
      notify.error(
        "Não foi possível salvar. Verifique os dados e tente novamente.",
      );
    }
  };

  const handleAtualizarGlobal = async () => {
    try {
      const valorGlobalFormatado = String(valorGlobal).replace(",", ".");

      await reajustarPrecoGlobal(valorGlobalFormatado);

      notify.success("Valores atualizados com sucesso.");
      carregarProdutos();
      fecharModal();
    } catch (error) {
      console.error("Erro ao atualizar valor global de produtos: ", error);
      notify.error(
        "Não foi possível atualizar os valores. Verifique os dados.",
      );
    }
  };

  const handleExcluir = async () => {
    try {
      await excluirProduto(produtoSelecionado.id);

      setProdutosData((prev) =>
        prev.filter((produto) => produto.id !== produtoSelecionado.id),
      );

      notify.success("Produto excluído com sucesso.");
      fecharModal();
    } catch (error) {
      console.error("Erro ao excluir Produto:", error);
      notify.error("Não foi possível excluir o produto.");
    }
  };

  const produtosFiltrados = produtosData.filter((produto) => {
    if (filtroAtivo === "TODOS") return true;
    if (filtroAtivo === "PRÉ-LAVADO") return produto.tipo === "PRE_LAVADO";
    if (filtroAtivo === "NÃO LAVADO") return produto.tipo === "NAO_LAVADO";
    return true;
  });

  return {
    produtosFiltrados,
    busca,
    onChangeBusca: setBusca,
    filtroAtivo,
    onFiltrarPorTipo: setFiltroAtivo,

    modalAtivo,
    produtoSelecionado,
    formData,
    onChangeCampoForm: handleAlterarCampoForm,
    valorGlobal,
    onChangeValorGlobal: setValorGlobal,

    abrirModal,
    fecharModal,
    handleSalvar,
    handleAtualizarGlobal,
    handleExcluir,
  };
}
