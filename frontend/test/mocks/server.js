import { setupServer } from 'msw/node'
import { mockAPI } from './mockAPI'

export const server = setupServer(...mockAPI)
