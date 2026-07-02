export function Button({ children, variant = 'primary', icon: Icon, className = '', ...props }) {
  // Estilos base que todo botão terá
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition-colors cursor-pointer sm:text-sm";
  
  // Variações de estilo (Primário = Verde Sólido | Outline = Borda Verde)
  const variants = {
    primary: "bg-[#00a859] hover:bg-[#008f4c] text-white",
    outline: "bg-[#00a859]/10 text-[#00a859] hover:bg-[#00a859]/20",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`.trim()} {...props}>
      {/* Se passarmos um ícone, ele renderiza aqui */}
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}