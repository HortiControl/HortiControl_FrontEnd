export function formatarProdutoDaApi(produto) {
  return {
    id: produto.id,
    preco: produto.preco,
    nome: produto.nome,
    embalagem: produto.tipoEmbalagem,
    tipo: produto.tipoProduto,
  };
}
