/* eslint-disable no-undef */
// vitest.config.js
import { defineConfig } from 'vitest/config'
import path from 'path';

const isTest = process.env.VITEST === 'true'

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
  plugins: isTest
    ? [
        {
          name: 'mock-static-assets',
          enforce: 'pre',
          resolveId(source) {
            if (/\.(png|jpe?g|svg|gif|webp|webm)$/.test(source)) {
              return source
            }
            return null
          },
          load(id) {
            if (/\.(png|jpe?g|svg|gif|webp|webm)$/.test(id)) {
              return 'export default ""'
            }
            return null
          },
        },
      ]
    : [],
})

