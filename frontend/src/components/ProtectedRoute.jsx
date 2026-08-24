import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const {
    status,
    revalidar,
  } = useAuth();

  const location = useLocation();

  /*
   * Enquanto o backend não responde, nenhuma página
   * privada é renderizada.
   */
  if (status === "verificando") {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Verificando sessão...
      </div>
    );
  }

  /*
   * Se o backend estiver indisponível, a rota privada
   * permanece bloqueada.
   */
  if (status === "erro") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-gray-600">
          Não foi possível verificar sua sessão.
        </p>

        <button
          type="button"
          onClick={() => revalidar().catch(() => {})}
          className="rounded-lg bg-[#009951] px-4 py-2 font-semibold text-white hover:bg-[#007d42]"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  /*
   * Qualquer estado diferente de "autenticado"
   * bloqueia a rota privada.
   */
  if (status !== "autenticado") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  /*
   * Somente uma sessão confirmada pelo backend
   * libera o conteúdo privado.
   */
  return children;
}

export default ProtectedRoute;