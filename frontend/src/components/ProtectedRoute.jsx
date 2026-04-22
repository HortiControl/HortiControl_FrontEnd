import { Navigate } from "react-router-dom";

const PROTEGER_ROTAS = false;

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (PROTEGER_ROTAS && !token) {
      return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
