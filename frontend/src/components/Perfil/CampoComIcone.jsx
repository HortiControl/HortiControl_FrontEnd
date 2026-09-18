export function CampoComIcone({
  icon: Icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  maxLength,
}) {
  return (
    <div className="relative">
      <label className="mb-2 block text-xs font-bold text-gray-700 sm:text-sm">
        {label}
      </label>
      <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-4 text-gray-400" size={18} />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full rounded-xl bg-gray-100 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#00a859]/20"
        />
      </div>
    </div>
  );
}
