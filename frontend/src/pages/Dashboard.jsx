import { useDashboardPageState } from "../hooks/useDashboardPageState";
import { FiltroPeriodo } from "../components/Dashboard/FiltroPeriodo";
import { KpiCardsSection } from "../components/Dashboard/KpiCardsSection";
import { GraficoEvolucaoFaturamento } from "../components/Dashboard/GraficoEvolucaoFaturamento";
import { GraficoHistoricoEmbalagens } from "../components/Dashboard/GraficoHistoricoEmbalagens";
import { RankingMelhoresClientes } from "../components/Dashboard/RankingMelhoresClientes";
import { RankingProdutosMaisVendidos } from "../components/Dashboard/RankingProdutosMaisVendidos";

export function Dashboard() {
  const { periodos, periodoAtivo, onSelecionarPeriodo, dados } =
    useDashboardPageState();

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* cabeçalho */}
      <div className="mb-2 flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800 sm:text-3xl">
          Resultados
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500 sm:text-base">
          Acompanhe os resultados e o desempenho do seu negócio
        </p>
      </div>

      <FiltroPeriodo
        periodos={periodos}
        periodoAtivo={periodoAtivo}
        onSelecionar={onSelecionarPeriodo}
      />

      <KpiCardsSection dados={dados} />

      {/* grid dos gráficos */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:gap-6">
        {/* Seção de Gráficos (Evolução e Histórico) */}
        <div className="flex flex-col gap-3 lg:col-span-2 sm:gap-4">
          <GraficoEvolucaoFaturamento
            evolucaoFaturamento={dados.evolucaoFaturamento}
          />
          <GraficoHistoricoEmbalagens
            historicoEmbalagens={dados.historicoEmbalagens}
          />
        </div>

        {/* Seção de Rankings (Melhores Clientes e Produtos) */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <RankingMelhoresClientes melhoresClientes={dados.melhoresClientes} />
          <RankingProdutosMaisVendidos
            produtosMaisVendidos={dados.produtosMaisVendidos}
          />
        </div>
      </div>
    </div>
  );
}
