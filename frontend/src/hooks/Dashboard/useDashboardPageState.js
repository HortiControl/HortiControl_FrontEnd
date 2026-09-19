import { useEffect, useState } from "react";
import { buscarResultados } from "../../services/Dashboard/dashboardService";
import { normalizarResultadosDashboard } from "../../utils/Dashboard/dashboardMappers";

export const PERIODOS_DASHBOARD = [
  "Hoje",
  "Esta Semana",
  "Semana Passada",
  "Este mês",
  "Mês passado",
  "Ano",
];

const DADOS_INICIAIS = {
  faturadoTotal: 0,
  totalPedidos: 0,
  consumoEmbalagens: { bandejas: 0, potes: 0, sacos: 0 },
  evolucaoFaturamento: [],
  melhoresClientes: [],
  produtosMaisVendidos: [],
  historicoEmbalagens: [],
};

/** Orquestra estado e regra de negócio da tela de Dashboard. */
export function useDashboardPageState() {
  const [periodoAtivo, setPeriodoAtivo] = useState("Hoje");
  const [dados, setDados] = useState(DADOS_INICIAIS);

  useEffect(() => {
    buscarResultados(periodoAtivo)
      .then((resultado) => {
        setDados((dadosAtuais) =>
          normalizarResultadosDashboard(resultado, dadosAtuais),
        );
      })
      .catch((error) => {
        console.error("Erro ao carregar dados da dashboard:", error);
      });
  }, [periodoAtivo]);

  return {
    periodos: PERIODOS_DASHBOARD,
    periodoAtivo,
    onSelecionarPeriodo: setPeriodoAtivo,
    dados,
  };
}
