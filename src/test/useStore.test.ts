import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from '../store/useStore'
import { act } from '@testing-library/react'

describe('useStore', () => {
  beforeEach(() => {
    act(() => {
      useStore.setState({
        currentData: null,
        history: [],
        streak: 0,
        lastCalculatedDate: null,
      })
    })
  })

  it('should initialize with null currentData', () => {
    expect(useStore.getState().currentData).toBeNull()
  })

  it('should initialize with empty history', () => {
    expect(useStore.getState().history).toEqual([])
  })

  it('should initialize streak at 0', () => {
    expect(useStore.getState().streak).toBe(0)
  })

  it('should set footprint data and calculate total', () => {
    act(() => {
      useStore.getState().setFootprintData({
        transport: 500,
        energy: 400,
        diet: 913,
        waste: 200,
        shopping: 600,
      })
    })

    const { currentData } = useStore.getState()
    expect(currentData?.total).toBe(2613)
    expect(currentData?.transport).toBe(500)
    expect(currentData?.date).toBeDefined()
  })

  it('should add entry to history when footprint is saved', () => {
    act(() => {
      useStore.getState().setFootprintData({
        transport: 100,
        energy: 100,
        diet: 100,
        waste: 100,
        shopping: 100,
      })
    })

    expect(useStore.getState().history).toHaveLength(1)
    expect(useStore.getState().history[0].total).toBe(500)
  })

  it('should start streak at 1 on first calculation', () => {
    act(() => {
      useStore.getState().setFootprintData({
        transport: 0,
        energy: 0,
        diet: 365,
        waste: 0,
        shopping: 0,
      })
    })

    expect(useStore.getState().streak).toBe(1)
  })

  it('should append multiple history entries', () => {
    const payload = { transport: 50, energy: 50, diet: 50, waste: 50, shopping: 50 }

    act(() => {
      useStore.getState().setFootprintData(payload)
      useStore.getState().setFootprintData(payload)
    })

    expect(useStore.getState().history).toHaveLength(2)
  })
})
