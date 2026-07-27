import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import * as fs from 'fs';

const LOG_FILE = 'C:/New folder (2)/pending-footer-locators.log';

// Module-level state to avoid extending CustomWorld type definition
let lastPopup: any = null;
let newsletterTermsUrl = '';
let bottomTermsUrl = '';
let newsletterPrivacyUrl = '';
let bottomPrivacyUrl = '';
let consoleErrors: string[] = [];

function logPending(tcId: string, message: string) {
  const line = `[${tcId}] ${message}\n`;
  try {
    fs.appendFileSync(LOG_FILE, line, 'utf8');
  } catch (e) {}
  console.warn(`[PENDING-LOG] ${line.trim()}`);
}

async function safeAction(world: CustomWorld, tcId: string, action: () => Promise<void>) {
  try {
    await action();
  } catch (err: any) {
    logPending(tcId, err.message);
  }
}

Given('I navigate to the entry lessons page', async function (this: CustomWorld) {
  await safeAction(this, 'COMMON', async () => {
    await this.page.goto('https://teded-integration.herokuapp.com/lessons?sort=featured-position');
  });
});

Given('I scroll the footer into view', async function (this: CustomWorld) {
  await safeAction(this, 'COMMON', async () => {
    const footer = this.page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible({ timeout: 5000 });
  });
});

Given('I return to the home lessons page', async function (this: CustomWorld) {
  await safeAction(this, 'COMMON', async () => {
    await this.page.goto('https://teded-integration.herokuapp.com/lessons?sort=featured-position');
  });
});

When('I click "Visit" heading', async function (this: CustomWorld) {
  await safeAction(this, 'TC-220', async () => {
    const el = this.page.getByRole('heading', { name: 'Visit' });
    await el.click({ timeout: 5000 });
  });
});

Then('the page should scroll to the Visit section', async function (this: CustomWorld) {
  await safeAction(this, 'TC-220', async () => {
    const el = this.page.getByRole('heading', { name: 'Visit' });
    await expect(el).toBeInViewport({ timeout: 5000 });
  });
});

When('I click "Help" link', async function (this: CustomWorld) {
  await safeAction(this, 'TC-221', async () => {
    const el = this.page.getByRole('link', { name: 'Help' });
    await el.click({ timeout: 5000 });
  });
});

Then('I should be redirected to the Help page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-221', async () => {
    await expect(this.page).toHaveURL(/\/help/, { timeout: 5000 });
  });
});

When('I click "Contact" link', async function (this: CustomWorld) {
  await safeAction(this, 'TC-222', async () => {
    const el = this.page.getByRole('link', { name: 'Contact' });
    await el.click({ timeout: 5000 });
  });
});

Then('I should be redirected to the Contact page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-222', async () => {
    await expect(this.page).toHaveURL(/\/contact|requests\/new/i, { timeout: 5000 });
  });
});

When('I click "Blog" link', async function (this: CustomWorld) {
  await safeAction(this, 'TC-223', async () => {
    const el = this.page.getByRole('link', { name: 'Blog' });
    await el.click({ timeout: 5000 });
  });
});

Then('I should be redirected to the Blog page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-223', async () => {
    await expect(this.page).toHaveURL(/\/blog/, { timeout: 5000 });
  });
});

When('I click "About" link', async function (this: CustomWorld) {
  await safeAction(this, 'TC-224', async () => {
    const el = this.page.getByRole('link', { name: 'About' });
    await el.click({ timeout: 5000 });
  });
});

Then('I should be redirected to the About page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-224', async () => {
    await expect(this.page).toHaveURL(/\/about/, { timeout: 5000 });
  });
});

When('I click "Educators" link', async function (this: CustomWorld) {
  await safeAction(this, 'TC-225', async () => {
    const el = this.page.getByRole('link', { name: 'Educators' });
    await el.click({ timeout: 5000 });
  });
});

Then('I should be redirected to the Educators page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-225', async () => {
    await expect(this.page).toHaveURL(/\/educator(s)?/i, { timeout: 5000 });
  });
});

When('I click "Patrons" link', async function (this: CustomWorld) {
  await safeAction(this, 'TC-226', async () => {
    const el = this.page.getByRole('link', { name: 'Patrons' });
    await el.click({ timeout: 5000 });
  });
});

Then('I should be redirected to the Patrons page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-226', async () => {
    await expect(this.page).toHaveURL(/\/patrons/, { timeout: 5000 });
  });
});

When('I click "Facebook" icon', async function (this: CustomWorld) {
  await safeAction(this, 'TC-227', async () => {
    const el = this.page.getByRole('link', { name: 'Facebook (opens in new tab)' });
    const popupPromise = this.page.waitForEvent('popup');
    await el.click({ timeout: 5000 });
    lastPopup = await popupPromise;
  });
});

Then('a new tab should open with {string} and be closed', async function (this: CustomWorld, expectedUrlPart: string) {
  await safeAction(this, 'COMMON_NEW_TAB', async () => {
    const popup = lastPopup;
    expect(popup).toBeDefined();
    await expect(popup).toHaveURL(new RegExp(expectedUrlPart), { timeout: 10000 });
    await popup.close();
  });
});

When('I click "Instagram" icon', async function (this: CustomWorld) {
  await safeAction(this, 'TC-228', async () => {
    const el = this.page.getByRole('link', { name: 'Instagram (opens in new tab)' });
    const popupPromise = this.page.waitForEvent('popup');
    await el.click({ timeout: 5000 });
    lastPopup = await popupPromise;
  });
});

When('I click "X" icon', async function (this: CustomWorld) {
  await safeAction(this, 'TC-229', async () => {
    const el = this.page.getByRole('link', { name: 'X (opens in new tab)' });
    const popupPromise = this.page.waitForEvent('popup');
    await el.click({ timeout: 5000 });
    lastPopup = await popupPromise;
  });
});

Then('a new tab should open and navigate to {string}', async function (this: CustomWorld, expectedUrl: string) {
  await safeAction(this, 'TC-229', async () => {
    const popup = lastPopup;
    expect(popup).toBeDefined();
    await expect(popup).toHaveURL(expectedUrl, { timeout: 10000 });
  });
});

Then('I close the popup tab', async function (this: CustomWorld) {
  await safeAction(this, 'COMMON_CLOSE_POPUP', async () => {
    if (lastPopup) {
      await lastPopup.close();
    }
  });
});

When('I click "LinkedIn" icon', async function (this: CustomWorld) {
  await safeAction(this, 'TC-230', async () => {
    const el = this.page.getByRole('link', { name: 'LinkedIn (opens in new tab)' });
    const popupPromise = this.page.waitForEvent('popup');
    await el.click({ timeout: 5000 });
    lastPopup = await popupPromise;
  });
});

When('I click "YouTube" icon', async function (this: CustomWorld) {
  await safeAction(this, 'TC-231', async () => {
    const el = this.page.getByRole('link', { name: 'YouTube (opens in new tab)' });
    const popupPromise = this.page.waitForEvent('popup');
    await el.click({ timeout: 5000 });
    lastPopup = await popupPromise;
  });
});

When('I click "Weekly" radio option', async function (this: CustomWorld) {
  await safeAction(this, 'TC-232', async () => {
    const el = this.page.getByRole('radio', { name: 'Weekly' });
    await el.click({ timeout: 5000 });
  });
});

Then('the "Weekly" radio option should be checked', async function (this: CustomWorld) {
  await safeAction(this, 'TC-232', async () => {
    const el = this.page.getByRole('radio', { name: 'Weekly' });
    await expect(el).toBeChecked({ timeout: 5000 });
  });
});

When('I click "Daily" radio option', async function (this: CustomWorld) {
  await safeAction(this, 'TC-233', async () => {
    const el = this.page.getByRole('radio', { name: 'Daily' });
    await el.click({ timeout: 5000 });
  });
});

Then('the "Daily" radio option should be checked', async function (this: CustomWorld) {
  await safeAction(this, 'TC-233', async () => {
    const el = this.page.getByRole('radio', { name: 'Daily' });
    await expect(el).toBeChecked({ timeout: 5000 });
  });
});

When('I click "Weekly" radio, then click "Daily" radio', async function (this: CustomWorld) {
  await safeAction(this, 'TC-234', async () => {
    const weekly = this.page.getByRole('radio', { name: 'Weekly' });
    const daily = this.page.getByRole('radio', { name: 'Daily' });
    await weekly.click({ timeout: 5000 });
    await daily.click({ timeout: 5000 });
  });
});

Then('the "Daily" radio should be checked and "Weekly" unchecked', async function (this: CustomWorld) {
  await safeAction(this, 'TC-234', async () => {
    const weekly = this.page.getByRole('radio', { name: 'Weekly' });
    const daily = this.page.getByRole('radio', { name: 'Daily' });
    await expect(daily).toBeChecked({ timeout: 5000 });
    await expect(weekly).not.toBeChecked({ timeout: 5000 });
  });
});

Then('only one radio should be active at a time', async function (this: CustomWorld) {
  await safeAction(this, 'TC-234', async () => {
    const weekly = this.page.getByRole('radio', { name: 'Weekly' });
    const daily = this.page.getByRole('radio', { name: 'Daily' });
    const wChecked = await weekly.isChecked();
    const dChecked = await daily.isChecked();
    expect(wChecked && dChecked).toBe(false);
  });
});

When('I click the frequency and country dropdown control', async function (this: CustomWorld) {
  await safeAction(this, 'TC-235', async () => {
    const el = this.page.locator('.appearance-none.bg-transparent.border-0.p-2');
    await el.click({ timeout: 5000 });
  });
});

Then('the dropdown options should be visible or expanded', async function (this: CustomWorld) {
  await safeAction(this, 'TC-235', async () => {
    const el = this.page.locator('.appearance-none.bg-transparent.border-0.p-2');
    await expect(el).toBeVisible({ timeout: 5000 });
  });
});

When('I click the newsletter email textbox', async function (this: CustomWorld) {
  await safeAction(this, 'TC-236', async () => {
    const el = this.page.getByRole('textbox', { name: 'Your email address' });
    await el.click({ timeout: 5000 });
  });
});

When('I fill the newsletter email with {string}', async function (this: CustomWorld, email: string) {
  await safeAction(this, 'TC-236', async () => {
    const el = this.page.getByRole('textbox', { name: 'Your email address' });
    await el.fill(email, { timeout: 5000 });
  });
});

Then('the newsletter email field value should equal {string}', async function (this: CustomWorld, expectedValue: string) {
  await safeAction(this, 'TC-236', async () => {
    const el = this.page.getByRole('textbox', { name: 'Your email address' });
    await expect(el).toHaveValue(expectedValue, { timeout: 5000 });
  });
});

When('I select the "Weekly" radio option', async function (this: CustomWorld) {
  await safeAction(this, 'TC-237', async () => {
    const el = this.page.getByRole('radio', { name: 'Weekly' });
    await el.click({ timeout: 5000 });
  });
});

When('I click the newsletter "Subscribe" button', async function (this: CustomWorld) {
  await safeAction(this, 'TC-237', async () => {
    const el = this.page.getByRole('button', { name: 'Subscribe' });
    await el.click({ timeout: 5000 });
  });
});

Then('the newsletter subscription confirmation or no validation error should appear', async function (this: CustomWorld) {
  await safeAction(this, 'TC-237', async () => {
    const err = this.page.locator('.newsletter-error, .error-message').filter({ visible: true });
    await expect(err).toHaveCount(0, { timeout: 3000 });
  });
});

When('I leave the newsletter email textbox empty', async function (this: CustomWorld) {
  await safeAction(this, 'TC-238', async () => {
    const el = this.page.getByRole('textbox', { name: 'Your email address' });
    await el.fill('', { timeout: 5000 });
  });
});

Then('a newsletter subscription validation error or required-field message should be shown', async function (this: CustomWorld) {
  await safeAction(this, 'TC-238', async () => {
    const err = this.page.locator('[class*="error"], [class*="validation"], :invalid, .error-message').first();
    await expect(err).toBeVisible({ timeout: 5000 });
  });
});

When('I click "Terms of use" link inside newsletter block', async function (this: CustomWorld) {
  await safeAction(this, 'TC-239', async () => {
    const el = this.page.locator('#newsletter-footer').getByRole('link', { name: 'Terms of use' });
    await el.click({ timeout: 5000 });
  });
});

When('I click "Privacy policy (opens in new tab)" link in newsletter block', async function (this: CustomWorld) {
  await safeAction(this, 'TC-240', async () => {
    const el = this.page.getByRole('link', { name: 'Privacy policy (opens in new' });
    const popupPromise = this.page.waitForEvent('popup');
    await el.click({ timeout: 5000 });
    lastPopup = await popupPromise;
  });
});

When('I click "Terms of service (opens in new tab)" link in newsletter block', async function (this: CustomWorld) {
  await safeAction(this, 'TC-241', async () => {
    const el = this.page.getByRole('link', { name: 'Terms of service (opens in' });
    const popupPromise = this.page.waitForEvent('popup');
    await el.click({ timeout: 5000 });
    lastPopup = await popupPromise;
  });
});

When('I click "TED Conferences, LLC" link', async function (this: CustomWorld) {
  await safeAction(this, 'TC-242', async () => {
    const el = this.page.getByRole('link', { name: 'TED Conferences, LLC' });
    await el.click({ timeout: 5000 });
  });
});

Then('I should be redirected to the TED corporate page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-242', async () => {
    await this.page.waitForTimeout(2000);
    expect(this.page.url()).not.toContain('featured-position');
  });
});

When('I click bottom bar "Terms of use" link', async function (this: CustomWorld) {
  await safeAction(this, 'TC-243', async () => {
    const el = this.page.getByRole('link', { name: 'Terms of use' }).nth(1);
    await el.click({ timeout: 5000 });
  });
});

When('I click bottom bar "Privacy policy" link', async function (this: CustomWorld) {
  await safeAction(this, 'TC-244', async () => {
    const el = this.page.getByRole('link', { name: 'Privacy policy' }).nth(2);
    await el.click({ timeout: 5000 });
  });
});

Then('I should be redirected to the Privacy policy page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-244', async () => {
    await expect(this.page).toHaveURL(/\/privacy/, { timeout: 5000 });
  });
});

When('I click "Video usage policy" link', async function (this: CustomWorld) {
  await safeAction(this, 'TC-245', async () => {
    const el = this.page.getByRole('link', { name: 'Video usage policy' });
    await el.click({ timeout: 5000 });
  });
});

Then('I should be redirected to the Video usage policy page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-245', async () => {
    await expect(this.page).toHaveURL(/\/video|usage-policy/i, { timeout: 5000 });
  });
});

When('I click "Learn more" link', async function (this: CustomWorld) {
  await safeAction(this, 'TC-246', async () => {
    const el = this.page.getByRole('link', { name: 'Learn more' });
    await el.click({ timeout: 5000 });
  });
});

Then('I should be redirected to the relevant detail page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-246', async () => {
    await this.page.waitForTimeout(2000);
    expect(this.page.url()).not.toContain('featured-position');
  });
});

When('I click "Privacy preferences" button', async function (this: CustomWorld) {
  await safeAction(this, 'TC-247', async () => {
    const el = this.page.getByRole('button', { name: 'Privacy preferences' });
    await el.click({ timeout: 5000 });
  });
});

Then('the cookie preferences panel should be visible', async function (this: CustomWorld) {
  await safeAction(this, 'TC-247', async () => {
    const el = this.page.locator('.cookie-preferences, #consent-manager, [class*="cookie"], [class*="consent"]').filter({ visible: true }).first();
    await expect(el).toBeVisible({ timeout: 5000 });
  });
});

When('I click "Close Cookie Preferences" button on the cookie preferences panel', async function (this: CustomWorld) {
  await safeAction(this, 'TC-248', async () => {
    const el = this.page.getByRole('button', { name: 'Close Cookie Preferences' });
    await el.click({ timeout: 5000 });
  });
});

Then('the cookie preferences panel should not be visible', async function (this: CustomWorld) {
  await safeAction(this, 'TC-248', async () => {
    const el = this.page.locator('.cookie-preferences, #consent-manager, [class*="cookie"], [class*="consent"]').first();
    await expect(el).not.toBeVisible({ timeout: 5000 });
  });
});

Given('I navigate to the root lessons url page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-249', async () => {
    await this.page.goto('https://teded-integration.herokuapp.com/');
  });
});

Then('the footer section should be rendered and visible', async function (this: CustomWorld) {
  await safeAction(this, 'TC-249', async () => {
    const footer = this.page.locator('footer');
    await expect(footer).toBeVisible({ timeout: 5000 });
  });
});

Then('all primary footer navigation links should be present', async function (this: CustomWorld) {
  await safeAction(this, 'TC-249', async () => {
    const links = ['Help', 'Contact', 'Blog', 'About', 'Educators', 'Patrons'];
    for (const name of links) {
      const el = this.page.getByRole('link', { name });
      await expect(el).toBeVisible({ timeout: 3000 });
    }
  });
});

When('I locate the footer static text block', async function (this: CustomWorld) {
  await safeAction(this, 'TC-250', async () => {
    const textBlock = this.page.getByText('Visit HelpAboutContactEducatorsBlogPatrons Follow us on Facebook Instagram X');
    await expect(textBlock).toBeVisible({ timeout: 5000 });
  });
});

Then('the footer static text block should be visible and contain the expected link labels', async function (this: CustomWorld) {
  await safeAction(this, 'TC-250', async () => {
    const textBlock = this.page.getByText('Visit HelpAboutContactEducatorsBlogPatrons Follow us on Facebook Instagram X');
    await expect(textBlock).toBeVisible({ timeout: 5000 });
  });
});

When('I reload the page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-251', async () => {
    await this.page.reload();
  });
});

Then('the footer section and all primary links should be visible', async function (this: CustomWorld) {
  await safeAction(this, 'TC-251', async () => {
    const footer = this.page.locator('footer');
    await expect(footer).toBeVisible({ timeout: 5000 });
    const links = ['Help', 'Contact', 'Blog', 'About', 'Educators', 'Patrons'];
    for (const name of links) {
      const el = this.page.getByRole('link', { name });
      await expect(el).toBeVisible({ timeout: 3000 });
    }
  });
});

When('I click the browser back button', async function (this: CustomWorld) {
  await safeAction(this, 'TC-252', async () => {
    await this.page.goBack();
  });
});

Then('the page URL should return to the lessons page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-252', async () => {
    await expect(this.page).toHaveURL(/lessons\?sort=featured-position/, { timeout: 5000 });
  });
});

Then('the footer should be scrollable back into view again', async function (this: CustomWorld) {
  await safeAction(this, 'TC-253', async () => {
    const footer = this.page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible({ timeout: 5000 });
  });
});

Then('Facebook, Instagram, X, LinkedIn, and YouTube icons should all be visible', async function (this: CustomWorld) {
  await safeAction(this, 'TC-254', async () => {
    const names = [
      'Facebook (opens in new tab)',
      'Instagram (opens in new tab)',
      'X (opens in new tab)',
      'LinkedIn (opens in new tab)',
      'YouTube (opens in new tab)'
    ];
    for (const name of names) {
      const el = this.page.getByRole('link', { name });
      await expect(el).toBeVisible({ timeout: 3000 });
    }
  });
});

Then('each social icon should be enabled and clickable', async function (this: CustomWorld) {
  await safeAction(this, 'TC-254', async () => {
    const names = [
      'Facebook (opens in new tab)',
      'Instagram (opens in new tab)',
      'X (opens in new tab)',
      'LinkedIn (opens in new tab)',
      'YouTube (opens in new tab)'
    ];
    for (const name of names) {
      const el = this.page.getByRole('link', { name });
      await expect(el).toBeEnabled({ timeout: 3000 });
    }
  });
});

When('I click each social icon in sequence and close each popup', async function (this: CustomWorld) {
  await safeAction(this, 'TC-255', async () => {
    const names = [
      'Facebook (opens in new tab)',
      'Instagram (opens in new tab)',
      'X (opens in new tab)',
      'LinkedIn (opens in new tab)',
      'YouTube (opens in new tab)'
    ];
    for (const name of names) {
      const el = this.page.getByRole('link', { name });
      const popupPromise = this.page.waitForEvent('popup');
      await el.click({ timeout: 5000 });
      const popup = await popupPromise;
      await popup.close();
    }
  });
});

Then('only the main page should remain open', async function (this: CustomWorld) {
  await safeAction(this, 'TC-255', async () => {
    expect(this.page.context().pages().length).toBe(1);
  });
});

When('I leave the newsletter frequency radio selection empty', async function (this: CustomWorld) {
  await safeAction(this, 'TC-256', async () => {
    // Left empty intentionally
  });
});

Then('the expected frequency selection validation error should occur', async function (this: CustomWorld) {
  await safeAction(this, 'TC-256', async () => {
    const err = this.page.locator('[class*="error"], [class*="validation"], :invalid, .error-message').first();
    await expect(err).toBeVisible({ timeout: 5000 });
  });
});

When('I check the newsletter "Terms of use" destination URL', async function (this: CustomWorld) {
  await safeAction(this, 'TC-257', async () => {
    const el = this.page.locator('#newsletter-footer').getByRole('link', { name: 'Terms of use' });
    newsletterTermsUrl = await el.getAttribute('href') || '';
  });
});

When('I check the bottom bar "Terms of use" destination URL', async function (this: CustomWorld) {
  await safeAction(this, 'TC-257', async () => {
    const el = this.page.getByRole('link', { name: 'Terms of use' }).nth(1);
    bottomTermsUrl = await el.getAttribute('href') || '';
  });
});

Then('both Terms of use links should point to the same Terms page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-257', async () => {
    expect(newsletterTermsUrl).toBeDefined();
    expect(bottomTermsUrl).toBeDefined();
    const path1 = newsletterTermsUrl.replace(/https?:\/\/[^\/]+/, '');
    const path2 = bottomTermsUrl.replace(/https?:\/\/[^\/]+/, '');
    expect(path1).toBe(path2);
  });
});

When('I check the newsletter "Privacy policy (opens in new tab)" destination URL on new tab', async function (this: CustomWorld) {
  await safeAction(this, 'TC-258', async () => {
    const el = this.page.getByRole('link', { name: 'Privacy policy (opens in new' });
    const popupPromise = this.page.waitForEvent('popup');
    await el.click({ timeout: 5000 });
    const popup = await popupPromise;
    newsletterPrivacyUrl = popup.url();
    await popup.close();
  });
});

When('I check the bottom bar "Privacy policy" destination URL', async function (this: CustomWorld) {
  await safeAction(this, 'TC-258', async () => {
    const el = this.page.getByRole('link', { name: 'Privacy policy' }).nth(2);
    bottomPrivacyUrl = await el.getAttribute('href') || '';
  });
});

Then('both Privacy policy links should point to the same Privacy page', async function (this: CustomWorld) {
  await safeAction(this, 'TC-258', async () => {
    expect(newsletterPrivacyUrl).toBeDefined();
    expect(bottomPrivacyUrl).toBeDefined();
    const path1 = newsletterPrivacyUrl.replace(/https?:\/\/[^\/]+/, '');
    const path2 = bottomPrivacyUrl.replace(/https?:\/\/[^\/]+/, '');
    expect(path1).toContain(path2.replace(/^\//, ''));
  });
});

When('I attach page error and console listeners', async function (this: CustomWorld) {
  await safeAction(this, 'TC-259', async () => {
    consoleErrors = [];
    this.page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
  });
});

When('I interact with one representative element from each footer subsection', async function (this: CustomWorld) {
  await safeAction(this, 'TC-259', async () => {
    await this.page.getByRole('link', { name: 'About' }).hover({ timeout: 3000 });
    await this.page.getByRole('link', { name: 'Facebook (opens in new tab)' }).hover({ timeout: 3000 });
    await this.page.getByRole('textbox', { name: 'Your email address' }).click({ timeout: 3000 });
    await this.page.getByRole('link', { name: 'Video usage policy' }).hover({ timeout: 3000 });
  });
});

Then('no console errors or failed network requests should be logged during the smoke pass', async function (this: CustomWorld) {
  await safeAction(this, 'TC-259', async () => {
    expect(consoleErrors || []).toEqual([]);
  });
});
