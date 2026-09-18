import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ContentCard } from "../ContentCard";
import { CustomTooltip } from "./CustomTooltip";

export function GraficoHistoricoEmbalagens({ historicoEmbalagens }) {
  return (
    <ContentCard
      title="Histórico de embalagens"
      subtitle="Volume consumido mês a mês (Visão anual fixa)"
    >
      <div
        className="w-full p-3 sm:p-4"
        style={{ height: "320px", minHeight: "320px" }}
      >
        {historicoEmbalagens && historicoEmbalagens.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={historicoEmbalagens}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="mes"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
              <Line
                name="Bandejas"
                type="monotone"
                dataKey="bandejas"
                stroke="#d94a11"
                strokeWidth={3}
                dot={{ r: 4, fill: "#d94a11" }}
                activeDot={{ r: 6 }}
              />
              <Line
                name="Potes"
                type="monotone"
                dataKey="potes"
                stroke="#185adb"
                strokeWidth={3}
                dot={{ r: 4, fill: "#185adb" }}
              />
              <Line
                name="Sacos"
                type="monotone"
                dataKey="sacos"
                stroke="#00a859"
                strokeWidth={3}
                dot={{ r: 4, fill: "#00a859" }}
              />
            </LineChart>
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
