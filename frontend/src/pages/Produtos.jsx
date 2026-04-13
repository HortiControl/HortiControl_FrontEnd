import { useState } from 'react';
import { Search, Filter, Pencil, Trash2, RefreshCw, Droplets, Leaf } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ContentCard } from '../components/ContentCard';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Select } from '../components/Select';

export function Produtos() {
  const [produtosData, setProdutosData] = useState([
    { id: 1, nome: 'Alface Crespa', embalagem: 'Pote', preco: 'R$ 9,00', tipo: 'Lavado' },
    { id: 2, nome: 'Alface Crespa', embalagem: 'Bandeja', preco: 'R$ 9,00', tipo: 'Não Lavado' },
    { id: 3, nome: 'Alface Crespa', embalagem: 'Saco', preco: 'R$ 9,00', tipo: 'Lavado' },
    { id: 4, nome: 'Alface Americana', embalagem: 'Bandeja', preco: 'R$ 9,00', tipo: 'Não Lavado' },
    { id: 5, nome: 'Cebolinha', embalagem: 'Bandeja', preco: 'R$ 9,00', tipo: 'Lavado' },
    { id: 6, nome: 'Shimeji', embalagem: 'Pote', preco: 'R$ 4,50', tipo: 'Não Lavado' },
  ]);

  const [modalAtivo, setModalAtivo] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const abrirModal = (tipo, produto = null) => {
    setProdutoSelecionado(produto);
    setModalAtivo(tipo);
  };

  const fecharModal = () => {
    setModalAtivo(null);
    setProdutoSelecionado(null);
  };

  const FiltrosProdutos = (
    <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">
      <div className="relative flex items-center w-full sm:w-64">
        <Search size={16} className="absolute left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome..."
          className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-md text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
        />
      </div>

      <Button variant="primary" icon={RefreshCw} onClick={() => abrirModal('reajustar')}>
        Reajustar Preços
      </Button>

      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-2 text-sm">
          <Filter size={18} className="text-gray-400" />
          <span className="text-gray-500">Tipo</span>
          <select className="bg-gray-100 border-none text-gray-700 rounded-md px-3 py-1.5 outline-none">
            <option>Todos</option>
            <option>Lavado</option>
            <option>Não Lavado</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Embalagem</span>
          <select className="bg-gray-100 border-none text-gray-700 rounded-md px-3 py-1.5 outline-none">
            <option>Todos</option>
            <option>Bandeja</option>
            <option>Pote</option>
            <option>Saco</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Produtos</h1>
          <p className="text-gray-500 mt-1 text-sm">Gerencie seu catálogo de produtos e preços</p>
        </div>
        <Button onClick={() => abrirModal('add')}>+ Adicionar Produto</Button>
      </div>

      <ContentCard title="Todos os Produtos" count={produtosData.length} filters={FiltrosProdutos}>
        {/* CORREÇÃO: Passamos apenas os headers de dados. O Table.jsx coloca o "Ações" sozinho */}
        <Table headers={['Nome', 'Tipo', 'Embalagem', 'Preço']}>
          {produtosData.map((produto) => (
            <tr key={produto.id} className="hover:bg-gray-50 border-b border-gray-100 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-800">{produto.nome}</td>

              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${produto.tipo === 'Lavado'
                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                    : 'bg-orange-50 text-orange-600 border border-orange-100'
                  }`}>
                  {produto.tipo === 'Lavado' ? <Droplets size={12} /> : <Leaf size={12} />}
                  {produto.tipo}
                </span>
              </td>

              <td className="px-6 py-4">
                <Badge text={produto.embalagem} />
              </td>

              <td className="px-6 py-4 text-[#00a859] font-bold">
                {produto.preco}
              </td>

              {/* ALINHAMENTO: 'text-right' na td e 'justify-end' na div para casar com o th do Table.jsx */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3 text-gray-400">
                  <button onClick={() => abrirModal('edit', produto)} className="hover:text-gray-800 cursor-pointer transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => abrirModal('delete', produto)} className="hover:text-red-500 cursor-pointer transition-colors">
                    <Trash2 size={18} />
                  </button>
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
        title={modalAtivo === 'add' ? 'Adicionar Novo Produto' : 'Editar Produto'}
      >
        <Input label="Nome do Produto:" placeholder="Ex: Alface Lisa" defaultValue={produtoSelecionado?.nome} />
        <Select
          label="Tipo de Processamento"
          options={['Lavado', 'Não Lavado']}
          defaultValue={produtoSelecionado?.tipo || 'Lavado'}
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Select label="Embalagem" options={['Pote', 'Bandeja', 'Saco']} defaultValue={produtoSelecionado?.embalagem || 'Bandeja'} />
          <Input label="Preço Atual (R$)" placeholder="0,00" defaultValue={produtoSelecionado?.preco?.replace('R$ ', '')} />
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="primary">{modalAtivo === 'add' ? 'Salvar' : 'Salvar Alterações'}</Button>
        </div>
      </Modal>

      <Modal isOpen={modalAtivo === 'delete'} onClose={fecharModal} title="Confirmar Exclusão" isDanger={true}>
        <p className="text-gray-700">Tem certeza que deseja excluir <span className="font-bold">{produtoSelecionado?.nome}</span>?</p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="danger">Excluir Produto</Button>
        </div>
      </Modal>

      <Modal isOpen={modalAtivo === 'reajustar'} onClose={fecharModal} title="Reajustar Preços">
        <Input label="Novo Valor (R$)" placeholder="Ex: 9,00" />
        <div className="flex justify-center gap-3 mt-6">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="primary">Aplicar Reajuste</Button>
        </div>
      </Modal>
    </div>
  );
}