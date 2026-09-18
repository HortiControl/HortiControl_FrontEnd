/**
 * Normaliza a resposta de /resultados, preservando os valores padrões
 * quando algum campo não for retornado pelo backend.
 */
export function normalizarResultadosDashboard(resultado, dadosAtuais) {
  const resultadoSeguro =
    resultado && typeof resultado === "object" && !Array.isArray(resultado)
      ? resultado
      : {};

  return {
    ...dadosAtuais,
    ...resultadoSeguro,

    // consumoEmbalagens é um objeto interno, por isso é combinado separadamente.
    consumoEmbalagens: {
      ...dadosAtuais.consumoEmbalagens,
      ...(resultadoSeguro.consumoEmbalagens ?? {}),
    },

    // Garante que os campos utilizados com map() sempre sejam listas.
    evolucaoFaturamento: Array.isArray(resultadoSeguro.evolucaoFaturamento)
      ? resultadoSeguro.evolucaoFaturamento
      : [],

    melhoresClientes: Array.isArray(resultadoSeguro.melhoresClientes)
      ? resultadoSeguro.melhoresClientes
      : [],

    produtosMaisVendidos: Array.isArray(resultadoSeguro.produtosMaisVendidos)
      ? resultadoSeguro.produtosMaisVendidos
      : [],

    historicoEmbalagens: Array.isArray(resultadoSeguro.historicoEmbalagens)
      ? resultadoSeguro.historicoEmbalagens
      : [],
  };
}
