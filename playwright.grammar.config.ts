import { defineConfig, devices } from '@playwright/test';

const port = process.env.PLAYWRIGHT_PORT ?? '3000';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['grammar-study.spec.ts', 'grammar-all-lessons.spec.ts', 'grammar-locatives.spec.ts', 'lesson4-book-reference.spec.ts'],
  timeout: 45_000,
  workers: 2,
  use: { baseURL, trace: 'retain-on-failure', serviceWorkers: 'block' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit-iphone', use: { ...devices['iPhone 13'] } },
  ],
  webServer: process.env.PLAYWRIGHT_EXTERNAL_SERVER === '1' ? undefined : {
    command: `${JSON.stringify(process.execPath)} scripts/e2e-server.mjs`,
    url: baseURL,
    env: { PORT: port },
    timeout: 120_000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 },
  },
});
