import 'vitest-axe/extend-expect'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'vitest-axe'
import Home from '../pages/Home'
import Calculator from '../pages/Calculator'
import History from '../pages/History'
import Layout from '../components/Layout'

describe('Accessibility', () => {
  it('Home page should have no critical accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Calculator page should have no critical accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <Calculator />
      </MemoryRouter>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('History page should have no critical accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Layout should have no critical accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <Layout>
          <div><h1>Test page</h1></div>
        </Layout>
      </MemoryRouter>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
