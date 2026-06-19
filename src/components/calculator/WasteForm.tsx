import { Input } from '../ui/Input';

interface WasteProps {
  data: { kgPerWeek: number; recyclingRate: number; };
  onChange: (data: { kgPerWeek: number; recyclingRate: number; }) => void;
}

export function WasteForm({ data, onChange }: WasteProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Estimate your household waste.</p>
      <Input label="Total Waste (kg/week)" value={data.kgPerWeek} onChange={(v) => onChange({ ...data, kgPerWeek: v })} />
      <div>
        <label htmlFor="recycling-rate" className="block text-sm font-medium text-gray-700 mb-2">
          Recycling Rate (0% to 100%)
        </label>
        <input
          id="recycling-rate"
          type="range"
          min="0"
          max="100"
          value={data.recyclingRate * 100}
          onChange={(e) => onChange({ ...data, recyclingRate: parseInt(e.target.value) / 100 })}
          aria-valuenow={Math.round(data.recyclingRate * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${Math.round(data.recyclingRate * 100)} percent`}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2"
        />
        <p className="text-right text-sm text-primary font-bold mt-1" aria-hidden="true">{Math.round(data.recyclingRate * 100)}%</p>
      </div>
    </div>
  );
}
