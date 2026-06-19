import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import Layout from '../components/Layout'
import Home from '../pages/Home'

describe('App', () => {
  it('should render home page at root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText(/understand your/i)).toBeInTheDocument()
  })

  it('should render calculator route', () => {
    render(
      <MemoryRouter initialEntries={['/calculator']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /carbon calculator/i })).toBeInTheDocument()
  })
})

describe('Layout', () => {
  it('should provide skip to main content link', () => {
    render(
      <MemoryRouter>
        <Layout>
          <Home />
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main-content')
  })

  it('should wrap content in main landmark', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Page content</div>
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
