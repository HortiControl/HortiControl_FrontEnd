import { useState } from 'react';
import { Filter, Eye, DollarSign, Check } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ContentCard } from '../components/ContentCard';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function GerenciamentoPedidos() {
  // Estado que controla qual aba está selecionada ('ativos' ou 'historico')
  const [abaAtiva, setAbaAtiva] = useState('ativos');

  // --- ESTADOS DOS MODAIS ---
  const [modalAtivo, setModalAtivo] = useState(null); // 'detalhes', 'pagamento' ou null
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  const abrirModal = (tipo, pedido) => {
    setPedidoSelecionado(pedido);
    setModalAtivo(tipo);
  };

  const fecharModal = () => {
    setModalAtivo(null);
    setPedidoSelecionado(null);
  };

  // --- DADOS MOCADOS ---
  const pedidosAtivosData = [
    { id: 1, mercado: 'MJ4', tipo: 'Normal', data: '29/03/2026', valor: 'R$ 541,00', aPagar: 'R$ 541,00' },
    { id: 2, mercado: 'MJ2', tipo: 'Normal', data: '23/03/2026', valor: 'R$ 607,00', aPagar: 'R$ 307,00' },
    { id: 3, mercado: 'Tropical', tipo: 'Normal', data: '20/03/2026', valor: 'R$ 333,00', aPagar: 'R$ 102,00' },
    { id: 4, mercado: 'MJ4', tipo: 'Normal', data: '27/03/2026', valor: 'R$ 287,00', aPagar: 'R$ 58,00' },
    { id: 5, mercado: 'Mercado São Paulo', tipo: 'Consignado', data: '29/03/2026', valor: 'R$ 567,00', aPagar: 'R$ 182,00' },
  ];

  const historicoData = [
    { id: 6, mercado: 'MJ4', tipo: 'Normal', data: '29/03/2026', valor: 'R$ 541,00', status: 'Concluído' },
    { id: 7, mercado: 'MJ2', tipo: 'Normal', data: '23/03/2026', valor: 'R$ 607,00', status: 'Concluído' },
    { id: 8, mercado: 'Tropical', tipo: 'Normal', data: '20/03/2026', valor: 'R$ 333,00', status: 'Cancelado' },
    { id: 9, mercado: 'MJ4', tipo: 'Normal', data: '27/03/2026', valor: 'R$ 287,00', status: 'Concluído' },
    { id: 10, mercado: 'Mercado São Paulo', tipo: 'Consignado', data: '29/03/2026', valor: 'R$ 567,00', status: 'Cancelado' },
  ];

  // Itens fictícios para mostrar dentro do Modal de Detalhes
  const itensFicticios = [
    { nome: 'Alface Lisa', qtd: 50, preco: 'R$ 9,00', total: 'R$ 450,00' },
    { nome: 'Rúcula', qtd: 35, preco: 'R$ 6,00', total: 'R$ 210,00' },
  ];

  // --- FILTROS CONDICIONAIS ---
  // Este é o filtro base de Mercado que aparece nas duas abas
  const FiltroMercado = (
    <div className="flex flex-col">
      <span className="text-[10px] text-gray-500 font-medium mb-1 uppercase tracking-wider">Mercado</span>
      <div className="flex items-center gap-2 text-sm">
        <Filter size={16} className="text-gray-700" />
          <span>Filtro |</span>
        <select className="bg-gray-100 border-none text-gray-700 rounded-md px-3 py-1.5 outline-none min-w-30">
          <option>Todos</option>
          <option>MJ4</option>
          <option>MJ2</option>
        </select>
      </div>
    </div>
  );

  // Se a aba for histórico, adicionamos o filtro de status junto com o de mercado
  const Filtros = (
    <div className="flex items-center gap-6">
      {abaAtiva === 'historico' && (
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-medium mb-1 uppercase tracking-wider">Status</span>
          <div className="flex items-center gap-2 text-sm">
            <Filter size={16} className="text-gray-400" />
            <select className="bg-gray-100 border-none text-gray-700 rounded-md px-3 py-1.5 outline-none min-w-30">
              <option>Todos</option>
              <option>Concluído</option>
              <option>Cancelado</option>
            </select>
          </div>
        </div>
      )}
      {FiltroMercado}
    </div>
  );

  return (
    <div>
      <PageHeader 
        title="Gerenciamento de Pedidos" 
        subtitle="Visualize e gerencie todos os pedidos do sistema" 
        // Não passamos buttonText aqui porque não há botão verde no topo dessa página nas imagens!
      />

      {/* --- O SELETOR DE ABAS (TABS) --- */}
      <div className="flex bg-white rounded-full p-1 mb-6 border border-gray-200 shadow-sm w-full">
        <button 
          onClick={() => setAbaAtiva('ativos')}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
            abaAtiva === 'ativos' 
              ? 'bg-gray-100 text-gray-800 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Pedidos Ativos (8)
        </button>
        <button 
          onClick={() => setAbaAtiva('historico')}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
            abaAtiva === 'historico' 
              ? 'bg-gray-100 text-gray-800 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Histórico (12)
        </button>
      </div>

      {/* --- RENDERIZAÇÃO CONDICIONAL DA TABELA --- */}
      {abaAtiva === 'ativos' ? (
        // VISÃO: PEDIDOS ATIVOS
        <ContentCard 
          title="Pedidos Ativos" 
          subtitle="Pedidos em andamento que precisam de atenção"
          count={8} 
          filters={Filtros}
        >
          <Table headers={['Mercado', 'Tipo', 'Data Solicitação', 'Valor Total', 'A pagar']}>
            {pedidosAtivosData.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-gray-50 border-b border-gray-100">
                <td className="px-6 py-4 font-medium text-gray-800">{pedido.mercado}</td>
                <td className="px-6 py-4"><Badge text={pedido.tipo} /></td>
                <td className="px-6 py-4 text-gray-600">{pedido.data}</td>
                <td className="px-6 py-4 text-[#00a859] font-medium">{pedido.valor}</td>
                <td className="px-6 py-4 text-red-600 font-medium">{pedido.aPagar}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    {/* Botão de Detalhes (Olho) */}
                    <button onClick={() => abrirModal('detalhes', pedido)} className="text-gray-400 hover:text-gray-800 cursor-pointer"><Eye size={18} /></button>
                    {/* Botão de Valor Pago (Cifrão) */}
                    <button onClick={() => abrirModal('pagamento', pedido)} className="text-gray-600 hover:text-gray-900 cursor-pointer"><DollarSign size={18} /></button>
                    {/* Botão de Concluir (Check) - sem ação de modal por enquanto */}
                    <button className="text-green-600 hover:text-green-800 cursor-pointer"><Check size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </ContentCard>
      ) : (
        // VISÃO: HISTÓRICO
        <ContentCard 
          title="Histórico de Pedidos" 
          subtitle="Pedidos concluídos ou cancelados"
          count={12} 
          filters={Filtros}
        >
          <Table headers={['Mercado', 'Tipo', 'Data Solicitação', 'Valor Total', 'Status']}>
            {historicoData.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-gray-50 border-b border-gray-100">
                <td className="px-6 py-4 font-medium text-gray-800">{pedido.mercado}</td>
                <td className="px-6 py-4"><Badge text={pedido.tipo} /></td>
                <td className="px-6 py-4 text-gray-600">{pedido.data}</td>
                <td className="px-6 py-4 text-[#00a859] font-medium">{pedido.valor}</td>
                <td className="px-6 py-4"><Badge text={pedido.status} /></td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3 text-gray-400">
                    {/* Botão de Detalhes (Olho) também no histórico */}
                    <button onClick={() => abrirModal('detalhes', pedido)} className="hover:text-gray-800 cursor-pointer"><Eye size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </ContentCard>
      )}

      {/* --- RENDERIZAÇÃO DOS MODAIS --- */}

      {/* 1. Modal de Valor Pago */}
      <Modal 
        isOpen={modalAtivo === 'pagamento'} 
        onClose={fecharModal}
        title="Valor Pago"
        subtitle="Insira quanto do valor do pedido já foi pago"
      >
        <Input label="Pago (R$)" placeholder="Ex: 100,00" />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="primary">Registrar</Button>
        </div>
      </Modal>

      {/* 2. Modal de Detalhes do Pedido */}
      {/* maxWidth="max-w-2xl" para ele ficar bem "largão" */}
      <Modal 
        isOpen={modalAtivo === 'detalhes'} 
        onClose={fecharModal}
        title={`Detalhes do Pedido - ${pedidoSelecionado?.mercado}`}
        subtitle="Visualize ou gerencie o status do pedido."
        maxWidth="max-w-2xl" 
      >
        {/* Caixa Cinza de Alterar Status */}
        <div className="bg-gray-100 p-4 rounded-xl mb-6">
          <p className="text-xs text-gray-500 font-medium uppercase mb-3">Alterar Status</p>
          <div className="flex gap-3">
            {/* Simulando o Status ativo baseado no botão clicado. Se for histórico, mostra a cor certa */}
            <button className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors ${pedidoSelecionado?.status === 'Concluído' ? 'bg-[#00a859] text-white border-[#00a859]' : 'bg-white text-gray-700 border-gray-300'}`}>Concluído</button>
            <button className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors ${pedidoSelecionado?.status === 'Cancelado' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-700 border-gray-300'}`}>Cancelado</button>
            {/* O status pendente fica laranja se não tiver nenhum dos outros status (ou seja, se for da aba Ativos) */}
            <button className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors ${!pedidoSelecionado?.status ? 'bg-[#d97706] text-white border-[#d97706]' : 'bg-white text-gray-700 border-gray-300'}`}>Pendente</button>
          </div>
        </div>

        {/* Grid com Informações do Pedido */}
        <div className="grid grid-cols-2 gap-y-6 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">Mercado</p>
            <p className="font-semibold text-gray-800">{pedidoSelecionado?.mercado}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Tipo</p>
            <Badge text={pedidoSelecionado?.tipo || 'Normal'} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Data Solicitação</p>
            <p className="font-semibold text-gray-800">{pedidoSelecionado?.data}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">A Pagar</p>
            <p className="font-semibold text-red-600">{pedidoSelecionado?.aPagar || 'R$ 0,00'}</p>
          </div>
        </div>

        {/* Tabela de Itens Fictícia */}
        <div className="mb-6">
          <p className="font-medium text-gray-800 mb-3">Itens do Pedido</p>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium">Qtd</th>
                  <th className="px-4 py-3 font-medium">Preço Unit.</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {itensFicticios.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-gray-600">{item.nome}</td>
                    <td className="px-4 py-3 text-gray-600">{item.qtd}</td>
                    <td className="px-4 py-3 text-gray-600">{item.preco}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 text-right">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rodapé do Modal de Detalhes */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
          <Button variant="danger">Excluir Pedido</Button>
          <p className="text-gray-800 font-medium">
            Valor Total: <span className="text-[#00a859] font-bold ml-1">{pedidoSelecionado?.valor}</span>
          </p>
        </div>
      </Modal>

    </div>
  );
}