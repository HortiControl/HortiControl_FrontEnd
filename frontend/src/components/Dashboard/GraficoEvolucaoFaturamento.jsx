import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ContentCard } from "../ContentCard";
import { CustomTooltip } from "./CustomTooltip";

export function GraficoEvolucaoFaturamento({ evolucaoFaturamento }) {
  return (
    <ContentCard
      title="Evolução do faturamento"
      subtitle="Acompanhe seu faturamento conforme o período"
    >
      <div
        className="w-full p-3 sm:p-4"
        style={{ height: "320px", minHeight: "320px" }}
      >
        {evolucaoFaturamento && evolucaoFaturamento.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={evolucaoFaturamento}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
              <Bar dataKey="valor" fill="#0B623C" radius={[6, 6, 0, 0]} barSize={45} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Carregando dados...
          </div>
        )}
      </div>
    </ContentCard>
  );
}
