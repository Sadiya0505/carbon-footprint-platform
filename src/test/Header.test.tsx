import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../components/Header'

const renderHeader = (path = '/') => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Header />
    </MemoryRouter>
  )
}

describe('Header', () => {
  it('should render site logo and name', () => {
    renderHeader()
    expect(screen.getByLabelText(/carbonsaathi — go to home page/i)).toBeInTheDocument()
  })

  it('should render main navigation links', () => {
    renderHeader()
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Calculator' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'History' })).toBeInTheDocument()
  })

  it('should mark current page with aria-current', () => {
    renderHeader('/calculator')
    expect(screen.getByRole('link', { name: 'Calculator' })).toHaveAttribute('aria-current', 'page')
  })

  it('should open mobile navigation menu', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))
    expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument()
  })

  it('should close mobile menu when a link is clicked', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))
    const mobileNav = screen.getByRole('navigation', { name: /mobile navigation/i })
    fireEvent.click(mobileNav.querySelector('a[href="/roadmap"]')!)
    expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).not.toBeInTheDocument()
  })
})
