import { describe, it, expect } from 'vitest'
import { calculateCarbonScore, AVERAGES, EMISSION_FACTORS } from '../lib/emissionFactors'

describe('Emission Factors', () => {
  describe('AVERAGES', () => {
    it('should have correct India average', () => {
      expect(AVERAGES.india).toBe(1900)
    })

    it('should have correct Global average', () => {
      expect(AVERAGES.global).toBe(4700)
    })

    it('should have correct Paris target', () => {
      expect(AVERAGES.paris).toBe(2000)
    })
  })

  describe('EMISSION_FACTORS', () => {
    it('should have petrol car emission factor', () => {
      expect(EMISSION_FACTORS.transport.petrolCar).toBeGreaterThan(0)
    })

    it('should have electricity emission factor for India grid', () => {
      expect(EMISSION_FACTORS.electricity).toBe(0.82)
    })

    it('should have LPG cylinder emission factor', () => {
      expect(EMISSION_FACTORS.lpg).toBeGreaterThan(0)
    })

    it('should have diet factors for all diet types', () => {
      expect(EMISSION_FACTORS.diet.vegetarian).toBe(1.0)
      expect(EMISSION_FACTORS.diet.vegan).toBeLessThan(EMISSION_FACTORS.diet.meatHeavy)
    })

    it('should have shopping levels ordered by impact', () => {
      expect(EMISSION_FACTORS.shopping.low).toBeLessThan(EMISSION_FACTORS.shopping.high)
    })
  })

  describe('calculateCarbonScore', () => {
    it('should return A for excellent footprint (≤1500kg)', () => {
      expect(calculateCarbonScore(800)).toBe('A')
      expect(calculateCarbonScore(1500)).toBe('A')
    })

    it('should return B for good footprint (1501–2000kg)', () => {
      expect(calculateCarbonScore(1501)).toBe('B')
      expect(calculateCarbonScore(2000)).toBe('B')
    })

    it('should return C for average footprint (2001–3000kg)', () => {
      expect(calculateCarbonScore(2500)).toBe('C')
      expect(calculateCarbonScore(3000)).toBe('C')
    })

    it('should return D for high footprint (3001–4700kg)', () => {
      expect(calculateCarbonScore(4000)).toBe('D')
      expect(calculateCarbonScore(4700)).toBe('D')
    })

    it('should return F for very high footprint (>4700kg)', () => {
      expect(calculateCarbonScore(5000)).toBe('F')
      expect(calculateCarbonScore(8000)).toBe('F')
    })

    it('should handle zero footprint', () => {
      expect(calculateCarbonScore(0)).toBe('A')
    })
  })
})
