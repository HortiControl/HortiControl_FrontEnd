import { ChevronDown } from 'lucide-react';

export function Select({ label, options, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      
      <div className="relative flex items-center">
        <select 
          className="w-full px-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#00a859]/30 transition-all appearance-none cursor-pointer pr-10" 
          {...props}
        >
          {options.map((opt, index) => (
            <option key={index} value={opt}>{opt}</option>
          ))}
        </select>
        
        {/* Ícone posicionado absolutamente à direita */}
        <ChevronDown 
          size={18} 
          className="absolute right-3 text-gray-500 pointer-events-none" 
        />
      </div>
    </div>
  );
}