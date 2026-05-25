export function Table({ headers, children }) {
  return (
    <table className="w-full text-left border-collapse ">
      <thead>
        <tr className="sticky top-0 bg-gray-50 z-10 text-gray-500 text-sm border-b border-gray-200 shadow-sm">
          {headers.map((header, index) => (
            <th key={index} className="px-6 py-4 font-medium">
              {header}
            </th>
          ))}
          {/* A última coluna sempre será a de Ações, então deixamos fixa e alinhada à direita */}
          <th className="px-6 py-4 font-medium text-right">Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {children}
      </tbody>
    </table>
  );
}