import { useState, useEffect } from 'react';
import { Pencil, Trash2, MapPin } from 'lucide-react';
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

  const [endereco, setEndereco] = useState(null);
  const [loadingEndereco, setLoadingEndereco] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'NORMAL',
    cep: '',
    numero: ''
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
            cep: mercado.cep,
            numero: mercado.numero
          })).sort((a, b) => a.nome.localeCompare(b.nome));
          setMercadosData(mercadosFormatados);
        }
      })
      .catch(error => console.error("Erro ao carregar clientes:", error));
  };

  const buscarEnderecoPorCep = async (cep) => {
    try {
      const cepLimpo = cep.replace(/\D/g, '');

      if (cepLimpo.length !== 8) return;

      setLoadingEndereco(true);
      setEndereco(null);

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) throw new Error('CEP inválido');

      setEndereco(data);
    } catch (err) {
      console.log(err);
      setEndereco(null);
      alert('CEP não encontrado');
    } finally {
      setLoadingEndereco(false);
    }
  };

  useEffect(() => {
    if (token) carregarMercados();
  }, [token]);

  const abrirModal = (tipo, mercado = null) => {
    setMercadoSelecionado(mercado);
    setModalAtivo(tipo);

    if (tipo === 'edit' && mercado) {
      setFormData({
        nome: mercado.nome,
        tipo: mercado.tipo,
        cep: mercado.cep || '',
        numero: mercado.numero
      });
    }
    if (tipo === 'viewAddress' && mercado) {
      buscarEnderecoPorCep(mercado.cep);
    }

    if (tipo === 'add') {
      setFormData({ nome: '', tipo: 'NORMAL', cep: '', numero: '' });
    }
  };

  const fecharModal = () => {
    setModalAtivo(null);
    setMercadoSelecionado(null);
  };


  function formatarCEP(valor) {
    return valor
      .replace(/\D/g, "")        // remove tudo que não é número
      .replace(/(\d{5})(\d)/, "$1-$2") // adiciona o traço
      .slice(0, 9);              // limita ao tamanho do CEP
  }


  const handleSalvar = async () => {
    const dadosDoForms = {
      nome: formData.nome,
      tipoMercado: formData.tipo,
      cep: formData.cep,
      numero: formData.numero
    };

    try {
      if (modalAtivo === 'add') {
        await api.post('/mercados', dadosDoForms, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (modalAtivo === 'edit') {
        await api.put(`/mercados/${mercadoSelecionado.id}`, dadosDoForms, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      carregarMercados();
      fecharModal();
    } catch (err) {
      console.log(err);
      alert('Erro ao salvar mercado');
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
            className={`px-4 py-1.5 rounded-full border text-xs font-semibold transition-colors cursor-pointer ${filtroAtivo === f
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
    <div className="h-full">
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

        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
          <Table headers={['Nome', 'Tipo', 'CEP']}>
            {mercadosFiltrados.map((mercado) => (
              <tr key={mercado.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                <td className="px-6 py-4 font-medium text-gray-800">{mercado.nome}</td>
                <td className="px-6 py-4">
                  <Badge text={mercado.tipo} />
                </td>
                <td className="px-6 py-4 text-gray-600">{formatarCEP(mercado.cep)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => abrirModal('edit', mercado)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
                    >
                      <Pencil size={14} /> Editar
                    </button>
                    <button
                      onClick={() => abrirModal('viewAddress', mercado)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium cursor-pointer"
                    >
                      <MapPin size={14} /> Endereço
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
        </div>
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

        <Input
          label="CEP:"
          placeholder="Ex: 01234-567"
          value={formatarCEP(formData.cep)}
          onChange={(e) => {
            const cep = e.target.value;
            setFormData({ ...formData, cep });
            buscarEnderecoPorCep(cep);
          }}
        />
        {loadingEndereco && (
          <p className="text-sm text-gray-500 mt-2">Buscando endereço...</p>
        )}

        {endereco && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input label="Logradouro" value={endereco.logradouro} disabled />
            <Input label="Bairro" value={endereco.bairro} disabled />
            <Input label="Cidade" value={endereco.localidade} disabled />
            <Input label="Estado" value={endereco.uf} disabled />
          </div>
        )}

        <Input
          label="Número:"
          placeholder="Ex: 123"
          value={formData.numero}
          maxLength={6}
          onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
        />

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleSalvar}>
            {modalAtivo === 'add' ? 'Salvar' : 'Salvar Alterações'}
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={modalAtivo === 'viewAddress'}
        onClose={fecharModal}
        title="Endereço do Cliente"
        maxWidth="max-w-lg"
      >
        {loadingEndereco && (
          <p className="text-gray-500">Carregando endereço...</p>
        )}

        {!loadingEndereco && endereco && (
          <div className="space-y-3 text-sm text-gray-700">
            <div><strong>CEP:</strong> {formatarCEP(endereco.cep) || '—'}</div>
            <div><strong>Logradouro:</strong> {endereco.logradouro || '—'}</div>
            <div><strong>Número:</strong> {mercadoSelecionado?.numero || '—'}</div>
            <div><strong>Bairro:</strong> {endereco.bairro || '—'}</div>
            <div><strong>Cidade:</strong> {endereco.localidade}</div>
            <div><strong>Estado:</strong> {endereco.uf}</div>
          </div>
        )}

        {!loadingEndereco && !endereco && (
          <p className="text-red-500">Endereço não encontrado.</p>
        )}

        <div className="flex justify-end mt-6">
          <Button variant="secondary" onClick={fecharModal}>Fechar</Button>
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