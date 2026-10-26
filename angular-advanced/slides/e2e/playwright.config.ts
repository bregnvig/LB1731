import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:4310', viewport: { width: 1280, height: 720 } },
  webServer: {
    command: 'npx ng build && node server/server.mjs --root e2e/fixture --port 4310',
    cwd: '..',
    url: 'http://localhost:4310/api/deck',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
