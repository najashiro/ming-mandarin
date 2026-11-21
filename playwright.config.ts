import { defineConfig, devices } from '@playwright/test';

const nodeExecutable = JSON.stringify(process.execPath);
const baseURL = `http://127.0.0.1:${process.env.PORT ?? 3000}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: { baseURL, trace: 'retain-on-failure', serviceWorkers: 'block' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'webkit-iphone', testMatch: ['hide-and-seek.spec.ts', 'directions-game.spec.ts', 'learning-design.spec.ts', 'game-learning-quality.spec.ts', 'time-learning.spec.ts', 'game-catalog.spec.ts', 'dialogue-reading-aids.spec.ts', 'lesson4.spec.ts', 'lesson4-book-reference.spec.ts', 'lesson4-activities.spec.ts', 'lesson5.spec.ts', 'lesson6.spec.ts', 'lesson7.spec.ts', 'games.spec.ts', 'hanzi-font.spec.ts', 'hanzi-focus.spec.ts', 'hanzi-writing.spec.ts', 'hanzi-layout.spec.ts', 'hanzi-complete.spec.ts', 'reto-share.spec.ts', 'vocabulary-mix.spec.ts', 'vocabulary-mix-levels.spec.ts', 'vocabulary-image-loading.spec.ts', 'lessons123-review.spec.ts'], use: { ...devices['iPhone 13'] } },
  ],
  webServer: process.env.PLAYWRIGHT_EXTERNAL_SERVER === '1' ? undefined : {
    command: `${nodeExecutable} scripts/e2e-server.mjs`,
    url: baseURL,
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === '1',
    timeout: 120_000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 },
  },
});
