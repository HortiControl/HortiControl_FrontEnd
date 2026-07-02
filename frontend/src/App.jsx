import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Mercados } from "./pages/Mercados";
import { Produtos } from "./pages/Produtos";
import { GerenciamentoPedidos } from "./pages/GerenciamentoPedidos";
import CriarPedidos from "./pages/CriarPedidos";
import Perfil from "./pages/Perfil";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { NotificationProvider } from "./components/notifications/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rota da Dashboard (Raiz do sistema) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout activePage="dashboard">
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Rota de Mercados */}
          <Route
            path="/mercados"
            element={
              <ProtectedRoute>
                <AppLayout activePage="mercados">
                  <Mercados />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Rota de Produtos */}
          <Route
            path="/produtos"
            element={
              <ProtectedRoute>
                <AppLayout activePage="produtos">
                  <Produtos />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/pedidos"
            element={
              <ProtectedRoute>
                <AppLayout activePage="pedidos">
                  <GerenciamentoPedidos />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/criarpedidos"
            element={
              <ProtectedRoute>
                <AppLayout activePage="criarpedidos">
                  <CriarPedidos />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <AppLayout activePage="perfil">
                  <Perfil />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;