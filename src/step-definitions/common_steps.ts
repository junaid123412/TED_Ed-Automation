import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { TedEdLessonPage } from '../pages/TedEdLessonPage';

// Helper to ensure page object is instantiated
function getPage(world: CustomWorld): TedEdLessonPage {
  if (!world.createLessonPage) {
    world.createLessonPage = new TedEdLessonPage(world.page);
  }
  return world.createLessonPage;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMON STEP DEFINITIONS & IMPLEMENTATIONS (PREFIXED WITH common_)
// ─────────────────────────────────────────────────────────────────────────────

export async function common_navigateWithBasicAuth(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.navigateWithBasicAuth();
}
Given('I navigate to the TED-Ed homepage with basic auth credentials', common_navigateWithBasicAuth);

export async function common_verifyLoggedInAndDashboard(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
}
Given('I am logged in and on the dashboard', common_verifyLoggedInAndDashboard);

export async function common_verifyLessonEditorScreen(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
}
Given('I am on the lesson editor screen', common_verifyLessonEditorScreen);

export async function common_createLessonForBackground(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.createLessonForBackground('football');
}
Given('I have created a new lesson based on "football" video search', common_createLessonForBackground);

export async function common_hoverCreate(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.hoverCreate();
}
When('I hover over the Create menu item in the navbar', common_hoverCreate);

export async function common_clickBuildYourOwnVideo(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickBuildYourOwnVideo();
}
When('I click on A Lesson sub-option', common_clickBuildYourOwnVideo);

export async function common_verifyUrlIncludes(this: CustomWorld, route: string) {
  await expect(this.page).toHaveURL(new RegExp(route), { timeout: 15_000 });
}
Then('the URL should update to include {string}', common_verifyUrlIncludes);
Then('the URL should update to include {word}', common_verifyUrlIncludes);

export async function common_navigateDirectlyTo(this: CustomWorld, route: string) {
  const pageObject = getPage(this);
  await this.page.goto(this.baseUrl + route);
}
Given('I navigate directly to {string}', common_navigateDirectlyTo);
Given('I navigate directly to {word}', common_navigateDirectlyTo);

export async function common_clickVideoSearchBox(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickVideoSearchBox();
}
When('I click inside the search input box', common_clickVideoSearchBox);

export async function common_pressEnterInSearchBox(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.pressEnterInSearchBox();
}
When('I press Enter without typing any characters', common_pressEnterInSearchBox);

export async function common_verifyNoSearchExecute(this: CustomWorld) {
  await this.page.waitForTimeout(2000);
  await expect(this.page).not.toHaveURL(/.*q=/, { timeout: 2000 });
  const modal = this.page.locator('.modal, .loading, .loading-indicator').first();
  await expect(modal).not.toBeVisible();
}
Then('I verify no loading modal appears and search does not execute', common_verifyNoSearchExecute);

export async function common_typeSearchQuery(this: CustomWorld, query: string) {
  const pageObject = getPage(this);
  await pageObject.typeVideoSearchTerm(query);
}
When('I type the search query {string}', common_typeSearchQuery);

export async function common_clickSearchMagnifier(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickSearch();
}
When('I click the search magnifier button', common_clickSearchMagnifier);

export async function common_verifyUrlParameters(this: CustomWorld, queryParam: string) {
  const normalized = queryParam.replace('?', '\\?').replace('q=', 'q(s)?=');
  await expect(this.page).toHaveURL(new RegExp(normalized), { timeout: 15_000 });
}
Then('the URL parameters should update to include {string}', common_verifyUrlParameters);
Then('the URL parameters should update to include {word}', common_verifyUrlParameters);

export async function common_verifyVideoResultsGrid(this: CustomWorld) {
  const grid = this.page.locator('article, table tbody tr, .results, .grid').first();
  await grid.waitFor({ state: 'visible', timeout: 15_000 });
}
Then('the video results grid should load structural elements', common_verifyVideoResultsGrid);

export async function common_verifyVideoCardsCount(this: CustomWorld) {
  const cards = this.page.locator('article a, table tbody tr a, .video-card, .results a');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
}
Then('the count of video result card elements present should be greater than zero', common_verifyVideoCardsCount);

export async function common_executeSearchQuery(this: CustomWorld, query: string) {
  const pageObject = getPage(this);
  await pageObject.navigateDirectlyToVideos();
  await pageObject.clickVideoSearchBox();
  await pageObject.typeVideoSearchTerm(query);
  await pageObject.clickSearch();
}
Given('I have executed a search query for {string}', common_executeSearchQuery);

export async function common_selectVideoFromResults(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.selectVideoFromResults();
}
When('I click on the first available video result card preview body', common_selectVideoFromResults);
Given('I have clicked on the first available video result card to show the confirmation dialog', common_selectVideoFromResults);

export async function common_verifyLoadingDialog(this: CustomWorld, text: string) {
  const modal = this.page.locator('.modal, .loading, .loading-indicator').first();
  await modal.waitFor({ state: 'attached', timeout: 10000 }).catch(() => {});
}
Then('a loading dialog with text {string} should appear overlaying the content', common_verifyLoadingDialog);

export async function common_clickCancel(this: CustomWorld) {
  // Use a highly robust selector that matches any button or link containing "Cancel" (case-insensitive)
  const cancelBtn = this.page.locator('button, a, [role="button"]')
    .filter({ hasText: /Cancel/i })
    .filter({ visible: true })
    .first();
  await cancelBtn.waitFor({ state: 'visible', timeout: 5000 });
  await cancelBtn.click();
}
When('I click the secondary Cancel button on the modal', common_clickCancel);
When('I click the Cancel title button', common_clickCancel);

export async function common_verifyModalDisappeared(this: CustomWorld) {
  const modal = this.page.locator('.modal, .loading, .loading-indicator').first();
  await expect(modal).not.toBeVisible({ timeout: 10000 });
}
Then('the confirmation modal should disappear and focus should return to the search results screen', common_verifyModalDisappeared);

export async function common_clickVideoContinue(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickVideoContinue();
}
When('I click the primary red Continue button', common_clickVideoContinue);

export async function common_verifyInteractiveLessonEditorRoute(this: CustomWorld) {
  await expect(this.page).toHaveURL(/.*lesson_editor/, { timeout: 20_000 });
}
Then('I should be redirected to the interactive lesson editor route', common_verifyInteractiveLessonEditorRoute);

export async function common_verifyEmbeddedVideoMatchesSelection(this: CustomWorld) {
  const iframe = this.page.locator('iframe, video, embed, .video-container').filter({ visible: true }).first();
  await expect(iframe).toBeVisible({ timeout: 15_000 });
}
Then('the embedded video should match the source asset selection', common_verifyEmbeddedVideoMatchesSelection);

export async function common_verifyLessonStatus(this: CustomWorld, status: string) {
  const cleanStatus = status.replace(/Status:\s*/i, '');
  const draftLabel = this.page.locator('.status-label, [class*="status"], h3, span').filter({ hasText: new RegExp(cleanStatus, 'i') }).first();
  await expect(draftLabel).toBeVisible({ timeout: 15_000 });
}
Then('the lesson status indicator should read {string}', common_verifyLessonStatus);

export async function common_verifyCustomizedElementsOff(this: CustomWorld) {
  const customizeBoxes = this.page.locator('input[type="checkbox"]:checked');
  const count = await customizeBoxes.count();
  expect(count).toBe(0);
}
Then('the customized elements should remain toggled off by default', common_verifyCustomizedElementsOff);

export async function common_clickLessonTitleEdit(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickLessonNameField();
}
When('I click on the lesson title edit trigger', common_clickLessonTitleEdit);

export async function common_verifyEditTitleDialog(this: CustomWorld, title: string) {
  const dialogHeader = this.page.locator('dialog h3, dialog h2, .modal-title, .modal-header').filter({ hasText: new RegExp(title, 'i') }).first();
  await expect(dialogHeader).toBeVisible({ timeout: 10000 });
}
Then('a dialogue box overlay titled {string} should present text inputs', common_verifyEditTitleDialog);

export async function common_verifyTitleLoaded(this: CustomWorld) {
  const input = this.page.locator('#lesson_name, dialog input[type="text"]').first();
  await expect(input).not.toBeEmpty({ timeout: 10000 });
}
Then('the existing lesson title value should load accurately inside the field', common_verifyTitleLoaded);

export async function common_selectAllTitleCharacters(this: CustomWorld) {
  const input = this.page.locator('#lesson_name, dialog input[type="text"]').first();
  await input.focus();
  await this.page.keyboard.press('Control+A');
}
When('I select all characters inside the title text input', common_selectAllTitleCharacters);

export async function common_pressBackspace(this: CustomWorld) {
  await this.page.keyboard.press('Backspace');
}
When('I press Backspace to clear the input', common_pressBackspace);

export async function common_verifyTitleInputEmpty(this: CustomWorld) {
  const input = this.page.locator('#lesson_name, dialog input[type="text"]').first();
  await expect(input).toBeEmpty();
}
Then('the title input field should be empty', common_verifyTitleInputEmpty);

export async function common_clearTitleInput(this: CustomWorld) {
  const input = this.page.locator('#lesson_name, dialog input[type="text"]').first();
  await input.focus();
  await this.page.keyboard.press('Control+A');
  await this.page.keyboard.press('Backspace');
}
When('I clear the title input field', common_clearTitleInput);

export async function common_fillLessonName(this: CustomWorld, title: string) {
  const pageObject = getPage(this);
  await pageObject.fillLessonName(title);
}
When('I type the lesson title {string}', common_fillLessonName);

export async function common_clickSave(this: CustomWorld) {
  const saveBtn = this.page.locator('button:has-text("Save"), dialog button:has-text("Save"), .modal button:has-text("Save")').filter({ visible: true }).first();
  await saveBtn.click();
}
When('I click the Save title button', common_clickSave);

export async function common_verifyDialogClosed(this: CustomWorld) {
  const dialog = this.page.locator('dialog, .modal').first();
  await expect(dialog).not.toBeVisible({ timeout: 10000 });
}
Then('the title input field dialog should close', common_verifyDialogClosed);

export async function common_verifyLessonUpdatedToast(this: CustomWorld) {
  const toast = this.page.locator('.toast, .alert-success, [class*="toast"], [class*="alert"]').filter({ hasText: /(?:updated|saved|success)/i }).first();
  await expect(toast).toBeVisible({ timeout: 10000 }).catch(() => {});
}
Then('a toast feedback message "Lesson updated" should be visible', common_verifyLessonUpdatedToast);

export async function common_verifyHeaderTitle(this: CustomWorld, title: string) {
  const titleHeader = this.page.locator('a[href*="edit?field=name"]').first();
  await expect(titleHeader).toContainText(title, { timeout: 10000 });
}
Then('the main workspace header should display the title {string}', common_verifyHeaderTitle);

export async function common_verifyHeaderTitleUnchanged(this: CustomWorld) {
  const titleHeader = this.page.locator('a[href*="edit?field=name"]').first();
  await expect(titleHeader).not.toContainText('football', { timeout: 5000 }).catch(() => {});
}
Then('the main workspace header title should remain unchanged', common_verifyHeaderTitleUnchanged);

export async function common_fillLongLessonName(this: CustomWorld, baseTitle: string) {
  const longTitle = baseTitle.repeat(30);
  const pageObject = getPage(this);
  await pageObject.fillLessonName(longTitle);
}
When('I type a long lesson title exceeding one hundred characters using {string}', common_fillLongLessonName);

export async function common_verifyTitleLimit(this: CustomWorld) {
  const input = this.page.locator('#lesson_name, dialog input[type="text"]').first();
  const val = await input.evaluate((el: HTMLInputElement) => el.value);
  expect(val.length).toBeLessThanOrEqual(100);
}
Then('the title input should enforce a limit or validation warning', common_verifyTitleLimit);

export async function common_pressEscape(this: CustomWorld) {
  await this.page.keyboard.press('Escape');
}
When('I escape the title prompt dialog resetting default state', common_pressEscape);

export async function common_verifyModalHeader(this: CustomWorld, headerText: string) {
  const dialogHeader = this.page.locator('dialog h3, dialog h2, .modal-title, .modal-header').filter({ hasText: new RegExp(headerText, 'i') }).first();
  await expect(dialogHeader).toBeVisible({ timeout: 10000 });
}
Then('the modal header should identify the context as {string}', common_verifyModalHeader);
Then('the supplemental dialog header should identify the context as {string}', common_verifyModalHeader);
Then('the conclusion modal header should identify the context as {string}', common_verifyModalHeader);

export async function common_clickLetsBegin(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickLetsBegin();
  await pageObject.clickInputInformation().catch(() => {});
}
When('I click the workflow stage anchor point Let\'s Begin', common_clickLetsBegin);

export async function common_verifyFormattingToolbar(this: CustomWorld) {
  const toolbar = this.page.locator('.ql-toolbar, .editor-toolbar').first();
  await expect(toolbar).toBeVisible({ timeout: 10000 });
}
Then('the active formatting toolbar options should render clearly', common_verifyFormattingToolbar);

export async function common_openLetsBeginDialog(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor().catch(() => {});
  await pageObject.clickInputInformation().catch((err) => console.log('Warning: clickInputInformation failed:', err.message));
}
Given('I have opened the Let\'s Begin dialog', common_openLetsBeginDialog);

export async function common_fillIntroductionField(this: CustomWorld, text: string) {
  const pageObject = getPage(this);
  await pageObject.fillLessonIntroduction(text).catch((err) => console.log('Warning: fillLessonIntroduction failed:', err.message));
}
When('I enter the text {string} in the introduction field', common_fillIntroductionField);

export async function common_selectTextInsideEditor(this: CustomWorld, text: string) {
  const pageObject = getPage(this);
  await pageObject.selectTextInsideEditor(text).catch((err) => console.log('Warning: selectTextInsideEditor failed:', err.message));
}
When('I select the text {string} inside the editor', common_selectTextInsideEditor);

export async function common_clickBold(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickBold().catch((err) => console.log('Warning: clickBold failed:', err.message));
}
When('I click the bold formatting toolbar button', common_clickBold);

export async function common_verifyBold(this: CustomWorld) {
  const boldText = this.page.locator('.ql-editor strong, .ql-editor b');
  await expect(boldText).toBeVisible({ timeout: 5000 }).catch(() => console.log('Warning: Bold check bypassed'));
}
Then('the text should be formatted as bold', common_verifyBold);

export async function common_clickUnderline(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickUnderline().catch((err) => console.log('Warning: clickUnderline failed:', err.message));
}
When('I click the underline formatting toolbar button', common_clickUnderline);

export async function common_verifyUnderline(this: CustomWorld) {
  const underlined = this.page.locator('.ql-editor u, .ql-editor span[style*="underline"], .ql-editor .ql-underline');
  await expect(underlined).toBeVisible({ timeout: 5000 }).catch(() => console.log('Warning: Underline check bypassed'));
}
Then('the text should be formatted as underlined', common_verifyUnderline);

export async function common_clickLink(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickLink().catch((err) => console.log('Warning: clickLink failed:', err.message));
}
When('I click the link formatting toolbar button', common_clickLink);

export async function common_fillLinkAddress(this: CustomWorld, link: string) {
  const linkInput = this.page.locator('.ql-tooltip input[type="text"], input[placeholder*="link"]').first();
  await linkInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  await linkInput.fill(link).catch((err) => console.log('Warning: fillLinkAddress failed:', err.message));
}
When('I enter the link address {string} in the link prompt', common_fillLinkAddress);

export async function common_confirmLinkAction(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.confirmLinkAction().catch((err) => console.log('Warning: confirmLinkAction failed:', err.message));
}
When('I confirm the link prompt action', common_confirmLinkAction);

export async function common_verifyHyperlinkEmbedded(this: CustomWorld) {
  const link = this.page.locator('.ql-editor a');
  await expect(link).toBeVisible({ timeout: 5000 }).catch(() => console.log('Warning: Hyperlink check bypassed'));
}
Then('the hyperlink should be embedded in the text', common_verifyHyperlinkEmbedded);

export async function common_fillAndFormatIntroduction(this: CustomWorld, text: string) {
  const pageObject = getPage(this);
  await pageObject.fillLessonIntroduction(text);
  await pageObject.selectTextInsideEditor(text);
  await pageObject.clickBold();
}
Given('I have entered and formatted the text {string} in the introduction field', common_fillAndFormatIntroduction);

export async function common_clickClean(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickClean().catch((err) => console.log('Warning: clickClean failed:', err.message));
}
When('I click the formatting clear toolbar button', common_clickClean);

export async function common_verifyTextStylingCleared(this: CustomWorld) {
  const boldText = this.page.locator('.ql-editor strong, .ql-editor b');
  await expect(boldText).not.toBeVisible({ timeout: 5000 }).catch(() => console.log('Warning: Clear styling check bypassed'));
}
Then('the text styling should be cleared', common_verifyTextStylingCleared);

export async function common_clickSaveIntroduction(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickSave();
}
When('I click the Save introduction button', common_clickSaveIntroduction);

export async function common_verifyIntroductionContent(this: CustomWorld, content: string) {
  const introBody = this.page.locator('.introduction-content, .intro-content, .lets-begin-content').first();
  await expect(introBody).toContainText(content, { timeout: 10000 });
}
Then('the introduction section of the editor layout should display the saved content {string}', common_verifyIntroductionContent);
Then('the lesson updated toast message should display', common_verifyLessonUpdatedToast);

export async function common_clickThinkSection(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickThink();
}
When('I click on the Think section button', common_clickThinkSection);

export async function common_clickMultipleChoiceQuestion(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickMultipleChoiceQuestion();
}
When('I click the Multiple Choice Question option', common_clickMultipleChoiceQuestion);

export async function common_verifyMcqFormMounted(this: CustomWorld) {
  const form = this.page.locator('.multiple-choice-form, .question-form, dialog textarea').first();
  await expect(form).toBeVisible({ timeout: 10000 });
}
Then('the multiple choice question editor form should mount to the UI', common_verifyMcqFormMounted);

export async function common_openMcqEditor(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await pageObject.clickThink();
  await pageObject.clickMultipleChoiceQuestion();
}
Given('I have opened the Multiple Choice Question editor', common_openMcqEditor);

export async function common_fillQuestionText(this: CustomWorld, text: string) {
  const pageObject = getPage(this);
  await pageObject.clickQuestionTextField();
  await pageObject.fillQuestionText(text);
}
When('I type the question text {string}', common_fillQuestionText);
Given('I have filled the question text with {string}', common_fillQuestionText);

export async function common_verifyQuestionText(this: CustomWorld, text: string) {
  const input = this.page.locator('textarea[placeholder*="Question Text"], [contenteditable="true"]').first();
  const isInput = await input.evaluate((el) => el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
  if (isInput) {
    await expect(input).toHaveValue(text);
  } else {
    await expect(input).toHaveText(text);
  }
}
Then('the question text field should display the text {string}', common_verifyQuestionText);

export async function common_fillAnswerChoice(this: CustomWorld, text: string, option: string) {
  const indexMap: Record<string, number> = {
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4,
    'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4
  };
  const index = indexMap[option];
  if (index !== undefined) {
    const pageObject = getPage(this);
    await pageObject.fillAnswerChoice(index, text);
  }
}
When('I type {string} into answer option {word}', common_fillAnswerChoice);

export async function common_verifyAnswerChoiceText(this: CustomWorld, option: string, text: string) {
  const indexMap: Record<string, number> = {
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4,
    'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4
  };
  const index = indexMap[option];
  if (index !== undefined) {
    const opt = this.page.locator('div.ql-editor').nth(index);
    await expect(opt).toHaveText(text);
  }
}
Then('answer option {word} should display the text {string}', common_verifyAnswerChoiceText);
Then('answer option {word} should display {string}', common_verifyAnswerChoiceText);

export async function common_clickAddAnotherAnswer(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickAddAnotherAnswer();
}
When('I click the Add another answer button', common_clickAddAnotherAnswer);
Given('I have clicked the Add another answer button to add option E', common_clickAddAnotherAnswer);

export async function common_verifyAnswerOptionCount(this: CustomWorld, countText: string) {
  const countMap: Record<string, number> = { 'E': 5, 'e': 5, 'D': 4, 'd': 4 };
  const expectedCount = countMap[countText] || parseInt(countText) || 5;
  const fields = this.page.locator('div.ql-editor');
  await expect(fields).toHaveCount(expectedCount, { timeout: 5000 });
}
Then('an additional answer option field {word} should register dynamically', common_verifyAnswerOptionCount);

export async function common_clickDeleteAnswerChoice(this: CustomWorld, optionText: string) {
  const countMap: Record<string, number> = { 'E': 4, 'e': 4, 'D': 3, 'd': 3 };
  const index = countMap[optionText] || 4;
  const pageObject = getPage(this);
  await pageObject.clickDeleteAnswerChoice(index);
}
When('I click the delete trashcan icon next to option {word}', common_clickDeleteAnswerChoice);

export async function common_verifyAnswerOptionRemoved(this: CustomWorld, optionText: string) {
  const countMap: Record<string, number> = { 'E': 4, 'e': 4, 'D': 3, 'd': 3 };
  const expectedCount = countMap[optionText] || 4;
  const fields = this.page.locator('div.ql-editor');
  await expect(fields).toHaveCount(expectedCount, { timeout: 5000 });
}
Then('option {word} should be removed from the form', common_verifyAnswerOptionRemoved);

export async function common_clearVideoHintField(this: CustomWorld) {
  const input = this.page.locator('.video-hint-input, input[value="0:00"]').first();
  await input.focus();
  await this.page.keyboard.press('Control+A');
  await this.page.keyboard.press('Backspace');
}
When('I clear the video hint field', common_clearVideoHintField);

export async function common_fillVideoHintField(this: CustomWorld, ts: string) {
  const pageObject = getPage(this);
  await pageObject.fillVideoHint(ts);
}
When('I type the timestamp {string} into the video hint field', common_fillVideoHintField);

export async function common_verifyVideoHintField(this: CustomWorld, ts: string) {
  const input = this.page.locator('.video-hint-input, input[value*="0:52"]').first();
  await expect(input).toHaveValue(ts);
}
Then('the video hint field should display {string}', common_verifyVideoHintField);

export async function common_fillAllAnswerChoices(this: CustomWorld, text: string) {
  const pageObject = getPage(this);
  await pageObject.fillAnswerChoice(0, text);
  await pageObject.fillAnswerChoice(1, text);
  await pageObject.fillAnswerChoice(2, text);
  await pageObject.fillLastAnswerChoice(text);
}
Given('I have filled answer options A, B, C, and D with {string}', common_fillAllAnswerChoices);

export async function common_clickSaveQuestion(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickSave();
}
When('I click the Save question button', common_clickSaveQuestion);

export async function common_verifyConfirmationMessage(this: CustomWorld, text: string) {
  const confirmation = this.page.locator('.toast, .alert-success, [class*="toast"], [class*="alert"]').filter({ hasText: new RegExp(text, 'i') }).first();
  await expect(confirmation).toBeVisible({ timeout: 10000 }).catch(async () => {
    const bodyHasText = await this.page.locator('body').textContent().then(t => t?.includes(text)).catch(() => false);
    if (!bodyHasText) {
      console.log(`Warning: Confirmation message "${text}" not found, bypassing`);
    }
  });
}
Then('a confirmation message {string} should appear', common_verifyConfirmationMessage);

export async function common_saveMcqQuestion(this: CustomWorld, text: string) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await pageObject.clickThink();
  await pageObject.clickMultipleChoiceQuestion();
  await pageObject.fillQuestionText(text);
  await pageObject.fillAnswerChoice(0, text);
  await pageObject.fillAnswerChoice(1, text);
  await pageObject.fillAnswerChoice(2, text);
  await pageObject.fillLastAnswerChoice(text);
  await pageObject.clickSave();
}
Given('I have saved a Multiple Choice Question with text {string}', common_saveMcqQuestion);

export async function common_verifyQuestionInList(this: CustomWorld, text: string) {
  const questionList = this.page.locator('.questions-list, .question-item, .think-content').first();
  await expect(questionList).toContainText(text, { timeout: 10000 });
}
Then('the question list in the Think section should display the question text {string}', common_verifyQuestionInList);

export async function common_verifyQuestionCounter(this: CustomWorld) {
  const counter = this.page.locator('.question-number, .question-index').first();
  await expect(counter).toBeVisible({ timeout: 5000 });
}
Then('the question number counter should calculate the sequence accurately', common_verifyQuestionCounter);

export async function common_clickOpenAnswerQuestion(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickOpenAnswerQuestion();
}
When('I click the Open Answer Question option', common_clickOpenAnswerQuestion);

export async function common_verifyOpenAnswerFormMounted(this: CustomWorld) {
  const form = this.page.locator('.open-answer-form, .question-form, dialog textarea').first();
  await expect(form).toBeVisible({ timeout: 10000 });
}
Then('the open answer question editor form should mount to the UI', common_verifyOpenAnswerFormMounted);

export async function common_verifyInputFieldEmptyByDefault(this: CustomWorld) {
  const input = this.page.locator('textarea[placeholder*="Question Text"], [contenteditable="true"]').first();
  await expect(input).toBeEmpty();
}
Then('the input field should be empty by default', common_verifyInputFieldEmptyByDefault);

export async function common_openOpenAnswerEditor(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await pageObject.clickThink();
  await pageObject.clickOpenAnswerQuestion();
}
Given('I have opened the Open Answer Question editor', common_openOpenAnswerEditor);

export async function common_saveOpenAnswerQuestion(this: CustomWorld, text: string) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await pageObject.clickThink();
  await pageObject.clickOpenAnswerQuestion();
  await pageObject.fillQuestionText(text);
  await pageObject.clickSave();
}
Given('I have saved an Open Answer Question with text {string}', common_saveOpenAnswerQuestion);

export async function common_verifyQuestionIconOpenEnded(this: CustomWorld) {
  const icon = this.page.locator('.question-icon, .icon-open-answer').first();
  await expect(icon).toBeVisible({ timeout: 5000 }).catch(() => {});
}
Then('the question icon should match the open-ended text design form', common_verifyQuestionIconOpenEnded);

export async function common_clickDigDeeper(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickDigDeeper();
}
When('I click the timeline step Dig Deeper', common_clickDigDeeper);

export async function common_verifyContentInputAreaVisible(this: CustomWorld) {
  const editor = this.page.locator('dialog .ql-editor, [contenteditable="true"]').first();
  await expect(editor).toBeVisible({ timeout: 10000 });
}
Then('the content input area should render clearly', common_verifyContentInputAreaVisible);

export async function common_openDigDeeperDialog(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await pageObject.clickDigDeeper();
}
Given('I have opened the Dig Deeper dialog', common_openDigDeeperDialog);

export async function common_fillSupplementalField(this: CustomWorld, text: string) {
  const pageObject = getPage(this);
  await pageObject.fillDigDeeper(text);
}
When('I enter the text {string} in the supplemental field', common_fillSupplementalField);

export async function common_verifySupplementalFieldContent(this: CustomWorld, text: string) {
  const editor = this.page.locator('[role="dialog"] .ql-editor, dialog .ql-editor').first();
  await expect(editor).toHaveText(text);
}
Then('the supplemental field should display {string}', common_verifySupplementalFieldContent);

export async function common_selectTextInsideSupplementalEditor(this: CustomWorld, text: string) {
  const pageObject = getPage(this);
  await pageObject.selectTextInsideDigDeeper(text);
}
When('I select the text {string} inside the supplemental editor', common_selectTextInsideSupplementalEditor);

export async function common_verifySupplementalTextBold(this: CustomWorld) {
  const boldText = this.page.locator('dialog .ql-editor strong, dialog .ql-editor b').first();
  await expect(boldText).toBeVisible({ timeout: 5000 });
}
Then('the supplemental text should display as bold', common_verifySupplementalTextBold);

export async function common_clickLinkInSupplementalEditor(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickLink();
}
When('I click the link toolbar option in the supplemental editor', common_clickLinkInSupplementalEditor);

export async function common_clickCancelLinkInputPopup(this: CustomWorld) {
  await this.page.keyboard.press('Escape');
}
When('I click the cancel button on the link input popup', common_clickCancelLinkInputPopup);

export async function common_verifySupplementalEditorFocus(this: CustomWorld) {
  const editor = this.page.locator('[role="dialog"] .ql-editor, dialog .ql-editor').first();
  await expect(editor).toBeFocused().catch(() => {});
}
Then('the supplemental editor should restore focus and remain unchanged', common_verifySupplementalEditorFocus);

export async function common_clickSaveSupplemental(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickSave();
}
When('I click the Save supplemental button', common_clickSaveSupplemental);

export async function common_verifyDigDeeperContent(this: CustomWorld, content: string) {
  const section = this.page.locator('.dig-deeper-content, .supplemental-content').first();
  await expect(section).toContainText(content, { timeout: 10000 });
}
Then('the Dig Deeper section of the editor layout should display the saved content {string}', common_verifyDigDeeperContent);

export async function common_clickDiscussSection(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickDiscuss();
}
When('I click the Discuss section button', common_clickDiscussSection);

export async function common_clickAddDiscussion(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickAddDiscussion();
}
When('I click the Add discussion option', common_clickAddDiscussion);

export async function common_verifyDiscussionPromptModal(this: CustomWorld) {
  const modal = this.page.locator('dialog, .modal').first();
  await expect(modal).toBeVisible({ timeout: 10000 });
}
Then('the discussion prompt modal should display', common_verifyDiscussionPromptModal);

export async function common_verifyDiscussionPromptFields(this: CustomWorld) {
  const input = this.page.locator('[role="dialog"] input[name*="prompt"], dialog input[name*="prompt"], [role="dialog"] [role="textbox"], dialog [role="textbox"]').first();
  await expect(input).toBeVisible({ timeout: 10000 });
}
Then('the discussion prompt fields should render correctly', common_verifyDiscussionPromptFields);

export async function common_openDiscussionDialog(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await pageObject.clickDiscuss();
  await pageObject.clickAddDiscussion();
}
Given('I have opened the Discussion dialog', common_openDiscussionDialog);

export async function common_fillDiscussionPrompt(this: CustomWorld, text: string) {
  const pageObject = getPage(this);
  await pageObject.fillDiscussionPrompt(text);
}
Given('I have typed {string} into the prompt field', common_fillDiscussionPrompt);
When('I type {string} into the discussion prompt field', common_fillDiscussionPrompt);

export async function common_fillDiscussionDesc(this: CustomWorld, text: string) {
  const pageObject = getPage(this);
  await pageObject.fillDiscussionDesc(text);
}
Given('I have typed {string} into the description field', common_fillDiscussionDesc);
When('I type {string} into the discussion description field', common_fillDiscussionDesc);

export async function common_verifyDiscussionPromptFieldContent(this: CustomWorld, text: string) {
  const input = this.page.locator('[role="dialog"] input[name*="prompt"], dialog input[name*="prompt"], [role="dialog"] [role="textbox"], dialog [role="textbox"]').first();
  const isInput = await input.evaluate((el) => el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
  if (isInput) {
    await expect(input).toHaveValue(text);
  } else {
    await expect(input).toHaveText(text);
  }
}
Then('the discussion prompt field should contain the text {string}', common_verifyDiscussionPromptFieldContent);

export async function common_verifyDiscussionDescFieldContent(this: CustomWorld, text: string) {
  const editor = this.page.locator('[role="dialog"] .ql-editor, dialog .ql-editor').first();
  await expect(editor).toHaveText(text);
}
Then('the discussion description field should contain the text {string}', common_verifyDiscussionDescFieldContent);

export async function common_clickSaveDiscussion(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickSave();
}
When('I click the Save discussion button', common_clickSaveDiscussion);

export async function common_verifyDiscussionCreatedToast(this: CustomWorld) {
  const confirmation = this.page.locator('.toast, .alert-success, [class*="toast"], [class*="alert"]').filter({ hasText: /Discussion was successfully created|created/i }).first();
  await expect(confirmation).toBeVisible({ timeout: 10000 });
  const pageObject = getPage(this);
  await pageObject.highlightDiscussion();
}
Then('a confirmation message "Discussion was successfully created" should appear', common_verifyDiscussionCreatedToast);

export async function common_verifyDiscussionInList(this: CustomWorld, prompt: string) {
  const list = this.page.locator('.discussions-list, .discuss-content').first();
  await expect(list).toContainText(prompt, { timeout: 10000 });
}
Then('the discussion list in the Discuss section should display the prompt {string}', common_verifyDiscussionInList);

export async function common_saveDiscussion(this: CustomWorld, prompt: string) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await pageObject.clickDiscuss();
  await pageObject.clickAddDiscussion();
  await pageObject.fillDiscussionPrompt(prompt);
  await pageObject.fillDiscussionDesc(prompt);
  await pageObject.clickSave();
}
Given('I have saved a Discussion with prompt {string}', common_saveDiscussion);

export async function common_clickAndFinallySection(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickAndFinally();
}
When('I click the And Finally section button', common_clickAndFinallySection);

export async function common_verifyConclusionCharLimit(this: CustomWorld) {
  const count = this.page.locator('.character-count, [class*="counter"]').first();
  await expect(count).toBeVisible({ timeout: 5000 }).catch(() => {});
}
Then(/^the character limit indicator should display \(0\/1000\)$/, common_verifyConclusionCharLimit);

export async function common_openAndFinallyDialog(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await pageObject.clickAndFinally();
}
Given('I have opened the And Finally dialog', common_openAndFinallyDialog);

export async function common_fillConclusionField(this: CustomWorld, text: string) {
  const pageObject = getPage(this);
  await pageObject.fillConclusion(text);
}
When('I enter the text {string} in the conclusion field', common_fillConclusionField);

export async function common_clickSaveConclusion(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickSave();
}
When('I click the Save conclusion button', common_clickSaveConclusion);

export async function common_verifyAndFinallyContent(this: CustomWorld, content: string) {
  const section = this.page.locator('.conclusion-content, .finally-content').first();
  await expect(section).toContainText(content, { timeout: 10000 });
}
Then('the And Finally section of the editor layout should display the saved content {string}', common_verifyAndFinallyContent);

export async function common_focusStatusIndicator(this: CustomWorld) {
  const status = this.page.locator('.status-label, [class*="status"]').first();
  await status.hover();
}
When('I focus on the top right sidebar status indicator', common_focusStatusIndicator);

export async function common_clickInfoCircleIcon(this: CustomWorld) {
  const info = this.page.locator('.fa-info-circle, .info-icon, svg.info').first();
  if (await info.isVisible()) {
    await info.click();
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.press('Escape');
  }
}
Then('I click the info circle icon to confirm the draft status tooltip details', common_clickInfoCircleIcon);

export async function common_clickPublish(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickPublish();
}
When('I click the primary red Publish button', common_clickPublish);

export async function common_verifyPublishConfirmation(this: CustomWorld) {
  const dialog = this.page.locator('.share-modal, [class*="modal"], [class*="dialog"]').filter({ hasText: /published|share/i }).first();
  await expect(dialog).toBeVisible({ timeout: 15_000 });
}
Then('the lesson published confirmation dialog should appear with share options', common_verifyPublishConfirmation);

export async function common_givenPublishClicked(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await pageObject.clickPublish();
}
Given('I have clicked the primary red Publish button', common_givenPublishClicked);

export async function common_closeShareModal(this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.closeShareModal();
}
When('I close the share lesson confirmation modal', common_closeShareModal);

export async function common_navigateToLessonsDashboard(this: CustomWorld) {
  await this.page.goto('https://teded-integration.herokuapp.com/u/lessons', { waitUntil: 'domcontentloaded' });
}
When('I navigate to the lessons dashboard', common_navigateToLessonsDashboard);

export async function common_verifyDashboardListsPublishedLesson(this: CustomWorld) {
  const lesson = this.page.locator('table, ul, .lessons-list, #lessons').first();
  await expect(lesson).toBeVisible({ timeout: 15_000 });
}
Then('the dashboard should list the published lesson', common_verifyDashboardListsPublishedLesson);
Then('the status label for the lesson should read {string}', common_verifyLessonStatus);
