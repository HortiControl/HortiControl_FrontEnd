export function Input({ label, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={`min-h-11 px-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#00a859]/30 transition-all ${className}`.trim()}
        {...props}
      />
    </div>
  );
}