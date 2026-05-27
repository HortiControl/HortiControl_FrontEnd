import { Navigate } from "react-router-dom";

const PROTEGER_ROTAS = true;

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (PROTEGER_ROTAS && !token) {
      return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
