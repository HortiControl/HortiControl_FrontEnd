export function formatarProdutoDaApi(produto) {
  return {
    id: produto.id,
    preco: produto.preco,
    nome: produto.nome,
    embalagem: produto.tipoEmbalagem,
    tipo: produto.tipoProduto,
  };
}

export function formatarProdutoPreLavado(produto) {
  return {
    id: produto.id,
    nome: produto.nome,
    embalagem: produto.tipoEmbalagem,
    preco: produto.preco,
    tipoProduto: "PRE_LAVADO",
  };
}

export function formatarProdutoNaoLavado(produto) {
  return {
    id: produto.id,
    nome: produto.nome,
    embalagem: produto.tipoEmbalagem,
    preco: produto.preco,
    tipoProduto: "NAO_LAVADO",
  };
}
