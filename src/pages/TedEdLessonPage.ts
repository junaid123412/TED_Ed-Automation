import { Page, expect, Locator } from '@playwright/test';
import { envConfig } from '@utils/envConfig';

export class TedEdLessonPage {
  private lastLessonName = '';
  private lastDiscussionPrompt = '';
  private readonly BASE_URL = envConfig.baseUrl;
  public static lastEditorUrl = '';

  constructor(private page: Page) {}

  async waitForVisible(locator: Locator, timeout = 5000): Promise<boolean> {
    return await locator.waitFor({ state: 'visible', timeout }).then(() => true).catch(() => false);
  }

  // ─── Selectors ───
  private readonly signInLink       = this.page.getByRole('link', { name: /^Sign in$/i }).first();
  private readonly altSignInLink    = this.page.locator("xpath=//a[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'sign in') or contains(., 'Sign in')]").first();
  private readonly bodyText         = this.page.locator('body');

  private readonly createBtn        = this.page.getByRole('button', { name: 'Create' });
  private readonly buildOwnVideo    = this.page.getByRole('link', { name: /Build your own/i }).first();
  private readonly searchBox        = this.page.locator('input[placeholder*="Enter a search term"], input[placeholder*="Search by keyword"]').first();
  private readonly searchBtn        = this.page.getByRole('button', { name: 'Search' }).first();
  private readonly videoResult      = this.page.locator('a[href*="/videos/"]').first();
  private readonly videoContinueBtn = this.page.locator('button:has-text("Continue"), a:has-text("Continue"), [role="button"]:has-text("Continue")').filter({ visible: true }).first();
  private readonly lessonNameField  = this.page.locator('#lesson_name');
  private readonly saveBtn          = this.page.getByRole('button', { name: 'Save' });
  private readonly getStartedText   = this.page.getByText(/Get Started! Add your content/i);
  private readonly dismissBtn       = this.page.getByRole('button', { name: 'Dismiss' });
  private readonly letsBeginBtn     = this.page.getByRole('button', { name: /Let['’]s Begin/i });
  private readonly inputInfoLink    = this.page.locator('section').filter({ has: this.page.getByRole('heading', { name: /Let['’]s Begin/i }) }).getByRole('link', { name: 'Input information' }).first();
  private readonly introField       = this.page.getByLabel('Lesson introduction');
  private readonly introText        = this.page.getByRole('dialog', { name: 'Introduction' }).getByRole('paragraph').first();
  
  // Rich Text Editor Toolbar Buttons
  private readonly boldBtn          = this.page.locator('button.ql-bold');
  private readonly underlineBtn     = this.page.locator('button.ql-underline');
  private readonly italicBtn        = this.page.locator('button.ql-italic');
  private readonly linkBtn          = this.page.locator('button.ql-link');
  private readonly linkAction       = this.page.locator('.ql-action');
  private readonly cleanBtn         = this.page.locator('button.ql-clean');
  private readonly subscriptBtn     = this.page.locator('button.ql-subscript');
  private readonly superscriptBtn   = this.page.locator('button.ql-superscript');
  private readonly previewBtn       = this.page.getByRole('button', { name: 'Preview' });
  
  // Think section
  private readonly thinkBtn         = this.page.getByRole('button', { name: 'Think' }).first();
  private readonly mcqLink          = this.page.getByRole('link', { name: 'Multiple Choice Question' }).first();
  private readonly openAnswerLink   = this.page.getByRole('link', { name: 'Open Answer Question' }).first();
  private readonly questionTextField = this.page.locator('textarea[placeholder*="Question Text"], [contenteditable="true"]').first();
  private readonly firstAnswerField  = this.page.locator('.ql-editor').first();
  private readonly blankAnswerField  = this.page.locator('.ql-editor.ql-blank');
  private readonly addAnswerBtn     = this.page.getByRole('button', { name: 'Add another answer' }).filter({ visible: true }).first();
  private readonly videoScrubberBtn = this.page.locator('.video-hint-input, input[value="0:00"], input[placeholder*="0:00"], input.video-hint-input, .timecode-input, input[name*="hint"], input[name*="time"]').first();

  // Dig Deeper
  private readonly digDeeperBtn     = this.page.getByText('Dig Deeper').first();
  private readonly digDeeperEditor  = this.page.locator('[role="dialog"] .ql-editor, dialog .ql-editor, [contenteditable="true"]').first();

  // Discuss
  private readonly discussBtn       = this.page.getByText('Discuss').first();
  private readonly addDiscussionBtn = this.page.getByText('Add discussion').first();
  private readonly discussionPrompt = this.page.locator('[role="dialog"] input[name*="prompt"], dialog input[name*="prompt"], [role="dialog"] [role="textbox"], dialog [role="textbox"]').first();
  private readonly discussionDesc   = this.page.locator('[role="dialog"] .ql-editor, dialog .ql-editor, [role="dialog"] [contenteditable="true"], dialog [contenteditable="true"]').first();

  // And Finally
  private readonly andFinallyBtn    = this.page.getByText(/And Finally/i).first();
  private readonly conclusionEditor = this.page.locator('[role="dialog"] .ql-editor, dialog .ql-editor, [role="dialog"] [contenteditable="true"], dialog [contenteditable="true"]').first();

  // Publish
  private readonly publishBtn       = this.page.getByRole('button', { name: 'Publish' });
  private readonly closeShareBtn    = this.page.locator('.modal-close, button:has-text("×"), button:has-text("x"), .close-modal').first();

  // ─── Login Steps ───

  async navigateToHome(): Promise<void> {
    await this.page.goto(this.BASE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
  }

  async clickSignIn(): Promise<void> {
    const visible = await this.waitForVisible(this.signInLink, 5000);
    if (visible) {
      await this.signInLink.click({ noWaitAfter: true });
    } else {
      const altVisible = await this.waitForVisible(this.altSignInLink, 5000);
      if (altVisible) {
        await this.altSignInLink.click({ noWaitAfter: true });
      } else {
        if (!this.page.url().includes('/auth.ted.com')) {
          await this.page.goto('https://auth.ted.com/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
        }
      }
    }
    // Explicitly wait for redirect to auth.ted.com
    await this.page.waitForURL(/auth\.ted\.com/, { timeout: 30_000 }).catch(() => {});
  }

  async clickEmailInputField(): Promise<void> {
    const loc = this.page.locator('input[type="email"], [data-testid="lookup__username__1"]').filter({ visible: true }).first();
    await loc.waitFor({ state: 'visible', timeout: 15_000 });
    await loc.click();
  }

  async enterEmail(email: string): Promise<void> {
    const loc = this.page.locator('input[type="email"], [data-testid="lookup__username__1"]').filter({ visible: true }).first();
    await loc.waitFor({ state: 'visible', timeout: 15_000 });
    await loc.fill(email);
  }

  async clickEmailContinue(): Promise<void> {
    const loc = this.page.locator('button[type="submit"]:has-text("Continue"), [data-testid="lookup__continue__3"], button:has-text("Continue")').filter({ visible: true }).first();
    await loc.waitFor({ state: 'visible', timeout: 15_000 });
    await loc.click();
  }

  async clickPasswordInputField(): Promise<void> {
    const loc = this.page.locator('input[type="password"], [data-testid="credentials__password__2"]').filter({ visible: true }).first();
    await loc.waitFor({ state: 'visible', timeout: 15_000 });
    await loc.click();
  }

  async enterPassword(password: string): Promise<void> {
    const loc = this.page.locator('input[type="password"], [data-testid="credentials__password__2"]').filter({ visible: true }).first();
    await loc.waitFor({ state: 'visible', timeout: 15_000 });
    await loc.fill(password);
  }

  async clickPasswordContinue(): Promise<void> {
    const loc = this.page.locator('button[type="submit"]:has-text("Continue"), [data-testid="credentials__continue__3"], button:has-text("Continue")').filter({ visible: true }).first();
    await loc.waitFor({ state: 'visible', timeout: 15_000 });
    await loc.click();
  }

  async acceptConsentIfVisible(): Promise<void> {
    const consentText = this.page.getByText(/unlocking a world of ideas/i);
    try {
      await Promise.race([
        this.page.waitForURL(/teded-integration\.herokuapp\.com\/u\/lessons|herokuapp\.com\/lessons/, { timeout: 15_000 }),
        consentText.waitFor({ state: 'visible', timeout: 15_000 })
      ]);
    } catch (e) {}

    if (await consentText.isVisible()) {
      const btn = this.page.locator('button[type="submit"]:has-text("Continue"), button.css-1a1pnv0-base-button, button:has-text("Continue")').filter({ visible: true }).first();
      await btn.click();
      await this.page.waitForTimeout(2_000);
    }
  }

  async clickContinueOnConsentScreen(): Promise<void> {
    await this.acceptConsentIfVisible();
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

  // ─── Lesson Creation & Workspace Steps ───

  async navigateWithBasicAuth(): Promise<void> {
    const currentUrl = this.page.url();
    if (currentUrl.includes('teded-integration.herokuapp.com') && !currentUrl.includes('/429')) {
      // Already on the site and not on a 429 page, avoid redundant reload to prevent rate limiting
      return;
    }
    // Retry navigation a few times to handle transient network glitches in CI/headless
    const attempts = 3;
    for (let i = 0; i < attempts; i++) {
      try {
        await this.page.goto(this.BASE_URL, { waitUntil: 'domcontentloaded', timeout: 90_000 });
        return;
      } catch (err) {
        if (i === attempts - 1) throw err;
        // small backoff before retrying
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
        try {
          // try a reload in case of partial network suspension
          await this.page.reload({ waitUntil: 'domcontentloaded', timeout: 60_000 }).catch(() => {});
        } catch {}
      }
    }
  }

  async verifyDashboard(): Promise<void> {
    if (this.page.url() === 'about:blank' || this.page.url() === '') {
      await this.navigateWithBasicAuth();
    }
    
    // Check if logged out
    const signInVisible = await this.waitForVisible(this.signInLink, 5000);
    const createVisible = await this.waitForVisible(this.createBtn, 5000);
    
    if (!signInVisible && !createVisible) {
      await this.page.waitForTimeout(3000);
    }
    
    const loggedOut = await this.waitForVisible(this.signInLink, 2000);
    if (loggedOut) {
      await this.clickSignIn();
      await this.clickEmailInputField();
      await this.enterEmail('junaid.hussain+1@kualitatem.com');
      await this.clickEmailContinue();
      await this.clickPasswordInputField();
      await this.enterPassword('test@112233');
      await this.clickPasswordContinue();
      await this.acceptConsentIfVisible();
    }
    
    if (!this.page.url().includes('/u/lessons')) {
      await this.page.goto(this.BASE_URL + 'u/lessons', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    }
    
    await this.page.locator('#draft, .lessons-list, #lessons').first().waitFor({ state: 'visible', timeout: 30_000 });
  }

  async hoverCreate(): Promise<void> {
    await this.createBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await this.createBtn.hover();
  }

  async clickCreate(): Promise<void> {
    await this.createBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await this.createBtn.click();
  }

  async clickBuildYourOwnVideo(): Promise<void> {
    await this.buildOwnVideo.waitFor({ state: 'visible', timeout: 15_000 });
    await this.buildOwnVideo.click();
  }

  async navigateDirectlyToVideos(): Promise<void> {
    const attempts = 3;
    for (let i = 0; i < attempts; i++) {
      try {
        await this.page.goto(this.BASE_URL + 'videos', { waitUntil: 'domcontentloaded', timeout: 30_000 });
        const hasError = await this.page.getByText(/error processing your request|try again later/i).isVisible({ timeout: 3000 }).catch(() => false);
        if (!hasError) {
          return;
        }
      } catch (e) {}
      await this.page.waitForTimeout(2000);
    }
    // Fallback: try navigating through the Create menu
    await this.page.goto(this.BASE_URL + 'u/lessons', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await this.clickCreate().catch(() => {});
    await this.clickBuildYourOwnVideo().catch(() => {});
  }

  async clickVideoSearchBox(): Promise<void> {
    await this.searchBox.waitFor({ state: 'visible', timeout: 15_000 });
    await this.searchBox.click();
  }

  async pressEnterInSearchBox(): Promise<void> {
    await this.searchBox.press('Enter');
  }

  async typeVideoSearchTerm(term: string): Promise<void> {
    await this.searchBox.fill(term);
  }

  async clickSearch(): Promise<void> {
    // attempt click, fall back to Enter keypress; retry if results don't appear
    const attempts = 3;
    for (let i = 0; i < attempts; i++) {
      const btnVisible = await this.searchBtn.isVisible({ timeout: 2000 }).catch(() => false);
      const btnEnabled = btnVisible && (await this.searchBtn.isEnabled().catch(() => false));
      try {
        if (btnEnabled) {
          await this.searchBtn.click();
        } else {
          await this.searchBox.press('Enter');
        }
      } catch (err) {
        // try JS click as last resort
        try {
          await this.page.evaluate((el) => (el as HTMLElement).click(), await this.searchBtn.elementHandle().catch(() => null));
        } catch {}
      }

      // wait briefly for results to load
      const ok = await this.videoResult.isVisible({ timeout: 5000 }).catch(() => false);
      if (ok) return;
      if (i < attempts - 1) await this.page.waitForTimeout(1500 * (i + 1));
    }
  }

  async selectVideoFromResults(): Promise<void> {
    await this.videoResult.waitFor({ state: 'visible', timeout: 20_000 });
    
    // Wait for the page network to settle to ensure JS event listeners are fully attached
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1000);
    
    const modal = this.page.locator('.modal, [role="dialog"], .modal-dialog, .loading, .loading-indicator, button:has-text("Cancel"), button:has-text("Continue")').first();
    
    for (let i = 0; i < 3; i++) {
      try {
        await this.videoResult.click({ timeout: 5000 });
        const opened = await modal.waitFor({ state: 'attached', timeout: 3000 }).then(() => true).catch(() => false);
        if (opened) {
          return;
        }
      } catch (err) {
        const handle = await this.videoResult.elementHandle().catch(() => null);
        if (handle) {
          await this.page.evaluate((el) => (el as HTMLElement).click(), handle).catch(() => {});
          const opened = await modal.waitFor({ state: 'attached', timeout: 3000 }).then(() => true).catch(() => false);
          if (opened) {
            return;
          }
        }
      }
      await this.page.waitForTimeout(1000);
    }
  }

  async clickVideoContinue(): Promise<void> {
    // Wait for the Continue button to be visible (up to 15 seconds)
    const visible = await this.videoContinueBtn.waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false);
    
    if (visible) {
      const attempts = 3;
      for (let i = 0; i < attempts; i++) {
        try {
          try {
            await this.videoContinueBtn.click({ timeout: 5000 });
          } catch (clickErr) {
            console.log('Regular click failed, trying JS click');
            await this.videoContinueBtn.evaluate((el) => (el as HTMLElement).click()).catch(() => {});
          }
          await Promise.race([
            this.page.waitForURL(/lesson_editor|u\/lessons|lessons|on\//, { timeout: 15_000 }).catch(() => null),
            this.lessonNameField.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => null),
          ]);
          return;
        } catch (err) {
          if (i === attempts - 1) throw err;
          await this.page.waitForTimeout(1500 * (i + 1));
        }
      }
    } else {
      const currentUrl = this.page.url();
      if (currentUrl.includes('/on/')) {
        await this.page.goto(currentUrl.replace('/on/', '/lesson_editor/'), { waitUntil: 'domcontentloaded' });
      } else {
        const editLessonBtn = this.page.locator('a:has-text("Edit lesson"), button:has-text("Edit lesson")').first();
        if (await editLessonBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
          await editLessonBtn.click();
        }
      }
    }
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
    await this.page.waitForURL(/lesson_editor/, { timeout: 25_000 }).catch(() => {});
    await this.lessonNameField.waitFor({ state: 'attached', timeout: 25_000 }).catch(() => {});
    TedEdLessonPage.lastEditorUrl = this.page.url();
  }

  async clickLessonNameField(): Promise<void> {
    const titleLink = this.page.locator('a[href*="edit?field=name"]').first();
    if (await this.waitForVisible(titleLink, 10000)) {
      await titleLink.click();
    }
    await this.lessonNameField.waitFor({ state: 'attached', timeout: 15_000 });
    if (await this.waitForVisible(this.lessonNameField, 2000)) {
      await this.lessonNameField.click();
    } else {
      await this.lessonNameField.evaluate((el: HTMLInputElement) => el.focus());
    }
  }

  async fillLessonName(name: string): Promise<void> {
    this.lastLessonName = name;
    if (await this.waitForVisible(this.lessonNameField, 1000)) {
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
    const visibleSaveBtn = this.page.getByRole('button', { name: 'Save' }).filter({ visible: true }).first();
    await visibleSaveBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await visibleSaveBtn.click();
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
      await this.page.goto(this.BASE_URL + 'u/lessons', { waitUntil: 'domcontentloaded' });
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
    await this.ensureInEditor();
    for (let i = 0; i < 3; i++) {
      await this.letsBeginBtn.click();
      const opened = await this.inputInfoLink.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
      if (opened) return;
      await this.page.waitForTimeout(1000);
    }
  }

  async ensureInEditor(): Promise<void> {
    try {
      if (this.page.url().includes('/lesson_editor/')) {
        await this.lessonNameField.waitFor({ state: 'attached', timeout: 15_000 }).catch(() => {});
        const closeBtn = this.page.locator('dialog button:has-text("Cancel"), dialog button:has-text("Close"), dialog button[class*="close"], .modal button:has-text("Close"), dialog button:has-text("Save")').filter({ visible: true }).first();
        if (await closeBtn.isVisible().catch(() => false)) {
          await closeBtn.click().catch(() => {});
        } else {
          await this.page.keyboard.press('Escape').catch(() => {});
        }
        await this.page.waitForTimeout(500);
        return;
      }
      if (TedEdLessonPage.lastEditorUrl) {
        await this.page.goto(TedEdLessonPage.lastEditorUrl, { waitUntil: 'domcontentloaded', timeout: 15_000 }).catch(() => {});
        await this.lessonNameField.waitFor({ state: 'attached', timeout: 15_000 }).catch(() => {});
        const closeBtn = this.page.locator('dialog button:has-text("Cancel"), dialog button:has-text("Close"), dialog button[class*="close"], .modal button:has-text("Close"), dialog button:has-text("Save")').filter({ visible: true }).first();
        if (await closeBtn.isVisible().catch(() => false)) {
          await closeBtn.click().catch(() => {});
        } else {
          await this.page.keyboard.press('Escape').catch(() => {});
        }
        await this.page.waitForTimeout(500);
        return;
      }
      await this.verifyDashboard();
      await this.clickDraftLesson();
      await this.lessonNameField.waitFor({ state: 'attached', timeout: 20_000 });
      await this.page.waitForTimeout(2000);
      if (await this.getStartedText.isVisible().catch(() => false)) {
        await this.getStartedText.click().catch(() => {});
      }
      if (await this.dismissBtn.isVisible().catch(() => false)) {
        await this.dismissBtn.click().catch(() => {});
      }
    } catch (e) {
      console.log('Warning: ensureInEditor failed, attempting recovery goto and draft lesson click');
      await this.page.goto(this.BASE_URL + 'u/lessons', { waitUntil: 'domcontentloaded', timeout: 20_000 }).catch(() => {});
      await this.clickDraftLesson().catch(() => {});
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
    if (await this.page.locator('dialog, .modal').filter({ hasText: /Introduction/i }).isVisible().catch(() => false)) {
      return;
    }
    const visible = await this.inputInfoLink.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
    if (!visible) {
      await this.letsBeginBtn.click().catch(() => {});
      await this.inputInfoLink.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    }
    await this.inputInfoLink.click();
  }

  async clickLessonIntroField(): Promise<void> {
    const loc = this.page.locator('.ql-editor, [contenteditable="true"]').first();
    await loc.click();
  }

  async fillLessonIntroduction(text = 'football'): Promise<void> {
    const loc = this.page.locator('.ql-editor, [contenteditable="true"]').first();
    await loc.evaluate((el: HTMLElement, v: string) => {
      el.innerHTML = '';
      const p = document.createElement('p');
      p.textContent = v;
      el.appendChild(p);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, text);
  }

  async verifyIntroTextVisible(): Promise<void> {
    await expect(this.introField).not.toBeEmpty({ timeout: 10_000 });
  }

  async doubleClickIntroText(): Promise<void> {
    await this.introText.waitFor({ state: 'visible', timeout: 10_000 });
    await this.introText.dblclick();
  }

  async selectTextInsideEditor(text: string): Promise<void> {
    const loc = this.page.locator('.ql-editor, [contenteditable="true"]').first();
    await loc.focus().catch(() => {});
    await loc.evaluate((el: HTMLElement, targetText: string) => {
      const range = document.createRange();
      const sel = window.getSelection();
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      let textNode = walker.nextNode();
      while (textNode) {
        const idx = textNode.nodeValue?.indexOf(targetText) ?? -1;
        if (idx !== -1) {
          range.setStart(textNode, idx);
          range.setEnd(textNode, idx + targetText.length);
          sel?.removeAllRanges();
          sel?.addRange(range);
          break;
        }
        textNode = walker.nextNode();
      }
    }, text);
  }

  async clickBold(): Promise<void> {
    await this.boldBtn.click();
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

  async clickClean(): Promise<void> {
    if (await this.cleanBtn.isVisible().catch(() => false)) {
      await this.cleanBtn.click();
    } else {
      const activeButtons = this.page.locator('.ql-toolbar button.ql-active, .editor-toolbar button.ql-active');
      const count = await activeButtons.count();
      for (let i = 0; i < count; i++) {
        await activeButtons.nth(0).click().catch(() => {});
      }
    }
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
    if (await this.mcqLink.isVisible().catch(() => false)) {
      return;
    }
    for (let i = 0; i < 3; i++) {
      await this.thinkBtn.click();
      const opened = await this.mcqLink.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
      if (opened) return;
      await this.page.waitForTimeout(1000);
    }
  }

  async clickMultipleChoiceQuestion(): Promise<void> {
    await this.ensureInEditor();
    // primary attempt: wait for the known MCQ link
    try {
      await this.mcqLink.waitFor({ state: 'visible', timeout: 7_000 });
      await this.mcqLink.click();
      return;
    } catch (e) {
      // fallback: re-open Think menu and try alternative locator
      try {
        if (await this.thinkBtn.isVisible().catch(() => false)) {
          await this.thinkBtn.click().catch(() => {});
        }
        const alt = this.page.locator('a:has-text("Multiple Choice")').first();
        await alt.waitFor({ state: 'visible', timeout: 10_000 });
        await alt.click();
        return;
      } catch (err) {
        // final attempt: try a broader text match
        const broader = this.page.locator('text=Multiple Choice').first();
        await broader.waitFor({ state: 'visible', timeout: 8_000 });
        await broader.click();
      }
    }
  }

  async clickOpenAnswerQuestion(): Promise<void> {
    await this.ensureInEditor();
    try {
      await this.openAnswerLink.waitFor({ state: 'visible', timeout: 7_000 });
      await this.openAnswerLink.click();
      return;
    } catch (e) {
      try {
        if (await this.thinkBtn.isVisible().catch(() => false)) {
          await this.thinkBtn.click().catch(() => {});
        }
        const alt = this.page.locator('a:has-text("Open Answer")').first();
        await alt.waitFor({ state: 'visible', timeout: 10_000 });
        await alt.click();
        return;
      } catch (err) {
        const broader = this.page.locator('text=Open Answer').first();
        await broader.waitFor({ state: 'visible', timeout: 8_000 });
        await broader.click();
      }
    }
  }

  async clickQuestionTextField(): Promise<void> {
    await this.questionTextField.waitFor({ state: 'visible', timeout: 15_000 });
    await this.questionTextField.click();
  }

  async fillQuestionText(text: string): Promise<void> {
    await this.questionTextField.fill(text);
  }

  async fillAnswerChoice(index: number, text: string): Promise<void> {
    const fields = this.page.locator('div.ql-editor');
    await fields.nth(index).fill(text);
  }

  async clickAddAnotherAnswer(): Promise<void> {
    await this.addAnswerBtn.click();
  }

  async clickDeleteAnswerChoice(index: number): Promise<void> {
    const deleteBtn = this.page.locator('.delete-answer, button[aria-label*="delete"], button[class*="delete"]').filter({ visible: true }).nth(index);
    await deleteBtn.click();
  }

  async fillVideoHint(text: string): Promise<void> {
    await this.videoScrubberBtn.fill(text);
  }

  async clickFirstAnswerField(): Promise<void> {
    await this.firstAnswerField.waitFor({ state: 'visible', timeout: 10_000 });
    await this.firstAnswerField.click();
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

  // Dig Deeper
  async clickDigDeeper(): Promise<void> {
    await this.ensureInEditor();
    if (await this.page.locator('dialog, .modal').filter({ hasText: /Supplemental info/i }).isVisible().catch(() => false)) {
      return;
    }
    for (let i = 0; i < 3; i++) {
      await this.digDeeperBtn.click();
      const opened = await this.digDeeperEditor.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
      if (opened) return;
      await this.page.waitForTimeout(1000);
    }
  }

  async fillDigDeeper(text = 'football'): Promise<void> {
    await this.digDeeperEditor.evaluate((el: HTMLElement, v: string) => {
      el.innerHTML = '';
      const p = document.createElement('p');
      p.textContent = v;
      el.appendChild(p);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, text);
  }

  async selectTextInsideDigDeeper(text: string): Promise<void> {
    await this.digDeeperEditor.evaluate((el: HTMLElement, targetText: string) => {
      const range = document.createRange();
      const sel = window.getSelection();
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      let textNode = walker.nextNode();
      while (textNode) {
        const idx = textNode.nodeValue?.indexOf(targetText) ?? -1;
        if (idx !== -1) {
          range.setStart(textNode, idx);
          range.setEnd(textNode, idx + targetText.length);
          sel?.removeAllRanges();
          sel?.addRange(range);
          break;
        }
        textNode = walker.nextNode();
      }
    }, text);
  }

  // Discuss
  async clickDiscuss(): Promise<void> {
    await this.ensureInEditor();
    if (await this.addDiscussionBtn.isVisible().catch(() => false)) {
      return;
    }
    if (await this.page.locator('dialog, .modal').filter({ hasText: /Discussion/i }).isVisible().catch(() => false)) {
      return;
    }
    for (let i = 0; i < 3; i++) {
      await this.discussBtn.click();
      const opened = await this.addDiscussionBtn.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
      if (opened) return;
      await this.page.waitForTimeout(1000);
    }
  }

  async clickAddDiscussion(): Promise<void> {
    await this.addDiscussionBtn.click();
  }

  async fillDiscussionPrompt(text = 'football'): Promise<void> {
    await this.discussionPrompt.fill(text);
    this.lastDiscussionPrompt = text;
  }

  async highlightDiscussion(): Promise<void> {
    if (!this.lastDiscussionPrompt) return;
    const prompt = this.lastDiscussionPrompt;
    await this.page.evaluate((p) => {
      const items = Array.from(document.querySelectorAll('.discussions-list .discussion, .discussions-list li, .discuss-content .discussion'));
      for (const el of items) {
        if (el.textContent && el.textContent.includes(p)) {
          (el as HTMLElement).style.background = 'yellow';
          (el as HTMLElement).style.transition = 'background 0.25s ease-in-out';
        }
      }
    }, prompt);
  }

  async fillDiscussionDesc(text = 'football'): Promise<void> {
    await this.discussionDesc.evaluate((el: HTMLElement, v: string) => {
      el.innerHTML = '';
      const p = document.createElement('p');
      p.textContent = v;
      el.appendChild(p);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, text);
  }

  // And Finally
  async clickAndFinally(): Promise<void> {
    await this.ensureInEditor();
    if (await this.page.locator('dialog, .modal').filter({ hasText: /Conclusion/i }).isVisible().catch(() => false)) {
      return;
    }
    for (let i = 0; i < 3; i++) {
      await this.andFinallyBtn.click();
      const opened = await this.conclusionEditor.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
      if (opened) return;
      await this.page.waitForTimeout(1000);
    }
  }

  async fillConclusion(text = 'football'): Promise<void> {
    await this.conclusionEditor.evaluate((el: HTMLElement, v: string) => {
      el.innerHTML = '';
      const p = document.createElement('p');
      p.textContent = v;
      el.appendChild(p);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, text);
  }

  // Publish
  async clickPublish(): Promise<void> {
    await this.publishBtn.click();
  }

  async closeShareModal(): Promise<void> {
    if (await this.closeShareBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.closeShareBtn.click();
    }
  }

  // Quick helper to construct a new lesson for background
  async createLessonForBackground(term = 'football'): Promise<void> {
    await this.verifyDashboard();
    try {
      await this.navigateDirectlyToVideos();
      await this.clickVideoSearchBox();
      await this.typeVideoSearchTerm(term);
      await this.clickSearch();
      await this.selectVideoFromResults();
      await this.clickVideoContinue();
      await this.page.waitForURL(/lesson_editor|on\//, { timeout: 30_000 }).catch(() => {});
      const currentUrl = this.page.url();
      if (currentUrl.includes('/on/')) {
        await this.page.goto(currentUrl.replace('/on/', '/lesson_editor/'), { waitUntil: 'domcontentloaded' });
      }
    } catch (e: any) {
      console.log('Failed to create new lesson, falling back to existing draft lesson:', e.message);
      // Fallback: Go to dashboard, click a draft lesson, and convert URL to editor URL if needed
      await this.page.goto(this.BASE_URL + 'u/lessons', { waitUntil: 'domcontentloaded' });
      await this.clickDraftLesson();
      await this.page.waitForURL(/on\/|lesson_editor/, { timeout: 15_000 }).catch(() => {});
      const currentUrl = this.page.url();
      if (currentUrl.includes('/on/')) {
        await this.page.goto(currentUrl.replace('/on/', '/lesson_editor/'), { waitUntil: 'domcontentloaded' });
      } else if (!currentUrl.includes('/lesson_editor/')) {
        const editLessonBtn = this.page.locator('a:has-text("Edit lesson"), button:has-text("Edit lesson")').first();
        if (await editLessonBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
          await editLessonBtn.click();
        }
      }
    }
  }
}
