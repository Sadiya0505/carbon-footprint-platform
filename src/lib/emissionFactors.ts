export const EMISSION_FACTORS = {
  // Electricity: kg CO2e per kWh
  electricity: 0.82,
  
  // LPG: kg CO2e per cylinder (14.2 kg)
  lpg: 42.5,
  
  // Transport: kg CO2e per km
  transport: {
    petrolCar: 0.15,
    dieselCar: 0.17,
    ev: 0.05, // Accounts for grid emissions in India
    bus: 0.04, // per passenger km
    train: 0.01, // per passenger km
    flight: 0.25, // per passenger km
  },
  
  // Diet: kg CO2e per day
  diet: {
    meatHeavy: 2.5,
    moderate: 1.5,
    vegetarian: 1.0,
    vegan: 0.7,
  },
  
  // Waste: kg CO2e per kg of waste
  waste: {
    general: 0.5,
    recycled: 0.1,
  },

  // Shopping: kg CO2e per month rough estimate based on spend
  shopping: {
    low: 20,
    medium: 50,
    high: 100,
  }
};

export const AVERAGES = {
  india: 1900, // 1.9 tonnes
  global: 4700, // 4.7 tonnes
  paris: 2000, // 2.0 tonnes
};

export function calculateCarbonScore(totalEmissions: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  // totalEmissions is in kg
  if (totalEmissions <= 1500) return 'A'; // Excellent (below India avg and Paris target)
  if (totalEmissions <= 2000) return 'B'; // Good (around Paris target/India avg)
  if (totalEmissions <= 3000) return 'C'; // Average (above India, below Global)
  if (totalEmissions <= 4700) return 'D'; // Poor (around Global avg)
  return 'F'; // Very Poor (above Global avg)
}
