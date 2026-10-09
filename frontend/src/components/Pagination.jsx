import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}) {
  if (totalPages <= 1) return null;

  const pages = obterPaginasVisiveis(currentPage, totalPages);

  return (
    <nav
      aria-label="Paginação"
      className="flex flex-wrap items-center justify-center gap-1.5 border-t border-gray-100 px-2 py-3 sm:gap-2 sm:px-4 sm:py-4"
    >
      <button
        type="button"
        aria-label="Página anterior"
        disabled={disabled || currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="inline-flex h-11 w-6 items-center justify-center text-gray-500 sm:h-9"
            >
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            aria-current={isCurrent ? "page" : undefined}
            aria-label={`Página ${page + 1}`}
            disabled={disabled}
            onClick={() => onPageChange(page)}
            className={`inline-flex h-11 min-w-11 items-center justify-center rounded-md border px-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:h-9 sm:min-w-9 ${
              isCurrent
                ? "border-[#00a859] bg-[#00a859] text-white"
                : "border-gray-300 text-gray-600 hover:border-[#00a859] hover:text-[#007a43]"
            }`}
          >
            {page + 1}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Próxima página"
        disabled={disabled || currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

function obterPaginasVisiveis(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const paginas = new Set([0, totalPages - 1, currentPage]);

  if (currentPage > 1) paginas.add(currentPage - 1);
  if (currentPage < totalPages - 2) paginas.add(currentPage + 1);

  const ordenadas = Array.from(paginas).sort((a, b) => a - b);
  const resultado = [];

  ordenadas.forEach((page, index) => {
    const anterior = ordenadas[index - 1];
    if (index > 0 && page - anterior > 1) resultado.push("ellipsis");
    resultado.push(page);
  });

  return resultado;
}
