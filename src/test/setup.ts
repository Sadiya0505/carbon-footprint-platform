import '@testing-library/jest-dom'
import 'vitest-axe/extend-expect'
import { afterEach, vi, expect } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from 'vitest-axe/matchers'

expect.extend(matchers)

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  readonly scrollMargin = ''

  private callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe = (target: Element) => {
    this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  }

  unobserve = () => {}
  disconnect = () => {}
  takeRecords = () => []
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})

vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    section: 'section',
    h1: 'h1',
    span: 'span',
  },
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => 0,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: 'Your footprint is 2613 kg CO2e — above the India average.\n\n**Tip 1: Take the bus**\nSave ~200 kg/year\n\n**Tip 2: Switch to LED**\nSave ~40 kg/year\n\n**Tip 3: Reduce meat**\nSave ~150 kg/year',
      }),
    },
  })),
}))

vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,test'),
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})
