import { Locator, Page } from '@playwright/test';

export async function waitForElementVisible(locator: Locator, timeout = 15000) {
  await locator.waitFor({ state: 'visible', timeout });
}

export async function waitForURLMatches(page: Page, pattern: RegExp, timeout = 30000) {
  await page.waitForURL(pattern, { timeout });
}

export async function waitForPageLoad(page: Page, timeout = 30000) {
  await page.waitForLoadState('networkidle', { timeout });
}
