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
  const transportTotal =
    (input.transport.petrolKm * EMISSION_FACTORS.transport.petrolCar +
      input.transport.dieselKm * EMISSION_FACTORS.transport.dieselCar +
      input.transport.evKm * EMISSION_FACTORS.transport.ev +
      input.transport.busKm * EMISSION_FACTORS.transport.bus +
      input.transport.trainKm * EMISSION_FACTORS.transport.train +
      input.transport.flightKm * EMISSION_FACTORS.transport.flight) *
    52;

  const energyTotal =
    (input.energy.electricityKwh * EMISSION_FACTORS.electricity * 12 +
      input.energy.lpgCylinders * EMISSION_FACTORS.lpg * 12) /
    Math.max(1, input.energy.householdSize);

  const dietTotal = EMISSION_FACTORS.diet[input.diet] * 365;

  const weeklyWasteEmissions =
    input.waste.kgPerWeek * (1 - input.waste.recyclingRate) * EMISSION_FACTORS.waste.general +
    input.waste.kgPerWeek * input.waste.recyclingRate * EMISSION_FACTORS.waste.recycled;
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
