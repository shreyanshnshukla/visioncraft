import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the build works on GitHub Pages (/visioncraft/) and any static host
  base: './',
  // ES-module worker so it can import Transformers.js from the CDN at runtime
  worker: { format: 'es' },
})
