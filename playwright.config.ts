import { defineConfig, devices } from '@playwright/test'

const base = process.env.VITE_BASE_PATH ?? '/'
process.env.PLAYWRIGHT_BROWSERS_PATH ??= '.playwright'
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { baseURL: `http://127.0.0.1:4173${base}`, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [{
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: `http://127.0.0.1:4173${base}`,
    reuseExistingServer: false,
  }, {
    command: 'npx vite build --config tests/browser/vite.fixture.config.ts && npx vite preview --config tests/browser/vite.fixture.config.ts --host 127.0.0.1 --port 4174 --strictPort',
    url: 'http://127.0.0.1:4174/tests/browser/fixture.html',
    reuseExistingServer: false,
  }],
})
