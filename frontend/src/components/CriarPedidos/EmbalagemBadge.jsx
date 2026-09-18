const BASE_CLASS = "px-3 py-1 rounded-full text-xs font-semibold tracking-wide";

export function EmbalagemBadge({ embalagem }) {
  switch (embalagem?.toLowerCase()) {
    case "pote":
      return (
        <span className={`${BASE_CLASS} bg-[#e6f0ff] text-[#3b82f6]`}>Pote</span>
      );
    case "bandeja":
      return (
        <span className={`${BASE_CLASS} bg-[#ffebe6] text-[#ff5c33]`}>Bandeja</span>
      );
    case "saco":
      return (
        <span className={`${BASE_CLASS} bg-[#e6fcf5] text-[#0ca678]`}>Saco</span>
      );
    default:
      return (
        <span className={`${BASE_CLASS} bg-gray-100 text-gray-600`}>{embalagem}</span>
      );
  }
}
