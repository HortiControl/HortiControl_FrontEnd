export function Button({ children, variant = 'primary', icon: Icon, ...props }) {
  // Estilos base que todo botão terá
  const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors cursor-pointer text-sm";
  
  // Variações de estilo (Primário = Verde Sólido | Outline = Borda Verde)
  const variants = {
    primary: "bg-[#00a859] hover:bg-[#008f4c] text-white",
    outline: "bg-[#00a859]/10 text-[#00a859] hover:bg-[#00a859]/20",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {/* Se passarmos um ícone, ele renderiza aqui */}
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}