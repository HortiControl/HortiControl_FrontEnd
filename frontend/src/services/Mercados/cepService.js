const VIA_CEP_BASE_URL = "https://viacep.com.br/ws";
const VIA_CEP_TIMEOUT_MS = 10000;

/**
 * Consulta a API pública do ViaCEP.
 * Retorna `null` se o CEP informado for inválido/incompleto.
 * Lança erro com name "AbortError" em caso de timeout.
 */
export async function buscarEnderecoPorCep(cep) {
  const cepLimpo = String(cep || "").replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    VIA_CEP_TIMEOUT_MS,
  );

  try {
    const response = await fetch(`${VIA_CEP_BASE_URL}/${cepLimpo}/json/`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`ViaCEP respondeu com status HTTP ${response.status}.`);
    }

    const data = await response.json();

    const cepRetornado =
      typeof data.cep === "string" ? data.cep.replace(/\D/g, "") : "";

    if (data.erro || cepRetornado !== cepLimpo) {
      throw new Error("CEP inválido ou resposta inválida do ViaCEP.");
    }

    return {
      ...data,
      cep: cepRetornado,
      logradouro: String(data.logradouro || "")
        .trim()
        .slice(0, 120),
      bairro: String(data.bairro || "")
        .trim()
        .slice(0, 80),
      localidade: String(data.localidade || "")
        .trim()
        .slice(0, 80),
      uf: String(data.uf || "")
        .trim()
        .toUpperCase()
        .slice(0, 2),
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
