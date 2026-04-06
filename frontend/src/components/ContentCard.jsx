export function ContentCard({ title, count, filters, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      {/* Cabeçalho do Card (ex: Todos os mercados (5) + Filtros) */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-medium text-gray-800">
          {title} ({count})
        </h2>
        
        {/* Aqui injetamos a barra de busca ou o dropdown de filtro */}
        <div className="flex items-center gap-3">
          {filters}
        </div>
      </div>
      
      {/* Área da Tabela */}
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}