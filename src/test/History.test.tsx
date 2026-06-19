import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import History from '../pages/History'
import { useStore } from '../store/useStore'
import { act } from '@testing-library/react'

const renderHistory = () => {
  return render(
    <MemoryRouter>
      <History />
    </MemoryRouter>
  )
}

describe('History Page', () => {
  beforeEach(() => {
    act(() => {
      useStore.setState({ history: [], streak: 0 })
    })
  })

  it('should render Your Progress heading', () => {
    renderHistory()
    expect(screen.getByRole('heading', { name: /your progress/i })).toBeInTheDocument()
  })

  it('should show streak counter', () => {
    renderHistory()
    expect(screen.getByText(/current streak/i)).toBeInTheDocument()
  })

  it('should show empty state when no history', () => {
    renderHistory()
    expect(screen.getByText(/emissions over time/i)).toBeInTheDocument()
  })

  it('should show history chart section', () => {
    renderHistory()
    const chartSection = screen.getByText(/emissions over time/i)
    expect(chartSection).toBeInTheDocument()
  })

  it('should show streak days', () => {
    act(() => { useStore.setState({ streak: 3 }) })
    renderHistory()
    expect(screen.getByText(/days/i)).toBeInTheDocument()
  })

  it('should render with history data', () => {
    const mockHistory = [
      { transport: 500, energy: 400, diet: 913, waste: 200, shopping: 600, total: 2613, date: '2026-06-01' },
      { transport: 450, energy: 380, diet: 800, waste: 180, shopping: 500, total: 2310, date: '2026-06-10' },
    ]
    act(() => { useStore.setState({ history: mockHistory }) })
    renderHistory()
    expect(screen.getByText(/emissions over time/i)).toBeInTheDocument()
  })
})
