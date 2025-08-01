import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from "vite-plugin-top-level-await"
import csp from "vite-plugin-csp-guard"

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(), 
        wasm(),
        topLevelAwait(),
        csp({
          dev: {
            run: false,
            outlierSupport: ["scss"], 
          },   
          policy: {
            "script-src": ["'self'", "https://www.google-analytics.com"],
          },
          build:{
            sri: true
          }
        }),
    ],
    build: {
        outDir: '/home/runner/work/_temp/_github_home/build',
        emptyOutDir: true,
    }
})
