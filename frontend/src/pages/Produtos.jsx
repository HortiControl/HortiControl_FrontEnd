import { useState, useEffect } from 'react';
import { Search, Filter, Pencil, Trash2, RefreshCw, Droplets, Leaf } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ContentCard } from '../components/ContentCard';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import api from '../provider/api';

export function Produtos() {
  const [produtosData, setProdutosData] = useState([]);
  const [modalAtivo, setModalAtivo] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [valorGlobal,setValorGlobal] = useState(0);
  const [formData, setFormData] = useState({
    preco: '',
    nome: '',
    embalagem: 'BANDEJA',
    tipo: 'PRE_LAVADO'
  });

  const token = localStorage.getItem('token');

  const carregarProdutos = () => {
    api.get("/produtos", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (response.data.length == 0) {
          console.log("vazio pae")
        } else {
          const produtosFormatados = response.data.map(produto => ({
            id: produto.id,
            preco: produto.preco,
            nome: produto.nome,
            embalagem: produto.tipoEmbalagem,
            tipo: produto.tipoProduto
          }))
          setProdutosData(produtosFormatados)
        }
      })
      .catch(error => console.error("Erro ao carregar produtos: ", error))
  }

  useEffect(() => {
    if (token) carregarProdutos();
  }, [token]);

  const abrirModal = (tipo, produto = null) => {
    setProdutoSelecionado(produto);
    setModalAtivo(tipo);

    if (tipo === 'edit' && produto) {
      setFormData({
        preco: produto.preco,
        nome: produto.nome,
        embalagem: produto.embalagem,
        tipo: produto.tipo ||
          ''
      });
    } else if (tipo === 'add') {
      setFormData({
        preco: '',
        nome: '',
        embalagem: 'BANDEJA',
        tipo: 'PRE_LAVADO'
      });
    }
  };

  const fecharModal = () => {
    setModalAtivo(null);
    setProdutoSelecionado(null);
  };

  const handleSalvar = async () => {
    const dadosDoForms = {
      nome: formData.nome,
      preco: Number(formData.preco),
      tipoEmbalagem: formData.embalagem,
      tipoProduto: formData.tipo
    };
    try {
      if (modalAtivo === 'add') {
        console.log(dadosDoForms)
        await api.post("/produtos", dadosDoForms, {
          headers: { Authorization: `Bearer ${token}` }
        })
        alert("Produto adicionado com sucesso!");
      } else if (modalAtivo === 'edit') {
        await api.put(`/produtos/${produtoSelecionado.id}`, dadosDoForms, {
          headers: { Authorization: `Bearer ${token}` }
        })
        alert("Produto atualizado com sucesso!");
      }
      carregarProdutos()
      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar produto: ", error)
      alert("Erro ao salvar. Verifique os dados.")
    }
  };

  const handleAtualizarGlobal = async () => {
    try{
      await api.patch(`/produtos/reajuste-global?novoPreco=${valorGlobal}`,{},{
          headers: { Authorization: `Bearer ${token}` }
      })
      alert("Atualizado com sucesso!!")
      carregarProdutos();
      fecharModal();
    }catch(error){
      console.error("Erro ao atualizar valor global de produtos: ", error)
      alert("Erro ao atualizar valor global de produtos. Verifique os dados.")
    }
  }

  const handleExcluir = async () => {
    try {

      await api.delete(`/produtos/${produtoSelecionado.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProdutosData(prev =>
        prev.filter(m => m.id !== produtoSelecionado.id)
      );

      alert("Produto excluído com sucesso!");
      fecharModal();
    } catch (error) {
      console.error("Erro ao excluir Produto:", error);
      alert("Erro ao excluir Produto");
    }
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
          <Filter size={18} className="text-gray-700" />
          <span>Filtros |</span>
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
    <div >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Produtos</h1>
          <p className="text-gray-500 mt-1 font-medium">Gerencie seu catálogo de produtos e preços</p>
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
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${produto.tipo === 'PRE_LAVADO'
                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                  : 'bg-orange-50 text-orange-600 border border-orange-100'
                  }`}>
                  {produto.tipo === 'PRE_LAVADO' ? <Droplets size={12} /> : <Leaf size={12} />}
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
        <Input 
        label="Nome do Produto:" 
        placeholder="Ex: Alface Lisa" 
        value={formData.nome} 
        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        />

        <Select
          label="Tipo de Processamento"
          options={['PRE_LAVADO', 'NAO_LAVADO']}
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Select 
          label="Embalagem"
          options={['POTE', 'BANDEJA', 'SACO']} 
          value={formData.embalagem}
          onChange={(e) => setFormData({ ...formData, embalagem: e.target.value })}
          />

          <Input 
          label="Preço Atual (R$)"
          placeholder="0,00" 
          value={formData.preco}
          onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
           />
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleSalvar}>
            {modalAtivo === 'add' ? 'Salvar' : 'Salvar Alterações'}</Button>
        </div>
      </Modal>

      <Modal isOpen={modalAtivo === 'delete'} onClose={fecharModal} title="Confirmar Exclusão" isDanger={true}>
        <p className="text-gray-700">Tem certeza que deseja excluir <span className="font-bold">{produtoSelecionado?.nome}</span>?</p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="danger" onClick={handleExcluir} >Excluir Produto</Button>
        </div>
      </Modal>

      <Modal isOpen={modalAtivo === 'reajustar'} onClose={fecharModal} title="Reajustar Preços">
        <Input label="Novo Valor (R$)" 
        placeholder="Ex: 9,00" 
        onChange={(e) => setValorGlobal(e.target.value)}
        />
        <div className="flex justify-center gap-3 mt-6">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleAtualizarGlobal}>Aplicar Reajuste</Button>
        </div>
      </Modal>
    </div>
  );
}