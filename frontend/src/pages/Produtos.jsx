import { useState, useEffect } from "react";
import { Search, Pencil, Trash2, RefreshCw } from "lucide-react";
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

export function Produtos() {
  const notify = useNotification();
  const [produtosData, setProdutosData] = useState([]);
  const [modalAtivo, setModalAtivo] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [valorGlobal, setValorGlobal] = useState(0);
  const [busca, setBusca] = useState("");

  const [filtroAtivo, setFiltroAtivo] = useState("TODOS");

  const [formData, setFormData] = useState({
    preco: "",
    nome: "",
    embalagem: "BANDEJA",
    tipo: "PRE_LAVADO",
  });

  const formatarMoeda = (valor) => {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const carregarProdutos = (filtro = "") => {
    let url = "/produtos";

    if (filtro !== "") {
      url = `/produtos/busca?nome=${filtro}`;
    }

    /*
     * Não é necessário enviar Authorization manualmente.
     * O navegador envia o cookie HttpOnly por meio do cliente api.
     */
    api
      .get(url)
      .then((response) => {
        if (response.data.length === 0 || response.status === 204) {
          setProdutosData([]);
          return;
        } else {
          const produtosFormatados = response.data
            .map((produto) => ({
              id: produto.id,
              preco: produto.preco,
              nome: produto.nome,
              embalagem: produto.tipoEmbalagem,
              tipo: produto.tipoProduto,
            }))
            .sort((a, b) => a.nome.localeCompare(b.nome));

          setProdutosData(produtosFormatados);
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar produtos: ", error);
        notify.error("Não foi possível carregar os produtos neste momento.");
      });
  };

  useEffect(() => {
    /*
     * A busca não depende mais de um token armazenado no navegador.
     */
    if (busca.trim() === "") {
      carregarProdutos();
      return;
    }

    const delayDeBusca = setTimeout(() => {
      carregarProdutos(busca);
    }, 400);

    return () => clearTimeout(delayDeBusca);
  }, [busca]);

  const fecharModal = () => {
    setModalAtivo(null);
    setProdutoSelecionado(null);
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
        await api.post("/produtos", dadosDoForms);
        notify.success("Produto adicionado com sucesso.");
      } else if (modalAtivo === "edit") {
        await api.put(`/produtos/${produtoSelecionado.id}`, dadosDoForms);

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

      /*
       * O cookie JWT é enviado automaticamente.
       * Por ser PATCH, o interceptor também adiciona o token CSRF.
       */
      await api.patch(
        `/produtos/reajuste-global?novoPreco=${valorGlobalFormatado}`,
        {},
      );

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
      await api.delete(`/produtos/${produtoSelecionado.id}`);

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

  const BuscaEReajuste = (
    <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
      <div className="relative flex items-center w-full sm:w-64">
        <Search size={16} className="absolute left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome..."
          className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-md text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
      <Button
        variant="primary"
        icon={RefreshCw}
        onClick={() => abrirModal("reajustar")}
      >
        Reajustar Preços
      </Button>
    </div>
  );

  const FiltrosProdutos = (
    <div className="flex flex-col items-start gap-1 text-sm sm:items-end">
      <span className="mb-1 text-xs font-medium text-gray-500">
        Tipo de Produto
      </span>
      <div className="flex flex-wrap gap-2">
        {["TODOS", "PRÉ-LAVADO", "NÃO LAVADO"].map((f) => (
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

  return (
    <div className="h-full">
      <PageHeader
        title="Produtos"
        subtitle="Gerencie seu catálogo de produtos e preços"
        buttonText="Adicionar Produto"
        onButtonClick={() => abrirModal("add")}
      />

      <ContentCard
        title="Todos os Produtos"
        count={produtosFiltrados.length}
        subtitle={BuscaEReajuste}
        filters={FiltrosProdutos}
      >
        <div className="max-h-[calc(100vh-18rem)] overflow-y-auto pr-2">
          <div className="space-y-3 md:hidden">
            {produtosFiltrados.map((produto) => (
              <article
                key={produto.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-800">
                      {produto.nome}
                    </h3>
                    <p className="mt-1 text-sm text-[#00a859] font-bold">
                      {formatarMoeda(produto.preco)}
                    </p>
                  </div>
                  <Badge text={produto.embalagem} />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      produto.tipo === "PRE_LAVADO"
                        ? "bg-[#00a859] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {produto.tipo === "PRE_LAVADO"
                      ? "Pré-Lavado"
                      : "Não Lavado"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    onClick={() => abrirModal("edit", produto)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Pencil size={14} /> Editar
                  </button>
                  <button
                    onClick={() => abrirModal("delete", produto)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-600 bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    <Trash2 size={14} /> Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block">
            <Table headers={["Nome", "Tipo", "Embalagem", "Preço"]}>
              {produtosFiltrados.map((produto) => (
                <tr
                  key={produto.id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {produto.nome}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        produto.tipo === "PRE_LAVADO"
                          ? "bg-[#00a859] text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {produto.tipo === "PRE_LAVADO"
                        ? "Pré-Lavado"
                        : "Não Lavado"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <Badge text={produto.embalagem} />
                  </td>

                  <td className="px-6 py-4 text-[#00a859] font-bold">
                    {formatarMoeda(produto.preco)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => abrirModal("edit", produto)}
                        className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <Pencil size={14} /> Editar
                      </button>
                      <button
                        onClick={() => abrirModal("delete", produto)}
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

      <Modal
        isOpen={modalAtivo === "add" || modalAtivo === "edit"}
        onClose={fecharModal}
        title={
          modalAtivo === "add" ? "Adicionar Novo Produto" : "Editar Produto"
        }
      >
        <Input
          label="Nome do Produto:"
          placeholder="Ex: Alface Lisa"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        />
        <Select
          label="Tipo de Processamento"
          options={["PRE-LAVADO", "NAO-LAVADO"]}
          value={formData.tipo}
          onChange={(e) =>
            setFormData({ ...formData, tipo: e.target.value.replace("-", "_") })
          }
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Select
            label="Embalagem"
            options={["POTE", "BANDEJA", "SACO"]}
            value={formData.embalagem}
            onChange={(e) =>
              setFormData({ ...formData, embalagem: e.target.value })
            }
          />
          <Input
            label="Preço Atual (R$)"
            placeholder="0,00"
            value={formData.preco}
            onChange={(e) =>
              setFormData({ ...formData, preco: e.target.value })
            }
          />
        </div>
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
        isOpen={modalAtivo === "delete"}
        onClose={fecharModal}
        title="Confirmar Exclusão"
        isDanger={true}
      >
        <p className="text-gray-700">
          Tem certeza que deseja excluir{" "}
          <span className="font-bold">{produtoSelecionado?.nome}</span>?
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleExcluir}>
            Excluir Produto
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={modalAtivo === "reajustar"}
        onClose={fecharModal}
        title="Reajustar Preços"
      >
        <Input
          label="Novo Valor (R$)"
          placeholder="Ex: 9,00"
          onChange={(e) => setValorGlobal(e.target.value)}
        />
        <div className="flex justify-center gap-3 mt-6">
          <Button variant="secondary" onClick={fecharModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAtualizarGlobal}>
            Aplicar Reajuste
          </Button>
        </div>
      </Modal>
    </div>
  );
}
