import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/e2e',testMatch:'image-review.spec.ts',workers:1,timeout:60000,
  use:{baseURL:'http://localhost:3103',serviceWorkers:'block',trace:'retain-on-failure'},
  projects:[{name:'chromium',use:{...devices['Desktop Chrome']}},{name:'webkit',use:{...devices['Desktop Safari']}}],
  webServer:{command:`"${process.execPath}" tests/fixtures/image-review-server.mjs`,url:'http://localhost:3103/api/vocabulary/images',timeout:60000},
});
