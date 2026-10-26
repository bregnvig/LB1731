import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:4310', viewport: { width: 1280, height: 720 }, trace: 'retain-on-failure' },
  webServer: {
    command: 'npx ng build && node server/server.mjs --root e2e/fixture --port 4310',
    cwd: '..',
    url: 'http://127.0.0.1:4310/api/deck',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
