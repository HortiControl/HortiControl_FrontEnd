import { X } from 'lucide-react';

// Ele recebe isOpen (para saber se aparece ou não) e onClose (função para fechar)
export function Modal({ isOpen, onClose, title, subtitle, children, isDanger, maxWidth = 'max-w-md' }) {
  if (!isOpen) return null;

  return (
    // Fundo escuro cobrindo a tela toda (para ficar por cima de tudo)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      {/* A Caixa Branca do Modal */}
      <div className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} mx-4 overflow-hidden flex flex-col`}>

        {/* Cabeçalho do Modal */}
        <div className="px-6 py-5 flex justify-between items-start">
          <div>
            {/*(Excluir), o título fica vermelho */}
            <h2 className={`text-xl font-semibold ${isDanger ? 'text-red-600' : 'text-gray-800'}`}>
              {title}
            </h2>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>

          {/* Botão de Fechar (X) */}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo Dinâmico (Os inputs e botões) */}
        <div className="px-6 pb-6">
          {children}
        </div>

      </div>
    </div>
  );
}