import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Roadmap from '../pages/Roadmap'
import { useStore } from '../store/useStore'
import { act } from '@testing-library/react'

vi.mock('../hooks/useGeminiRoadmap', () => {
  const DEFAULT_PLAN = {
    summary: "Follow this 90-day journey to build sustainable habits and reduce your carbon footprint step by step.",
    phase30: [
      { text: "Switch off standby appliances and unplug chargers daily", saving: "Save ~50 kg CO₂/year", done: false },
      { text: "Replace all incandescent bulbs with LED alternatives", saving: "Save ~40 kg CO₂/year", done: false },
      { text: "Buy local and seasonal produce for at least 30% of groceries", saving: "Save ~30 kg CO₂/year", done: false },
    ],
    phase60: [
      { text: "Carpool or use public transport at least twice a week", saving: "Save ~200 kg CO₂/year", done: false },
      { text: "Start a home composting bin for kitchen waste", saving: "Save ~60 kg CO₂/year", done: false },
      { text: "Reduce meat consumption by having 2 meat-free days per week", saving: "Save ~150 kg CO₂/year", done: false },
    ],
    phase90: [
      { text: "Switch to a green energy provider or install a solar water heater", saving: "Save ~300 kg CO₂/year", done: false },
      { text: "Reduce new clothing purchases by 50% — opt for second-hand", saving: "Save ~100 kg CO₂/year", done: false },
      { text: "Plant 5 trees or donate to a local reforestation project", saving: "Offset ~100 kg CO₂/year", done: false },
    ],
  };

  return {
    DEFAULT_PLAN,
    useGeminiRoadmap: () => ({
      plan: DEFAULT_PLAN,
      loading: false,
      generate: vi.fn(),
      isAIGenerated: false,
    })
  };
})


const mockData = {
  transport: 500,
  energy: 1290,
  diet: 548,
  waste: 328,
  shopping: 1200,
  total: 3866,
  date: new Date().toISOString(),
}

const renderRoadmap = () => {
  return render(
    <MemoryRouter>
      <Roadmap />
    </MemoryRouter>
  )
}

describe('Roadmap Page', () => {
  beforeEach(() => {
    act(() => { useStore.setState({ currentData: null }) })
  })

  it('should show prompt to calculate when no data', () => {
    renderRoadmap()
    expect(screen.getByText(/calculate first/i)).toBeInTheDocument()
  })

  it('should show link to calculator when no data', () => {
    renderRoadmap()
    expect(screen.getByRole('link', { name: /go to calculator/i })).toBeInTheDocument()
  })

  it('should show 90-Day Roadmap heading when data exists', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderRoadmap()
    expect(screen.getByText(/90-day carbon roadmap/i)).toBeInTheDocument()
  })

  it('should show progress bar', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderRoadmap()
    expect(screen.getByText(/overall progress/i)).toBeInTheDocument()
  })

  it('should show 0/9 actions initially', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderRoadmap()
    expect(screen.getByText(/0\/9 actions/i)).toBeInTheDocument()
  })

  it('should show First 30 Days phase', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderRoadmap()
    expect(screen.getByText(/first 30 days/i)).toBeInTheDocument()
  })

  it('should show Days 31-60 phase', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderRoadmap()
    expect(screen.getByText(/days 31/i)).toBeInTheDocument()
  })

  it('should show Days 61-90 phase', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderRoadmap()
    expect(screen.getByText(/days 61/i)).toBeInTheDocument()
  })

  it('should show Regenerate button', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderRoadmap()
    expect(screen.getByRole('button', { name: /regenerate with gemini/i })).toBeInTheDocument()
  })

  it('should show Powered by Google Gemini footer', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderRoadmap()
    expect(screen.getByText(/powered by google gemini/i)).toBeInTheDocument()
  })

  it('should toggle item completion when clicked', async () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderRoadmap()

    await waitFor(() => {
      expect(screen.getByText(/overall progress/i)).toBeInTheDocument()
    })

    const actionButtons = screen.getAllByRole('button').filter(
      (btn) => btn.getAttribute('aria-pressed') === 'false'
    )
    expect(actionButtons.length).toBeGreaterThan(0)
    fireEvent.click(actionButtons[0])
    expect(actionButtons[0]).toHaveAttribute('aria-pressed', 'true')
  })
})
