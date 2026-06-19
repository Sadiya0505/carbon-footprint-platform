import { Input } from '../ui/Input';

interface TransportProps {
  data: { petrolKm: number; dieselKm: number; evKm: number; busKm: number; trainKm: number; flightKm: number; };
  onChange: (data: any) => void;
}

export function TransportForm({ data, onChange }: TransportProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Estimate your weekly travel distance in kilometers.</p>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Petrol Car (km/week)" value={data.petrolKm} onChange={(v) => onChange({ ...data, petrolKm: v })} />
        <Input label="Diesel Car (km/week)" value={data.dieselKm} onChange={(v) => onChange({ ...data, dieselKm: v })} />
        <Input label="EV (km/week)" value={data.evKm} onChange={(v) => onChange({ ...data, evKm: v })} />
        <Input label="Bus (km/week)" value={data.busKm} onChange={(v) => onChange({ ...data, busKm: v })} />
        <Input label="Train (km/week)" value={data.trainKm} onChange={(v) => onChange({ ...data, trainKm: v })} />
        <Input label="Flights (km/year)" value={data.flightKm} onChange={(v) => onChange({ ...data, flightKm: v })} />
      </div>
    </div>
  );
}
