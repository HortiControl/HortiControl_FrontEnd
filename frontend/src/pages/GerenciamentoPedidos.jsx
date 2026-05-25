import { useState, useEffect } from 'react';
import { DollarSign, Trash2, ArrowLeft, Printer } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ContentCard } from '../components/ContentCard';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import api from '../provider/api';

export function GerenciamentoPedidos() {
  const token = localStorage.getItem('token');

  // Bloqueia o scroll da página principal
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousHeight = document.body.style.height;

    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.height = previousHeight;
    };
  }, []);

  // --- ESTADOS PRINCIPAIS ---
  const [abaAtiva, setAbaAtiva] = useState('ativos');
  const [viewMode, setViewMode] = useState('lista');

  // --- ESTADOS DE DADOS E MODAIS ---
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalAtivo, setModalAtivo] = useState(null);

  const [finalizadosData, setfinalizadosData] = useState([]);
  const [pedidosAtivosData, setPedidosAtivosData] = useState([]);
  const [valorPago, setValorPago] = useState(0);

  const [tamanhoFinalizado, setTamanhoFinalizado] = useState(null);
  const [tamanhoAtivo, setTamanhoAtivo] = useState(null);

  const formatarData = (dataString) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const carregarPedidosAtivos = () => {
    api
      .get('/pedidos/ativos', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.length === 0) {
          setPedidosAtivosData([]);
          setTamanhoAtivo(0);
          return;
        } else {
          const pedidosAtivosFormatado = response.data
            .map((ativo) => ({
              id: ativo.id,
              data: formatarData(ativo.dataSolicitacao),
              valorTotal: ativo.valorTotal,
              statusPedido: ativo.statusPedido,
              valorPago: ativo.valorPago,
              valorAPagar: ativo.valorAPagar,
              mercado: {
                nome: ativo.mercado.nome,
                tipo: ativo.mercado.tipoMercado,
              },
              itens: ativo.itens,
            }))
            .reverse();

          setPedidosAtivosData(pedidosAtivosFormatado);
          setTamanhoAtivo(pedidosAtivosFormatado.length);
        }
      })
      .catch((error) => console.error('Erro ao carregar pedidos ativos:', error));
  };

  const carregarPedidosFinalizados = () => {
    api
      .get('/pedidos/historico', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.length === 0) {
          setfinalizadosData([]);
          setTamanhoFinalizado(0);
          return;
        } else {
          const finalizadosFormatado = response.data
            .map((finalizado) => ({
              id: finalizado.id,
              data: formatarData(finalizado.dataSolicitacao),
              valorTotal: finalizado.valorTotal,
              statusPedido: finalizado.statusPedido,
              valorPago: finalizado.valorPago,
              valorAPagar: finalizado.valorAPagar,
              mercado: {
                nome: finalizado.mercado.nome,
                tipo: finalizado.mercado.tipoMercado,
              },
              itens: finalizado.itens,
            }))
            .reverse();

          setfinalizadosData(finalizadosFormatado);
          setTamanhoFinalizado(finalizadosFormatado.length);
        }
      })
      .catch((error) => console.error('Erro ao carregar pedidos finalizados:', error));
  };

  useEffect(() => {
    if (token) {
      carregarPedidosAtivos();
      carregarPedidosFinalizados();
    }
  }, [token]);

  const handleExcluir = async () => {
    if (!pedidoSelecionado) return;

    try {
      await api.delete(`/pedidos/${pedidoSelecionado.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (abaAtiva === 'ativos') {
        setPedidosAtivosData((prev) => prev.filter((p) => p.id !== pedidoSelecionado.id));
      } else {
        setfinalizadosData((prev) => prev.filter((p) => p.id !== pedidoSelecionado.id));
      }

      if (viewMode === 'detalhes') {
        voltarParaLista();
      }

      carregarPedidosAtivos();
      carregarPedidosFinalizados();
      fecharModal();
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      alert('Erro ao excluir o pedido. Tente novamente.');
    }
  };

  const handleRemoverItem = async () => {
    if (!itemSelecionado) return;

    try {
      await api.delete(`/pedidos/${pedidoSelecionado.id}/itens/${itemSelecionado.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPedidoSelecionado((prev) => {
        const itensAtualizados = prev.itens.filter((item) => item.id !== itemSelecionado.id);
        const novoValorTotal = itensAtualizados.reduce((acc, item) => acc + Number(item.subTotal), 0);

        return {
          ...prev,
          itens: itensAtualizados,
          valorTotal: novoValorTotal.toFixed(2),
        };
      });

      alert('Item removido com sucesso!');

      carregarPedidosAtivos();
      carregarPedidosFinalizados();
      fecharModal();
    } catch (error) {
      console.error('Erro ao remover item:', error);
      alert('Erro ao remover o item do pedido.');
    }
  };

  const handlePagarValor = async () => {
    const valorInformadoNum = parseFloat(String(valorPago).replace(',', '.'));
    const valorAPagarNum = parseFloat(pedidoSelecionado.valorAPagar);

    if (valorInformadoNum > valorAPagarNum) {
      alert(
        `Erro: O valor digitado (R$ ${valorInformadoNum}) é maior que o valor restante a pagar (R$ ${valorAPagarNum})!`
      );
      return;
    }

    if (isNaN(valorInformadoNum) || valorInformadoNum <= 0) {
      alert('Por favor, insira um valor válido.');
      return;
    }

    try {
      await api.patch(
        `/pedidos/${pedidoSelecionado.id}/pagamento?valor=${valorInformadoNum}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (valorInformadoNum === valorAPagarNum) {
        alert('Pedido pago!');
      } else {
        alert('Pagamento registrado com sucesso!!');
      }

      carregarPedidosAtivos();
      carregarPedidosFinalizados();
      fecharModal();
      setValorPago(0);
    } catch (error) {
      console.error('Erro ao atualizar valor pago do pedido: ', error);
      alert('Erro ao atualizar o pagamento. Verifique os dados.');
    }
  };

  // --- FUNÇÕES DE NAVEGAÇÃO E MODAL ---
  const abrirDetalhes = (pedido) => {
    setPedidoSelecionado(pedido);
    setViewMode('detalhes');
  };

  const abrirModalItem = (item) => {
    setItemSelecionado(item);
    setModalAtivo('deleteItem');
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
    <div className="h-dvh flex flex-col overflow-hidden">
      {viewMode === 'detalhes' && pedidoSelecionado ? (
        /* ----------------------------------
           DETALHES DO PEDIDO
           ---------------------------------- */
        <div className="animate-in fade-in duration-300 flex flex-col flex-1 min-h-0 pb-4 overflow-hidden">
          <button
            onClick={voltarParaLista}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium mb-6 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft size={16} /> Voltar aos Pedidos
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 shrink-0">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                {pedidoSelecionado.mercado.nome}
              </h1>
              <p className="text-gray-500 mt-1 font-medium">
                Data de Solicitação - {pedidoSelecionado.data}
              </p>
            </div>
            <Button variant="primary" icon={Printer}>
              Imprimir
            </Button>
          </div>

          {/* ÁREA DE SCROLL VERTICAL DOS ITENS */}
          <div
            className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0"
            style={{ maxHeight: 'calc(100dvh - 190px)' }}
          >
            <ContentCard
              title={`Itens do Pedido (${pedidoSelecionado.itens?.length || 0})`}
              subtitle="Produtos incluídos no pedido do cliente"
              filters={
                <div className="px-4 py-2 border-2 border-[#00a859] text-[#00a859] font-bold rounded-lg text-sm bg-white">
                  TOTAL: R$ {pedidoSelecionado.valorTotal}
                </div>
              }
            >
              {/* SCROLL HORIZONTAL DA TABELA */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
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
                    {pedidoSelecionado.itens?.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-800">{item.quantidade}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">{item.nomeProduto}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${item.tipoProduto === 'PRE_LAVADO'
                              ? 'bg-[#00a859] text-white'
                              : 'bg-gray-200 text-gray-700'
                              }`}
                          >
                            {item.tipoProduto === 'PRE_LAVADO' ? 'Pré-Lavado' : 'Não Lavado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800">R$ {item.precoUnitario}</td>
                        <td className="px-6 py-4 font-bold text-[#00a859] text-right">
                          R$ {item.subTotal}
                        </td>
                        {abaAtiva === 'ativos' && (
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end">
                              <button
                                onClick={() => abrirModalItem(item)}
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
        </div>
      ) : (
        /* ----------------------------------
           LISTA DE PEDIDOS
           ---------------------------------- */
        <div className="animate-in fade-in duration-300 flex flex-col flex-1 min-h-0 pb-4 overflow-hidden">
          <div className="shrink-0">
            <PageHeader
              title="Gerenciamento de Pedidos"
              subtitle="Visualize e gerencie todos os pedidos do sistema"
            />
          </div>

          <div className="flex bg-white rounded-full p-1 mb-4 border border-gray-200 shadow-sm w-full shrink-0">
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
              Finalizados ({tamanhoFinalizado})
            </button>
          </div>

          {/* ÁREA DE SCROLL VERTICAL DAS LISTAS */}
          <div
            className="flex-1 overflow-y-auto pr-1 min-h-0 custom-scrollbar"
            style={{ maxHeight: 'calc(100dvh - 190px)' }}
          >
            {abaAtiva === 'ativos' ? (
              <ContentCard
                title="Pedidos Ativos"
                subtitle="Pedidos em andamento que precisam de atenção"
                count={pedidosAtivosData.length}
              >
                {/* SCROLL HORIZONTAL DA TABELA */}
                <div className="w-full overflow-x-auto">
                  <Table headers={['Cliente', 'Tipo', 'Data Solicitação', 'Valor Total', 'A pagar']}>
                    {pedidosAtivosData.map((pedido) => (
                      <tr
                        key={pedido.id}
                        onClick={() => abrirDetalhes(pedido)}
                        className="hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">{pedido.mercado.nome}</td>
                        <td className="px-6 py-4">
                          <Badge text={pedido.mercado.tipo} />
                        </td>
                        <td className="px-6 py-4 text-gray-600">{pedido.data}</td>
                        <td className="px-6 py-4 text-[#00a859] font-bold">R$ {pedido.valorTotal}</td>
                        <td className="px-6 py-4 text-red-600 font-bold">R$ {pedido.valorAPagar}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirModal('pagamento', pedido);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
                            >
                              <DollarSign size={14} /> Pagar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirModal('delete', pedido);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-red-600 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
                            >
                              <Trash2 size={14} /> Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Table>
                </div>
              </ContentCard>
            ) : (
              <ContentCard
                title="Pedidos Finalizados"
                subtitle="Pedidos concluídos ou cancelados"
                count={tamanhoFinalizado}
              >
                {/* SCROLL HORIZONTAL DA TABELA */}
                <div className="w-full overflow-x-auto">
                  <Table headers={['Cliente', 'Tipo', 'Data Solicitação', 'Valor Total', 'Status']}>
                    {finalizadosData.map((pedido) => (
                      <tr
                        key={pedido.id}
                        onClick={() => abrirDetalhes(pedido)}
                        className="hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">{pedido.mercado.nome}</td>
                        <td className="px-6 py-4">
                          <Badge text={pedido.mercado.tipo} />
                        </td>
                        <td className="px-6 py-4 text-gray-600">{pedido.data}</td>
                        <td className="px-6 py-4 text-[#00a859] font-bold">R$ {pedido.valorTotal}</td>
                        <td className="px-6 py-4">
                          <Badge text={pedido.statusPedido} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirModal('delete', pedido);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-red-600 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
                            >
                              <Trash2 size={14} /> Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Table>
                </div>
              </ContentCard>
            )}
          </div>
        </div>
      )}

      {/* MODAIS RESTANTES */}
      <Modal
        isOpen={modalAtivo === 'pagamento'}
        onClose={fecharModal}
        title="Valor Pago"
        subtitle="Insira quanto do valor do pedido já foi pago"
      >
        <Input
          label="Pago (R$)"
          placeholder="Ex: 100,00"
          onChange={(e) => setValorPago(e.target.value)}
        />
        <div className="flex flex-row justify-between max-h-10 mt-7">
          <div className="flex flex-col gap-1 p-2 rounded-lg justify-center border-2 border-gray-300 bg-gray-100">
            <p className="text-gray-700 text-[12px] font-medium">
              Total: R$ {pedidoSelecionado?.valorTotal?.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handlePagarValor}>
              Registrar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalAtivo === 'delete'}
        onClose={fecharModal}
        title="Confirmar Exclusão"
        isDanger={true}
      >
        <p className="text-gray-700">
          Tem certeza que deseja excluir o pedido de{' '}
          <span className="font-bold">{pedidoSelecionado?.mercado?.nome}</span>?
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleExcluir}>
            Excluir Pedido
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={modalAtivo === 'deleteItem'}
        onClose={fecharModal}
        title="Confirmar Exclusão"
        isDanger={true}
      >
        <p className="text-gray-700">
          Tem certeza que deseja excluir o Item{' '}
          <span className="font-bold">{itemSelecionado?.nomeProduto}</span>?
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleRemoverItem}>
            Excluir Item
          </Button>
        </div>
      </Modal>

    </div>
  );
}