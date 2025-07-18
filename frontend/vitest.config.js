/* eslint-disable no-undef */
// vitest.config.js
import { defineConfig } from 'vitest/config'
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.js'],
    globals: true,
    include: ['test/**/*.test.{js,jsx,ts,tsx}'],
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

