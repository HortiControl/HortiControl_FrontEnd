import { ChevronDown } from 'lucide-react';

export function Select({ label, options, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      
      <div className="relative flex items-center">
        <select 
          className={`min-h-11 w-full px-4 py-3 bg-gray-100 rounded-lg text-[13px] text-gray-800 font-medium outline-none focus:ring-2 focus:ring-[#000000]/30 transition-all appearance-none cursor-pointer pr-10 ${className}`.trim()} 
          {...props}
        >
          {options.map((opt, index) => (
            <option className='font-medium' key={index} value={opt}>{opt}</option>
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