import {
  LayoutDashboard,
  Store,
  Carrot,
  ShoppingCart,
  LogOut,
  CirclePlus,
  User,
  X,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";

/*
 * Importa o contexto responsável pela autenticação.
 *
 * A Sidebar não acessará mais o token diretamente.
 * O AuthContext solicitará ao backend a revogação do JWT
 * e a remoção do cookie HttpOnly.
 */
import { useAuth } from "../context/AuthContext";

export function Sidebar({
  activeItem,
  isOpen = false,
  onClose,
}) {
  const navigate = useNavigate();

  /*
   * Obtém a função de logout disponibilizada pelo AuthContext.
   *
   * A Sidebar não precisa saber:
   * - onde está o JWT;
   * - como o cookie é removido;
   * - como o token é revogado;
   * - como o CSRF é enviado.
   *
   * Essas responsabilidades ficam centralizadas no AuthContext
   * e no cliente api.
   */
  const { logout } = useAuth();

  async function logOff() {
    try {
      /*
       * Solicita o logout ao backend.
       *
       * O backend:
       * 1. Obtém o JWT do cookie HttpOnly.
       * 2. Revoga o JWT no servidor.
       * 3. envia um Set-Cookie com Max-Age=0.
       * 4. O navegador remove o cookie automaticamente.
       */
      await logout();

      /*
       * O redirecionamento só acontece depois que o backend
       * confirma que o logout foi realizado.
       */
      navigate("/login", { replace: true });
    } catch (error) {
      /*
       * Não removemos nada do localStorage porque o JWT não está mais lá.
       *
       * Também não simulamos um logout no frontend quando o backend falha,
       * pois o cookie HttpOnly pode continuar válido.
       */
      console.error(
        "Não foi possível encerrar a sessão no servidor:",
        error
      );
    }
  }

  function perfil() {
    navigate("/perfil", { replace: true });
    onClose?.();
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Resultados",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      id: "mercados",
      label: "Clientes",
      icon: Store,
      path: "/mercados",
    },
    {
      id: "produtos",
      label: "Produtos",
      icon: Carrot,
      path: "/produtos",
    },
    {
      id: "pedidos",
      label: "Pedidos",
      icon: ShoppingCart,
      path: "/pedidos",
    },
    {
      id: "criarpedidos",
      label: "Criar Pedidos",
      icon: CirclePlus,
      path: "/criarpedidos",
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-hidden bg-[#0B623C] text-green-300 shadow-2xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-30 lg:w-64 lg:translate-x-0 lg:shadow-none ${
        isOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex items-center justify-between p-5 lg:flex-col lg:justify-center lg:p-6">
        <img
          src={logoImg}
          alt="HortiControl"
          className="h-auto w-28 sm:w-32"
        />

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
              className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 transition-colors ${
                isActive
                  ? "bg-[#00a859] font-semibold text-white"
                  : "text-green-100 hover:bg-[#0a9154]"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-green-800 p-4">
        <button
          type="button"
          onClick={perfil}
          className="flex w-full cursor-pointer items-center space-x-3 rounded-lg px-4 py-3 text-white transition-colors hover:bg-[#0a4f30]"
        >
          <User size={20} />
          <span>Perfil</span>
        </button>

        <button
          type="button"
          onClick={logOff}
          className="flex w-full cursor-pointer items-center space-x-3 rounded-lg px-4 py-3 text-white transition-colors hover:bg-[#0a4f30]"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}