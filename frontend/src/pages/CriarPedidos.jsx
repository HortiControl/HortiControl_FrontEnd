import { useCriarPedidoPageState } from "../hooks/CriarPedidos/useCriarPedidoPageState";
import { SelecaoCliente } from "../components/CriarPedidos/SelecaoCliente";
import { SecaoSanfonaProdutos } from "../components/CriarPedidos/SecaoSanfonaProdutos";
import { LinhaProdutoDesktop } from "../components/CriarPedidos/LinhaProdutoDesktop";
import { CardProdutoMobile } from "../components/CriarPedidos/CardProdutoMobile";
import { ResumoPedido } from "../components/CriarPedidos/ResumoPedido";

export default function CriarPedidos() {
  const {
    mercadosData,
    produtosData,
    mercadoSelecionado,
    onSelecionarMercado,
    abaAberta,
    onAlternarSecao,
    handleLancarPedido,

    carrinho,
    totalGeral,
    totalItens,
    obterQuantidade,
    handleChangeQuantidade,
    finalizarEdicaoQuantidade,
    incrementar,
    decrementar,
    atualizarQtd,
    removerItem,
    limparCarrinho,
  } = useCriarPedidoPageState();

  const renderSecaoProdutos = (id, titulo, produtos) => (
    <SecaoSanfonaProdutos
      id={id}
      titulo={titulo}
      produtos={produtos}
      isAberta={abaAberta === id}
      onToggle={() => onAlternarSecao(id)}
      mobileItems={produtos?.map((produto) => (
        <CardProdutoMobile
          key={produto.id}
          produto={produto}
          quantidade={obterQuantidade(produto.id)}
          onChangeQuantidade={(valor) => handleChangeQuantidade(produto, valor)}
          onBlurQuantidade={() => finalizarEdicaoQuantidade(produto.id)}
          onIncrementar={() => incrementar(produto)}
          onDecrementar={() => decrementar(produto)}
        />
      ))}
    >
      {produtos?.map((produto) => (
        <LinhaProdutoDesktop
          key={produto.id}
          produto={produto}
          quantidade={obterQuantidade(produto.id)}
          onChangeQuantidade={(valor) => handleChangeQuantidade(produto, valor)}
          onBlurQuantidade={() => finalizarEdicaoQuantidade(produto.id)}
          onIncrementar={() => incrementar(produto)}
          onDecrementar={() => decrementar(produto)}
        />
      ))}
    </SecaoSanfonaProdutos>
  );

  return (
    <div>
      <div>
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Criar Novo Pedido
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Lance manualmente um pedido para um mercado
          </p>
        </header>
      </div>

      {/* Layout Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Coluna da Esquerda (Formulário e Produtos) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <SelecaoCliente
            mercados={mercadosData}
            mercadoSelecionado={mercadoSelecionado}
            onSelecionar={onSelecionarMercado}
          />

          <div className="flex flex-col gap-3">
            {renderSecaoProdutos(
              "nao_lavados",
              "Produtos Não Lavados",
              produtosData.nao_lavados,
            )}
            {renderSecaoProdutos(
              "pre_lavados",
              "Produtos Pré-Lavados",
              produtosData.pre_lavados,
            )}
          </div>
        </div>

        {/* Coluna da Direita (Resumo do Pedido) */}
        <ResumoPedido
          carrinho={carrinho}
          totalGeral={totalGeral}
          totalItens={totalItens}
          onLimparCarrinho={limparCarrinho}
          onRemoverItem={removerItem}
          onAtualizarQtd={atualizarQtd}
          onLancarPedido={handleLancarPedido}
        />
      </div>
    </div>
  );
}
