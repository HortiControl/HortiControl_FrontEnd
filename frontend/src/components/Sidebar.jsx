import { LayoutDashboard, Store, Carrot, ShoppingCart, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/HortiControlLogo.png';

export function Sidebar({ activeItem }) {
  // Lista de itens do menu para facilitar a renderização sem repetir código
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'mercados', label: 'Mercados', icon: Store, path: '/mercados' },
    { id: 'produtos', label: 'Produtos', icon: Carrot, path: '/produtos' },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
  ];

  return (
    <aside className="w-64 bg-[#e9f4ef] text-black flex flex-col min-h-screen">
      {/* Logo Area */}
      <div className="p-6 flex flex-col items-center justify-center">
        {/* Usando a tag img, definindo uma largura maior (w-32) e sem fundo */}
        <img src={logoImg} alt="HortiControl" className="w-24 h-auto" />
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
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[#00a859] text-black font-semibold' 
                  : 'text-black hover:bg-[#118551]' 
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
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-green-100 hover:bg-[#0a4f30] rounded-lg transition-colors">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}