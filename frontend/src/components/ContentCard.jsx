export function ContentCard({ title, subtitle, count, filters, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-gray-800">
            {title} {count !== undefined && `(${count})`}
          </h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
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