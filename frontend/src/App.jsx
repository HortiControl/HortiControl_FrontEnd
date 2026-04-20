import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Mercados } from './pages/Mercados';
import { Produtos } from './pages/Produtos';
import { GerenciamentoPedidos } from './pages/GerenciamentoPedidos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;