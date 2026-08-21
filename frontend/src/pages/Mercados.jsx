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
import { useNotification } from '../components/notifications/NotificationContext';

const VIA_CEP_TIMEOUT_MS = 10000;

export function Mercados() {
  const notify = useNotification();
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
      .catch(error => {
        console.error("Erro ao carregar clientes:", error);
        notify.error("Não foi possível carregar os clientes neste momento.");
      });
  };

  const buscarEnderecoPorCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), VIA_CEP_TIMEOUT_MS);

    try {
      setLoadingEndereco(true);
      setEndereco(null);

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`ViaCEP respondeu com status HTTP ${response.status}.`);
      }

      const data = await response.json();

      const cepRetornado = typeof data.cep === 'string' ? data.cep.replace(/\D/g, '') : '';
      if (data.erro || cepRetornado !== cepLimpo) {
        throw new Error('CEP inválido ou resposta inválida do ViaCEP.');
      }

      setEndereco({
        ...data,
        cep: cepRetornado,
        logradouro: String(data.logradouro || '').trim().slice(0, 120),
        bairro: String(data.bairro || '').trim().slice(0, 80),
        localidade: String(data.localidade || '').trim().slice(0, 80),
        uf: String(data.uf || '').trim().toUpperCase().slice(0, 2)
      });
    } catch (err) {
      setEndereco(null);
      if (err.name === 'AbortError') {
        notify.warning('A consulta de CEP demorou demais. Tente novamente.');
      } else {
        console.error('Erro ao consultar o ViaCEP:', err);
        notify.warning('CEP não encontrado ou serviço indisponível. Verifique o valor digitado.');
      }
    } finally {
      window.clearTimeout(timeoutId);
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
    setEndereco(null);
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
    } catch {
      notify.error('Não foi possível salvar o cliente. Verifique os dados e tente novamente.');
    }
  };

  const handleExcluir = async () => {
    try {
      await api.delete(`/mercados/${mercadoSelecionado.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMercadosData(prev => prev.filter(m => m.id !== mercadoSelecionado.id));
      notify.success("Cliente excluído com sucesso.");
      fecharModal();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      notify.warning("Não foi possível excluir. Este cliente pode ter pedidos vinculados.");
    }
  };

  // LÓGICA DOS FILTROS
  const mercadosFiltrados = mercadosData.filter(mercado => {
    if (filtroAtivo === 'TODOS') return true;
    return mercado.tipo.toUpperCase() === filtroAtivo;
  });

  const FiltroClientes = (
    <div className="flex flex-col items-start gap-1 text-sm sm:items-end">
      <span className="mb-1 text-xs font-medium text-gray-500">Tipo de Cliente</span>
      <div className="flex flex-wrap gap-2">
        {['TODOS', 'NORMAL', 'CONSIGNADO'].map(f => (
          <button
            key={f}
            onClick={() => setFiltroAtivo(f)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${filtroAtivo === f
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
      <PageHeader
        title="Clientes"
        subtitle="Gerencie os clientes parceiros da Alto Tietê"
        buttonText="Adicionar Cliente"
        onButtonClick={() => abrirModal('add')}
      />

      <ContentCard
        title={`Todos os Clientes`}
        count={mercadosFiltrados.length}
        filters={FiltroClientes}
      >

        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
          <div className="space-y-3 md:hidden">
            {mercadosFiltrados.map((mercado) => (
              <article key={mercado.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-800">{mercado.nome}</h3>
                    <p className="mt-1 text-sm text-gray-500">CEP {formatarCEP(mercado.cep)}</p>
                  </div>
                  <Badge text={mercado.tipo} />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <button
                    onClick={() => abrirModal('edit', mercado)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Pencil size={14} /> Editar
                  </button>
                  <button
                    onClick={() => abrirModal('viewAddress', mercado)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                  >
                    <MapPin size={14} /> Endereço
                  </button>
                  <button
                    onClick={() => abrirModal('delete', mercado)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-600 bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    <Trash2 size={14} /> Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block">
            <Table headers={['Nome', 'Tipo', 'CEP']}>
              {mercadosFiltrados.map((mercado) => (
                <tr key={mercado.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{mercado.nome}</td>
                  <td className="px-6 py-4">
                    <Badge text={mercado.tipo} />
                  </td>
                  <td className="px-6 py-4 text-gray-600">{formatarCEP(mercado.cep)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => abrirModal('edit', mercado)}
                        className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <Pencil size={14} /> Editar
                      </button>
                      <button
                        onClick={() => abrirModal('viewAddress', mercado)}
                        className="flex items-center gap-1.5 rounded-md border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                      >
                        <MapPin size={14} /> Endereço
                      </button>
                      <button
                        onClick={() => abrirModal('delete', mercado)}
                        className="flex items-center gap-1.5 rounded-md border border-red-600 bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                      >
                        <Trash2 size={14} /> Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
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
