import { Search, Filter, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ContentCard } from '../components/ContentCard';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

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

  // A área de filtros da tela de Produtos é mais robusta
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

      {/* Botão de Reajustar Preços (Usando a variante que criamos!) */}
      <Button variant="primary" icon={RefreshCw}>
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
      <PageHeader 
        title="Produtos" 
        subtitle="Gerencie seu catálogo de produtos e preços" 
        buttonText="Adicionar Produto"
      />

      <ContentCard 
        title="Todos os Produtos" 
        count={produtosData.length} 
        filters={FiltrosProdutos}
      >
        <Table headers={['Nome', 'Embalagem', 'Preços']}>
          {produtosData.map((produto) => (
            <tr key={produto.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
              <td className="px-6 py-4 font-medium text-gray-800">{produto.nome}</td>
              <td className="px-6 py-4">
                <Badge text={produto.embalagem} />
              </td>
              {/* O texto do preço é verdinho na sua imagem */}
              <td className="px-6 py-4 text-[#00a859] font-medium">
                {produto.preco}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-3 text-gray-400">
                  <button className="hover:text-gray-800 transition-colors cursor-pointer"><Pencil size={18} /></button>
                  <button className="hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </ContentCard>
    </div>
  );
}