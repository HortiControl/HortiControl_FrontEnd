import apiExport from "../provider/apiExport";

// O microsserviço não devolve o PDF na hora: ele aceita o pedido e vai
// processando. Por isso aqui a gente pergunta de tempos em tempos se já ficou
// pronto antes de baixar.
const INTERVALO = 1000;
const MAX_TENTATIVAS = 30;

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function baixar(conteudo, nome) {
  const url = URL.createObjectURL(conteudo);
  const link = document.createElement("a");

  link.href = url;
  link.download = nome || "pedidos.pdf";
  link.click();

  URL.revokeObjectURL(url);
}

export async function exportarPedidosPdf(filtro) {
  const { data: solicitacao } = await apiExport.post("/exportacoes", filtro);

  let exportacao = solicitacao;

  for (let i = 0; i < MAX_TENTATIVAS; i++) {
    if (exportacao.status === "CONCLUIDA" || exportacao.status === "FALHOU") {
      break;
    }

    await esperar(INTERVALO);

    const { data } = await apiExport.get(`/exportacoes/${solicitacao.id}`);
    exportacao = data;
  }

  if (exportacao.status === "FALHOU") {
    throw new Error(exportacao.motivoDaFalha || "A exportação falhou.");
  }

  if (exportacao.status !== "CONCLUIDA") {
    throw new Error("A exportação está demorando mais que o esperado.");
  }

  const { data: arquivo } = await apiExport.get(
    `/exportacoes/${solicitacao.id}/arquivo`,
    { responseType: "blob" },
  );

  baixar(arquivo, exportacao.nomeDoArquivo);

  return exportacao;
}
