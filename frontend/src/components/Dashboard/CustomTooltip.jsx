export function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
        <p className="text-xs font-bold text-gray-400 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-sm font-bold"
            style={{ color: entry.color || entry.fill }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}
