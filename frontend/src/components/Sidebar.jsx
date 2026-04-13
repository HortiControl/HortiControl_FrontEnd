import { LayoutDashboard, Store, Carrot, ShoppingCart, LogOut, CirclePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

export function Sidebar({ activeItem }) {
  // Lista de itens do menu para facilitar a renderização sem repetir código
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'mercados', label: 'Mercados', icon: Store, path: '/mercados' },
    { id: 'produtos', label: 'Produtos', icon: Carrot, path: '/produtos' },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { id: 'criar_pedidos', label: 'Criar Pedidos', icon: CirclePlus, path: '/criarpedidos' }
  ];

  return (
    <aside className="w-64 bg-[#0B623C] text-green-300 flex flex-col min-h-screen">
      {/* Logo Area */}
      <div className="p-6 flex flex-col items-center justify-center">
        {/* Usando a tag img, definindo uma largura maior (w-32) e sem fundo */}
        <img src={logoImg} alt="HortiControl" className="w-32 h-auto" />
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? 'bg-[#00a859] text-white font-semibold'
                : 'text-green-100 hover:bg-[#0a9154]'
                }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Botão Sair - Fica sempre embaixo */}
      <div className="p-4">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-[#0a4f30] rounded-lg transition-colors">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}