import type { PlaywrightTestConfig } from '@playwright/test';
import { envConfig } from './src/utils/envConfig';

const config: PlaywrightTestConfig = {
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  retries: envConfig.isCI ? 1 : 0,
  use: {
    baseURL: envConfig.baseUrl,
    headless: envConfig.headless,
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    trace: 'on-first-retry',
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
    httpCredentials: {
      username: envConfig.basicAuthUsername,
      password: envConfig.basicAuthPassword,
    },
  },
  reporter: [['html', { outputFolder: 'reports/playwright-report', open: 'never' }]],
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
};

export default config;
