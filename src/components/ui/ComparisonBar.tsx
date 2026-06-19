export function ComparisonBar({ label, value, color, maxVal }: { label: string; value: number; color: string; maxVal: number }) {
  const percentage = Math.min((value / maxVal) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-1.5">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-900 font-bold">{(value / 1000).toFixed(2)}t</span>
      </div>
      <div
        className="w-full bg-gray-100 rounded-full h-2.5"
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${(value / 1000).toFixed(2)} tonnes CO2 equivalent`}
      >
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
