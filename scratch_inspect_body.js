const { chromium } = require('@playwright/test');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    httpCredentials: {
      username: 'teduser',
      password: 'tUeygHu@4q',
    }
  });
  const page = await context.newPage();
  
  await page.goto('https://teded-integration.herokuapp.com/', { waitUntil: 'domcontentloaded' });
  
  const LoginPage = require('./src/pages/LoginPage').LoginPage;
  const loginPage = new LoginPage(page);
  await loginPage.login();
  
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('link', { name: 'A Lesson Build your own video' }).click();
  
  await page.getByRole('searchbox', { name: 'Enter a search term or' }).fill('Football fifa');
  await page.getByRole('button', { name: 'Search' }).click();
  
  // Wait for results to appear
  await page.waitForTimeout(5000);
  
  const html = await page.content();
  fs.writeFileSync('search_results.html', html);
  console.log('Saved search_results.html');
  await browser.close();
}

run().catch(console.error);
