import { useProdutosPageState } from "../hooks/useProdutosPageState";
import { PageHeader } from "../components/PageHeader";
import { ContentCard } from "../components/ContentCard";
import { BuscaEReajustePrecos } from "../components/Produtos/BuscaEReajustePrecos";
import { FiltroTipoProduto } from "../components/Produtos/FiltroTipoProduto";
import { ProdutosLista } from "../components/Produtos/ProdutosLista";
import { ProdutoFormModal } from "../components/Produtos/ProdutoFormModal";
import { ExcluirProdutoModal } from "../components/Produtos/ExcluirProdutoModal";
import { ReajustarPrecoModal } from "../components/Produtos/ReajustarPrecoModal";

export function Produtos() {
  const {
    produtosFiltrados,
    busca,
    onChangeBusca,
    filtroAtivo,
    onFiltrarPorTipo,
    modalAtivo,
    produtoSelecionado,
    formData,
    onChangeCampoForm,
    onChangeValorGlobal,
    abrirModal,
    fecharModal,
    handleSalvar,
    handleAtualizarGlobal,
    handleExcluir,
  } = useProdutosPageState();

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
        subtitle={
          <BuscaEReajustePrecos
            busca={busca}
            onChangeBusca={onChangeBusca}
            onAbrirReajuste={() => abrirModal("reajustar")}
          />
        }
        filters={
          <FiltroTipoProduto filtroAtivo={filtroAtivo} onFiltrar={onFiltrarPorTipo} />
        }
      >
        <ProdutosLista
          produtos={produtosFiltrados}
          onEditar={(produto) => abrirModal("edit", produto)}
          onExcluir={(produto) => abrirModal("delete", produto)}
        />
      </ContentCard>

      <ProdutoFormModal
        isOpen={modalAtivo === "add" || modalAtivo === "edit"}
        isEdicao={modalAtivo === "edit"}
        formData={formData}
        onChangeCampo={onChangeCampoForm}
        onClose={fecharModal}
        onSalvar={handleSalvar}
      />

      <ExcluirProdutoModal
        isOpen={modalAtivo === "delete"}
        produto={produtoSelecionado}
        onClose={fecharModal}
        onConfirmar={handleExcluir}
      />

      <ReajustarPrecoModal
        isOpen={modalAtivo === "reajustar"}
        onClose={fecharModal}
        onChangeValorGlobal={onChangeValorGlobal}
        onConfirmar={handleAtualizarGlobal}
      />
    </div>
  );
}
