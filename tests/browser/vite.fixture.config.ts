import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: { outDir: '.browser-fixtures', rolldownOptions: { input: resolve('tests/browser/fixture.html') } },
})
