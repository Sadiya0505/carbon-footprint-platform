import { describe, it, expect } from 'vitest'
import { calculateFootprint } from '../lib/calculateFootprint'
import { EMISSION_FACTORS } from '../lib/emissionFactors'

describe('calculateFootprint', () => {
  it('should calculate transport emissions weekly to yearly', () => {
    const result = calculateFootprint({
      transport: { petrolKm: 100, dieselKm: 0, evKm: 0, busKm: 0, trainKm: 0, flightKm: 0 },
      energy: { electricityKwh: 0, lpgCylinders: 0, householdSize: 1 },
      diet: 'vegan',
      waste: { kgPerWeek: 0, recyclingRate: 0 },
      shopping: 'low',
    })

    const expectedTransport = 100 * EMISSION_FACTORS.transport.petrolCar * 52
    expect(result.transport).toBeCloseTo(expectedTransport)
  })

  it('should divide energy by household size', () => {
    const result = calculateFootprint({
      transport: { petrolKm: 0, dieselKm: 0, evKm: 0, busKm: 0, trainKm: 0, flightKm: 0 },
      energy: { electricityKwh: 200, lpgCylinders: 1, householdSize: 4 },
      diet: 'vegan',
      waste: { kgPerWeek: 0, recyclingRate: 0 },
      shopping: 'low',
    })

    const rawEnergy = 200 * EMISSION_FACTORS.electricity * 12 + 1 * EMISSION_FACTORS.lpg * 12
    expect(result.energy).toBeCloseTo(rawEnergy / 4)
  })

  it('should calculate diet emissions for a full year', () => {
    const result = calculateFootprint({
      transport: { petrolKm: 0, dieselKm: 0, evKm: 0, busKm: 0, trainKm: 0, flightKm: 0 },
      energy: { electricityKwh: 0, lpgCylinders: 0, householdSize: 1 },
      diet: 'vegetarian',
      waste: { kgPerWeek: 0, recyclingRate: 0 },
      shopping: 'low',
    })

    expect(result.diet).toBe(EMISSION_FACTORS.diet.vegetarian * 365)
  })

  it('should factor recycling rate into waste emissions', () => {
    const recycled = calculateFootprint({
      transport: { petrolKm: 0, dieselKm: 0, evKm: 0, busKm: 0, trainKm: 0, flightKm: 0 },
      energy: { electricityKwh: 0, lpgCylinders: 0, householdSize: 1 },
      diet: 'vegan',
      waste: { kgPerWeek: 10, recyclingRate: 1 },
      shopping: 'low',
    })

    const notRecycled = calculateFootprint({
      transport: { petrolKm: 0, dieselKm: 0, evKm: 0, busKm: 0, trainKm: 0, flightKm: 0 },
      energy: { electricityKwh: 0, lpgCylinders: 0, householdSize: 1 },
      diet: 'vegan',
      waste: { kgPerWeek: 10, recyclingRate: 0 },
      shopping: 'low',
    })

    expect(recycled.waste).toBeLessThan(notRecycled.waste)
  })

  it('should calculate shopping emissions monthly to yearly', () => {
    const result = calculateFootprint({
      transport: { petrolKm: 0, dieselKm: 0, evKm: 0, busKm: 0, trainKm: 0, flightKm: 0 },
      energy: { electricityKwh: 0, lpgCylinders: 0, householdSize: 1 },
      diet: 'vegan',
      waste: { kgPerWeek: 0, recyclingRate: 0 },
      shopping: 'high',
    })

    expect(result.shopping).toBe(EMISSION_FACTORS.shopping.high * 12)
  })

  it('handles extreme outlier inputs securely without overflowing', () => {
    const result = calculateFootprint({
      transport: { petrolKm: 999999999, dieselKm: 0, evKm: 0, busKm: 0, trainKm: 0, flightKm: 0 },
      energy: { electricityKwh: 0, lpgCylinders: 0, householdSize: 1 },
      diet: 'moderate',
      waste: { kgPerWeek: 0, recyclingRate: 0 },
      shopping: 'low'
    });
    expect(result.transport).toBeGreaterThan(100000);
  });

  it('prevents negative emission values from negative inputs', () => {
    const result = calculateFootprint({
      transport: { petrolKm: -500, dieselKm: -100, evKm: -50, busKm: 0, trainKm: 0, flightKm: 0 },
      energy: { electricityKwh: -200, lpgCylinders: -5, householdSize: -2 },
      diet: 'vegan',
      waste: { kgPerWeek: -10, recyclingRate: -0.5 },
      shopping: 'low'
    });
    expect(result.transport).toBe(0);
    expect(result.energy).toBe(0);
    expect(result.waste).toBe(0);
  });
})
