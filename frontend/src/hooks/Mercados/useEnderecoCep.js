import { useState } from "react";
import { buscarEnderecoPorCep as buscarEnderecoPorCepService } from "../../services/Mercados/cepService";
import { useNotification } from "../../components/notifications/NotificationContext";

/** Isola a busca de endereço via CEP (integração externa ViaCEP). */
export function useEnderecoCep() {
  const notify = useNotification();
  const [endereco, setEndereco] = useState(null);
  const [loadingEndereco, setLoadingEndereco] = useState(false);

  const buscarEnderecoPorCep = async (cep) => {
    const cepLimpo = String(cep || "").replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      setLoadingEndereco(true);
      setEndereco(null);

      const dadosEndereco = await buscarEnderecoPorCepService(cep);
      setEndereco(dadosEndereco);
    } catch (err) {
      setEndereco(null);
      if (err.name === "AbortError") {
        notify.warning("A consulta de CEP demorou demais. Tente novamente.");
      } else {
        console.error("Erro ao consultar o ViaCEP:", err);
        notify.warning(
          "CEP não encontrado ou serviço indisponível. Verifique o valor digitado.",
        );
      }
    } finally {
      setLoadingEndereco(false);
    }
  };

  const limparEndereco = () => setEndereco(null);

  return { endereco, loadingEndereco, buscarEnderecoPorCep, limparEndereco };
}
