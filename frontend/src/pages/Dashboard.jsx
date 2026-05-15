import { useState } from 'react';
import {
  DollarSign,
  Package,
  Inbox,
  Archive,
  ShoppingBag
} from 'lucide-react';
import { ContentCard } from '../components/ContentCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';

export function Dashboard() {
  const periodos = ['Hoje', 'Semana passada', 'Esta semana', 'Este mês', 'Mês passado', 'Ano'];
  const [periodoAtivo, setPeriodoAtivo] = useState('Esta semana');

  // dados mockados
  const melhoresClientes = [
    { id: 1, nome: 'Mercado São Paulo', pedidos: 3, valor: '220,00' },
    { id: 2, nome: 'MJ4', pedidos: 1, valor: '200,00' },
    { id: 3, nome: 'MJ2', pedidos: 2, valor: '183,00' },
    { id: 4, nome: 'MJ1', pedidos: 1, valor: '129,00' }
  ];

  const produtosVendidos = [
    { id: 1, nome: 'Alface Lisa', tipo: 'Pré-Lavado', unidades: 54 },
    { id: 2, nome: 'Alface Americana', tipo: 'Não Lavado', unidades: 47 },
    { id: 3, nome: 'Rúcula', tipo: 'Não Lavado', unidades: 26 },
    { id: 4, nome: 'Shimeji', tipo: 'Pré-Lavado', unidades: 14 }
  ];

  // Eixo X do gráfico
  // const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const dataFaturamento = [
    { name: 'Seg.', total: 4200 },
    { name: 'Ter.', total: 2800 },
    { name: 'Qua.', total: 3500 },
    { name: 'Qui.', total: 5100 },
  ];

  const dataEmbalagens = [
    { name: 'Jan', bandejas: 12, potes: 10, sacos: 15 },
    { name: 'Fev', bandejas: 10, potes: 18, sacos: 35 },
    { name: 'Mar', bandejas: 18, potes: 12, sacos: 32 },
    { name: 'Abr', bandejas: 8, potes: 11, sacos: 38 },
    { name: 'Mai', bandejas: 35, potes: 15, sacos: 55 },
    { name: 'Jun', bandejas: 25, potes: 10, sacos: 48 },
    { name: 'Jul', bandejas: 28, potes: 8, sacos: 42 },
    { name: 'Ago', bandejas: 15, potes: 22, sacos: 45 },
    { name: 'Set', bandejas: 12, potes: 45, sacos: 18 },
    { name: 'Out', bandejas: 10, potes: 42, sacos: 12 },
    { name: 'Nov', bandejas: 22, potes: 12, sacos: 10 },
    { name: 'Dez', bandejas: 32, potes: 15, sacos: 25 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
          <p className="text-xs font-bold text-gray-400 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-bold" style={{ color: entry.color || entry.fill }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6">

      {/* cabeçalho */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-semibold text-gray-800">Resultados</h1>
        <p className="text-gray-500 mt-1 font-medium">Acompanhe os resultados e o desempenho do seu negócio</p>
      </div>

      {/* filtros por periodo */}
      <div className="flex flex-wrap gap-2">
        {periodos.map((p) => (
          <button
            key={p}
            onClick={() => setPeriodoAtivo(p)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${periodoAtivo === p
              ? 'bg-[#00a859] text-white border-[#00a859]'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* cards KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* card faturamento */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Faturado</p>
            <h3 className="text-2xl font-bold text-gray-800">R$ 2878.50</h3>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#00a859]">
            <DollarSign size={24} />
          </div>
        </div>

        {/* card total de pedidos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total de Pedidos</p>
            <h3 className="text-2xl font-bold text-gray-800">11</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
            <Package size={24} />
          </div>
        </div>

        {/* card embalagens */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Consumo de Embalagens</p>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold">NO PERÍODO</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 text-orange-600 flex items-center justify-center rounded border border-orange-100"><Inbox size={16} /></div>
              <div><p className="text-[9px] font-bold text-orange-600 uppercase">Bandejas</p><p className="font-bold text-gray-800 leading-none">24</p></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 flex items-center justify-center rounded border border-blue-100"><Archive size={16} /></div>
              <div><p className="text-[9px] font-bold text-blue-600 uppercase">Potes</p><p className="font-bold text-gray-800 leading-none">67</p></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 text-green-600 flex items-center justify-center rounded border border-green-100"><ShoppingBag size={16} /></div>
              <div><p className="text-[9px] font-bold text-green-600 uppercase">Sacos</p><p className="font-bold text-gray-800 leading-none">43</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* grid dos gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Seção de Gráficos (Evolução e Histórico) */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Gráfico de Barras - Evolução do Faturamento */}
          <ContentCard title="Evolução do faturamento" subtitle="Acompanhe seu faturamento conforme o período">
            <div className="h-72 w-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataFaturamento}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    tickFormatter={(value) => `R$ ${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                  <Bar
                    dataKey="total"
                    fill="#0B623C"
                    radius={[6, 6, 0, 0]}
                    barSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ContentCard>

          {/* Gráfico de Linhas - Histórico de Embalagens */}
          <ContentCard title="Histórico de embalagens" subtitle="Volume consumido mês a mês (Visão anual fixa)">
            <div className="h-72 w-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataEmbalagens} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 600 }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                  <Line
                    name="Bandejas"
                    type="monotone"
                    dataKey="bandejas"
                    stroke="#d94a11"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#d94a11' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    name="Potes"
                    type="monotone"
                    dataKey="potes"
                    stroke="#185adb"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#185adb' }}
                  />
                  <Line
                    name="Sacos"
                    type="monotone"
                    dataKey="sacos"
                    stroke="#00a859"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#00a859' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ContentCard>
        </div>

        {/* Seção de Rankings (Melhores Clientes e Produtos) */}
        <div className="flex flex-col gap-6">
          <ContentCard title="Melhores Clientes" subtitle="Lista dos clientes mais lucrativos">
            <div className="p-4 flex flex-col gap-4">
              {melhoresClientes.map((c, i) => (
                <div key={c.id} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-50 text-[#00a859] border border-green-100 flex items-center justify-center text-[10px] font-bold">{i + 1}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{c.nome}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{c.pedidos} pedidos no total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">R$ {c.valor}</p>
                    <p className="text-[10px] text-gray-400 font-medium">em compras</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>

          <ContentCard title="Produtos mais vendidos" subtitle="Lista de produtos mais vendidos no período">
            <div className="p-4 flex flex-col gap-4">
              {produtosVendidos.map((p, i) => (
                <div key={p.id} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-50 text-[#00a859] border border-green-100 flex items-center justify-center text-[10px] font-bold">{i + 1}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{p.nome}</p>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${p.tipo === 'Pré-Lavado' ? 'bg-[#00a859] text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {p.tipo}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-gray-600">
                    {p.unidades} unidades
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        </div>

      </div>
    </div>
  );
}