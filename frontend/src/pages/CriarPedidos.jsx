import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, ChevronDown, ChevronUp, Leaf, Sprout, WashingMachine, Minus } from 'lucide-react';
import { Select } from '../components/Select';
import { Button } from '../components/Button';

export default function CriarPedidos() {
    const [carrinho, setCarrinho] = useState([]);
    const [abaAberta, setAbaAberta] = useState('');

    const produtosData = {
        nao_lavados: [
            { id: 201, nome: "Acelga (Não Lavada)", embalagem: "Saco", preco: 9.00 },
            { id: 202, nome: "Almeirão (Não Lavado)", embalagem: "Saco", preco: 9.00 },
            { id: 203, nome: "Beterraba", embalagem: "Saco", preco: 9.00 },
            { id: 204, nome: "Catalonha (Não Lavada)", embalagem: "Saco", preco: 9.00 },
            { id: 205, nome: "Cebolinha (Não Lavada)", embalagem: "Saco", preco: 9.00 },
            { id: 206, nome: "Cenoura", embalagem: "Saco", preco: 9.00 },
            { id: 207, nome: "Cheiro Verde", embalagem: "Saco", preco: 9.00 },
            { id: 208, nome: "Coentro (Não Lavado)", embalagem: "Saco", preco: 9.00 },
            { id: 209, nome: "Couve Manteiga (Não Lavada)", embalagem: "Saco", preco: 9.00 },
            { id: 210, nome: "Escarola (Não Lavada)", embalagem: "Saco", preco: 9.00 },
            { id: 211, nome: "Repolho (Não Lavado)", embalagem: "Saco", preco: 9.00 },
            { id: 212, nome: "Salsa (Não Lavada)", embalagem: "Saco", preco: 9.00 },
            { id: 213, nome: "Alecrim (Não Lavado)", embalagem: "Saco", preco: 5.00 },
            { id: 214, nome: "Orégano (Não Lavado)", embalagem: "Saco", preco: 5.00 },
            { id: 215, nome: "Tomilho (Não Lavado)", embalagem: "Saco", preco: 5.00 },
            { id: 216, nome: "Manjericão (Não Lavado)", embalagem: "Saco", preco: 5.00 },
            { id: 217, nome: "Shimeji Branco", embalagem: "Bandeja", preco: 4.50 },
            { id: 218, nome: "Shimeji Preto", embalagem: "Bandeja", preco: 4.50 }
        ],
        pre_lavados: [
            { id: 301, nome: "Agrião Higienizado", embalagem: "Bandeja", preco: 9.00 },
            { id: 302, nome: "Alface Crespa Higienizada", embalagem: "Bandeja", preco: 9.00 },
            { id: 303, nome: "Alface Crespa Roxa Hig.", embalagem: "Bandeja", preco: 9.00 },
            { id: 304, nome: "Alface Lisa Higienizada", embalagem: "Bandeja", preco: 9.00 },
            { id: 305, nome: "Alface Mista Higienizada", embalagem: "Bandeja", preco: 9.00 },
            { id: 306, nome: "Alface Romana Higienizada", embalagem: "Bandeja", preco: 9.00 },
            { id: 307, nome: "Alho Poró Higienizado", embalagem: "Bandeja", preco: 9.00 },
            { id: 308, nome: "Almeirão Higienizado", embalagem: "Bandeja", preco: 9.00 },
            { id: 309, nome: "Alface Americana Higienizada", embalagem: "Bandeja", preco: 9.00 },
            { id: 310, nome: "Brócolis Comum Hig.", embalagem: "Bandeja", preco: 9.00 },
            { id: 311, nome: "Ninja/Flor Higienizado", embalagem: "Bandeja", preco: 9.00 },
            { id: 312, nome: "Catalonha Higienizada", embalagem: "Bandeja", preco: 9.00 },
            { id: 313, nome: "Couve Flor Higienizada", embalagem: "Bandeja", preco: 9.00 },
            { id: 314, nome: "Escarola Higienizada", embalagem: "Bandeja", preco: 9.00 },
            { id: 315, nome: "Espinafre Higienizado", embalagem: "Bandeja", preco: 9.00 },
            { id: 316, nome: "Frizze", embalagem: "Bandeja", preco: 9.00 },
            { id: 317, nome: "Haditi", embalagem: "Bandeja", preco: 9.00 },
            { id: 318, nome: "Hortelã Higienizada", embalagem: "Bandeja", preco: 9.00 },
            { id: 319, nome: "Kit Salada", embalagem: "Bandeja", preco: 12.00 },
            { id: 320, nome: "Mini Agrião", embalagem: "Bandeja", preco: 9.00 },
            { id: 321, nome: "Ninja", embalagem: "Bandeja", preco: 9.00 },
            { id: 322, nome: "Rúcula Higienizada", embalagem: "Bandeja", preco: 9.00 },
            { id: 323, nome: "Salada Pote", embalagem: "Pote", preco: 15.00 },
            { id: 324, nome: "Salsão Higienizado", embalagem: "Bandeja", preco: 9.00 },
            { id: 325, nome: "Yakissoba", embalagem: "Saco", preco: 15.00 }
        ]
    };

    const mercadosMock = ["Escolha um mercado...", "MJ4", "MJ2", "Tropical", "Mercado São Paulo"];

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

    const ProdutoCard = ({ produto }) => {
        const itemNoCarrinho = carrinho.find(item => item.id === produto.id);

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
                setCarrinho(prev => prev.map(item =>
                    item.id === produto.id ? { ...item, qtd: novaQtd } : item
                ));
            } else {
                removerItem(produto.id);
            }
        };

        const handleBlur = () => {
            if (itemNoCarrinho && (itemNoCarrinho.qtd === "" || itemNoCarrinho.qtd === 0)) {
                removerItem(produto.id);
            }
        };

        return (
            <div className="bg-[#f9f9f9] border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:border-[#00a859]/30 transition-all">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-700 text-sm">{produto.nome}</h3>
                    <span className="text-[#00a859] font-bold text-sm">R$ {produto.preco.toFixed(2).replace('.', ',')}</span>
                </div>

                <div className="flex justify-between items-center mb-4 text-[10px] text-gray-400 uppercase font-semibold">
                    <span>Embalagem: <b className="text-gray-500">{produto.embalagem}</b></span>
                    <span>uni.</span>
                </div>

                {itemNoCarrinho ? (
                    <div className="flex items-center justify-between bg-white border-2 border-[#00a859] rounded-xl overflow-hidden h-9">
                        <button
                            onClick={() => atualizarQtd(produto.id, -1)}
                            className="w-10 h-full flex items-center justify-center text-[#00a859] hover:bg-green-50 transition-colors cursor-pointer"
                        >
                            <Minus size={16} strokeWidth={3} />
                        </button>

                        <input
                            type="text"
                            inputMode="numeric"
                            className="w-full h-full text-center text-sm font-bold text-gray-700 outline-none"
                            value={itemNoCarrinho.qtd}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            autoFocus={itemNoCarrinho.qtd === 1}
                        />

                        <button
                            onClick={() => atualizarQtd(produto.id, 1)}
                            className="w-10 h-full flex items-center justify-center text-[#00a859] hover:bg-green-50 transition-colors cursor-pointer"
                        >
                            <Plus size={16} strokeWidth={3} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => adicionarAoCarrinho(produto)}
                        className="w-full bg-[#00a859] hover:bg-[#008f4c] text-white text-[11px] h-9 rounded-xl flex items-center justify-center gap-2 transition-colors font-bold cursor-pointer"
                    >
                        <Plus size={14} strokeWidth={3} /> Adicionar Produto
                    </button>
                )}
            </div>
        );
    };

    const SecaoSanfona = ({ id, titulo, icon: Icon, produtos }) => (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4 shrink-0">
            <button
                onClick={() => setAbaAberta(abaAberta === id ? '' : id)}
                className="w-full flex items-center justify-between p-5 transition-colors hover:bg-gray-50"
            >
                <div className="flex items-center gap-3">
                    {/* ÍCONE FIXO EM VERDE AQUI */}
                    <div className="p-2 rounded-lg bg-green-50 text-[#00a859]">
                        <Icon size={20} />
                    </div>
                    <span className="text-lg font-semibold text-gray-700">{titulo}</span>
                </div>
                {abaAberta === id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
            </button>
            {abaAberta === id && (
                <div className="p-6 border-t border-gray-50 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                        {produtos?.map(p => <ProdutoCard key={p.id} produto={p} />)}
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div className="h-full max-h-screen flex flex-col overflow-hidden ">

            <header className="mb-2 shrink-0">
                <h1 className="text-3xl font-semibold text-gray-800">Criar Novo Pedido</h1>
                <p className="text-gray-500 font-medium">Lance manualmente um pedido para um mercado</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">

                <div className="lg:col-span-2 flex flex-col overflow-y-auto pr-2">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 flex items-center gap-4 px-6 pt-3.5">
                        <label className="text-[11px] font-bold text-gray-700 uppercase mb-3 tracking-widest pr-2">Selecione o Cliente:</label>
                        <div className='w-135'><Select options={mercadosMock} /></div>
                    </div>
                    <SecaoSanfona id="nao_lavados" titulo="Produtos Não Lavados" icon={Leaf} produtos={produtosData.nao_lavados} />
                    <SecaoSanfona id="pre_lavados" titulo="Produtos Pré-Lavados" icon={WashingMachine} produtos={produtosData.pre_lavados} />
                </div>

                <div className="lg:col-span-1 h-full flex flex-col overflow-hidden">
                    <div className="bg-white rounded-4xl shadow-sm border border-gray-200 p-8 flex flex-col h-full overflow-hidden">
                        <div className="flex items-center gap-3 mb-8 shrink-0">
                            <div className="bg-black text-white p-2 rounded-lg"><ShoppingCart size={20} /></div>
                            <h2 className="text-xl font-bold text-gray-800">Resumo do Pedido</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 mb-8">
                            {carrinho.length === 0 ? (
                                <p className="text-center text-gray-400 py-10 text-sm">Nenhum item adicionado.</p>
                            ) : (
                                carrinho.map(item => (
                                    <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-3">
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800">{item.nome}</p>
                                            <p className="text-[10px] text-gray-400 font-semibold uppercase">R$ {item.preco.toFixed(2)} x {item.qtd}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-2 py-1">
                                                <button onClick={() => atualizarQtd(item.id, -1)} className="p-1"><Minus size={12} /></button>
                                                <span className="text-xs font-bold px-2">{item.qtd}</span>
                                                <button onClick={() => atualizarQtd(item.id, 1)} className="p-1"><Plus size={12} /></button>
                                            </div>
                                            <button onClick={() => removerItem(item.id)} className="text-red-400"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="border-t border-gray-100 pt-6 space-y-4 shrink-0">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-800">Total</span>
                                <span className="text-2xl font-black text-[#00a859]">R$ {totalGeral.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <button className="w-full bg-[#222] hover:bg-black text-white py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-[0.98]">
                                Lançar Pedido
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}