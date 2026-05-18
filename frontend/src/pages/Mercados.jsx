import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ContentCard } from '../components/ContentCard';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import api from '../provider/api';

export function Mercados() {
  const [mercadosData, setMercadosData] = useState([]);
  const [modalAtivo, setModalAtivo] = useState(null);
  const [mercadoSelecionado, setMercadoSelecionado] = useState(null);
  const [filtroAtivo, setFiltroAtivo] = useState('TODOS');
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'NORMAL'
  });

  const token = localStorage.getItem('token');

  const carregarMercados = () => {
    api.get("/mercados", { 
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (response.data.length == 0) {
          console.log("vazio");
        } else {
          const mercadosFormatados = response.data.map(mercado => ({
            id: mercado.id,
            nome: mercado.nome,
            tipo: mercado.tipoMercado || mercado.tipo || 'NORMAL', 
          }));
          setMercadosData(mercadosFormatados);
        }
      })
      .catch(error => console.error("Erro ao carregar clientes:", error));
  };

  useEffect(() => {
    if (token) carregarMercados();
  }, [token]);

  const abrirModal = (tipo, mercado = null) => {
    setMercadoSelecionado(mercado);
    setModalAtivo(tipo);

    if (tipo === 'edit' && mercado) {
      setFormData({ nome: mercado.nome, tipo: mercado.tipo });
    } else if (tipo === 'add') {
      setFormData({ nome: '', tipo: 'NORMAL' });
    }
  };

  const fecharModal = () => {
    setModalAtivo(null);
    setMercadoSelecionado(null);
  };

  const handleSalvar = async () => {
    const dadosDoForms = {
      nome: formData.nome,
      tipoMercado: formData.tipo
    };
    try {
      if (modalAtivo === 'add') {
        await api.post("/mercados", dadosDoForms, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Cliente adicionado com sucesso!");
      } else if (modalAtivo === 'edit') {
        await api.put(`/mercados/${mercadoSelecionado.id}`, dadosDoForms, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Cliente atualizado com sucesso!");
      }
      carregarMercados();
      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      alert("Erro ao salvar. Verifique os dados.");
    }
  };

  const handleExcluir = async () => {
    try {
      await api.delete(`/mercados/${mercadoSelecionado.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMercadosData(prev => prev.filter(m => m.id !== mercadoSelecionado.id));
      alert("Cliente excluído com sucesso!");
      fecharModal();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      alert("Erro ao excluir. Este cliente pode possuir pedidos vinculados.");
    }
  };

  // LÓGICA DOS FILTROS
  const mercadosFiltrados = mercadosData.filter(mercado => {
    if (filtroAtivo === 'TODOS') return true;
    return mercado.tipo.toUpperCase() === filtroAtivo;
  });

  const FiltroClientes = (
    <div className="flex flex-col items-end gap-1 text-sm">
      <span className="text-gray-500 font-medium text-xs mb-1">Tipo de Cliente</span>
      <div className="flex gap-2">
        {['TODOS', 'NORMAL', 'CONSIGNADO'].map(f => (
          <button
            key={f}
            onClick={() => setFiltroAtivo(f)}
            className={`px-4 py-1.5 rounded-full border text-xs font-semibold transition-colors cursor-pointer ${
              filtroAtivo === f 
                ? 'bg-[#00a859] text-white border-[#00a859]' 
                : 'bg-white text-gray-600 border-gray-400 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Clientes</h1>
          <p className="text-gray-500 mt-1 font-medium">Gerencie os clientes parceiros da Alto Tietê</p>
        </div>
        <Button onClick={() => abrirModal('add')}>+ Adicionar Cliente</Button>
      </div>

      <ContentCard
        title={`Todos os Clientes`}
        count={mercadosFiltrados.length}
        filters={FiltroClientes}
      >
        {/* 4. TABELA SEM COLUNA DE OBSERVAÇÕES */}
        <Table headers={['Nome', 'Tipo']}>
          {mercadosFiltrados.map((mercado) => (
            <tr key={mercado.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
              <td className="px-6 py-4 font-medium text-gray-800">{mercado.nome}</td>
              <td className="px-6 py-4">
                <Badge text={mercado.tipo} />
              </td>
              <td className="px-6 py-4">
                {/* 5. NOVOS BOTÕES COM TEXTO E BORDAS */}
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => abrirModal('edit', mercado)} 
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
                  >
                    <Pencil size={14} /> Editar
                  </button>
                  <button 
                    onClick={() => abrirModal('delete', mercado)} 
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-red-600 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
                  >
                    <Trash2 size={14} /> Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </ContentCard>

      <Modal
        isOpen={modalAtivo === 'add' || modalAtivo === 'edit'}
        onClose={fecharModal}
        title={modalAtivo === 'add' ? 'Adicionar Novo Cliente' : 'Editar Cliente'}
        subtitle={modalAtivo === 'add' ? 'Insira os detalhes do novo cliente' : 'Altere os detalhes do cliente selecionado.'}
      >
        <Input
          label="Nome do Cliente:"
          placeholder="Ex: MJ4"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        />

        <Select
          label="Tipo:"
          options={['NORMAL', 'CONSIGNADO']}
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
        />

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleSalvar}>
            {modalAtivo === 'add' ? 'Salvar' : 'Salvar Alterações'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={modalAtivo === 'delete'} onClose={fecharModal} title="Confirmar Exclusão" isDanger={true}>
        <p className="text-gray-700">Tem certeza que deseja excluir o cliente <span className="font-bold">{mercadoSelecionado?.nome}</span>?</p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="danger" onClick={handleExcluir}>Excluir Cliente</Button>
        </div>
      </Modal>

    </div>
  );
}