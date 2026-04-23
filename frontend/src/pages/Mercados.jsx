import { Filter, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ContentCard } from '../components/ContentCard';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';

export function Mercados() {
  // Simulando os dados que viriam do seu banco de dados (JSON)
  const mercadosData = [
    { id: 1, nome: 'MJ4', tipo: 'Normal', obs: '-' },
    { id: 2, nome: 'MJ3', tipo: 'Normal', obs: '-' },
    { id: 3, nome: 'Mercado São Paulo', tipo: 'Consignado', obs: 'Enviar remessa de produtos todo dia 5 de cada mês' },
    { id: 4, nome: 'Casa Verde', tipo: 'Consignado', obs: '-' },
  ];

  // Componente de Filtro (Dropdown) que aparece no card
  const FiltroMercados = (
    <div className="flex items-center gap-2 text-sm">
      <Filter size={18} className="text-gray-700" />
      <span>Filtros |</span>
      <span className="text-gray-500">Tipo</span>
      <select className="bg-gray-100 border-none text-gray-700 rounded-md px-3 py-1.5 outline-none">
        <option>Todos</option>
        <option>Normal</option>
        <option>Consignado</option>
      </select>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Mercados"
        subtitle="Gerencie os mercados parceiros da Alto Tietê"
        buttonText="Adicionar Mercado"
      />

      <ContentCard
        title="Todos os mercados"
        count={mercadosData.length}
        filters={FiltroMercados}
      >
        <Table headers={['Nome', 'Tipo', 'Observações']}>
          {mercadosData.map((mercado) => (
            <tr key={mercado.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-800">{mercado.nome}</td>
              <td className="px-6 py-4">
                <Badge text={mercado.tipo} />
              </td>
              <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">
                {mercado.obs}
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