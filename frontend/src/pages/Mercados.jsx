import { useState } from 'react';
import { Filter, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ContentCard } from '../components/ContentCard';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Select } from '../components/Select';

export function Mercados() {

  const [mercadosData, setMercadosData] = useState([
    { id: 1, nome: 'MJ4', tipo: 'Normal', obs: '-' },
    { id: 2, nome: 'MJ3', tipo: 'Normal', obs: '-' },
    { id: 3, nome: 'Mercado São Paulo', tipo: 'Consignado', obs: '-' },
    { id: 4, nome: 'Casa Verde', tipo: 'Consignado', obs: '-' },
  ]);

  const [modalAtivo, setModalAtivo] = useState(null);
  const [mercadoSelecionado, setMercadoSelecionado] = useState(null);

  const abrirModal = (tipo, mercado = null) => {
    setMercadoSelecionado(mercado);
    setModalAtivo(tipo);
  };

  const fecharModal = () => {
    setModalAtivo(null);
    setMercadoSelecionado(null);
  };

  // Componente de Filtro (Dropdown) que aparece no card
  const FiltroMercados = (
    <div className="flex items-center gap-2 text-sm">
      <Filter size={18} className="text-gray-700" />
      <span>Filtros |</span>
      <span className="text-gray-500">Tipo</span>
      <select className="bg-gray-100 border-none text-gray-700 rounded-md px-3 py-1.5 outline-none">
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
        <Table headers={['Nome', 'Tipo', 'Observações']}>
          {mercadosData.map((mercado) => (
            <tr key={mercado.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-800">{mercado.nome}</td>
              <td className="px-6 py-4">
                <Badge text={mercado.tipo} />
              </td>
              <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">
                {mercado.obs}
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

      {/* Modais (Adicionar/Editar, Excluir, Reajustar) permanecem iguais aos anteriores */}
      <Modal
        isOpen={modalAtivo === 'add' || modalAtivo === 'edit'}
        onClose={fecharModal}
        title={modalAtivo === 'add' ? 'Adicionar Novo Mercado' : 'Editar Mercado'}
      >
        <Input label="Nome do Mercado:" placeholder="Ex: MJ4" defaultValue={mercadoSelecionado?.nome} />
        <Select
          label="Tipo de Mercado"
          options={['Normal', 'Consignado']}
          defaultValue={mercadoSelecionado?.tipo}
        />
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="primary">{modalAtivo === 'add' ? 'Salvar' : 'Salvar Alterações'}</Button>
        </div>
      </Modal>

      <Modal isOpen={modalAtivo === 'delete'} onClose={fecharModal} title="Confirmar Exclusão" isDanger={true}>
        <p className="text-gray-700">Tem certeza que deseja excluir <span className="font-bold">{mercadoSelecionado?.nome}</span>?</p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="danger">Excluir Mercado</Button>
        </div>
      </Modal>

    </div>
  );
}