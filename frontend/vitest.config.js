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
    mockReset: true,
  },
  resolve: {
    alias: {
      '\\.png$': path.resolve(__dirname, '__mocks__/fileMock.js'),
      '\\.jpg$': path.resolve(__dirname, '__mocks__/fileMock.js'),
      '\\.jpeg$': path.resolve(__dirname, '__mocks__/fileMock.js'),
      '\\.svg$': path.resolve(__dirname, '__mocks__/fileMock.js'),
    },
  },
})

