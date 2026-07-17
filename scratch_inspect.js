const { chromium } = require('@playwright/test');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    httpCredentials: {
      username: 'teduser',
      password: 'tUeygHu@4q',
    }
  });
  const page = await context.newPage();
  
  // Go to homepage
  await page.goto('https://teded-integration.herokuapp.com/', { waitUntil: 'domcontentloaded' });
  
  // Login
  const LoginPage = require('./src/pages/LoginPage').LoginPage;
  const loginPage = new LoginPage(page);
  await loginPage.login();
  
  // Click Create and Build your own video
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('link', { name: 'A Lesson Build your own video' }).click();
  
  // Type search term and search
  await page.getByRole('searchbox', { name: 'Enter a search term or' }).fill('Football fifa');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForLoadState('networkidle');
  
  // Log some elements
  const links = await page.evaluate(() => {
    // Find all links that look like video results
    const results = [];
    const elements = document.querySelectorAll('a');
    for (const el of elements) {
      if (el.href && (el.href.includes('youtube.com') || el.href.includes('watch') || el.href.includes('lessons'))) {
        results.push({
          href: el.href,
          text: el.innerText,
          className: el.className,
          outerHTML: el.outerHTML.substring(0, 200)
        });
      }
    }
    // Also log structure around the video cards
    return results.slice(0, 15);
  });
  
  console.log('Found links:', JSON.stringify(links, null, 2));
  await browser.close();
}

run().catch(console.error);
