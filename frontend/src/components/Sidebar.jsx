import { LayoutDashboard, Store, Carrot, ShoppingCart, LogOut, CirclePlus, User } from 'lucide-react';
import { X } from 'lucide-react';
import api from '../provider/api';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';

export function Sidebar({ activeItem, isOpen = false, onClose }) {
  const navigate = useNavigate();

  async function logOff() {
    api.get("/usuarios/logout", {
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

  function perfil () {
    navigate("/perfil", { replace: true })
    onClose?.();
  }

  const menuItems = [
    // Dashboard adicionada de volta aqui e apontando para "/"
    { id: 'dashboard', label: 'Resultados', icon: LayoutDashboard, path: '/' },
    { id: 'mercados', label: 'Clientes', icon: Store, path: '/mercados' },
    { id: 'produtos', label: 'Produtos', icon: Carrot, path: '/produtos' },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { id: 'criarpedidos', label: 'Criar Pedidos', icon: CirclePlus, path: '/criarpedidos' }
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-hidden bg-[#0B623C] text-green-300 shadow-2xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-30 lg:w-64 lg:translate-x-0 lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="flex items-center justify-between p-5 lg:flex-col lg:justify-center lg:p-6">
        <img src={logoImg} alt="HortiControl" className="h-auto w-28 sm:w-32" />

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Fechar menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="mt-2 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={onClose}
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
        <button onClick={perfil} className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-[#0a4f30] rounded-lg transition-colors cursor-pointer">
          <User size={20} />
          <span>Perfil</span>
        </button>
        <button onClick={logOff} className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-[#0a4f30] rounded-lg transition-colors cursor-pointer">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}