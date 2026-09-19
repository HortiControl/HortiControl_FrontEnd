import { useState } from "react";

/** Isola toda a regra de negócio do carrinho de compras do pedido. */
export function useCarrinho() {
  const [carrinho, setCarrinho] = useState([]);

  const removerItem = (id) =>
    setCarrinho((prev) => prev.filter((item) => item.id !== id));

  const atualizarQtd = (id, delta) => {
    setCarrinho((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qtd: Math.max(1, item.qtd + delta) } : item,
      ),
    );
  };

  const obterQuantidade = (produtoId) => {
    const item = carrinho.find((item) => item.id === produtoId);
    return item ? item.qtd : 0;
  };

  const handleChangeQuantidade = (produto, valorDigitado) => {
    if (valorDigitado === "") {
      setCarrinho((prev) =>
        prev.map((item) =>
          item.id === produto.id ? { ...item, qtd: "" } : item,
        ),
      );
      return;
    }

    const novaQtd = parseInt(valorDigitado);

    if (novaQtd > 0) {
      const itemExiste = carrinho.find((item) => item.id === produto.id);
      if (!itemExiste) {
        setCarrinho((prev) => [...prev, { ...produto, qtd: novaQtd }]);
      } else {
        setCarrinho((prev) =>
          prev.map((item) =>
            item.id === produto.id ? { ...item, qtd: novaQtd } : item,
          ),
        );
      }
    } else {
      removerItem(produto.id);
    }
  };

  const finalizarEdicaoQuantidade = (produtoId) => {
    const item = carrinho.find((item) => item.id === produtoId);
    if (item && (item.qtd === "" || item.qtd === 0)) {
      removerItem(produtoId);
    }
  };

  const incrementar = (produto) => {
    const itemExiste = carrinho.find((item) => item.id === produto.id);
    if (!itemExiste) {
      setCarrinho((prev) => [...prev, { ...produto, qtd: 1 }]);
    } else {
      atualizarQtd(produto.id, 1);
    }
  };

  const decrementar = (produto) => {
    const quantidadeAtual = obterQuantidade(produto.id);
    if (quantidadeAtual <= 1) {
      removerItem(produto.id);
    } else {
      atualizarQtd(produto.id, -1);
    }
  };

  const limparCarrinho = () => setCarrinho([]);

  const totalGeral = carrinho.reduce(
    (acc, item) => acc + item.preco * item.qtd,
    0,
  );
  const totalItens = carrinho.reduce(
    (acc, item) => acc + (Number(item.qtd) || 0),
    0,
  );

  return {
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
  };
}
