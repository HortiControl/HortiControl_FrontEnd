import { useState } from 'react';
import { Search, Filter, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ContentCard } from '../components/ContentCard';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Select } from '../components/Select';

export function Produtos() {
  // Simulando os dados dos produtos
  const produtosData = [
    { id: 1, nome: 'Alface Crespa', embalagem: 'Pote', preco: 'R$ 9,00' },
    { id: 2, nome: 'Alface Crespa', embalagem: 'Bandeja', preco: 'R$ 9,00' },
    { id: 3, nome: 'Alface Crespa', embalagem: 'Saco', preco: 'R$ 9,00' },
    { id: 4, nome: 'Alface Americana', embalagem: 'Bandeja', preco: 'R$ 9,00' },
    { id: 5, nome: 'Cebolinha', embalagem: 'Bandeja', preco: 'R$ 9,00' },
    { id: 6, nome: 'Shimeji', embalagem: 'Pote', preco: 'R$ 4,50' },
  ];

  const [modalAtivo, setModalAtivo] = useState(null); 
  // Guarda os dados do produto que o usuário clicou (para editar ou excluir)
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // Função para abrir o modal correto
  const abrirModal = (tipo, produto = null) => {
    setProdutoSelecionado(produto);
    setModalAtivo(tipo);
  };

  // Função para fechar qualquer modal
  const fecharModal = () => {
    setModalAtivo(null);
    setProdutoSelecionado(null);
  };

  // A área de filtros da tela
  const FiltrosProdutos = (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
      
      {/* Barra de Busca */}
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

      {/* Dropdown de Filtro de Embalagem */}
      <div className="flex items-center gap-2 text-sm ml-auto">
        <Filter size={18} className="text-gray-400" />
        <span className="text-gray-500">Embalagem</span>
        <select className="bg-gray-100 border-none text-gray-700 rounded-md px-3 py-1.5 outline-none">
          <option>Todos</option>
          <option>Bandeja</option>
          <option>Pote</option>
          <option>Saco</option>
        </select>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Produtos</h1>
          <p className="text-gray-500 mt-1 text-sm">Gerencie seu catálogo de produtos e preços</p>
        </div>
        <Button onClick={() => abrirModal('add')}>+ Adicionar Produto</Button>
      </div>

      <ContentCard title="Todos os Produtos" count={produtosData.length} filters={FiltrosProdutos}>
        <Table headers={['Nome', 'Embalagem', 'Preços']}>
          {produtosData.map((produto) => (
            <tr key={produto.id} className="hover:bg-gray-50 border-b border-gray-100">
              <td className="px-6 py-4 font-medium text-gray-800">{produto.nome}</td>
              <td className="px-6 py-4"><Badge text={produto.embalagem} /></td>
              <td className="px-6 py-4 text-[#00a859] font-medium">{produto.preco}</td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-3 text-gray-400">
                  {/* Botões de Ação da Tabela acionando os modais com o produto específico */}
                  <button onClick={() => abrirModal('edit', produto)} className="hover:text-gray-800 cursor-pointer"><Pencil size={18} /></button>
                  <button onClick={() => abrirModal('delete', produto)} className="hover:text-red-500 cursor-pointer"><Trash2 size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </ContentCard>
      
      {/* 1. Modal de Adicionar/Editar (Reaproveitamos a estrutura) */}
      <Modal 
        isOpen={modalAtivo === 'add' || modalAtivo === 'edit'} 
        onClose={fecharModal}
        title={modalAtivo === 'add' ? 'Adicionar Novo Produto' : 'Editar Produto'}
        subtitle={modalAtivo === 'add' ? 'Insira os detalhes do novo produto' : 'Altere os detalhes do produto selecionado'}
      >
        {/* Se for edição, o defaultValue mostra o valor antigo. Se for add, fica vazio. */}
        <Input label="Nome do Produto:" placeholder="Ex: Alface Lisa" defaultValue={produtoSelecionado?.nome} />
        <Select label="Embalagem" options={['Selecione', 'Pote', 'Bandeja', 'Saco']} defaultValue={produtoSelecionado?.embalagem || 'Selecione'} />
        <Input label="Preço Atual (R$)" placeholder="0,00" defaultValue={produtoSelecionado?.preco?.replace('R$ ', '')} />
        
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="primary">{modalAtivo === 'add' ? 'Salvar' : 'Salvar Alterações'}</Button>
        </div>
      </Modal>

      {/* 2. Modal de Exclusão */}
      <Modal 
        isOpen={modalAtivo === 'delete'} 
        onClose={fecharModal}
        title="Confirmar Exclusão"
        isDanger={true} // Título vermelho!
      >
        <p className="text-gray-700">
          Tem certeza que deseja excluir o produto <span className="font-bold">{produtoSelecionado?.nome}</span>?
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="danger">Excluir Produto</Button>
        </div>
      </Modal>

      {/* 3. Modal de Reajuste */}
      <Modal 
        isOpen={modalAtivo === 'reajustar'} 
        onClose={fecharModal}
        title="Reajustar Preços"
        subtitle="Aplique um reajuste no valor dos produtos"
      >
        <Input label="Novo Valor (R$)" placeholder="Ex: 9,00" />
        <div className="flex justify-center gap-3 mt-6">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="primary">Aplicar Reajuste</Button>
        </div>
      </Modal>

    </div>
  );
}