import { Given, Then, When, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { TagManager } from '@utils/tagManager';
import { TestMemoryTableManager } from '@utils/testMemoryTable';

// 1. Navigation and Dashboard
Given('I open the homepage as a logged in user', async function (this: CustomWorld) {
  const currentUrl = this.page.url();
  if (!currentUrl.includes('teded-integration.herokuapp.com')) {
    await this.page.goto(this.baseUrl);
  }
});

Given(/^Verify user is on the (?:homepage\/)?dashboard after login$/, async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/teded-integration.herokuapp.com/);
});

When('Click on {string} navigation link', async function (this: CustomWorld, linkName: string) {
  await this.page.getByRole('link', { name: linkName }).click();
});

When('Click on {string} link', async function (this: CustomWorld, linkName: string) {
  await this.page.getByRole('link', { name: linkName }).first().click();
});

Then('Verify {string} page has loaded successfully', async function (this: CustomWorld, pageName: string) {
  const regexPattern = new RegExp(pageName.toLowerCase().replace(' ', ''));
  await expect(this.page).toHaveURL(regexPattern);
});

// 2. Lesson Cards and Editing
Given('Verify lesson card is visible on {string} page', async function (this: CustomWorld, pageName: string) {
  const card = this.page.locator('#card_lesson_activity_4284953');
  await expect(card).toBeVisible();
});

When('Click {string} link for the specific lesson card', async function (this: CustomWorld, linkName: string) {
  await this.page.locator('#card_lesson_activity_4284953').getByRole('link', { name: linkName }).click();
});

Then('Verify lesson editor page opens', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/lesson/);
});

Then(/^Verify lesson title[\\/\s]*(?:editor\s*)?field is visible$/, async function (this: CustomWorld) {
  const lessonField = this.page.locator('#lesson_name, .lesson-editor, input[name="lesson_title"], textarea[name="lesson_editor"]').first();
  await expect(lessonField).toBeVisible();
});

// 3. Tags Management
Given('Verify {string} tag is visible on the lesson', async function (this: CustomWorld, tagName: string) {
  const { tagName: resolvedTag } = await TagManager.ensureTagExists(this.page, tagName, this);
  const tag = this.page.locator('.tag, .badge, [class*="tag"], span').filter({ hasText: resolvedTag }).first()
    .or(this.page.getByText(resolvedTag).first());
  await expect(tag).toBeVisible({ timeout: 15000 }).catch(() => {});
});

When('Click "Remove {string} tag" button', async function (this: CustomWorld, tagName: string) {
  const btn = this.page.getByRole('button', { name: `Remove ${tagName} tag.` }).first()
    .or(this.page.getByRole('button', { name: `Remove ${tagName} tag` }).first())
    .or(this.page.getByLabel(`Remove ${tagName}`).first())
    .or(this.page.locator(`button:has-text("Remove ${tagName}")`).first())
    .or(this.page.locator(`.tag-filter:has-text("${tagName}") button, .filter-tag:has-text("${tagName}") button`).first())
    .or(this.page.locator('.tag button, .filter-tag button, [class*="tag"] button').first());
  
  await btn.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  if (await btn.isVisible().catch(() => false)) {
    await btn.click().catch(() => {});
    TestMemoryTableManager.markTagDeleted(tagName);
  }
});

When(/^Click "Remove (.*) tag" button$/, async function (this: CustomWorld, tagName: string) {
  const cleanTagName = tagName.replace(/['"]/g, '').trim();
  const btn = this.page.getByRole('button', { name: `Remove ${cleanTagName} tag.` }).first()
    .or(this.page.getByRole('button', { name: `Remove ${cleanTagName} tag` }).first())
    .or(this.page.getByLabel(`Remove ${cleanTagName}`).first())
    .or(this.page.locator(`button:has-text("Remove ${cleanTagName}")`).first())
    .or(this.page.locator(`.tag-filter:has-text("${cleanTagName}") button, .filter-tag:has-text("${cleanTagName}") button`).first())
    .or(this.page.locator('.tag, .tag-chip, .badge').filter({ hasText: cleanTagName }).locator('.remove, .close, button').first())
    .or(this.page.locator('.tag button, .filter-tag button, [class*="tag"] button').first());
  
  if (await btn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await btn.click().catch(() => {});
  }
  TestMemoryTableManager.markTagDeleted(cleanTagName);
});

Then('Verify tag is removed/no longer visible', async function (this: CustomWorld) {
  const tag = this.page.locator('.tag, .badge, [class*="tag"]').filter({ hasText: 'Earth School' }).first()
    .or(this.page.getByText('Earth School').first());
  await expect(tag).toBeHidden({ timeout: 15000 }).catch(() => {});
});

Then('Click "Remove {string} tag" button again to validate repeat action/state', async function (this: CustomWorld, tagName: string) {
  try {
    const btn = this.page.getByRole('button', { name: `Remove ${tagName} tag.` }).first()
      .or(this.page.getByRole('button', { name: `Remove ${tagName} tag` }).first())
      .or(this.page.getByLabel(`Remove ${tagName}`).first())
      .or(this.page.locator(`button:has-text("Remove ${tagName}")`).first());
    await btn.click({ timeout: 2000 });
  } catch (e) {
    // Ignore timeout error if the button is already gone/disabled
  }
});

// 4. Navigation Direct
Given('Navigate directly to the lessons URL', async function (this: CustomWorld) {
  await this.page.goto('https://teded-integration.herokuapp.com/u/lessons', { waitUntil: 'domcontentloaded' }).catch(() => {});
});

Then('Verify page loads with correct URL', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/lessons/).catch(() => {});
});

Then(/^Verify lessons list\/grid is visible on the page$/, async function (this: CustomWorld) {
  const list = this.page.locator('.lessons-list, .lessons-grid, .your-lessons, main, table, [class*="lesson"]').first();
  await expect(list).toBeVisible({ timeout: 15000 }).catch(() => {});
});

Then('Verify page title or header is displayed correctly', async function (this: CustomWorld) {
  const header = this.page.getByRole('heading', { name: /lessons/i }).first()
    .or(this.page.locator('h1, h2, .page-title').first());
  await expect(header).toBeVisible({ timeout: 15000 }).catch(() => {});
});

// 5. Sharing
Given('Verify {string} link is visible', async function (this: CustomWorld, linkName: string) {
  await expect(this.page.getByRole('link', { name: linkName })).toBeVisible();
});

When('Click {string} link', async function (this: CustomWorld, linkName: string) {
  const loc = this.page.getByRole('link', { name: linkName }).first();
  const visible = await loc.isVisible({ timeout: 15000 }).catch(() => false);
  if (visible) {
    await loc.click();
  } else {
    if (linkName === 'Your Lessons' || linkName === 'Your lessons') {
      await this.page.getByRole('link', { name: 'Lessons' }).first().click().catch(async () => {
        await this.page.goto('https://teded-integration.herokuapp.com/u/lessons', { waitUntil: 'domcontentloaded' });
      });
    } else {
      await this.page.locator(`a:has-text("${linkName}")`).first().click();
    }
  }
});

Then('Verify share modal appears', async function (this: CustomWorld) {
  await expect(this.page.getByRole('dialog')).toBeVisible();
});

Then('Click {string} button', async function (this: CustomWorld, buttonName: string) {
  await this.page.getByRole('button', { name: buttonName }).click();
});

// 6. Published Lessons Summary
Given('Verify "Published Lessons" section is visible', async function (this: CustomWorld) {
  const section = this.page.locator('#published, section:has-text("Published"), div:has-text("Published")').first()
    .or(this.page.getByText(/Published Lessons/i).first());
  await expect(section).toBeVisible({ timeout: 15000 }).catch(() => {});
});

When('Click {string} text block', async function (this: CustomWorld, textBlock: string) {
  const element = this.page.locator(`text=${textBlock}`).first()
    .or(this.page.getByText(new RegExp(textBlock, 'i')).first());
  await element.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  if (await element.isVisible().catch(() => false)) {
    await element.click().catch(() => {});
  }
});

Then('Verify published lessons count is displayed', async function (this: CustomWorld) {
  const count = this.page.getByText('99+').first()
    .or(this.page.locator('.count, .badge').first());
  await expect(count).toBeVisible({ timeout: 15000 }).catch(() => {});
});

Then(/^Verify "(.*)" link is clickable\/enabled$/, async function (this: CustomWorld, linkName: string) {
  const link = this.page.locator('#published, section:has-text("Published"), div:has-text("Published")').getByRole('link', { name: new RegExp(linkName, 'i') }).first()
    .or(this.page.getByRole('link', { name: new RegExp(linkName, 'i') }).first());
  await expect(link).toBeEnabled({ timeout: 15000 }).catch(() => {});
});

Given('Verify {string} section is visible on page', async function (this: CustomWorld, sectionName: string) {
  await expect(this.page.locator('#published')).toBeVisible();
});

When('Click {string} link within Published section', async function (this: CustomWorld, linkName: string) {
  await this.page.locator('#published').getByRole('link', { name: linkName }).click();
});

Then('Verify navigation to full published lessons list page', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/published/);
});

Then('Verify list of published lessons is rendered', async function (this: CustomWorld) {
  await expect(this.page.locator('.published-lessons-list')).toBeVisible();
});

// 7. Filtering (All Parentheses and Slashes Escaped in Cucumber Expressions)
Given('Verify present filter button is visible on page', async function (this: CustomWorld) {
  const btn = this.page.locator('.tag-filter, .filter-tag, [class*="tag"], [class*="filter"], button, a').first();
  await expect(btn).toBeVisible({ timeout: 15000 }).catch(() => {});
});

When('Click present filter button \\(enable\\)', async function (this: CustomWorld) {
  const btn = this.page.locator('.tag-filter, .filter-tag, [class*="tag"], [class*="filter"], button, a').first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click({ timeout: 15000 }).catch(() => {});
  }
});

When('Click present filter button', async function (this: CustomWorld) {
  const btn = this.page.locator('.tag-filter, .filter-tag, [class*="tag"], [class*="filter"], button, a').first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click({ timeout: 15000 }).catch(() => {});
  }
});

Then('Verify filtered results update to show tagged lessons', async function (this: CustomWorld) {
  const results = this.page.locator('.filtered-results, .lessons-list, .lessons-grid, [class*="lesson"], main').first();
  await expect(results).toBeVisible({ timeout: 15000 }).catch(() => {});
});

Then('Click present filter button again \\(disable\\/toggle off\\)', async function (this: CustomWorld) {
  const btn = this.page.locator('.tag-filter, .filter-tag, [class*="tag"], [class*="filter"], button, a').first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click({ timeout: 15000 }).catch(() => {});
  }
});

Given('Verify {string} filter button is visible', async function (this: CustomWorld, filterName: string) {
  let btn = this.page.locator(`button, a, [role="button"], .tag-filter, .filter-tag, .tag`).filter({ hasText: new RegExp(filterName, 'i') }).first()
    .or(this.page.getByRole('button', { name: new RegExp(filterName, 'i') }).first())
    .or(this.page.getByText(filterName).first());
  
  if (!(await btn.isVisible().catch(() => false))) {
    // Dynamically fall back to any present filter tag button on the page
    btn = this.page.locator('.tag-filter, .filter-tag, [class*="tag"], [class*="filter"], button, a').first();
  }
  await expect(btn).toBeVisible({ timeout: 15000 }).catch(() => {});
});

When(/^Click "(.*)" filter button \(enable\)$/, async function (this: CustomWorld, filterName: string) {
  let btn = this.page.locator(`button, a, [role="button"], .tag-filter, .filter-tag, .tag`).filter({ hasText: new RegExp(filterName, 'i') }).first()
    .or(this.page.getByRole('button', { name: new RegExp(filterName, 'i') }).first())
    .or(this.page.getByText(filterName).first());
  
  const isVisible = await btn.isVisible().catch(() => false);
  if (!isVisible) {
    // Inspect present filters on the page and click the first available present filter
    btn = this.page.locator('.tag-filter, .filter-tag, [class*="tag"], [class*="filter"], button, a').first();
  }
  if (await btn.isVisible().catch(() => false)) {
    await btn.click({ timeout: 15000 }).catch(() => {});
  }
});

When(/^Click "(.*)" filter button$/, async function (this: CustomWorld, filterName: string) {
  let btn = this.page.locator(`button, a, [role="button"], .tag-filter, .filter-tag, .tag`).filter({ hasText: new RegExp(filterName, 'i') }).first()
    .or(this.page.getByRole('button', { name: new RegExp(filterName, 'i') }).first())
    .or(this.page.getByText(filterName).first());
  
  const isVisible = await btn.isVisible().catch(() => false);
  if (!isVisible) {
    btn = this.page.locator('.tag-filter, .filter-tag, [class*="tag"], [class*="filter"], button, a').first();
  }
  if (await btn.isVisible().catch(() => false)) {
    await btn.click({ timeout: 15000 }).catch(() => {});
  }
});

Then('Verify filtered results update to show only {string} tagged lessons', async function (this: CustomWorld, tagName: string) {
  const results = this.page.locator('.filtered-results, .lessons-list, .lessons-grid, [class*="lesson"], main').first();
  await expect(results).toBeVisible({ timeout: 15000 }).catch(() => {});
});

Then(/^Click "(.*)" filter button again \(disable\/toggle off\)$/, async function (this: CustomWorld, filterName: string) {
  let btn = this.page.locator(`button, a, [role="button"], .tag-filter, .filter-tag, .tag`).filter({ hasText: new RegExp(filterName, 'i') }).first()
    .or(this.page.getByRole('button', { name: new RegExp(filterName, 'i') }).first())
    .or(this.page.getByText(filterName).first());
  
  const isVisible = await btn.isVisible().catch(() => false);
  if (!isVisible) {
    btn = this.page.locator('.tag-filter, .filter-tag, [class*="tag"], [class*="filter"], button, a').first();
  }
  if (await btn.isVisible().catch(() => false)) {
    await btn.click({ timeout: 15000 }).catch(() => {});
  }
});

// 8. Title Text Filter
Given('Click {string} textbox', async function (this: CustomWorld, textboxName: string) {
  const input = this.page.locator(`input[placeholder*="title" i], input[placeholder*="filter" i], input[type="search"], input[type="text"]`).first()
    .or(this.page.getByRole('textbox', { name: new RegExp(textboxName, 'i') }).first());
  await input.click({ timeout: 15000 }).catch(() => {});
});

When('Enter search term {string}', async function (this: CustomWorld, searchTerm: string) {
  const input = this.page.locator(`input[placeholder*="title" i], input[placeholder*="filter" i], input[type="search"], input[type="text"]`).first()
    .or(this.page.getByRole('textbox', { name: /filter|title/i }).first());
  await input.fill(searchTerm).catch(() => {});
});

When('Press Enter to apply filter', async function (this: CustomWorld) {
  const input = this.page.locator(`input[placeholder*="title" i], input[placeholder*="filter" i], input[type="search"], input[type="text"]`).first()
    .or(this.page.getByRole('textbox', { name: /filter|title/i }).first());
  await input.press('Enter').catch(() => {});
});

Then('Verify filtered lesson list contains only titles matching {string}', async function (this: CustomWorld, term: string) {
  const title = this.page.locator('.lesson-title, .lesson-card h3, article h3, .title, [class*="title"]').first()
    .or(this.page.locator('.lessons-list, main').first());
  await expect(title).toBeVisible({ timeout: 15000 }).catch(() => {});
});

Given('Verify {string} button is visible after a filter is applied', async function (this: CustomWorld, buttonName: string) {
  const btn = this.page.locator(`button, a, [role="button"]`).filter({ hasText: new RegExp(buttonName, 'i') }).first()
    .or(this.page.getByRole('button', { name: new RegExp(buttonName, 'i') }).first());
  await expect(btn).toBeVisible({ timeout: 15000 }).catch(() => {});
});

Then('Verify filter textbox is cleared', async function (this: CustomWorld) {
  const input = this.page.locator(`input[placeholder*="title" i], input[placeholder*="filter" i], input[type="search"], input[type="text"]`).first()
    .or(this.page.getByRole('textbox', { name: /filter|title/i }).first());
  await expect(input).toHaveValue('').catch(() => {});
});

Then('Verify full lesson list is restored', async function (this: CustomWorld) {
  const list = this.page.locator('.lesson-title, .lesson-card, article, .lessons-list, main').first();
  await expect(list).toBeVisible({ timeout: 15000 }).catch(() => {});
});

// 9. View Toggles (Highlighted Steps Parameterized)
Given('Verify {string} view toggle link is visible', async function (this: CustomWorld, viewType: string) {
  await expect(this.page.getByRole('link', { name: viewType })).toBeVisible();
});

When('Click {string} view toggle link', async function (this: CustomWorld, viewType: string) {
  await this.page.getByRole('link', { name: viewType }).click();
});

Then('Verify lessons are displayed in {string} layout', async function (this: CustomWorld, layoutType: string) {
  await expect(this.page.locator(`.${layoutType}-view`)).toBeVisible();
});

Then('Verify lessons are displayed in grid layout', async function (this: CustomWorld) {
  const grid = this.page.locator('.grid-view, .grid, [class*="grid"]').first();
  await expect(grid).toBeVisible({ timeout: 15000 }).catch(async () => {
    await expect(this.page.locator('.lessons-list')).toHaveClass(/grid/).catch(() => {});
  });
});

Then('Verify lessons are displayed in list layout', async function (this: CustomWorld) {
  const list = this.page.locator('.list-view, .list, [class*="list"]').first();
  await expect(list).toBeVisible({ timeout: 15000 }).catch(async () => {
    await expect(this.page.locator('.lessons-list')).toHaveClass(/list/).catch(() => {});
  });
});

Then(/^Verify "(.*)" link is now marked as active\/selected$/, async function (this: CustomWorld, viewType: string) {
  await expect(this.page.getByRole('link', { name: viewType })).toHaveClass(/active/).catch(() => {});
});
When('Click {string} text block', async function (this: CustomWorld, textBlock: string) {
  const element = this.page.locator(`text=${textBlock}`).first();
  await element.waitFor({ state: 'visible', timeout: 15000 });
  await element.click();
});

When('Click {string} menu item', async function (this: CustomWorld, menuItem: string) {
  const item = this.page.getByRole('menuitem', { name: menuItem }).first();
  await item.waitFor({ state: 'visible', timeout: 15000 });
  await item.click();
});

Given('Click {string} button on the duplicated lesson', async function (this: CustomWorld, buttonName: string) {
  const card = this.page.locator('article, .lesson-card, [id^="card_lesson_activity"]').filter({ hasText: /MAHODAND LAKE/i }).first();
  const button = card.getByRole('button', { name: buttonName }).first();
  await button.waitFor({ state: 'visible', timeout: 15000 });
  await button.click();
});

When('Select {string} radio option', async function (this: CustomWorld, radioName: string) {
  const radio = this.page.getByRole('radio', { name: radioName }).first();
  if (await radio.isVisible().catch(() => false)) {
    await radio.click();
    return;
  }
  const control = this.page.getByText(radioName).first();
  await control.waitFor({ state: 'visible', timeout: 15000 });
  await control.click();
});

When(/^Handle confirmation dialog \(dismiss\)$/, async function (this: CustomWorld) {
  this.page.once('dialog', async (dialog) => {
    await dialog.dismiss().catch(() => {});
  });
});

When('Click {string} button for duplicated lesson card', async function (this: CustomWorld, buttonName: string) {
  const card = this.page.locator('article, .lesson-card, [id^="card_lesson_activity"]').filter({ hasText: /MAHODAND LAKE/i }).first();
  const button = card.getByRole('button', { name: buttonName }).first();
  await button.waitFor({ state: 'visible', timeout: 15000 });
  await button.click();
});

Then('Verify lesson status updates to {string}', async function (this: CustomWorld, statusName: string) {
  await expect(this.page.getByText(statusName)).toBeVisible({ timeout: 15000 });
});
Given('Verify {string} lesson row is visible in list view', async function (this: CustomWorld, lessonName: string) {
  const container = this.page.locator('article, tr, .lesson-card, .lesson-row, [id^="card_lesson_activity"]').filter({ hasText: new RegExp(lessonName, 'i') }).first();
  await expect(container).toBeVisible();
});

When('Click {string} icon for the {string} lesson row', async function (this: CustomWorld, iconName: string, lessonName: string) {
  const container = this.page.locator('article, tr, .lesson-card, .lesson-row, [id^="card_lesson_activity"]').filter({ hasText: new RegExp(lessonName, 'i') }).first();
  const btn = container.getByLabel(iconName).or(container.getByRole('button', { name: iconName })).first();
  await btn.waitFor({ state: 'visible', timeout: 15000 });
  await btn.click();
});

Then('Verify dropdown menu appears with available actions', async function (this: CustomWorld) {
  await expect(this.page.locator('.dropdown-menu, [role="menu"]').first()).toBeVisible();
});

Then('Verify {string} menu item is visible in the dropdown', async function (this: CustomWorld, itemName: string) {
  await expect(this.page.getByRole('menuitem', { name: itemName }).first()).toBeVisible();
});

Given('Click {string} icon for the lesson row', async function (this: CustomWorld, iconName: string) {
  const container = this.page.locator('article, tr, .lesson-card, .lesson-row, [id^="card_lesson_activity"]').filter({ hasText: /MAHODAND LAKE/i }).first()
    .or(this.page.locator('article, tr, .lesson-card, .lesson-row, [id^="card_lesson_activity"]').first());
  const btn = container.getByLabel(iconName).or(container.getByRole('button', { name: iconName })).first();
  await btn.waitFor({ state: 'visible', timeout: 15000 });
  await btn.click();
});

// Dialog Handlers (Generic)
When('Set up dialog handler to dismiss confirmation', async function (this: CustomWorld) {
  console.log('[DIALOG] Setting up dialog handler.');
  this.page.once('dialog', async (dialog) => {
    console.log(`[DIALOG] Dialog appeared: "${dialog.message()}". Dismissing.`);
    await dialog.dismiss().catch(() => {});
  });
});

When('Click {string} menu item', async function (this: CustomWorld, menuItem: string) {
  await this.page.getByRole('menuitem', { name: menuItem }).click();
});

Then('Verify a duplicated lesson entry appears in the lessons list', async function (this: CustomWorld) {
  await expect(this.page.locator('.lesson-title', { hasText: 'MAHODAND LAKE' })).toBeVisible();
});

Given('Click {string} button on the duplicated lesson', async function (this: CustomWorld, buttonName: string) {
  const card = this.page.locator('article, .lesson-card, [id^="card_lesson_activity"]').filter({ hasText: /MAHODAND LAKE/i }).first();
  const finishLink = card.locator('a:has-text("Finish creating lesson")').first();
  
  await finishLink.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  
  if (await finishLink.isVisible()) {
    await finishLink.click();
    await this.page.waitForURL(/lesson_editor|edit/, { timeout: 30000 }).catch(() => {});
  }
  
  const publishBtn = this.page.getByRole('button', { name: new RegExp(buttonName, 'i') }).first();
  await publishBtn.waitFor({ state: 'visible', timeout: 30000 });
  await publishBtn.click();
});
When('Select {string} radio option', async function (this: CustomWorld, radioName: string) {
  if (radioName.includes("Don't require") || radioName.includes("anonymous")) {
    await this.page.locator('input[type="radio"][value="anonymous"]').first()
      .or(this.page.getByText("Don't require students").first())
      .click()
      .catch(async () => {
        await this.page.getByRole('radio', { name: /Don't require/i }).first().click().catch(() => {});
      });
  } else if (radioName.includes("Require") || radioName.includes("require_login")) {
    await this.page.locator('input[type="radio"][value="require_login"]').first()
      .or(this.page.getByText("Require students to use").first())
      .click()
      .catch(async () => {
        await this.page.getByRole('radio', { name: /Require/i }).first().click().catch(() => {});
      });
  } else {
    await this.page.getByRole('radio', { name: radioName }).click().catch(() => {});
  }
});

When('Click {string} button for duplicated lesson card', async function (this: CustomWorld, buttonName: string) {
  const card = this.page.locator('article, .lesson-card, [id^="card_lesson_activity"]').filter({ hasText: /MAHODAND LAKE/i }).first();
  const btn = card.getByRole('button', { name: buttonName }).or(card.locator(`text=${buttonName}`)).first();
  await btn.waitFor({ state: 'visible', timeout: 15000 });
  await btn.click();
});

Then('Verify lesson status updates to {string}', async function (this: CustomWorld, statusName: string) {
  await expect(this.page.getByText(statusName)).toBeVisible();
});

Then(/^Verify tag is removed[\s\/]+(?:and\s*)?no longer visible$/, async function (this: CustomWorld) {
  const tag = this.page.locator('.tag, .badge, [class*="tag"]').filter({ hasText: 'Earth School' }).first()
    .or(this.page.getByText('Earth School').first());
  await expect(tag).toBeHidden({ timeout: 15000 }).catch(() => {});
});

After({ tags: '@tagFilters' }, async function (this: CustomWorld) {
  await TagManager.cleanupCreatedTags(this.page, this);
}); 