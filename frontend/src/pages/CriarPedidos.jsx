import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, ChevronDown, ChevronUp, Leaf, Minus, X } from 'lucide-react';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import api from '../provider/api';

export default function CriarPedidos() {
    const [carrinho, setCarrinho] = useState([]);
    const [abaAberta, setAbaAberta] = useState('pre_lavados');
    const [mercadosData, setMercadosData] = useState([]);
    const [produtosData, setProdutosData] = useState({ nao_lavados: [], pre_lavados: [] });
    const [mercadoSelecionado, setMercadoSelecionado] = useState('Selecione um mercado');

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

    const carregarPreLavados = () => {
        api.get("/produtos/pre-lavados", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                if (response.data.length == 0) {
                    console.log("vazio");
                } else {
                    const preLavadosFormatados = response.data.map(preLavado => ({
                        id: preLavado.id,
                        nome: preLavado.nome,
                        embalagem: preLavado.tipoEmbalagem,
                        preco: preLavado.preco,
                        tipoProduto: 'PRE_LAVADO'
                    }));
                    setProdutosData(prev => ({ ...prev, pre_lavados: preLavadosFormatados }));
                }
            })
            .catch(error => console.error("Erro ao carregar clientes:", error));
    };

    const carregarNaoLavados = () => {
        api.get("/produtos/nao-lavados", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                if (response.data.length == 0) {
                    console.log("vazio");
                } else {
                    const naoLavadosFormatados = response.data.map(naoLavado => ({
                        id: naoLavado.id,
                        nome: naoLavado.nome,
                        embalagem: naoLavado.tipoEmbalagem,
                        preco: naoLavado.preco,
                        tipoProduto: 'NAO_LAVADO'
                    }));
                    setProdutosData(prev => ({ ...prev, nao_lavados: naoLavadosFormatados }));
                }
            })
            .catch(error => console.error("Erro ao carregar clientes:", error));
    };

    useEffect(() => {
        if (token) {
            carregarMercados();
            carregarPreLavados();
            carregarNaoLavados();
        }
    }, [token]);

    const adicionarAoCarrinho = (produto) => {
        setCarrinho(prev => {
            const itemExiste = prev.find(item => item.id === produto.id);
            if (itemExiste) {
                return prev.map(item => item.id === produto.id ? { ...item, qtd: item.qtd + 1 } : item);
            }
            return [...prev, { ...produto, qtd: 1 }];
        });
    };

    const atualizarQtd = (id, delta) => {
        setCarrinho(prev => prev.map(item =>
            item.id === id ? { ...item, qtd: Math.max(1, item.qtd + delta) } : item
        ));
    };

    const removerItem = (id) => setCarrinho(prev => prev.filter(item => item.id !== id));
    const totalGeral = carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);
    const totalItens = carrinho.reduce((acc, item) => acc + (Number(item.qtd) || 0), 0);

    const handleLancarPedido = () => {
        if (!mercadoSelecionado || mercadoSelecionado === 'Selecione um mercado') {
            alert('Por favor, selecione um mercado válido antes de lançar o pedido.');
            return;
        }

        if (carrinho.length === 0) {
            alert('O carrinho está vazio! Adicione pelo menos um produto.');
            return;
        }

        const mercadoEncontrado = marketsData.find(m => m.nome === mercadoSelecionado);
        const mercadoId = mercadoEncontrado ? mercadoEncontrado.id : null;

        const novoPedido = {
            mercadoId: mercadoId,
            itens: carrinho.map(item => ({
                produtoId: item.id,
                quantidade: item.qtd,
            }))
        };

        console.log("Enviando dados estruturados para a API:", novoPedido);

        api.post("/pedidos", novoPedido, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                console.log("Resposta da API ao lançar pedido:", response.data);
                alert("Pedido lançado com sucesso!");
                setCarrinho([]);
                setMercadoSelecionado('Selecione um mercado');
            })
            .catch(error => {
                console.error("Erro ao registrar pedido:", error);
                if (error.response) {
                    console.log("Detalhes do erro do backend:", error.response.data);
                }
                alert("Houve um erro ao registrar o pedido no servidor.");
            });
    };

    const renderBadgeEmbalagem = (embalagem) => {
        const baseClass = "px-3 py-1 rounded-full text-xs font-semibold tracking-wide";
        switch (embalagem?.toLowerCase()) {
            case 'pote':
                return <span className={`${baseClass} bg-[#e6f0ff] text-[#3b82f6]`}>Pote</span>;
            case 'bandeja':
                return <span className={`${baseClass} bg-[#ffebe6] text-[#ff5c33]`}>Bandeja</span>;
            case 'saco':
                return <span className={`${baseClass} bg-[#e6fcf5] text-[#0ca678]`}>Saco</span>;
            default:
                return <span className={`${baseClass} bg-gray-100 text-gray-600`}>{embalagem}</span>;
        }
    };

    const LinhaProduto = ({ produto }) => {
        const itemNoCarrinho = carrinho.find(item => item.id === produto.id);
        const quantidadeAtual = itemNoCarrinho ? itemNoCarrinho.qtd : 0;

        const handleInputChange = (e) => {
            const valorDigitado = e.target.value;

            if (valorDigitado === "") {
                setCarrinho(prev => prev.map(item =>
                    item.id === produto.id ? { ...item, qtd: "" } : item
                ));
                return;
            }

            const novaQtd = parseInt(valorDigitado);

            if (novaQtd > 0) {
                const itemExiste = carrinho.find(item => item.id === produto.id);
                if (!itemExiste) {
                    setCarrinho(prev => [...prev, { ...produto, qtd: novaQtd }]);
                } else {
                    setCarrinho(prev => prev.map(item =>
                        item.id === produto.id ? { ...item, qtd: novaQtd } : item
                    ));
                }
            } else {
                removerItem(produto.id);
            }
        };

        const handleBlur = () => {
            if (itemNoCarrinho && (itemNoCarrinho.qtd === "" || itemNoCarrinho.qtd === 0)) {
                removerItem(produto.id);
            }
        };

        const incrementar = () => {
            const itemExiste = carrinho.find(item => item.id === produto.id);
            if (!itemExiste) {
                setCarrinho(prev => [...prev, { ...produto, qtd: 1 }]);
            } else {
                atualizarQtd(produto.id, 1);
            }
        };

        const decrementar = () => {
            if (quantidadeAtual <= 1) {
                removerItem(produto.id);
            } else {
                atualizarQtd(produto.id, -1);
            }
        };

        return (
            <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-4 text-sm font-medium text-gray-700">{produto.nome}</td>
                <td className="py-4">{renderBadgeEmbalagem(produto.embalagem || produto.tipoEmbalagem)}</td>
                <td className="py-4 text-sm font-semibold text-[#10b981]">R$ {produto.preco.toFixed(2).replace('.', ',')}</td>
                <td className="py-4">
                    <div className="flex items-center gap-1.5 justify-end">
                        <button
                            onClick={decrementar}
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <Minus size={14} />
                        </button>
                        <input
                            type="text"
                            inputMode="numeric"
                            className="w-10 h-7 text-center text-sm font-medium text-gray-700 border border-gray-200 bg-[#f8f9fa] rounded-md outline-none"
                            value={quantidadeAtual}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                        />
                        <button
                            onClick={incrementar}
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    const SecaoSanfona = ({ id, titulo, produtos }) => {
        const isAberta = abaAberta === id;
        const totalProdutos = produtos?.length || 0;

        return (
            <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden mb-5">
                <button
                    onClick={() => setAbaAberta(isAberta ? '' : id)}
                    className="w-full flex items-center justify-between p-5 transition-colors hover:bg-gray-50/50"
                >
                    <div className="flex items-center gap-3">
                        {/* Ícones com cores condicionais dinâmicas baseadas no id da seção */}
                        <div className={`p-2.5 rounded-xl ${id === 'pre_lavados' ? 'bg-[#e6fcf5] text-[#00a859]' : 'bg-[#f4f4f5] text-gray-400'}`}>
                            <Leaf size={22} />
                        </div>
                        <div className="text-left">
                            <span className="text-base font-bold text-gray-800 block leading-tight">{titulo}</span>
                            <span className="text-xs text-gray-400 font-medium">{totalProdutos} produtos</span>
                        </div>
                    </div>
                    {isAberta ? <ChevronUp className="text-gray-400" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
                </button>

                {isAberta && (
                    <div className="px-6 pb-4 border-t border-gray-100 bg-white">
                        <div className="max-h-85 overflow-y-auto pr-1 custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        <th className="py-3 font-semibold">Produto</th>
                                        <th className="py-3 font-semibold">Embalagem</th>
                                        <th className="py-3 font-semibold">Preço</th>
                                        <th className="py-3 font-semibold text-right pr-2">Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {produtos?.map(p => <LinhaProduto key={p.id} produto={p} />)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] p-8 flex flex-col font-sans selection:bg-green-100">
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-[28px] font-bold text-[#1f2937] tracking-tight">Criar Novo Pedido</h1>
                <p className="text-sm text-gray-500 font-normal mt-0.5">Lance manualmente um pedido para um mercado</p>
            </header>

            {/* Layout Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Coluna da Esquerda (Formulário e Produtos) */}
                <div className="lg:col-span-2 flex flex-col">
                    {/* Seleção do Cliente */}
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <label className="text-sm font-bold text-gray-700 tracking-tight whitespace-nowrap">Selecione o Cliente:</label>
                        <div className="w-full sm:w-120">
                            <Select
                                options={['Escolha um mercado...'].concat(mercadosData.map(m => m.nome))}
                                value={mercadoSelecionado === 'Selecione um mercado' ? 'Escolha um mercado...' : mercadoSelecionado}
                                onChange={(e) => setMercadoSelecionado(e.target.value)}
                            />
                        </div>
                    </div>

                    <SecaoSanfona id="nao_lavados" titulo="Produtos Não Lavados" produtos={produtosData.nao_lavados} />
                    <SecaoSanfona id="pre_lavados" titulo="Produtos Pré-Lavados" produtos={produtosData.pre_lavados} />
                </div>

                {/* Coluna da Direita (Resumo do Pedido) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col min-h-120 shadow-sm">

                        {/* Header do Resumo */}
                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                                <ShoppingCart size={18} className="text-gray-800" strokeWidth={2.5} />
                                <h2 className="text-base font-bold text-gray-800 tracking-tight">Resumo do Pedido</h2>
                            </div>
                            {carrinho.length > 0 && (
                                <button
                                    onClick={() => setCarrinho([])}
                                    className="bg-red-500 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-md flex items-center gap-1 hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 size={10} /> Limpar
                                </button>
                            )}
                        </div>

                        {/* Lista de Itens do Carrinho */}
                        <div className="flex-1 overflow-y-auto pr-1 max-h-80 custom-scrollbar">
                            {carrinho.length === 0 ? (
                                <div className="h-full flex items-center justify-center py-16">
                                    <p className="text-center text-sm font-normal text-gray-400">Nenhum item adicionado.</p>
                                </div>
                            ) : (
                                carrinho.map(item => (
                                    <div key={item.id} className="relative group p-3 border border-gray-200 bg-white rounded-xl mb-3 flex flex-col justify-between">
                                        <button
                                            onClick={() => removerItem(item.id)}
                                            className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>

                                        <div className="pr-5">
                                            <div className="flex items-baseline gap-2">
                                                <h4 className="text-xs font-bold text-gray-800">{item.nome}</h4>
                                                <span className="text-[10px] text-gray-400 font-medium">R$ {item.preco.toFixed(2).replace('.', ',')}/uni.</span>
                                            </div>
                                            <div className="flex gap-1.5 mt-1">
                                                <span className="bg-blue-50 text-[9px] text-blue-500 font-bold px-1.5 py-0.5 rounded">
                                                    {item.embalagem || item.tipoEmbalagem}
                                                </span>
                                                <span className="bg-gray-50 text-[9px] text-gray-400 font-semibold px-1.5 py-0.5 rounded">
                                                    {item.tipoProduto === 'PRE_LAVADO' ? 'Pré-Lavado' : 'Não Lavado'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed border-gray-100">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => atualizarQtd(item.id, -1)}
                                                    className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50"
                                                >
                                                    <Minus size={10} />
                                                </button>
                                                <span className="text-xs font-bold w-6 text-center text-gray-700 bg-gray-50 py-0.5 rounded">
                                                    {item.qtd}
                                                </span>
                                                <button
                                                    onClick={() => atualizarQtd(item.id, 1)}
                                                    className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50"
                                                >
                                                    <Plus size={10} />
                                                </button>
                                            </div>
                                            <span className="text-xs font-bold text-emerald-600">
                                                R$ {(item.preco * (Number(item.qtd) || 0)).toFixed(2).replace('.', ',')}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Rodapé do Resumo (Valores e Botão Salvar) */}
                        <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
                            <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                                <span>Total de itens:</span>
                                <span className="font-bold text-gray-700">{totalItens}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-800">Total</span>
                                <span className="text-lg font-extrabold text-[#10b981]">
                                    R$ {totalGeral.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                            <button
                                onClick={handleLancarPedido}
                                className="w-full bg-[#1f2937] hover:bg-black text-white py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-[0.99]"
                            >
                                Lançar Pedido
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}