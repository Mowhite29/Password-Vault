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
      '@': path.resolve(__dirname, './src'),
      'github.png': path.resolve(__dirname, '__mocks__/fileMock.js'),
      'copy.png': path.resolve(__dirname, '__mocks__/fileMock.js'),
    },
  },
  plugins: [
    {
      name: 'vite:ignore-assets-for-test',
      enforce: 'pre',
      resolveId(source) {
        if (source.match(/\.(png|jpe?g|svg|gif)$/)) {
          return source;
        }
        return null;
      },
      load(id) {
        if (id.match(/\.(png|jpe?g|svg|gif)$/)) {
          return 'export default ""';
        }
        return null;
      },
    },
  ],
})

