import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';

export function AppLayout({ children, activePage }) {
  return (
    <div className="flex min-h-screen w-full bg-[#f3f4f6]">
      {/* Sidebar fixada na esquerda */}
      <Sidebar activeItem={activePage} />

      {/* Área principal à direita */}
      <div className="flex-1 flex flex-col">
        <TopBar />
        
        {/* Aqui é onde o conteúdo das páginas (Mercados, Produtos) vai aparecer */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}