import { useState } from 'react';
import { DollarSign, Trash2, ArrowLeft, Printer } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ContentCard } from '../components/ContentCard';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function GerenciamentoPedidos() {
  // --- ESTADOS PRINCIPAIS ---
  const [abaAtiva, setAbaAtiva] = useState('ativos');
  const [viewMode, setViewMode] = useState('lista');

  // --- ESTADOS DE DADOS E MODAIS ---
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [modalAtivo, setModalAtivo] = useState(null);


  const [historicoData, setHistoricoData] = useState([])
  const [pedidosAtivosData, setPedidosAtivosData] = useState([])
  const [itensPedidoData, setItensPedidoData] = useState([])

  const carregarMercados = () => {
    api.get("/pedidos", { 
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (response.data.length == 0) {
          console.log("vazio");
        } else {
          const mercadosFormatados = response.data.map(mercado => ({
            id: mercado.id,
            nome: mercado.nome,
            // Trava de segurança para evitar tela branca se vier nulo
            tipo: mercado.tipoMercado || mercado.tipo || 'NORMAL', 
          }));
          setMercadosData(mercadosFormatados);
        }
      })
      .catch(error => console.error("Erro ao carregar clientes:", error));
  };


  // --- FUNÇÕES DE NAVEGAÇÃO E MODAL ---
  const abrirDetalhes = (pedido) => {
    setPedidoSelecionado(pedido);
    setViewMode('detalhes');
  };

  const voltarParaLista = () => {
    setViewMode('lista');
    setPedidoSelecionado(null);
  };

  const abrirModal = (tipo, pedido) => {
    setPedidoSelecionado(pedido);
    setModalAtivo(tipo);
  };

  const fecharModal = () => {
    setModalAtivo(null);
  };

  return (
    <div>

      {viewMode === 'detalhes' && pedidoSelecionado ? (

        /* ----------------------------------
          DETALHES DO PEDIDO
           ---------------------------------- */
        <div className="animate-in fade-in duration-300">
          <button
            onClick={voltarParaLista}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Voltar aos Pedidos
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">{pedidoSelecionado.mercado}</h1>
              <p className="text-gray-500 mt-1 font-medium">Data de Solicitação - {pedidoSelecionado.data}</p>
            </div>
            <Button variant="primary" icon={Printer}>
              Imprimir
            </Button>
          </div>

          <ContentCard
            title={`Itens do Pedido (${itensPedidoMock.length})`}
            subtitle="Produtos incluídos no pedido do cliente"
            filters={
              <div className="px-4 py-2 border-2 border-[#00a859] text-[#00a859] font-bold rounded-lg text-sm bg-white">
                TOTAL: {pedidoSelecionado.valor}
              </div>
            }
          >
            <div className="overflow-x-auto min-w-full">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                    <th className="px-6 py-4 font-medium">Unidade</th>
                    <th className="px-6 py-4 font-medium">Produto</th>
                    <th className="px-6 py-4 font-medium">Tipo</th>
                    <th className="px-6 py-4 font-medium">Preço</th>
                    <th className="px-6 py-4 font-medium text-right">Total</th>
                    {abaAtiva === 'ativos' && (
                      <th className="px-6 py-4 font-medium text-right">Ações</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {itensPedidoMock.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-800">{item.unidade}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{item.produto}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.tipo === 'PRE_LAVADO' ? 'bg-[#00a859] text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                          {item.tipo === 'PRE_LAVADO' ? 'Pré-Lavado' : 'Não Lavado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">{item.preco}</td>
                      <td className="px-6 py-4 font-bold text-[#00a859] text-right">{item.total}</td>

                      {abaAtiva === 'ativos' && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end">
                            {/* AQUI ESTÁ O CLIQUE QUE ABRE O MODAL */}
                            <button
                              onClick={() => abrirModal('delete', pedidoSelecionado)}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-red-600 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
                            >
                              <Trash2 size={14} /> Excluir
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ContentCard>
        </div>

      ) : (

        /* ----------------------------------
           LISTA DE PEDIDOS 
           ---------------------------------- */
        <div className="animate-in fade-in duration-300">
          <PageHeader
            title="Gerenciamento de Pedidos"
            subtitle="Visualize e gerencie todos os pedidos do sistema"
          />

          <div className="flex bg-white rounded-full p-1 mb-6 border border-gray-200 shadow-sm w-full">
            <button
              onClick={() => setAbaAtiva('ativos')}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${abaAtiva === 'ativos'
                  ? 'bg-[#00a859] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              Pedidos Ativos ({pedidosAtivosData.length})
            </button>
            <button
              onClick={() => setAbaAtiva('finalizados')}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${abaAtiva === 'finalizados'
                  ? 'bg-[#00a859] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              Finalizados
            </button>
          </div>

          {abaAtiva === 'ativos' ? (
            <ContentCard title="Pedidos Ativos" subtitle="Pedidos em andamento que precisam de atenção" count={pedidosAtivosData.length}>
              <Table headers={['Cliente', 'Tipo', 'Data Solicitação', 'Valor Total', 'A pagar']}>
                {pedidosAtivosData.map((pedido) => (
                  <tr key={pedido.id} onClick={() => abrirDetalhes(pedido)} className="hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium text-gray-800">{pedido.mercado}</td>
                    <td className="px-6 py-4"><Badge text={pedido.tipo} /></td>
                    <td className="px-6 py-4 text-gray-600">{pedido.data}</td>
                    <td className="px-6 py-4 text-[#00a859] font-bold">{pedido.valor}</td>
                    <td className="px-6 py-4 text-red-600 font-bold">{pedido.aPagar}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={(e) => { e.stopPropagation(); abrirModal('pagamento', pedido); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer">
                          <DollarSign size={14} /> Pagar
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); abrirModal('delete', pedido); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-red-600 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer">
                          <Trash2 size={14} /> Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            </ContentCard>
          ) : (
            <ContentCard title="Pedidos Finalizados" subtitle="Pedidos concluídos ou cancelados" count={historicoData.length}>
              <Table headers={['Cliente', 'Tipo', 'Data Solicitação', 'Valor Total', 'Status']}>
                {historicoData.map((pedido) => (
                  <tr key={pedido.id} onClick={() => abrirDetalhes(pedido)} className="hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium text-gray-800">{pedido.mercado}</td>
                    <td className="px-6 py-4"><Badge text={pedido.tipo} /></td>
                    <td className="px-6 py-4 text-gray-600">{pedido.data}</td>
                    <td className="px-6 py-4 text-[#00a859] font-bold">{pedido.valor}</td>
                    <td className="px-6 py-4"><Badge text={pedido.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={(e) => { e.stopPropagation(); abrirModal('delete', pedido); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-red-600 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer">
                          <Trash2 size={14} /> Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            </ContentCard>
          )}

        </div>
      )}

      <Modal isOpen={modalAtivo === 'pagamento'} onClose={fecharModal} title="Valor Pago" subtitle="Insira quanto do valor do pedido já foi pago">
        <Input label="Pago (R$)" placeholder="Ex: 100,00" />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="primary">Registrar</Button>
        </div>
      </Modal>

      <Modal isOpen={modalAtivo === 'delete'} onClose={fecharModal} title="Confirmar Exclusão" isDanger={true}>
        <p className="text-gray-700">Tem certeza que deseja excluir o pedido de <span className="font-bold">{pedidoSelecionado?.mercado}</span>?</p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="danger">Excluir Pedido</Button>
        </div>
      </Modal>

    </div>
  );
}