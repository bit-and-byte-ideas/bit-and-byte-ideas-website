import { defineConfig, devices } from '@playwright/test';

// E2E against the production build served with the real Static Web Apps
// headers (CSP included) by scripts/serve-built.mjs. Requires `pnpm build`
// first; `pnpm test:e2e` (playwright.config.ts) covers the dev server.
export default defineConfig({
  testDir: './e2e/built',
  timeout: 30_000,
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm serve:built',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env['CI'],
    timeout: 30_000,
  },
});
