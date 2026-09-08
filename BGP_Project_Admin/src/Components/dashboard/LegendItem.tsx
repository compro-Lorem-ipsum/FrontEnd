export const LegendItem = ({ color, label, value }: { color: string; label: string; value: number }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-3.5 h-3.5 rounded-sm" style={{ background: color }} />
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-900">{value}</span>
  </div>
);
