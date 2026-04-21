import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Mercados } from './pages/Mercados';
import { Produtos } from './pages/Produtos';
import { GerenciamentoPedidos } from './pages/GerenciamentoPedidos';
import CriarPedidos from './pages/CriarPedidos';
import Perfil from './pages/Perfil';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>



      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/cadastro" element={<Cadastro />} />  

        {/* Se o usuário entrar na raiz pura ("/"), redirecionamos para mercados */}
        <Route path="/" element={<Navigate to="/mercados" replace />} />

        {/* Rota de Mercados */}
        <Route
          path="/mercados"
          element={
            <AppLayout activePage="mercados">
              <Mercados />
            </AppLayout>
          }
        />

        {/* Rota de Produtos */}
        <Route
          path="/produtos"
          element={
            <AppLayout activePage="produtos">
              <Produtos />
            </AppLayout>
          }
        />

        <Route path="/pedidos"
          element={<AppLayout activePage="pedidos">
            <GerenciamentoPedidos />
          </AppLayout>} />

        <Route path="/criarpedidos"
          element={<AppLayout activePage="criarpedidos">
            <CriarPedidos />
          </AppLayout>} />

          <Route path="/perfil"
          element={<AppLayout activePage="perfil">
            <Perfil />
          </AppLayout>} />

            

      </Routes>
    </BrowserRouter>
  );
}

export default App;