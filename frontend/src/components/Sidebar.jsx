import { LayoutDashboard, Store, Carrot, ShoppingCart, LogOut, CirclePlus } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';

export function Sidebar({ activeItem }) {
  const navigate = useNavigate();

  async function logOff() {
    axios.get("http://localhost:5173/usuarios/logout", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        const aviso = response.data
        console.log(aviso);
        localStorage.removeItem("token");
        navigate("/login", { replace: true })
      })
      .catch(error => console.error("Erro ao fazer logout:", error));
  }

  const menuItems = [
    // Dashboard adicionada de volta aqui e apontando para "/"
    { id: 'dashboard', label: 'Resultados', icon: LayoutDashboard, path: '/' },
    { id: 'mercados', label: 'Mercados', icon: Store, path: '/mercados' },
    { id: 'produtos', label: 'Produtos', icon: Carrot, path: '/produtos' },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { id: 'criarpedidos', label: 'Criar Pedidos', icon: CirclePlus, path: '/criarpedidos' }
  ];

  return (
    <aside className="w-64 bg-[#0B623C] text-green-300 flex flex-col h-screen sticky top-0 overflow-hidden">
      <div className="p-6 flex flex-col items-center justify-center">
        <img src={logoImg} alt="HortiControl" className="w-32 h-auto" />
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
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

      <div className="p-4 border-t border-green-800">
        <button onClick={logOff} className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-[#0a4f30] rounded-lg transition-colors cursor-pointer">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}