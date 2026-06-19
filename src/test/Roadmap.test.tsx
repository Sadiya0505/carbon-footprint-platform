import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Roadmap from '../pages/Roadmap'
import { useStore } from '../store/useStore'
import { act } from '@testing-library/react'

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
