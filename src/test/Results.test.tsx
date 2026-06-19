import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Results from '../pages/Results'
import { useStore } from '../store/useStore'
import { act } from '@testing-library/react'

const mockData = {
  transport: 500,
  energy: 400,
  diet: 913,
  waste: 200,
  shopping: 600,
  total: 2613,
  date: new Date().toISOString(),
}

const renderResults = () => {
  return render(
    <MemoryRouter>
      <Results />
    </MemoryRouter>
  )
}

describe('Results/Dashboard Page', () => {
  beforeEach(() => {
    act(() => {
      useStore.setState({ currentData: null })
    })
  })

  it('should show empty state when no data', () => {
    renderResults()
    expect(screen.getByText(/no data found/i)).toBeInTheDocument()
  })

  it('should show link to calculator when no data', () => {
    renderResults()
    expect(screen.getByRole('link', { name: /go to calculator/i })).toBeInTheDocument()
  })

  it('should show Carbon Grade when data exists', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderResults()
    expect(screen.getByText(/carbon grade/i)).toBeInTheDocument()
  })

  it('should show total tonnes CO2e', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderResults()
    expect(screen.getByText(/tonnes co/i)).toBeInTheDocument()
  })

  it('should show Emissions Breakdown heading', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderResults()
    expect(screen.getByText(/emissions breakdown/i)).toBeInTheDocument()
  })

  it('should show How You Compare section', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderResults()
    expect(screen.getByText(/how you compare/i)).toBeInTheDocument()
  })

  it('should show India Average in comparison', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderResults()
    expect(screen.getByText(/india average/i)).toBeInTheDocument()
  })

  it('should show Paris Target in comparison', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderResults()
    expect(screen.getByText(/paris target/i)).toBeInTheDocument()
  })

  it('should show AI-Powered Insights section', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderResults()
    expect(screen.getByText(/ai-powered insights/i)).toBeInTheDocument()
  })

  it('should show Download Result Card button', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderResults()
    expect(screen.getByRole('button', { name: /download result card/i })).toBeInTheDocument()
  })

  it('should show correct carbon grade for 2613kg footprint', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderResults()
    // 2613kg should be grade C or D
    const gradeElement = screen.getByText(/carbon grade/i)
    expect(gradeElement).toBeInTheDocument()
  })

  it('should show Personalized by Google Gemini label', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderResults()
    expect(screen.getByText(/personalized by google gemini/i)).toBeInTheDocument()
  })

  it('should show regenerate button', () => {
    act(() => { useStore.setState({ currentData: mockData }) })
    renderResults()
    expect(screen.getByText(/regenerate insights/i)).toBeInTheDocument()
  })
})
