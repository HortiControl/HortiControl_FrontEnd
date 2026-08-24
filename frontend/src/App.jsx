import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

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

import {
  NotificationProvider,
} from "./components/notifications/NotificationContext";

import {
  AuthProvider,
} from "./context/AuthContext";

/*
 * Outlet representa a rota filha que será
 * renderizada dentro deste agrupamento.
 */
function RotasProtegidas() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

function App() {
  return (
    /*
     * Disponibiliza as notificações
     * para toda a aplicação.
     */
    <NotificationProvider>

      {/*
       * BrowserRouter ativa o sistema
       * de rotas do React.
       */}
      <BrowserRouter>

        {/*
         * AuthProvider disponibiliza o estado
         * de autenticação para todas as páginas.
         */}
        <AuthProvider>

          <Routes>

            {/*
             * Rotas públicas.
             */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/cadastro"
              element={
                <PublicRoute>
                  <Cadastro />
                </PublicRoute>
              }
            />

            {/*
             * Todas as rotas dentro deste grupo
             * passam por ProtectedRoute.
             */}
            <Route element={<RotasProtegidas />}>

              <Route
                path="/"
                element={
                  <AppLayout activePage="dashboard">
                    <Dashboard />
                  </AppLayout>
                }
              />

              <Route
                path="/mercados"
                element={
                  <AppLayout activePage="mercados">
                    <Mercados />
                  </AppLayout>
                }
              />

              <Route
                path="/produtos"
                element={
                  <AppLayout activePage="produtos">
                    <Produtos />
                  </AppLayout>
                }
              />

              <Route
                path="/pedidos"
                element={
                  <AppLayout activePage="pedidos">
                    <GerenciamentoPedidos />
                  </AppLayout>
                }
              />

              <Route
                path="/criarpedidos"
                element={
                  <AppLayout activePage="criarpedidos">
                    <CriarPedidos />
                  </AppLayout>
                }
              />

              <Route
                path="/perfil"
                element={
                  <AppLayout activePage="perfil">
                    <Perfil />
                  </AppLayout>
                }
              />

            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;