import { useState } from 'react';
import { 
  DollarSign, 
  Package, 
  Inbox, 
  Archive, 
  ShoppingBag
} from 'lucide-react';

import { ContentCard } from '../components/ContentCard';

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
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

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
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              periodoAtivo === p
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
              <div className="w-8 h-8 bg-orange-50 text-orange-600 flex items-center justify-center rounded border border-orange-100"><Inbox size={16}/></div>
              <div><p className="text-[9px] font-bold text-orange-600 uppercase">Bandejas</p><p className="font-bold text-gray-800 leading-none">24</p></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 flex items-center justify-center rounded border border-blue-100"><Archive size={16}/></div>
              <div><p className="text-[9px] font-bold text-blue-600 uppercase">Potes</p><p className="font-bold text-gray-800 leading-none">67</p></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 text-green-600 flex items-center justify-center rounded border border-green-100"><ShoppingBag size={16}/></div>
              <div><p className="text-[9px] font-bold text-green-600 uppercase">Sacos</p><p className="font-bold text-gray-800 leading-none">43</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* grid dos gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Seção de Gráficos (Evolução e Histórico) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ContentCard title="Evolução do faturamento" subtitle="Acompanhe seu faturamento conforme o período">
            <div className="p-6 h-64 flex items-end justify-around relative">
              {/* Linhas de Grade e Valores Y */}
              <div className="absolute inset-x-6 inset-y-8 flex flex-col justify-between pointer-events-none">
                {[7000, 3000, 1200, 500, 0].map(v => (
                  <div key={v} className="flex items-center gap-4">
                    <span className="text-[10px] text-gray-400 w-12 text-right">R$ {v}</span>
                    <div className="flex-1 border-t border-dashed border-gray-100"></div>
                  </div>
                ))}
              </div>
              {/* Barras Mockadas */}
              <div className="z-10 flex flex-col items-center gap-2 w-full ml-16">
                <div className="flex items-end justify-around w-full h-40">
                  <div className="w-12 bg-[#0B623C] rounded-t-md h-[70%] transition-all duration-500"></div>
                  <div className="w-12 bg-[#0B623C] rounded-t-md h-[40%] transition-all duration-500"></div>
                  <div className="w-12 bg-[#0B623C] rounded-t-md h-[55%] transition-all duration-500"></div>
                  <div className="w-12 bg-[#0B623C] rounded-t-md h-[85%] transition-all duration-500"></div>
                </div>
                <div className="flex justify-around w-full text-[10px] font-bold text-gray-400">
                  <span>Seg.</span><span>Ter.</span><span>Qua.</span><span>Qui.</span>
                </div>
              </div>
            </div>
          </ContentCard>

          {/* Gráfico de Linhas - Histórico de Embalagens */}
          <ContentCard title="Histórico de embalagens" subtitle="Volume consumido mês a mês (Visão anual fixa)">
             <div className="p-6">
                {/* Legenda do Gráfico */}
                <div className="flex justify-center gap-6 mb-8 text-[11px] font-bold">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#d94a11]"></div> <span className="text-[#d94a11]">Bandejas</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#185adb]"></div> <span className="text-[#185adb]">Potes</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#00a859]"></div> <span className="text-[#00a859]">Sacos</span></div>
                </div>

                <div className="relative h-48 pl-8 pr-2">
                  {/* Linhas de Grade e Eixo Y */}
                  <div className="absolute inset-y-0 left-0 right-2 flex flex-col justify-between pointer-events-none">
                    {[100, 70, 40, 10, 0].map((val) => (
                      <div key={val} className="flex items-center gap-3 w-full">
                        <span className="text-[10px] text-gray-400 w-6 text-right">{val}</span>
                        <div className="w-full border-t border-dashed border-gray-200"></div>
                      </div>
                    ))}
                  </div>

                  {/* SVG desenhando as linhas do gráfico */}
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-y-0 left-10 right-2 w-[calc(100%-2.5rem)] h-full overflow-visible z-10 py-1">
                     {/* Bandejas (Laranja/Vermelho) */}
                     <polyline points="0,90 9,92 18,85 27,98 36,75 45,90 54,80 63,95 72,90 81,91 90,98 100,70" fill="none" stroke="#d94a11" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                     {/* Potes (Azul) */}
                     <polyline points="0,90 9,85 18,98 27,98 36,90 45,98 54,85 63,100 72,60 81,60 90,90 100,90" fill="none" stroke="#185adb" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                     {/* Sacos (Verde) */}
                     <polyline points="0,90 9,65 18,65 27,75 36,58 45,65 54,70 63,65 72,98 81,92 90,100 100,85" fill="none" stroke="#00a859" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                  </svg>

                  {/* Eixo X (Meses) posicionado perfeitamente sob os pontos */}
                  <div className="absolute -bottom-6 left-10 right-2 flex justify-between text-[10px] text-gray-400 px-0.5">
                    {meses.map((mes) => (
                      <span key={mes} className="w-6 text-center -ml-3">{mes}</span>
                    ))}
                  </div>
                </div>
                
                {/* Espaçador para o eixo X não encostar na borda */}
                <div className="h-6"></div>
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
                    <div className="w-6 h-6 rounded-full bg-green-50 text-[#00a859] border border-green-100 flex items-center justify-center text-[10px] font-bold">{i+1}</div>
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
                    <div className="w-6 h-6 rounded-full bg-green-50 text-[#00a859] border border-green-100 flex items-center justify-center text-[10px] font-bold">{i+1}</div>
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