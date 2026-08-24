import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublicRoute({ children }) {
  const { status } = useAuth();

  /*
   * Aguarda o backend confirmar se existe sessão.
   */
  if (status === "verificando") {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Verificando sessão...
      </div>
    );
  }

  /*
   * Usuários autenticados não podem acessar
   * login nem cadastro.
   */
  if (status === "autenticado") {
    return <Navigate to="/" replace />;
  }

  /*
   * Usuários anônimos podem acessar login e cadastro.
   * O status "erro" também permite mostrar o login,
   * mas nenhuma rota privada é liberada.
   */
  return children;
}

export default PublicRoute;