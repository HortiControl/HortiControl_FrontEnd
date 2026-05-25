import { useState, useEffect } from 'react';
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
import api from '../provider/api';

export function Dashboard() {
  const periodos = ['Hoje', 'Semana passada', 'Esta semana', 'Este mês', 'Mês passado', 'Ano'];
  const [periodoAtivo, setPeriodoAtivo] = useState('Esta semana');

  const [dados, setDados] = useState({
    faturadoTotal: 0,
    totalPedidos: 0,
    consumoEmbalagens: { bandejas: 0, potes: 0, sacos: 0 },
    evolucaoFaturamento: [],
    melhoresClientes: [],
    produtosMaisVendidos: [],
    historicoEmbalagens: []
  });

  useEffect(() => {
    const url = `/resultados?periodo=${periodoAtivo}`;

    api.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then((resposta) => {
      console.log("Dados recebidos com sucesso:", resposta.data);
      setDados(resposta.data);
    })
      .catch((erro) => {
        console.error("Erro ao carregar dados da dashboard com Axios:", erro);

        if (erro.response) {
          console.error("Status do erro:", erro.response.status);
          console.error("Dados do erro:", erro.response.data);
        }
      });
  }, [periodoAtivo]);

  // Função para formatar moeda
  const formatarMoeda = (valor) => {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarTipoProduto = (tipo) => {
    const formatos = {
      'PRE_LAVADO': 'Pré-Lavado',
      'NAO_LAVADO': 'Não Lavado'
    };
    return formatos[tipo] || tipo;
  };

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
    <div className="flex flex-col gap-4">

      {/* cabeçalho */}
      <div className="flex flex-col mb-2">
        <h1 className="text-3xl font-semibold text-gray-800">Resultados</h1>
        <p className="text-gray-500 mt-1 font-medium">Acompanhe os resultados e o desempenho do seu negócio</p>
      </div>

      {/* filtros por periodo */}
      <div className="flex flex-wrap gap-3">
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
            <h3 className="text-2xl font-bold text-gray-800">{formatarMoeda(dados.faturadoTotal)}</h3>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#00a859]">
            <DollarSign size={24} />
          </div>
        </div>

        {/* card total de pedidos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total de Pedidos</p>
            <h3 className="text-2xl font-bold text-gray-800">{dados.totalPedidos}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
            <Package size={24} />
          </div>
        </div>

        {/* card embalagens */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Consumo de Embalagens</p>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 text-orange-600 flex items-center justify-center rounded border border-orange-100"><Inbox size={16} /></div>
              <div><p className="text-[9px] font-bold text-orange-600 uppercase">Bandejas</p><p className="font-bold text-gray-800 leading-none">{dados.consumoEmbalagens.bandejas}</p></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 flex items-center justify-center rounded border border-blue-100"><Archive size={16} /></div>
              <div><p className="text-[9px] font-bold text-blue-600 uppercase">Potes</p><p className="font-bold text-gray-800 leading-none">{dados.consumoEmbalagens.potes}</p></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 text-green-600 flex items-center justify-center rounded border border-green-100"><ShoppingBag size={16} /></div>
              <div><p className="text-[9px] font-bold text-green-600 uppercase">Sacos</p><p className="font-bold text-gray-800 leading-none">{dados.consumoEmbalagens.sacos}</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* grid dos gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Seção de Gráficos (Evolução e Histórico) */}
        <div className="lg:col-span-2 flex flex-col gap-2">

          {/* Gráfico de Barras - Evolução do Faturamento */}
          <ContentCard title="Evolução do faturamento" subtitle="Acompanhe seu faturamento conforme o período">
            <div className="w-full p-4" style={{ height: '320px', minHeight: '320px' }}>

              {dados.evolucaoFaturamento && dados.evolucaoFaturamento.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dados.evolucaoFaturamento}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="label"
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
                      dataKey="valor"
                      fill="#0B623C"
                      radius={[6, 6, 0, 0]}
                      barSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Carregando dados...
                </div>
              )}

            </div>
          </ContentCard>

          {/* Gráfico de Linhas - Histórico de Embalagens */}
          <ContentCard title="Histórico de embalagens" subtitle="Volume consumido mês a mês (Visão anual fixa)">
            <div className="w-full p-4" style={{ height: '320px', minHeight: '320px' }}>

              {dados.historicoEmbalagens && dados.historicoEmbalagens.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dados.historicoEmbalagens} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="mes"
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
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Carregando dados...
                </div>
              )}

            </div>
          </ContentCard>
        </div>

        {/* Seção de Rankings (Melhores Clientes e Produtos) */}
        <div className="flex flex-col gap-2">
          <ContentCard title="Melhores Clientes" subtitle="Lista dos clientes mais lucrativos">
            <div className="p-4 flex flex-col gap-4">

              {dados.melhoresClientes.map((c, i) => (
                <div key={c.id} className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0 gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-[#007d43] border border-green-300 flex items-center justify-center text-[13px] font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {c.nome}
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium truncate">
                        {c.totalPedidos} pedidos no total
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 whitespace-nowrap">
                    <p className="text-sm font-bold text-gray-800">R$ {c.valorTotal}</p>
                    <p className="text-[10px] text-gray-400 font-medium">em compras</p>
                  </div>

                </div>
              ))}
              
            </div>
          </ContentCard>

          <ContentCard title="Produtos mais vendidos" subtitle="Lista de produtos mais vendidos no período">
            <div className="p-4 flex flex-col gap-4">

              {dados.produtosMaisVendidos.map((p, i) => (
                <div key={p.id} className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0 gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-[#007d43] border border-green-300 flex items-center justify-center text-[13px] font-bold shrink-0">
                      {i + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-gray-800 mb-1 truncate mr-4">
                        {p.nome}
                      </p>
                      <span className={`inline-block text-[9px] font-semibold px-2 py-1.5 rounded-2xl uppercase ${p.tipo === 'PRE_LAVADO'
                        ? 'bg-[#00a859] text-white border-[#00a859]'
                        : 'bg-gray-200 text-gray-700'
                        }`}>
                        {formatarTipoProduto(p.tipo)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-200 px-2 py-1 rounded text-[13px] font-semibold text-gray-700 shrink-0 whitespace-nowrap">
                    {p.quantidadeVendida} unidades
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