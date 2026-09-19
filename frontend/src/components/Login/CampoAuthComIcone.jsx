import { Eye, EyeOff } from "lucide-react";

export function CampoAuthComIcone({
  icon: Icon,
  label,
  labelClassName = "mb-1 ml-1 text-xs font-semibold text-gray-700 sm:text-sm",
  type = "text",
  name,
  placeholder,
  maxLength,
  comToggleSenha = false,
  senhaVisivel = false,
  onToggleSenha,
}) {
  const tipoCampo = comToggleSenha ? (senhaVisivel ? "text" : "password") : type;

  return (
    <div className="flex flex-col">
      <label className={labelClassName}>{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          type={tipoCampo}
          name={name}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full rounded-xl border-none bg-[#e9ecef] px-4 py-3 pl-10 ${
            comToggleSenha ? "pr-10" : ""
          } outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#009951]`}
        />
        {comToggleSenha && (
          <button
            type="button"
            onClick={onToggleSenha}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none flex items-center justify-center"
          >
            {senhaVisivel ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
