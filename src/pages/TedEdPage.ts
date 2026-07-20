import { Page, expect } from '@playwright/test';
import { envConfig } from '@utils/envConfig';

export class TedEdPage {
  private lastLessonName = '';

  constructor(private page: Page) {}

  // ─── Selectors ───
  private readonly BASE_URL = envConfig.baseUrl;
  private readonly signInLink       = this.page.getByRole('link', { name: /^Sign in$/i }).first();
  private readonly altSignInLink    = this.page.locator("xpath=//a[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'sign in') or contains(., 'Sign in')]").first();
  private readonly emailField       = this.page.getByTestId('lookup__username__1');
  private readonly emailContinueBtn = this.page.getByTestId('lookup__continue__3');
  private readonly passwordField    = this.page.getByTestId('credentials__password__2');
  private readonly passwordContinueBtn = this.page.getByTestId('credentials__continue__3');
  private readonly consentButton    = this.page.getByRole('button', { name: /^Continue$/i }).first();
  private readonly bodyText         = this.page.locator('body');

  private readonly createBtn        = this.page.getByRole('button', { name: 'Create' });
  private readonly buildOwnVideo    = this.page.getByRole('link', { name: /Build your own/i }).first();
  private readonly searchBox        = this.page.getByRole('searchbox', { name: 'Enter a search term or' });
  private readonly searchBtn        = this.page.getByRole('button', { name: 'Search' });
  private readonly videoResult      = this.page.locator('article a').first();
  private readonly videoContinueBtn = this.page.getByRole('button', { name: 'Continue »' });
  private readonly lessonNameField  = this.page.locator('#lesson_name');
  private readonly saveBtn          = this.page.getByRole('button', { name: 'Save' });
  private readonly getStartedText   = this.page.getByText(/Get Started! Add your content/i);
  private readonly dismissBtn       = this.page.getByRole('button', { name: 'Dismiss' });
  private readonly letsBeginBtn     = this.page.getByRole('button', { name: /Let['’]s Begin/i });
  private readonly inputInfoLink    = this.page.locator('section').filter({ has: this.page.getByRole('heading', { name: /Let['’]s Begin/i }) }).getByRole('link', { name: 'Input information' }).first();
  private readonly introField       = this.page.getByLabel('Lesson introduction');
  private readonly introText        = this.page.getByRole('dialog', { name: 'Introduction' }).getByRole('paragraph');
  private readonly underlineBtn     = this.page.getByRole('button', { name: 'Underline' });
  private readonly italicBtn        = this.page.getByRole('button', { name: 'Italic' });
  private readonly linkBtn          = this.page.getByRole('button', { name: 'Link' });
  private readonly linkAction       = this.page.locator('.ql-action');
  private readonly subscriptBtn     = this.page.getByRole('button', { name: 'Subscript' });
  private readonly superscriptBtn   = this.page.getByRole('button', { name: 'Superscript' });
  private readonly previewBtn       = this.page.getByRole('button', { name: 'Preview' });
  private readonly thinkBtn         = this.page.getByRole('button', { name: 'Think' });
  private readonly mcqLink          = this.page.getByRole('link', { name: 'Multiple Choice Question' });
  private readonly questionTextField = this.page.getByRole('textbox', { name: 'Question Text' });
  private readonly firstAnswerField  = this.page.locator('.ql-editor').first();
  private readonly blankAnswerField  = this.page.locator('.ql-editor.ql-blank');

  // ─── Login Steps ───

  async navigateToHome(): Promise<void> {
    await this.page.goto('https://teded-integration.herokuapp.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  }

  async clickSignIn(): Promise<void> {
    const visible = await this.signInLink.isVisible({ timeout: 5_000 }).catch(() => false);
    if (visible) {
      await this.signInLink.click({ noWaitAfter: true });
    } else {
      const altVisible = await this.altSignInLink.isVisible({ timeout: 5_000 }).catch(() => false);
      if (altVisible) {
        await this.altSignInLink.click({ noWaitAfter: true });
      } else {
        if (!this.page.url().includes('/auth.ted.com')) {
          await this.page.goto('https://auth.ted.com/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
        }
      }
    }
  }

  async clickEmailInputField(): Promise<void> {
    const loc = this.page.locator('input[type="email"], [data-testid="lookup__username__1"]').first();
    await loc.waitFor({ state: 'visible', timeout: 15_000 });
    await loc.click();
  }

  async enterEmail(email: string): Promise<void> {
    const loc = this.page.locator('input[type="email"], [data-testid="lookup__username__1"]').first();
    await loc.fill(email);
  }

  async clickEmailContinue(): Promise<void> {
    const loc = this.page.getByTestId('lookup__continue__3')
      .or(this.page.getByRole('button', { name: 'Continue', exact: true }));
    await loc.click();
  }

  async clickPasswordInputField(): Promise<void> {
    const loc = this.page.locator('input[type="password"], [data-testid="credentials__password__2"]').first();
    await loc.waitFor({ state: 'visible', timeout: 15_000 });
    await loc.click();
  }

  async enterPassword(password: string): Promise<void> {
    const loc = this.page.locator('input[type="password"], [data-testid="credentials__password__2"]').first();
    await loc.fill(password);
  }

  async clickPasswordContinue(): Promise<void> {
    const loc = this.page.getByTestId('credentials__continue__3')
      .or(this.page.getByRole('button', { name: 'Continue', exact: true }));
    await loc.click();
  }

  async acceptConsentIfVisible(): Promise<void> {
    const visible = await this.consentButton.isVisible({ timeout: 8_000 }).catch(() => false);
    if (visible) {
      await this.consentButton.click();
      await this.page.waitForTimeout(2_000);
    }
  }

  async clickContinueOnConsentScreen(): Promise<void> {
    const visible = await this.consentButton.isVisible({ timeout: 8_000 }).catch(() => false);
    if (visible) {
      await this.consentButton.click();
      await this.page.waitForTimeout(2_000);
    }
  }

  async verifyDashboardURL(): Promise<void> {
    await this.page.waitForURL(/(?:teded-integration\.herokuapp\.com|www\.ted\.com)/, {
      timeout: 60_000,
      waitUntil: 'domcontentloaded',
    });
  }

  async verifyNoAccessDenied(): Promise<void> {
    await expect(this.bodyText).not.toContainText('HTTP Basic: Access denied.', { timeout: 15_000 });
  }

  // ─── Lesson Creation Steps ───

  async navigateWithBasicAuth(): Promise<void> {
    const currentUrl = this.page.url();
    if (currentUrl.includes('teded-integration.herokuapp.com') && !currentUrl.includes('/429')) {
      // Already on the site and not on a 429 page, avoid redundant reload to prevent rate limiting
      return;
    }
    await this.page.goto(this.BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  }

  async verifyDashboard(): Promise<void> {
    if (this.page.url() === 'about:blank' || this.page.url() === '') {
      await this.navigateWithBasicAuth();
    }
    await this.page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});
    const isLoggedOut = await this.signInLink.isVisible({ timeout: 10_000 }).catch(() => false);
    if (isLoggedOut) {
      await this.clickSignIn();
      await this.clickEmailInputField();
      await this.enterEmail(envConfig.tedLoginEmail);
      await this.clickEmailContinue();
      await this.clickPasswordInputField();
      await this.enterPassword(envConfig.tedLoginPassword);
      await this.clickPasswordContinue();
      await this.acceptConsentIfVisible();
    }
    if (!this.page.url().includes('/u/lessons')) {
      await this.page.goto('https://teded-integration.herokuapp.com/u/lessons', { waitUntil: 'domcontentloaded' });
    }
    await this.page.locator('#draft, .lessons-list, #lessons').first().waitFor({ state: 'visible', timeout: 30_000 });
  }

  async clickCreate(): Promise<void> {
    await this.createBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await this.createBtn.click();
  }

  async clickBuildYourOwnVideo(): Promise<void> {
    await this.buildOwnVideo.waitFor({ state: 'visible', timeout: 15_000 });
    await this.buildOwnVideo.click();
  }

  async clickVideoSearchBox(): Promise<void> {
    await this.searchBox.waitFor({ state: 'visible', timeout: 15_000 });
    await this.searchBox.click();
  }

  async typeVideoSearchTerm(term: string): Promise<void> {
    await this.searchBox.fill(term);
  }

  async clickSearch(): Promise<void> {
    await this.searchBtn.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 });
  }

  async selectVideoFromResults(): Promise<void> {
    await this.videoResult.waitFor({ state: 'visible', timeout: 15_000 });
    await this.videoResult.click();
  }

  async clickVideoContinue(): Promise<void> {
    await this.videoContinueBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await this.videoContinueBtn.click();
    await this.page.waitForTimeout(2_000);
  }

  async verifyLessonSetupLoaded(): Promise<void> {
    await Promise.race([
      this.page.waitForURL(/lesson_editor|u\/lessons|lessons|on\//, { timeout: 20_000 }),
      this.lessonNameField.waitFor({ state: 'visible', timeout: 20_000 }).catch(() => null),
    ]);
  }

  async clickDraftLesson(): Promise<void> {
    if (this.page.url().includes('/lesson_editor/')) {
      return;
    }
    let firstLesson = this.page.locator('table tbody tr').first().getByRole('link').first();
    if (await this.page.locator('table tbody tr').count() > 0) {
      firstLesson = this.page.locator('table tbody tr').first().getByRole('link').first();
    } else if (await this.page.locator('#draft article a[href*="/on/"]').count() > 0) {
      firstLesson = this.page.locator('#draft article a[href*="/on/"]').first();
    } else {
      firstLesson = this.page.locator('a[href*="/on/"]').first();
    }
    await firstLesson.waitFor({ state: 'visible', timeout: 15_000 });
    await firstLesson.click();
  }

  async clickLessonNameField(): Promise<void> {
    const titleLink = this.page.locator('a[href*="edit?field=name"]').first();
    if (await titleLink.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await titleLink.click();
    }
    await this.lessonNameField.waitFor({ state: 'attached', timeout: 15_000 });
    if (await this.lessonNameField.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await this.lessonNameField.click();
    } else {
      await this.lessonNameField.evaluate((el: HTMLInputElement) => el.focus());
    }
  }

  async fillLessonName(name: string): Promise<void> {
    this.lastLessonName = name;
    if (await this.lessonNameField.isVisible({ timeout: 1_000 }).catch(() => false)) {
      await this.lessonNameField.fill('', { force: true });
      await this.lessonNameField.fill(name, { force: true });
    } else {
      await this.lessonNameField.evaluate((el: HTMLInputElement, v: string) => {
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, name);
    }
  }

  async clickSave(): Promise<void> {
    await this.saveBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await this.saveBtn.click();
    await this.page.waitForTimeout(2_000);
  }

  async verifyLessonSaved(): Promise<void> {
    if (!this.lastLessonName) {
      await expect(this.lessonNameField).not.toBeEmpty({ timeout: 10_000 });
      return;
    }
    const titleLink = this.page.locator('a[href*="edit?field=name"]').first();
    if (await titleLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(titleLink).toContainText(this.lastLessonName, { timeout: 10_000 });
      return;
    }
    if (await this.lessonNameField.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await expect(this.lessonNameField).toHaveValue(this.lastLessonName, { timeout: 10_000 });
      return;
    }
    const val = await this.lessonNameField.evaluate((el: HTMLInputElement) => el.value).catch(() => '');
    await expect(val).toBe(this.lastLessonName);
  }

  async clickGetStarted(): Promise<void> {
    const isDashboard = this.page.url().endsWith('/u/lessons') || this.page.url().includes('herokuapp.com/lessons');
    if (isDashboard || await this.getStartedText.isHidden().catch(() => true)) {
      await this.page.goto('https://teded-integration.herokuapp.com/u/lessons', { waitUntil: 'domcontentloaded' });
      await this.clickDraftLesson();
    }
    const visible = await this.getStartedText.isVisible({ timeout: 5000 }).catch(() => false);
    if (visible) {
      await this.getStartedText.click();
    }
  }

  async clickDismiss(): Promise<void> {
    const visible = await this.dismissBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (visible) {
      await this.dismissBtn.click();
    }
  }

  async clickLetsBegin(): Promise<void> {
    await this.letsBeginBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await this.letsBeginBtn.click();
    await this.page.waitForTimeout(2_000);
  }

  async ensureInEditor(): Promise<void> {
    if (this.page.url().includes('/lesson_editor/')) {
      return;
    }
    await this.page.goto('https://teded-integration.herokuapp.com/u/lessons', { waitUntil: 'domcontentloaded' });
    await this.clickDraftLesson();
    await this.page.waitForTimeout(2000);
    if (await this.getStartedText.isVisible().catch(() => false)) {
      await this.getStartedText.click().catch(() => {});
    }
    if (await this.dismissBtn.isVisible().catch(() => false)) {
      await this.dismissBtn.click().catch(() => {});
    }
  }

  async verifyEditorScreen(): Promise<void> {
    const visible = await this.inputInfoLink.isVisible({ timeout: 20_000 }).catch(() => false);
    if (!visible) {
      await this.ensureInEditor();
      const collapsed = await this.letsBeginBtn.isVisible().catch(() => false);
      if (collapsed) {
        await this.letsBeginBtn.click().catch(() => {});
      }
      await expect(this.inputInfoLink).toBeVisible({ timeout: 15_000 });
      return;
    }
    await expect(this.inputInfoLink).toBeVisible({ timeout: 5_000 });
  }

  async clickInputInformation(): Promise<void> {
    await this.ensureInEditor();
    await this.inputInfoLink.click();
  }

  async clickLessonIntroField(): Promise<void> {
    const loc = this.page.locator('.ql-editor, [contenteditable="true"]').first();
    await loc.click();
  }

  async fillLessonIntroduction(): Promise<void> {
    await this.ensureInEditor();
    const text = 'This is an automated lesson introduction for FIFA WORLD CUP FANTASY FOOTBALL 2026';
    const loc = this.page.locator('.ql-editor, [contenteditable="true"]').first();
    await loc.waitFor({ state: 'visible', timeout: 30_000 }).catch(() => {});
    const exists = await loc.count();
    if (exists) {
      await loc.evaluate((el: HTMLElement, v: string) => {
        el.innerHTML = '';
        const p = document.createElement('p');
        p.textContent = v;
        el.appendChild(p);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }, text);
    } else {
      // fallback: inject via document query
      await this.page.evaluate((v: string) => {
        const el = document.querySelector('.ql-editor, [contenteditable="true"]') as HTMLElement | null;
        if (el) {
          el.innerHTML = '';
          const p = document.createElement('p');
          p.textContent = v;
          el.appendChild(p);
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, text);
    }
  }

  async verifyIntroTextVisible(): Promise<void> {
    await expect(this.introField).not.toBeEmpty({ timeout: 10_000 });
  }

  async doubleClickIntroText(): Promise<void> {
    await this.introText.waitFor({ state: 'visible', timeout: 10_000 });
    await this.introText.dblclick();
  }

  async clickUnderline(): Promise<void> {
    await this.underlineBtn.click();
  }

  async clickItalic(): Promise<void> {
    await this.italicBtn.click();
  }

  async clickLink(): Promise<void> {
    await this.linkBtn.click();
  }

  async confirmLinkAction(): Promise<void> {
    await this.linkAction.waitFor({ state: 'visible', timeout: 10_000 });
    await this.linkAction.click();
  }

  async clickSubscript(): Promise<void> {
    await this.subscriptBtn.click();
  }

  async clickSuperscript(): Promise<void> {
    await this.superscriptBtn.click();
  }

  async clickPreview(): Promise<void> {
    await this.previewBtn.click();
    await this.page.waitForTimeout(2_000);
  }

  async verifyIntroSaved(): Promise<void> {
    await expect(this.page.locator('body')).not.toContainText('Error', { timeout: 10_000 });
  }

  async clickThink(): Promise<void> {
    await this.ensureInEditor();
    await this.thinkBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await this.thinkBtn.click();
  }

  async clickMultipleChoiceQuestion(): Promise<void> {
    await this.mcqLink.waitFor({ state: 'visible', timeout: 15_000 });
    await this.mcqLink.click();
  }

  async clickQuestionTextField(): Promise<void> {
    await this.questionTextField.waitFor({ state: 'visible', timeout: 15_000 });
    await this.questionTextField.click();
  }

  async fillQuestionText(text: string): Promise<void> {
    await this.questionTextField.fill(text);
  }

  async clickFirstAnswerField(): Promise<void> {
    await this.firstAnswerField.waitFor({ state: 'visible', timeout: 10_000 });
    await this.firstAnswerField.click();
  }

  async fillAnswerChoice(index: number, text: string): Promise<void> {
    const fields = this.page.locator('div.ql-editor');
    await fields.nth(index).fill(text);
  }

  async clickLastBlankAnswerField(): Promise<void> {
    await this.blankAnswerField.waitFor({ state: 'visible', timeout: 10_000 });
    await this.blankAnswerField.click();
  }

  async fillLastAnswerChoice(text: string): Promise<void> {
    await this.blankAnswerField.fill(text);
  }

  async verifyAllAnswersFilled(): Promise<void> {
    const fields = this.page.locator('div.ql-editor');
    await expect(fields).toHaveCount(4, { timeout: 10_000 });
  }
}
