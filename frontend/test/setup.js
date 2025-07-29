import { beforeAll, afterAll, afterEach, vi } from 'vitest'
import { setupServer } from 'msw/node'
import { mockAPI } from './mocks/mockAPI'

if (!import.meta.env.VITE_BACKEND_URL) {
    import.meta.env.VITE_BACKEND_URL = 'http://test.api'
}

export const server = setupServer(...mockAPI)

server.events.on('request:start', (req) => {
    console.log('[MSW] Request:', req.method, req.url)
})

server.events.on('request:unhandled', (req) => {
    console.warn('[MSW] Unhandled request to:', req.url)
})

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

vi.mock('@/assets/images/dark/github-dark-50w.webp', () => ({ default: '' }))
vi.mock('@/assets/images/dark/github-dark-100w.webp', () => ({ default: '' }))
vi.mock('@/assets/images/dark/github-dark-140w.webp', () => ({ default: '' }))
vi.mock('@/assets/images/light/github-light-50w.webp', () => ({ default: '' }))
vi.mock('@/assets/images/light/github-light-100w.webp', () => ({ default: '' }))
vi.mock('@/assets/images/light/github-light-140w.webp', () => ({ default: '' }))
vi.mock('@/assets/images/dark/copy-dark-20w.webp', () => ({ default: '' }))
vi.mock('@/assets/images/dark/copy-dark-40w.webp', () => ({ default: '' }))
vi.mock('@/assets/images/light/copy-light-20w.webp', () => ({ default: '' }))
vi.mock('@/assets/images/light/copy-light-40w.webp', () => ({ default: '' }))
