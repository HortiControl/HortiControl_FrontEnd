export function formatarCEP(valor) {
  return String(valor || "")
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
}

export function formatarData(dataString) {
  if (!dataString) return "";
  const [ano, mes, dia] = dataString.split("T")[0].split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const ROTULOS_TIPO_PRODUTO = {
  PRE_LAVADO: "Pré-Lavado",
  NAO_LAVADO: "Não Lavado",
};

export function formatarTipoProduto(tipo) {
  return ROTULOS_TIPO_PRODUTO[tipo] || tipo;
}
