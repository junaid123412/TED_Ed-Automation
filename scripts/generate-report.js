const report = require('multiple-cucumber-html-reporter');
const path = require('path');
const fs = require('fs');

const reportsDir = path.resolve(__dirname, '..', 'reports');
const sourceJson = path.join(reportsDir, 'cucumber-report.json');

// Isolate the json report into a clean source directory
const cleanJsonDir = path.join(reportsDir, 'json-source');
if (!fs.existsSync(cleanJsonDir)) {
  fs.mkdirSync(cleanJsonDir, { recursive: true });
}
fs.copyFileSync(sourceJson, path.join(cleanJsonDir, 'cucumber-report.json'));

const outputHtmlDir = path.join(reportsDir, 'html-report');

report.generate({
  jsonDir: cleanJsonDir,
  reportPath: outputHtmlDir,
  metadata: {
    browser: {
      name: 'chromium',
      version: process.env.PLAYWRIGHT_BROWSER_VERSION || 'unknown',
    },
    device: 'Desktop Chrome',
    platform: {
      name: process.platform,
      version: process.version,
    },
  },
  customData: {
    title: 'Run information',
    data: [
      { label: 'Project', value: 'Playwright Cucumber BDD' },
      { label: 'Environment', value: process.env.CI ? 'CI' : 'Local' },
      { label: 'Base URL', value: process.env.BASE_URL || 'https://teded-integration.herokuapp.com/' }
    ],
  },
});

