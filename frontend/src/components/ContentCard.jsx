export function ContentCard({ title, subtitle, count, filters, children }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:mt-6">
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-end sm:gap-5 sm:p-6">
        <div>
          {title && (
            <h2 className="text-base font-medium text-gray-800 sm:text-lg">
              {title} {count !== undefined && `(${count})`}
            </h2>
          )}
          {/* Trocamos <p> por <div> para podermos injetar a barra de busca aqui sem dar erro de HTML */}
          {subtitle && <div className="mt-1 text-xs text-gray-500 sm:text-sm">{subtitle}</div>}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {filters}
        </div>
      </div>
      
      <div className="overflow-x-auto px-1 sm:px-0">
        {children}
      </div>
    </div>
  );
}