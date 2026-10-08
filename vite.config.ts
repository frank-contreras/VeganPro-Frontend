import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.VITE_BASE_PATH ?? '/'
if (!/^\/(?:[A-Za-z0-9._-]+\/)?$/.test(base) || base === '/./' || base === '/../') {
  throw new Error('VITE_BASE_PATH must be / or /repository-name/ with a trailing slash.')
}

export default defineConfig({
  plugins: [react()],
  base,
})
