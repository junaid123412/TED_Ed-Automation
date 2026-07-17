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
  
  await page.goto('https://teded-integration.herokuapp.com/', { waitUntil: 'domcontentloaded' });
  
  const LoginPage = require('./src/pages/LoginPage').LoginPage;
  const loginPage = new LoginPage(page);
  await loginPage.login();
  
  // Go to Your Lessons page
  console.log('Navigating to Your Lessons...');
  await page.goto('https://teded-integration.herokuapp.com/u/lessons', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  
  // Get all links in the draft section
  const drafts = await page.evaluate(() => {
    const list = [];
    // Find the container for draft lessons
    const draftContainer = document.querySelector('#draft');
    if (draftContainer) {
      const links = draftContainer.querySelectorAll('a');
      for (const a of links) {
        list.push({
          href: a.href,
          text: a.innerText.trim(),
          html: a.outerHTML.substring(0, 150)
        });
      }
    }
    return list;
  });
  
  console.log('Draft links:', JSON.stringify(drafts, null, 2));
  await browser.close();
}

run().catch(console.error);
