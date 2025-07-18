// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.js'],
    globals: true,
    include: ['test/**/*.test.{js,jsx,ts,tsx}'],
    testTimeout: 10000,
  },
})

