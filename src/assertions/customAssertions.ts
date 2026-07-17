import { expect, Locator, Page } from '@playwright/test';

export async function assertPageURL(page: Page, pattern: RegExp, message?: string) {
  await expect(page, message).toHaveURL(pattern, { timeout: 15000 });
}

export async function assertElementVisible(locator: Locator, message?: string) {
  await expect(locator, message).toBeVisible({ timeout: 15000 });
}

export async function assertElementText(locator: Locator, expected: string, message?: string) {
  await expect(locator, message).toHaveText(expected, { timeout: 15000 });
}

export async function assertElementCount(locator: Locator, count: number, message?: string) {
  await expect(locator, message).toHaveCount(count, { timeout: 15000 });
}

export async function assertNoConsoleErrors(page: Page) {
  const errors: string[] = [];
  const listener = (message: { type: () => string; text: () => string }) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  };

  page.on('console', listener);
  await page.waitForTimeout(500);
  page.off('console', listener);

  await expect(errors, 'Expected no console errors').toEqual([]);
}
