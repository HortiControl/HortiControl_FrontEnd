import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, ChevronDown, ChevronUp, Leaf, Minus, X } from 'lucide-react';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import api from '../provider/api';
import { useNotification } from '../components/notifications/NotificationContext';

const SecaoSanfona = ({ id, titulo, produtos, abaAberta, setAbaAberta, children, mobileItems }) => {
    const isAberta = abaAberta === id;
    const totalProdutos = produtos?.length || 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
            <button
                onClick={() => setAbaAberta(isAberta ? '' : id)}
                className="w-full flex items-center justify-between p-5 transition-colors hover:bg-gray-50/50 cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    {/* Ícones com cores condicionais dinâmicas baseadas no id da seção */}
                    <div className={`p-2.5 rounded-xl ${id === 'pre_lavados' ? 'bg-[#a7f1ce] text-[#097140]' : 'bg-[#e1e1e2] text-gray-600'}`}>
                        <Leaf size={22} />
                    </div>
                    <div className="text-left">
                        <span className="text-base font-semibold text-gray-800 block leading-tight">{titulo}</span>
                        <span className="text-xs text-gray-400 font-medium">{totalProdutos} produtos</span>
                    </div>
                </div>
                {isAberta ? <ChevronUp className="text-gray-400" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
            </button>

            {isAberta && (
                <div className="border-t border-gray-100 bg-white px-4 pb-4 sm:px-6 max-h-60">
                    <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                        <div className="space-y-3 md:hidden">
                            {mobileItems}
                        </div>

                        <table className="hidden w-full border-collapse text-left md:table">
                            <thead>
                                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="py-3 font-semibold">Produto</th>
                                    <th className="py-3 font-semibold">Embalagem</th>
                                    <th className="py-3 font-semibold">Preço</th>
                                    <th className="py-3 font-semibold text-right pr-2">Quantidade</th>
                                </tr>
                            </thead>
                            <tbody>{children}</tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function CriarPedidos() {
    const notify = useNotification();
    const [carrinho, setCarrinho] = useState([]);
    const [abaAberta, setAbaAberta] = useState('');
    const [mercadosData, setMercadosData] = useState([]);
    const [produtosData, setProdutosData] = useState({ nao_lavados: [], pre_lavados: [] });
    const [mercadoSelecionado, setMercadoSelecionado] = useState('Selecione um mercado');

    const token = localStorage.getItem('token');

    useEffect(() => {

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
                        }));
                        setMercadosData(mercadosFormatados);
                    }
                })
                .catch(error => {
                    console.error("Erro ao carregar clientes:", error);
                    notify.error("Não foi possível carregar os clientes.");
                });
        };

        const carregarPreLavados = () => {
            api.get("/produtos/pre-lavados", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    if (response.data.length == 0) {
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
                .catch(error => {
                    console.error("Erro ao carregar clientes:", error);
                    notify.error("Não foi possível carregar os produtos pré-lavados.");
                });
        };

        const carregarNaoLavados = () => {
            api.get("/produtos/nao-lavados", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    if (response.data.length == 0) {
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
                .catch(error => {
                    console.error("Erro ao carregar clientes:", error);
                    notify.error("Não foi possível carregar os produtos não lavados.");
                });
        };

        if (token) {
            carregarMercados();
            carregarPreLavados();
            carregarNaoLavados();
        }

    }, [token]);

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
            notify.warning('Selecione um mercado válido antes de lançar o pedido.');
            return;
        }

        if (carrinho.length === 0) {
            notify.warning('O carrinho está vazio. Adicione pelo menos um produto.');
            return;
        }

        const mercadoEncontrado = mercadosData.find(m => m.nome === mercadoSelecionado);
        const mercadoId = mercadoEncontrado ? mercadoEncontrado.id : null;

        const novoPedido = {
            mercadoId: mercadoId,
            itens: carrinho.map(item => ({
                produtoId: item.id,
                quantidade: item.qtd,
            }))
        };

        api.post("/pedidos", novoPedido, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                notify.success("Pedido lançado com sucesso.");
                setCarrinho([]);
                setMercadoSelecionado('Selecione um mercado');
            })
            .catch(error => {
                console.error("Erro ao registrar pedido:", error);
                notify.error("Não foi possível registrar o pedido. Tente novamente.");
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

    const CardProduto = ({ produto }) => {
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
            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h4 className="truncate text-base font-semibold text-gray-800">{produto.nome}</h4>
                        <p className="mt-1 text-sm text-[#10b981] font-semibold">R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
                    </div>
                    {renderBadgeEmbalagem(produto.embalagem || produto.tipoEmbalagem)}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={decrementar}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-500 transition-colors hover:bg-gray-100"
                        >
                            <Minus size={14} />
                        </button>
                        <input
                            type="text"
                            inputMode="numeric"
                            className="h-8 w-14 rounded-md border border-gray-200 bg-[#f8f9fa] text-center text-sm font-medium text-gray-700 outline-none"
                            value={quantidadeAtual}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                        />
                        <button
                            onClick={incrementar}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-500 transition-colors hover:bg-gray-100"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            </article>
        );
    };

    return (

        <div>
            <div>
                <header className="mb-6">
                    <h1 className="text-3xl font-semibold text-gray-800">Criar Novo Pedido</h1>
                    <p className="text-gray-500 mt-1 font-medium">Lance manualmente um pedido para um mercado</p>
                </header>
            </div>

            {/* Layout Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Coluna da Esquerda (Formulário e Produtos) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Seleção do Cliente */}
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 flex items-center sm:flex-row sm:items-center justify-between gap-4">
                        <label className="text-sm font-semibold text-gray-700">Selecione o Cliente:</label>
                        <div className="w-full sm:w-120 h-9">
                            <Select
                                options={['Escolha um mercado...'].concat(mercadosData.map(m => m.nome))}
                                value={mercadoSelecionado === 'Selecione um mercado' ? 'Escolha um mercado...' : mercadoSelecionado}
                                onChange={(e) => setMercadoSelecionado(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <SecaoSanfona
                            id="nao_lavados"
                            titulo="Produtos Não Lavados"
                            produtos={produtosData.nao_lavados}
                            abaAberta={abaAberta}
                            setAbaAberta={setAbaAberta}
                            mobileItems={produtosData.nao_lavados?.map(p => <CardProduto key={p.id} produto={p} />)}
                        >
                            {produtosData.nao_lavados?.map(p => <LinhaProduto key={p.id} produto={p} />)}
                        </SecaoSanfona>

                        <SecaoSanfona
                            id="pre_lavados"
                            titulo="Produtos Pré-Lavados"
                            produtos={produtosData.pre_lavados}
                            abaAberta={abaAberta}
                            setAbaAberta={setAbaAberta}
                            mobileItems={produtosData.pre_lavados?.map(p => <CardProduto key={p.id} produto={p} />)}
                        >
                            {produtosData.pre_lavados?.map(p => <LinhaProduto key={p.id} produto={p} />)}
                        </SecaoSanfona>
                    </div>

                </div>

                {/* Coluna da Direita (Resumo do Pedido) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-6 flex flex-col h-136 max-h-136 shadow-sm">

                        {/* Header do Resumo */}
                        <div className="flex items-center justify-between mb-5 pb-4 ">
                            <div className="flex items-center gap-2.5">
                                <ShoppingCart size={22} className="text-gray-800 mr-1" strokeWidth={2.5} />
                                <h2 className="text-xl font-semibold text-gray-800">Resumo do Pedido</h2>
                            </div>
                            {carrinho.length > 0 && (
                                <button
                                    onClick={() => setCarrinho([])}
                                    className="bg-red-600 text-white font-semibold text-[11px] uppercase px-2.5 py-1.5 rounded-md flex items-center justify-center gap-1 hover:bg-red-700 transition-colors cursor-pointer"
                                >
                                    <Trash2 size={14} /> Limpar
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
                                            className="absolute top-2.5 right-2.5 text-gray-500 hover:text-red-600 transition-colors"
                                        >
                                            <X size={20} className='cursor-pointer' />
                                        </button>

                                        <div className="pr-7 w-full">
                                            <div className="flex items-center gap-2 mb-1 w-full">
                                                <h4 className="text-[16px] font-semibold text-gray-800 truncate min-w-0">{item.nome}</h4>
                                                <span className={`font-medium px-1.5 py-1 rounded text-[10px] min-w-fit ${item.tipoProduto === 'PRE_LAVADO' ? 'bg-[#00a859] text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                    {item.tipoProduto === 'PRE_LAVADO' ? 'Pré-Lavado' : 'Não Lavado'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed border-gray-200">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => atualizarQtd(item.id, -1)}
                                                    className="w-5 h-5 flex items-center justify-center border border-gray-400 rounded text-gray-600 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-xs font-bold text-center text-gray-700 bg-gray-100 py-1 px-1.5 rounded w-max">
                                                    {item.qtd}
                                                </span>
                                                <button
                                                    onClick={() => atualizarQtd(item.id, 1)}
                                                    className="w-5 h-5 flex items-center justify-center border border-gray-400 rounded text-gray-600 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <Plus size={14} />
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
                        <div className="border-t-2 border-gray-200 pt-4 mt-4 space-y-4">
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
                                className="w-full bg-[#1f2937] hover:bg-black text-white py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-[0.99] cursor-pointer"
                            >
                                Lançar Pedido
                            </button>
                        </div>

                    </div>
                </div>

            </div>

        </div >

    );
}