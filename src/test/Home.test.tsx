import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../pages/Home'

const renderHome = () => {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
}

describe('Home Page', () => {
  it('should render the main heading', () => {
    renderHome()
    expect(screen.getByText(/understand your/i)).toBeInTheDocument()
  })

  it('should render CTA button to calculator', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /calculate my footprint/i })).toBeInTheDocument()
  })

  it('should render Live CO2 counter section', () => {
    renderHome()
    expect(screen.getByText(/live co₂ tracked/i)).toBeInTheDocument()
  })

  it('should render Why CarbonSaathi section', () => {
    renderHome()
    expect(screen.getByText(/why carbonsaathi/i)).toBeInTheDocument()
  })

  it('should render India-Specific Factors feature', () => {
    renderHome()
    expect(screen.getByText(/india-specific factors/i)).toBeInTheDocument()
  })

  it('should render AI-Powered Insights feature', () => {
    renderHome()
    expect(screen.getByText(/gemini ai insights/i)).toBeInTheDocument()
  })

  it('should render How It Works section', () => {
    renderHome()
    expect(screen.getByText(/how it works/i)).toBeInTheDocument()
  })

  it('should render 3 steps', () => {
    renderHome()
    expect(screen.getByText(/step 01/i)).toBeInTheDocument()
    expect(screen.getByText(/step 02/i)).toBeInTheDocument()
    expect(screen.getByText(/step 03/i)).toBeInTheDocument()
  })

  it('should render footer CTA section', () => {
    renderHome()
    expect(screen.getByText(/ready to know your carbon footprint/i)).toBeInTheDocument()
  })

  it('should have navigation link to dashboard', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /view dashboard/i })).toBeInTheDocument()
  })

  it('should show Powered by Google Gemini badge', () => {
    renderHome()
    expect(screen.getByText(/powered by google gemini/i)).toBeInTheDocument()
  })

  it('should render Start Calculating Now CTA', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /start calculating now/i })).toBeInTheDocument()
  })
})
