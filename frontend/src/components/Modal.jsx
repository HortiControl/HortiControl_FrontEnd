import { X } from 'lucide-react';

// Ele recebe isOpen (para saber se aparece ou não) e onClose (função para fechar)
export function Modal({ isOpen, onClose, title, subtitle, children, isDanger, maxWidth = 'max-w-md' }) {
  if (!isOpen) return null;

  return (
    // Fundo escuro cobrindo a tela toda (para ficar por cima de tudo)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      {/* A Caixa Branca do Modal */}
      <div className={`mx-4 flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl ${maxWidth}`}>

        {/* Cabeçalho do Modal */}
        <div className="flex items-start justify-between px-4 py-4 sm:px-6 sm:py-5">
          <div>
            {/*(Excluir), o título fica vermelho */}
            <h2 className={`text-base font-semibold sm:text-lg lg:text-xl ${isDanger ? 'text-red-600' : 'text-gray-800'}`}>
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-xs text-gray-500 sm:text-sm">{subtitle}</p>}
          </div>

          {/* Botão de Fechar (X) */}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo Dinâmico (Os inputs e botões) */}
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          {children}
        </div>

      </div>
    </div>
  );
}