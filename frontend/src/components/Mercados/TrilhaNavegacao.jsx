import { ArrowLeft } from "lucide-react";

export function TrilhaNavegacao({ texto, onVoltar, ariaLabel }) {
  return (
    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500 shrink-0">
      <button
        onClick={onVoltar}
        className="text-gray-600 transition-colors hover:text-gray-900"
        aria-label={ariaLabel}
      >
        <ArrowLeft size={16} />
      </button>
      <p>{texto}</p>
    </div>
  );
}
