import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const browserPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
  ?? (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
const deployedURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45000,
  reporter: [['list'], ['json', { outputFile: 'test-results/report.json' }]],
  use: {
    baseURL: deployedURL || 'http://127.0.0.1:4322',
    browserName: 'chromium',
    launchOptions: { executablePath: browserPath },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: deployedURL ? undefined : {
    command: 'node scripts/serve-build.mjs',
    url: 'http://127.0.0.1:4322',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
