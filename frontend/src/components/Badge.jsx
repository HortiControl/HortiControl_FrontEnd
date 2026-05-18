export function Badge({ text }) {
  // Mapeamos o texto para as cores que vimos nas suas imagens
  const colorMap = {
    // Mercados
    'NORMAL': 'bg-gray-200 text-gray-700',
    'CONSIGNADO': 'bg-[#00a859] text-white',
    // Produtos
    'POTE': 'bg-blue-100 text-blue-700',
    'BANDEJA': 'bg-orange-100 text-orange-700',
    'SACO': 'bg-green-100 text-green-700',
  };

  // Se o texto não estiver no mapa, usa cinza por padrão
  const styleClass = colorMap[text] || 'bg-gray-100 text-gray-600';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styleClass}`}>
      {text}
    </span>
  );
}