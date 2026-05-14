import { useState, useEffect } from 'react';
import { Filter, Pencil, Trash2 } from 'lucide-react';
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
  const [filtroSelecionado, setFiltroSelecionado] = useState("Todos");

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'NORMAL'
  });

  const token = localStorage.getItem('token');

  const carregarMercados = (event = null) => {

    let valorSelecionado = "Todos";

    if (event) {
      valorSelecionado = event.target.value;
      setFiltroSelecionado(valorSelecionado);
    }

    let endpoint = "/mercados";

    if (valorSelecionado === "Normal") {
      endpoint = "/mercados/normais";
    }

    else if (valorSelecionado === "Consignado") {
      endpoint = "/mercados/consignados";
    }

    api.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {

        if (response.data.length === 0) {
          console.log("vazio");
        }

        const mercadosFormatados = response.data.map(mercado => ({
          id: mercado.id,
          nome: mercado.nome,
          tipo: mercado.tipoMercado
        }));

        setMercadosData(mercadosFormatados);

      })
      .catch(error =>
        console.error("Erro ao carregar mercados:", error)
      );
  };

  useEffect(() => {
    if (token) carregarMercados(event);
  }, [token]);

  const abrirModal = (tipo, mercado = null) => {
    setMercadoSelecionado(mercado);
    setModalAtivo(tipo);

    if (tipo === 'edit' && mercado) {
      setFormData({ nome: mercado.nome, tipo: mercado.tipo || '' });
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
      tipoMercado: formData.tipo,
    };
    try {
      if (modalAtivo === 'add') {

        await api.post("/mercados", dadosDoForms, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Mercado adicionado com sucesso!");

      } else if (modalAtivo === 'edit') {

        await api.put(`/mercados/${mercadoSelecionado.id}`, dadosDoForms, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Mercado atualizado com sucesso!");
      }

      setFiltroSelecionado("Todos")
      carregarMercados();
      fecharModal();

    } catch (error) {
      console.log(dadosDoForms)
      console.error("Erro ao salvar mercado:", error);
      alert("Erro ao salvar. Verifique os dados.");
    }
  };

  const handleExcluir = async () => {
    try {

      await api.delete(`/mercados/${mercadoSelecionado.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMercadosData(prev =>
        prev.filter(m => m.id !== mercadoSelecionado.id)
      );

      alert("Mercado excluído com sucesso!");
      fecharModal();

    } catch (error) {
      console.error("Erro ao excluir mercado:", error);
      alert("Erro ao excluir. Este mercado pode possuir pedidos vinculados.");
    }
  };

  const FiltroMercados = (
    <div className="flex items-center gap-2 text-sm">
      <Filter size={18} className="text-gray-700" />
      <span>Filtros |</span>
      <span className="text-gray-500">Tipo</span>
      <select className="bg-gray-100 border-none text-gray-700 rounded-md px-3 py-1.5 outline-none"
        value={filtroSelecionado}
        onChange={carregarMercados}>
        <option>Todos</option>
        <option>Normal</option>
        <option>Consignado</option>
      </select>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Mercados</h1>
          <p className="text-gray-500 mt-1 font-medium">Gerencie os mercados parceiros da Alto Tietê</p>
        </div>
        <Button onClick={() => abrirModal('add')}>+ Adicionar Mercado</Button>
      </div>

      <ContentCard
        title="Todos os mercados"
        count={mercadosData.length}
        filters={FiltroMercados}
      >
        <Table headers={['Nome', 'Tipo']}>
          {mercadosData.map((mercado) => (
            <tr key={mercado.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-800">{mercado.nome}</td>
              <td className="px-6 py-4">
                <Badge text={mercado.tipo} />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-3 text-gray-400">
                  <button onClick={() => abrirModal('edit', mercado)} className="hover:text-gray-800 transition-colors cursor-pointer"><Pencil size={18} /></button>
                  <button onClick={() => abrirModal('delete', mercado)} className="hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </ContentCard>

      <Modal
        isOpen={modalAtivo === 'add' || modalAtivo === 'edit'}
        onClose={fecharModal}
        title={modalAtivo === 'add' ? 'Adicionar Novo Mercado' : 'Editar Mercado'}
      >
        <Input
          label="Nome do Mercado:"
          placeholder="Ex: MJ4"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        />

        <Select
          label="Tipo de Mercado"
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
        <p className="text-gray-700">Tem certeza que deseja excluir <span className="font-bold">{mercadoSelecionado?.nome}</span>?</p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="danger" onClick={handleExcluir}>Excluir Mercado</Button>
        </div>
      </Modal>

    </div>
  );
}