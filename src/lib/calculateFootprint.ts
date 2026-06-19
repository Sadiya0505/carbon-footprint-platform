import { EMISSION_FACTORS } from './emissionFactors';

export interface TransportInput {
  petrolKm: number;
  dieselKm: number;
  evKm: number;
  busKm: number;
  trainKm: number;
  flightKm: number;
}

export interface EnergyInput {
  electricityKwh: number;
  lpgCylinders: number;
  householdSize: number;
}

export interface WasteInput {
  kgPerWeek: number;
  recyclingRate: number;
}

export type DietType = 'meatHeavy' | 'moderate' | 'vegetarian' | 'vegan';
export type ShoppingLevel = 'low' | 'medium' | 'high';

export interface FootprintInput {
  transport: TransportInput;
  energy: EnergyInput;
  diet: DietType;
  waste: WasteInput;
  shopping: ShoppingLevel;
}

export interface FootprintBreakdown {
  transport: number;
  energy: number;
  diet: number;
  waste: number;
  shopping: number;
}

export function calculateFootprint(input: FootprintInput): FootprintBreakdown {
  const sanitize = (val: number) => {
    if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) return 0;
    return Math.max(0, val);
  };

  const petrol = sanitize(input.transport.petrolKm);
  const diesel = sanitize(input.transport.dieselKm);
  const ev = sanitize(input.transport.evKm);
  const bus = sanitize(input.transport.busKm);
  const train = sanitize(input.transport.trainKm);
  const flight = sanitize(input.transport.flightKm);

  const transportTotal =
    (petrol * EMISSION_FACTORS.transport.petrolCar +
      diesel * EMISSION_FACTORS.transport.dieselCar +
      ev * EMISSION_FACTORS.transport.ev +
      bus * EMISSION_FACTORS.transport.bus +
      train * EMISSION_FACTORS.transport.train +
      flight * EMISSION_FACTORS.transport.flight) *
    52;

  const electricity = sanitize(input.energy.electricityKwh);
  const lpg = sanitize(input.energy.lpgCylinders);
  const size = Math.max(1, input.energy.householdSize || 1);

  const energyTotal =
    (electricity * EMISSION_FACTORS.electricity * 12 +
      lpg * EMISSION_FACTORS.lpg * 12) /
    size;

  const dietTotal = EMISSION_FACTORS.diet[input.diet] * 365;

  const kgPerWeek = sanitize(input.waste.kgPerWeek);
  const recyclingRate = Math.max(0, Math.min(1, input.waste.recyclingRate || 0));

  const weeklyWasteEmissions =
    kgPerWeek * (1 - recyclingRate) * EMISSION_FACTORS.waste.general +
    kgPerWeek * recyclingRate * EMISSION_FACTORS.waste.recycled;
  const wasteTotal = weeklyWasteEmissions * 52;

  const shoppingTotal = EMISSION_FACTORS.shopping[input.shopping] * 12;

  return {
    transport: transportTotal,
    energy: energyTotal,
    diet: dietTotal,
    waste: wasteTotal,
    shopping: shoppingTotal,
  };
}
