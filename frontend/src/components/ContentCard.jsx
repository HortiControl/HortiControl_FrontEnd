export function ContentCard({ title, subtitle, count, filters, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          {title && (
            <h2 className="text-lg font-medium text-gray-800">
              {title} {count !== undefined && `(${count})`}
            </h2>
          )}
          {/* Trocamos <p> por <div> para podermos injetar a barra de busca aqui sem dar erro de HTML */}
          {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {filters}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}