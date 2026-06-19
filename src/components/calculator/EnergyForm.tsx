import { Input } from '../ui/Input';

interface EnergyProps {
  data: { electricityKwh: number; lpgCylinders: number; householdSize: number; };
  onChange: (data: { electricityKwh: number; lpgCylinders: number; householdSize: number; }) => void;
}

export function EnergyForm({ data, onChange }: EnergyProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Enter your monthly household energy usage.</p>
      <Input label="Electricity (kWh/month)" value={data.electricityKwh} onChange={(v) => onChange({ ...data, electricityKwh: v })} />
      <Input label="LPG Cylinders (per month)" value={data.lpgCylinders} onChange={(v) => onChange({ ...data, lpgCylinders: v })} />
      <Input label="Household Size (people)" value={data.householdSize} onChange={(v) => onChange({ ...data, householdSize: v })} />
    </div>
  );
}
