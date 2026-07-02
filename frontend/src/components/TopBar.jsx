import { Moon, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TopBar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-end border-b border-gray-200 bg-white px-4 space-x-3 sm:px-6 sm:space-x-4">
      {/* Ícone de Modo Noturno */}
      <button className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
        <Moon size={24} />
      </button>

      {/* Redirecionamento para a página de Perfil */}
      <Link
        to="/perfil"
        className="text-gray-500 hover:text-[#00a859] transition-colors flex items-center justify-center"
        title="Meu Perfil"
      >
        <UserCircle size={28} />
      </Link>
    </header>
  );
}