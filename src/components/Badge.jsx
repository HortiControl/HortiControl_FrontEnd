export function Badge({ text }) {
  // Mapeamos o texto para as cores que vimos nas suas imagens
  const colorMap = {
    // Mercados
    'Normal': 'bg-gray-200 text-gray-700',
    'Consignado': 'bg-[#00a859] text-white',
    // Produtos
    'Pote': 'bg-blue-100 text-blue-700',
    'Bandeja': 'bg-orange-100 text-orange-700',
    'Saco': 'bg-green-100 text-green-700',
  };

  // Se o texto não estiver no mapa, usa cinza por padrão
  const styleClass = colorMap[text] || 'bg-gray-100 text-gray-600';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styleClass}`}>
      {text}
    </span>
  );
}