import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/oral-final-e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45000,
  use: { baseURL: 'http://127.0.0.1:3217', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'iphone-webkit', use: { ...devices['iPhone 13'] } },
  ],
  webServer: { command: 'pnpm start --port 3217', url: 'http://127.0.0.1:3217', reuseExistingServer: false, timeout: 120000 },
});
