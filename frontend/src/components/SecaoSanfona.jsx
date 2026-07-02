import { useState } from "react";



function SecaoSanfona({ id, titulo, produtos }) {

    const [abaAberta, setAbaAberta] = useState('');

    const isAberta = abaAberta === id;
    const totalProdutos = produtos?.length || 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
            <button
                onClick={() => setAbaAberta(isAberta ? '' : id)}
                className="w-full flex items-center justify-between p-4 transition-colors hover:bg-gray-50/50 cursor-pointer sm:p-5"
            >
                <div className="flex items-center gap-3">
                    {/* Ícones com cores condicionais dinâmicas baseadas no id da seção */}
                    <div className={`p-2.5 rounded-xl ${id === 'pre_lavados' ? 'bg-[#a7f1ce] text-[#097140]' : 'bg-[#e1e1e2] text-gray-600'}`}>
                        <Leaf size={22} />
                    </div>
                    <div className="text-left">
                        <span className="block text-sm font-semibold leading-tight text-gray-800 sm:text-base">{titulo}</span>
                        <span className="text-[11px] font-medium text-gray-400 sm:text-xs">{totalProdutos} produtos</span>
                    </div>
                </div>
                {isAberta ? <ChevronUp className="text-gray-400" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
            </button>

            {isAberta && (
                <div className="max-h-60 border-t border-gray-100 bg-white px-4 pb-4 sm:px-6">
                    <div className="max-h-85 overflow-y-auto pr-1 custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-[11px]">
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

export default SecaoSanfona;
