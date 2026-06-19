import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Calculator from '../pages/Calculator'

const renderCalculator = () => {
  return render(
    <MemoryRouter>
      <Calculator />
    </MemoryRouter>
  )
}

const clickNext = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    await vi.advanceTimersByTimeAsync(3000)
  })
}

describe('Calculator Page', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render the calculator heading', () => {
    renderCalculator()
    expect(screen.getByRole('heading', { name: /carbon calculator/i })).toBeInTheDocument()
  })

  it('should show Step 1 of 5 initially', () => {
    renderCalculator()
    expect(screen.getByText(/step 1 of 5/i)).toBeInTheDocument()
  })

  it('should show Transport section on step 1', () => {
    renderCalculator()
    expect(screen.getByRole('heading', { name: /transport/i })).toBeInTheDocument()
  })

  it('should show Petrol Car input on step 1', () => {
    renderCalculator()
    expect(screen.getByLabelText(/petrol car/i)).toBeInTheDocument()
  })

  it('should show Next button', () => {
    renderCalculator()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('should disable Back button on step 1', () => {
    renderCalculator()
    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled()
  })

  it('should show progress bar with accessible label', () => {
    renderCalculator()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '20')
  })

  it('should progress to step 2 after fun fact', async () => {
    renderCalculator()
    await clickNext()
    expect(screen.getByText(/step 2 of 5/i)).toBeInTheDocument()
  })

  it('should show Home Energy on step 2', async () => {
    renderCalculator()
    await clickNext()
    expect(screen.getByRole('heading', { name: /home energy/i })).toBeInTheDocument()
  })

  it('should show Diet section on step 3', async () => {
    renderCalculator()
    await clickNext()
    await clickNext()
    expect(screen.getByRole('heading', { name: /diet/i })).toBeInTheDocument()
  })

  it('should show diet options as radio buttons', async () => {
    renderCalculator()
    await clickNext()
    await clickNext()
    expect(screen.getByRole('radio', { name: /vegetarian/i })).toBeInTheDocument()
  })

  it('should show Waste section on step 4', async () => {
    renderCalculator()
    await clickNext()
    await clickNext()
    await clickNext()
    expect(screen.getByRole('heading', { name: /waste/i })).toBeInTheDocument()
  })

  it('should show Shopping section on step 5', async () => {
    renderCalculator()
    await clickNext()
    await clickNext()
    await clickNext()
    await clickNext()
    expect(screen.getByRole('heading', { name: /shopping/i })).toBeInTheDocument()
  })

  it('should show Calculate button on step 5', async () => {
    renderCalculator()
    await clickNext()
    await clickNext()
    await clickNext()
    await clickNext()
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument()
  })

  it('should allow selecting a diet option', async () => {
    renderCalculator()
    await clickNext()
    await clickNext()
    fireEvent.click(screen.getByRole('radio', { name: /vegan/i }))
    expect(screen.getByRole('radio', { name: /vegan/i })).toHaveAttribute('aria-checked', 'true')
  })
})
