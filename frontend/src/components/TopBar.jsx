import { Moon, UserCircle } from 'lucide-react';

export function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 space-x-4">
      {/* Ícone de Modo Noturno */}
      <button className="text-gray-500 hover:text-gray-700 transition-colors">
        <Moon size={24} />
      </button>
      
      {/* Ícone/Avatar do Usuário */}
      <button className="text-gray-500 hover:text-gray-700 transition-colors">
        <UserCircle size={28} />
      </button>
    </header>
  );
}