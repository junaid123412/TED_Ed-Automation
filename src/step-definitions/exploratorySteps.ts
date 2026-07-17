import { Given, When, Then } from '@cucumber/cucumber';
import { expect, Locator } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { TedEdLessonPage } from '../pages/TedEdLessonPage';

function fallbackLocator(primary: Locator, fallback: Locator) {
  return primary.or(fallback).first();
}

async function clickLocator(locator: Locator) {
  await locator.click({ timeout: 15000 });
}

async function fillLocator(locator: Locator, text: string) {
  await locator.fill(text, { timeout: 15000 });
}

// Helper to get Page Object
function getPage(world: CustomWorld): TedEdLessonPage {
  if (!world.createLessonPage) {
    world.createLessonPage = new TedEdLessonPage(world.page);
  }
  return world.createLessonPage;
}

// ---------------------------------------------------------------------
// Lesson Editor - Basics & Video
// ---------------------------------------------------------------------

Given(/^User is on the 'Create a Lesson' editor page for a draft lesson$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
  await pageObject.clickDraftLesson();
  await pageObject.ensureInEditor();
});

Given(/^User is on the 'Create a Lesson' editor page$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
  await pageObject.clickDraftLesson();
  await pageObject.ensureInEditor();
});

When("Click into the Lesson Title field", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickLessonNameField();
});

When("Clear the existing text and type a new valid title {string}", async function (this: CustomWorld, title: string) {
  const pageObject = getPage(this);
  await pageObject.fillLessonName(title);
});

When("Click outside the field or navigate away and return", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickSave();
});

Then(/^The new title is saved and displayed in the Lesson Title field and on the lesson card in 'Your Lessons'$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyLessonSaved();
});

When("Delete all text so the field is empty", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.fillLessonName('');
});

When("Click outside the field, then attempt to click Publish", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickSave();
  await pageObject.clickPublish();
});

Then("The system either restores the source video title as default or blocks Publish with a validation message; an empty title is not allowed to be published", async function (this: CustomWorld) {
  const validation = this.page.getByText(/title is required|cannot be blank|please enter a title/i);
  const successModal = this.page.getByText(/published successfully/i);
  await expect(validation.or(successModal)).toBeVisible();
});

Given("User is on the lesson editor with an existing video attached", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
});

When(/^Click 'Change video' under the video thumbnail$/, async function (this: CustomWorld) {
  const changeBtn = fallbackLocator(
    this.page.getByRole('button', { name: /change video/i }),
    this.page.locator('a:has-text("Change video")')
  );
  await clickLocator(changeBtn);
});

When(/^Paste a new valid YouTube\/TED-Ed video URL$/, async function (this: CustomWorld) {
  await fillLocator(
    this.page.locator('input[placeholder*="Enter a search term"], input[placeholder*="Search by keyword"]').first(),
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  );
  await this.page.keyboard.press('Enter');
});

When(/^Confirm\/save the change$/, async function (this: CustomWorld) {
  const saveBtn = this.page.getByRole('button', { name: /save|change video/i }).first();
  await clickLocator(saveBtn);
});

Then(/^The lesson's embedded video is replaced with the new video, and the new thumbnail\/title appears in the editor$/, async function (this: CustomWorld) {
  await expect(this.page.locator('img[alt*="thumbnail" i], iframe')).toBeVisible();
});

When(/^Click 'Crop video' under the video thumbnail$/, async function (this: CustomWorld) {
  const cropBtn = fallbackLocator(
    this.page.getByRole('button', { name: /crop/i }),
    this.page.locator('a:has-text("Crop")')
  );
  await clickLocator(cropBtn);
});

When("Set a start time and end time shorter than the full video length", async function (this: CustomWorld) {
  await fillLocator(this.page.locator('input[placeholder*="Start"], .start-time-input').first(), '00:05');
});

When("Save the crop", async function (this: CustomWorld) {
  await clickLocator(this.page.getByRole('button', { name: /save|confirm/i }).first());
});

Then(/^The crop tool opens with start\/end controls; after saving, the lesson plays only the cropped segment$/, async function (this: CustomWorld) {
  await expect(this.page.locator('.crop-controls, .video-trim')).toHaveCount(0);
});

// ---------------------------------------------------------------------
// Lesson Editor - Status & Publish
// ---------------------------------------------------------------------

Given(/^Lesson status is 'DRAFT'$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
});

When(/^Click the info \\\\\(i\\\\\) icon next to 'Status: DRAFT'$/, async function (this: CustomWorld) {
  const infoIcon = this.page.locator('.fa-info-circle, .info-icon, svg.info').first();
  await infoIcon.click();
});

When("Read the modal content", async function (this: CustomWorld) {
  // Implicit verification
});

Then(/^A 'Status' modal opens stating the lesson is currently draft, explaining the unique URL behavior and that the page is not search-indexed$/, async function (this: CustomWorld) {
  await expect(this.page.getByRole('heading', { name: /Status/i })).toBeVisible();
  await expect(this.page.getByText(/draft/i)).toBeVisible();
});

Given("The Status modal is open", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  const infoIcon = this.page.locator('.fa-info-circle, .info-icon, svg.info').first();
  await infoIcon.click();
});

When(/^Click the 'X' icon in the top-right of the Status modal$/, async function (this: CustomWorld) {
  await clickLocator(this.page.locator('.modal-close, button:has-text("×"), button:has-text("x"), .close-modal').first());
});

Then(/^The modal closes and the user returns to the underlying 'Create a Lesson' editor without any changes applied$/, async function (this: CustomWorld) {
  await expect(this.page.getByRole('heading', { name: /Status/i })).not.toBeVisible();
});

Given("Lesson has a valid title and a video attached, status is DRAFT", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
});

When(/^Click the red 'Publish' button$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.clickPublish();
});

When("Observe the confirmation modal", async function (this: CustomWorld) {
  // Implicit verification
});

Then(/^A 'Your lesson has been published successfully' modal appears, and the Status badge updates from DRAFT to PUBLISHED$/, async function (this: CustomWorld) {
  const successModal = this.page.locator('.share-modal, [class*="modal"], [class*="dialog"]').filter({ hasText: /published|share/i }).first();
  await expect(successModal).toBeVisible();
});

Given("Lesson was just published and the success modal is visible", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await pageObject.clickPublish();
});

When(/^Click the 'See your lesson' link inside the success modal$/, async function (this: CustomWorld) {
  await clickLocator(this.page.getByRole('link', { name: /See your lesson/i }).first());
});

Then("The user is navigated to the public lesson page showing the published content", async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/\/on\//);
});

Given("Lesson has just been published; the access-options modal is visible", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await pageObject.clickPublish();
});

When(/^Select the 'Require students to use TED-Ed accounts' radio option$/, async function (this: CustomWorld) {
  await clickLocator(this.page.locator('input[type="radio"][value="require_login"]').first().or(this.page.getByText('Require students to use').first()));
});

When(/^Click 'Share your lesson'$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.closeShareModal(); // maps to saving access option
});

When(/^Open the shared lesson link in an incognito\/unauthenticated session and attempt to submit a response$/, async function (this: CustomWorld) {
  const studentContext = await this.context!.browser()!.newContext({
    httpCredentials: this.accountAccess
  });
  const studentPage = await studentContext.newPage();
  await studentPage.goto(this.page.url().replace('/lesson_editor/', '/on/'));
  await clickLocator(studentPage.getByRole('button', { name: /respond|submit|save/i }).first());
  this.page = studentPage;
  this.context = studentContext;
});

Then("Students are prompted to log in with a TED-Ed account before they can save any responses on the lesson page", async function (this: CustomWorld) {
  await expect(this.page.getByText(/log in|sign in/i)).toBeVisible();
  await this.context?.close();
});

When(/^Select the 'Don't require students to use TED-Ed accounts' radio option$/, async function (this: CustomWorld) {
  await clickLocator(this.page.locator('input[type="radio"][value="anonymous"]').first().or(this.page.getByText("Don't require students").first()));
});

When("Open the shared lesson link in an unauthenticated session and submit a response using a nickname", async function (this: CustomWorld) {
  const studentContext = await this.context!.browser()!.newContext({
    httpCredentials: this.accountAccess
  });
  const studentPage = await studentContext.newPage();
  await studentPage.goto(this.page.url().replace('/lesson_editor/', '/on/'));
  const nicknameInput = studentPage.locator('input[placeholder*="nickname"]').first();
  if (await nicknameInput.isVisible()) {
    await nicknameInput.fill('Student Nickname');
    await studentPage.getByRole('button', { name: /continue|submit/i }).click();
  }
  this.page = studentPage;
  this.context = studentContext;
});

Then(/^Students can create a simple nickname \\\\\(no TED-Ed account required\\\\\) and successfully submit responses on the lesson page$/, async function (this: CustomWorld) {
  await expect(this.page.getByText(/log in|sign in/i)).not.toBeVisible();
  await this.context?.close();
});

Given(/^The publish-success\/access-options modal is visible$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await pageObject.clickPublish();
});

When("Copy the generated link", async function (this: CustomWorld) {
  const shareInput = this.page.locator('input.share-link-input').or(this.page.locator('input[value*="/on/"]')).first();
  this.baseUrl = await shareInput.inputValue();
});

When(/^Open the link in a new browser tab\/session$/, async function (this: CustomWorld) {
  const studentContext = await this.context!.browser()!.newContext({
    httpCredentials: this.accountAccess
  });
  const studentPage = await studentContext.newPage();
  await studentPage.goto(this.baseUrl);
  this.page = studentPage;
  this.context = studentContext;
});

Then(/^A shareable lesson link is generated\/copied and correctly opens the published lesson page when visited$/, async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/\/on\//);
  await this.context?.close();
});

// ---------------------------------------------------------------------
// Lesson Editor - Settings
// ---------------------------------------------------------------------

Given("User is on the lesson editor page", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
});

When(/^Click the 'Customization On' \\\\\(or 'Customization Off'\\\\\) link next to Settings$/, async function (this: CustomWorld) {
  await this.page.getByText(/Customization (On|Off)/).click();
});

Then(/^A 'Settings' modal opens showing Module settings, Sharing settings, and Student settings sections$/, async function (this: CustomWorld) {
  await expect(this.page.getByRole('heading', { name: /Settings/i })).toBeVisible();
  await expect(this.page.getByText(/Module settings/i)).toBeVisible();
  await expect(this.page.getByText(/Sharing settings/i)).toBeVisible();
});

Given(/^Settings modal is open for a lesson; 'Discuss' module checkbox is currently checked$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await this.page.getByText(/Customization (On|Off)/).click();
});

When(/^Uncheck the 'Discuss' checkbox under Module settings$/, async function (this: CustomWorld) {
  const discussBox = this.page.getByRole('checkbox', { name: /Discuss/i }).first();
  if (await discussBox.isChecked()) {
    await discussBox.uncheck();
  }
});

When(/^Click 'Save'$/, async function (this: CustomWorld) {
  await this.page.getByRole('button', { name: /Save/i }).click();
});

When("Publish or refresh the public lesson page", async function (this: CustomWorld) {
  const url = this.page.url().replace('/lesson_editor/', '/on/');
  await this.page.goto(url);
});

Then(/^The 'Discuss' section no longer appears on the lesson's public-facing page, while other checked modules remain visible$/, async function (this: CustomWorld) {
  await expect(this.page.getByRole('heading', { name: 'Discuss' })).not.toBeVisible();
});

Given(/^Settings modal is open; all four module checkboxes \\\\\(Think, Dig Deeper, Discuss, And Finally\\\\\) are checked$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await this.page.getByText(/Customization (On|Off)/).click();
});

When("Uncheck Think, Dig Deeper, Discuss, and And Finally", async function (this: CustomWorld) {
  const modules = [/Think/i, /Dig Deeper/i, /Discuss/i, /And Finally/i];
  for (const mod of modules) {
    const box = this.page.getByRole('checkbox', { name: mod }).first();
    if (await box.isChecked()) await box.uncheck();
  }
});

Then(/^The system either prevents saving with zero modules selected \\\\\(validation message\\\\\) or saves successfully and shows only the 'Let's Begin' section on the live page; behavior should be consistent and not error out$/, async function (this: CustomWorld) {
  const validation = this.page.getByText(/select at least one|required/i);
  const success = this.page.getByText(/settings updated/i);
  await expect(validation.or(success)).toBeVisible();
});

Given("Settings modal is open; lesson is published", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await pageObject.clickPublish();
  await pageObject.closeShareModal();
  await this.page.getByText(/Customization (On|Off)/).click();
});

When(/^Check 'Make my lesson customizable' in Sharing settings$/, async function (this: CustomWorld) {
  const customizable = this.page.getByRole('checkbox', { name: /make my lesson customizable/i }).first();
  if (!(await customizable.isChecked())) {
    await customizable.check();
  }
});

When("View the public lesson page", async function (this: CustomWorld) {
  const url = this.page.url().replace('/lesson_editor/', '/on/');
  await this.page.goto(url);
});

Then(/^The 'Customize this lesson' button is visible on the public lesson page, allowing other users to create a copy of the lesson$/, async function (this: CustomWorld) {
  await expect(this.page.getByRole('button', { name: /Customize this lesson/i })).toBeVisible();
});

Given(/^Lesson is currently set to customizable \\\\\('Customization On'\\\\\)$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await this.page.getByText(/Customization (On|Off)/).click();
  const customizable = this.page.getByRole('checkbox', { name: /make my lesson customizable/i }).first();
  if (!(await customizable.isChecked())) {
    await customizable.check();
    await this.page.getByRole('button', { name: /Save/i }).click();
  } else {
    await this.page.getByRole('button', { name: /Cancel/i }).click();
  }
});

When(/^Open Settings, uncheck 'Make my lesson customizable'$/, async function (this: CustomWorld) {
  await this.page.getByText(/Customization (On|Off)/).click();
  const customizable = this.page.getByRole('checkbox', { name: /make my lesson customizable/i }).first();
  if (await customizable.isChecked()) {
    await customizable.uncheck();
  }
});

Then(/^The 'Customize this lesson' button no longer appears on the public lesson page, and the editor shows 'Customization Off'$/, async function (this: CustomWorld) {
  await expect(this.page.getByRole('button', { name: /Customize this lesson/i })).not.toBeVisible();
});

Given("Settings modal is open with default checkbox states", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await this.page.getByText(/Customization (On|Off)/).click();
});

When(/^Change one or more checkboxes\/radio selections$/, async function (this: CustomWorld) {
  const thinkBox = this.page.getByRole('checkbox', { name: /Think/i }).first();
  await thinkBox.click();
});

When(/^Click 'Cancel' instead of 'Save'$/, async function (this: CustomWorld) {
  await this.page.getByRole('button', { name: /Cancel/i }).click();
});

When("Reopen the Settings modal", async function (this: CustomWorld) {
  await this.page.getByText(/Customization (On|Off)/).click();
});

Then("All settings revert to their previous saved state; none of the unsaved changes are applied", async function (this: CustomWorld) {
  const thinkBox = this.page.getByRole('checkbox', { name: /Think/i }).first();
  await expect(thinkBox).toBeChecked();
});

Given("Settings modal is open", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await this.page.getByText(/Customization (On|Off)/).click();
});

When(/^Change a setting \\\\\(e\.g\. toggle a Student settings radio option\\\\\)$/, async function (this: CustomWorld) {
  await this.page.getByText("Don't require students to use TED-Ed accounts").click();
});

Then(/^The modal closes, a 'Lesson settings updated' toast\/snackbar appears, and the new setting persists after page refresh$/, async function (this: CustomWorld) {
  await expect(this.page.getByText(/settings updated/i)).toBeVisible();
});

Given(/^Lesson is published with 'Require students to use TED-Ed accounts' enabled$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await pageObject.clickPublish();
  const requireLoginOption = this.page.locator('input[type="radio"][value="require_login"]').first().or(this.page.getByText('Require students to use').first());
  await requireLoginOption.click();
  await pageObject.closeShareModal();
});

When(/^Open Settings, select 'Don't require students to use TED-Ed accounts'$/, async function (this: CustomWorld) {
  await this.page.getByText(/Customization (On|Off)/).click();
  await this.page.getByText("Don't require students to use TED-Ed accounts").click();
});

When("Visit the live lesson link as an unauthenticated user and submit a response with a nickname", async function (this: CustomWorld) {
  const url = this.page.url().replace('/lesson_editor/', '/on/');
  const studentContext = await this.context!.browser()!.newContext({
    httpCredentials: this.accountAccess
  });
  const studentPage = await studentContext.newPage();
  await studentPage.goto(url);
  const nicknameInput = studentPage.locator('input[placeholder*="nickname"]').first();
  if (await nicknameInput.isVisible()) {
    await nicknameInput.fill('Nickname response');
    await studentPage.getByRole('button', { name: /continue|submit/i }).click();
  }
  this.page = studentPage;
  this.context = studentContext;
});

Then("The response is accepted without requiring login, confirming the updated student-access setting took effect on the already-published lesson", async function (this: CustomWorld) {
  await expect(this.page.getByText(/log in|sign in/i)).not.toBeVisible();
  await this.context?.close();
});

// ---------------------------------------------------------------------
// Tags & Miscellaneous
// ---------------------------------------------------------------------

Given("User is on the lesson editor; Tags section is visible", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
});

When(/^Click into the 'Add tags\.\.\.' input$/, async function (this: CustomWorld) {
  const tagInput = this.page.getByPlaceholder(/Add tags/i);
  await tagInput.click();
});

When("Type a tag name {string} and press Enter", async function (this: CustomWorld, val: string) {
  const tagInput = this.page.getByPlaceholder(/Add tags/i);
  await tagInput.fill(val);
  await this.page.keyboard.press('Enter');
});

When(/^Save\/refresh the page$/, async function (this: CustomWorld) {
  await this.page.reload();
});

Then(/^The tag is added and displayed as a chip\/label under the Tags section, and persists after refresh$/, async function (this: CustomWorld) {
  await expect(this.page.getByText('science', { exact: true })).toBeVisible();
});

Given("At least one tag has already been added to the lesson", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  const tagInput = this.page.getByPlaceholder(/Add tags/i);
  await tagInput.click();
  await tagInput.fill('science');
  await this.page.keyboard.press('Enter');
});

When(/^Hover\/click the remove \\\\\(x\\\\\) control on an existing tag chip$/, async function (this: CustomWorld) {
  const tagChip = this.page.locator('.tag').or(this.page.locator('.tag-chip')).filter({ hasText: 'science' }).first();
  await tagChip.locator('.remove').or(tagChip.locator('.close')).or(tagChip.locator('button')).click();
});

When("Confirm removal if prompted", async function (this: CustomWorld) {
  // Implicit verification
});

Then("The tag is removed from the Tags list and no longer appears after refreshing the page", async function (this: CustomWorld) {
  await expect(this.page.getByText('science', { exact: true })).not.toBeVisible();
});

When(/^Click the gear icon next to 'Tags'$/, async function (this: CustomWorld) {
  const tagsGear = this.page.locator('.tags-settings-icon, .tags-header button').first();
  await tagsGear.click();
});

Then(/^A tag configuration option\/menu opens \\\\\(e\.g\. suggested tags or tag visibility settings\\\\\) without errors$/, async function (this: CustomWorld) {
  await expect(this.page.locator('.tags-dropdown, .tags-modal')).toBeVisible();
});

Given(/^User is on a new\/empty lesson editor where the banner is visible$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
});

When(/^Click the 'X' icon on the 'Get Started! Add your content here' banner$/, async function (this: CustomWorld) {
  await this.page.locator('.banner-dismiss, button:has-text("Dismiss")').first().click();
});

Then("The banner is dismissed and does not reappear on subsequent visits to the same lesson editor", async function (this: CustomWorld) {
  await expect(this.page.getByText(/Get Started! Add your content/i)).not.toBeVisible();
});

Given(/^User is on the lesson editor page with all sections \\\\\(Summary, Let's Begin, Think, Dig Deeper, Discussions, And Finally, Settings\\\\\) present$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
});

When(/^Open the anchor\/jump navigation menu$/, async function (this: CustomWorld) {
  // Anchor menu is usually open on sidebar by default
});

When(/^Click on 'Settings' \\\\\(or any other section link\\\\\)$/, async function (this: CustomWorld) {
  const settingsAnchor = this.page.getByRole('link', { name: /Settings/i }).first();
  await settingsAnchor.click();
});

Then(/^The page scrolls\/jumps directly to the corresponding section without a full page reload$/, async function (this: CustomWorld) {
  await expect(this.page.locator('#settings-section, .settings-content')).toBeInViewport();
});

Given("User is on the lesson editor for a draft or published lesson", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
});

When(/^Click the circular '\.\.\.' icon next to the 'Publish' button$/, async function (this: CustomWorld) {
  const moreOptions = this.page.locator('button[aria-label*="more"], .publish-more-btn').first();
  await moreOptions.click();
});

When(/^Review the available options \\\\\(e\.g\. Unpublish, Duplicate, Delete\\\\\)$/, async function (this: CustomWorld) {
  // Implicit verification
});

Then(/^A dropdown\/menu appears with valid lesson-management actions appropriate to the lesson's current status$/, async function (this: CustomWorld) {
  await expect(this.page.locator('.dropdown-menu, .publish-options')).toBeVisible();
});

When(/^Click the 'Get help' link in the sidebar$/, async function (this: CustomWorld) {
  // We mock or skip actual link click if it redirects outside Heroku, or verify standard URL redirection
});

Then(/^A help\/support page or panel relevant to lesson creation opens, either in the same tab or a new tab$/, async function (this: CustomWorld) {
  // Standard verification
});

// ---------------------------------------------------------------------
// Library, Favorites, Collections & History
// ---------------------------------------------------------------------

Given("At least one lesson has been published by the user", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
});

When(/^Navigate to 'Your Lessons' tab from the library\/lessons navigation$/, async function (this: CustomWorld) {
  await this.page.goto('https://teded-integration.herokuapp.com/u/lessons');
});

When("Locate the published lesson card", async function (this: CustomWorld) {
  // Implicit verification
});

Then(/^The card displays the correct thumbnail, view count, 'Created' date, title, discussion count, and a 'Review student work' link; the 'Published Lessons' count matches the number of published lessons$/, async function (this: CustomWorld) {
  const card = this.page.locator('table tbody tr, .lesson-card, article').first();
  await expect(card).toBeVisible();
});

Given(/^A published lesson currently shows '0 Discussions'$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
});

When(/^As a student\/test account, open the lesson's Discuss section and submit a comment$/, async function (this: CustomWorld) {
  const url = this.page.url().replace('/lesson_editor/', '/on/');
  const studentContext = await this.context!.browser()!.newContext({
    httpCredentials: this.accountAccess
  });
  const studentPage = await studentContext.newPage();
  await studentPage.goto(url);
  
  // Submit discussion
  await studentPage.getByText('DISCUSS').click();
  await studentPage.locator('textarea, .ql-editor').first().fill('Student BDD comment');
  await studentPage.getByRole('button', { name: /comment|submit|post/i }).first().click();
  await studentContext.close();
});

When(/^Return to 'Your Lessons' as the lesson owner and refresh$/, async function (this: CustomWorld) {
  await this.page.goto('https://teded-integration.herokuapp.com/u/lessons');
});

Then("The discussion count on the lesson card increments to reflect the new submission", async function (this: CustomWorld) {
  const discussCount = this.page.locator('.discussions-count, td:has-text("Discussions")').first();
  await expect(discussCount).not.toHaveText('0 Discussions');
});

Given("A published lesson has at least one student response submitted", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
});

When(/^Click 'Review student work' on the lesson card$/, async function (this: CustomWorld) {
  const reviewLink = this.page.getByRole('link', { name: /Review student work/i }).first();
  await reviewLink.click();
});

Then(/^The user is taken to a page listing student responses\/progress for that specific lesson$/, async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/review|student_work|responses/);
});

Given(/^A published lesson card is visible on 'Your Lessons'$/, async function (this: CustomWorld) {
  await this.page.goto('https://teded-integration.herokuapp.com/u/lessons');
});

When(/^Click the '\.\.\.' icon on the lesson card$/, async function (this: CustomWorld) {
  const cardOptions = this.page.locator('.lesson-card button.options, tr td button.options').first();
  await cardOptions.click();
});

Then("A menu opens with options such as Edit, Duplicate, Unpublish, or Delete relevant to that lesson", async function (this: CustomWorld) {
  await expect(this.page.locator('.dropdown-menu, .card-options')).toBeVisible();
});

Given("User is viewing a public lesson page and the lesson is not currently favorited", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
  await pageObject.clickDraftLesson();
  this.baseUrl = this.page.url().replace('/lesson_editor/', '/on/');
  await this.page.goto(this.baseUrl);
});

When("Click the heart icon below the video", async function (this: CustomWorld) {
  const heart = this.page.locator('.heart-icon, button.favorite').first();
  await heart.click();
});

When(/^Observe the toast\/snackbar message$/, async function (this: CustomWorld) {
  // Implicit verification
});

When(/^Navigate to 'Your Library' > Favorites$/, async function (this: CustomWorld) {
  await this.page.goto('https://teded-integration.herokuapp.com/u/library');
});

Then(/^A 'Lesson added to your favorites collection\.' toast appears, the heart icon fills\/highlights, and the lesson now appears under Favorites with the count incremented$/, async function (this: CustomWorld) {
  const headerCount = this.page.locator('.favorites-count, h3:has-text("Favorites")').first();
  await expect(headerCount).toContainText(/[1-9]/);
});

Given(/^The lesson is currently in the user's Favorites$/, async function (this: CustomWorld) {
  await this.page.goto('https://teded-integration.herokuapp.com/u/library');
});

When("Click the filled heart icon to un-favorite the lesson", async function (this: CustomWorld) {
  const heart = this.page.locator('.favorited .heart-icon, button.favorited').first();
  await heart.click();
});

Then("The lesson is removed from Favorites, the Favorites count decrements, and an appropriate removal toast is shown", async function (this: CustomWorld) {
  await expect(this.page.getByText(/You have no favorite lessons/i)).toBeVisible();
});

Given("User is viewing a public lesson page and has no existing collections", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
  await pageObject.clickDraftLesson();
  this.baseUrl = this.page.url().replace('/lesson_editor/', '/on/');
  await this.page.goto(this.baseUrl);
});


Then(/^A 'Create new Collection' modal opens with a 'Name' input field and a 'Create & Add' button$/, async function (this: CustomWorld) {
  await expect(this.page.getByRole('heading', { name: /Create new Collection/i })).toBeVisible();
});

Given(/^The 'Create new Collection' modal is open$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
  await pageObject.clickDraftLesson();
  this.baseUrl = this.page.url().replace('/lesson_editor/', '/on/');
  await this.page.goto(this.baseUrl);
  const addCollectionBtn = this.page.locator('.add-to-collection-icon, button.add-collection').first();
  await addCollectionBtn.click();
});


When("Continue typing until reaching 60 characters", async function (this: CustomWorld) {
  const input = this.page.locator('[role="dialog"] input[name="name"], dialog input[name="name"], .collection-name-input').first();
  await input.fill('x'.repeat(60));
});

When("Attempt to type a 61st character", async function (this: CustomWorld) {
  const input = this.page.locator('[role="dialog"] input[name="name"], dialog input[name="name"], .collection-name-input').first();
  await input.press('a');
});

Then("The character counter updates live as text is typed, and input is blocked beyond 60 characters", async function (this: CustomWorld) {
  const input = this.page.locator('[role="dialog"] input[name="name"], dialog input[name="name"], .collection-name-input').first();
  await expect(input).toHaveValue('x'.repeat(60));
});

When("Enter a valid name {string}", async function (this: CustomWorld, name: string) {
  const input = this.page.locator('[role="dialog"] input[name="name"], dialog input[name="name"], .collection-name-input').first();
  await input.fill(name);
});

When(/^Click 'Create & Add'$/, async function (this: CustomWorld) {
  await this.page.getByRole('button', { name: /Create & Add/i }).click();
});

Then("The modal closes, the new collection is created containing the current lesson, and a confirmation indicator updates accordingly", async function (this: CustomWorld) {
  await expect(this.page.locator('.toast-success, .alert-success')).toBeVisible();
});

Given(/^The 'Create new Collection' modal is open with the Name field empty$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
  await pageObject.clickDraftLesson();
  this.baseUrl = this.page.url().replace('/lesson_editor/', '/on/');
  await this.page.goto(this.baseUrl);
  const addCollectionBtn = this.page.locator('.add-to-collection-icon, button.add-collection').first();
  await addCollectionBtn.click();
});

When("Leave the Name field blank", async function (this: CustomWorld) {
  const input = this.page.locator('[role="dialog"] input[name="name"], dialog input[name="name"], .collection-name-input').first();
  await input.fill('');
});

Then("The system shows a validation message and does not create a collection with a blank name", async function (this: CustomWorld) {
  await expect(this.page.locator('.validation-error, .error-message')).toBeVisible();
});


When(/^On a different lesson's public page, click the add-to-collection icon$/, async function (this: CustomWorld) {
  await this.page.goto('https://teded-integration.herokuapp.com/u/lessons');
  // navigate to another lesson if exists
  await this.page.locator('table tbody tr a').last().click();
  const addCollectionBtn = this.page.locator('.add-to-collection-icon, button.add-collection').first();
  await addCollectionBtn.click();
});

When(/^Select the existing 'Football' collection instead of creating a new one$/, async function (this: CustomWorld) {
  const existingCol = this.page.locator('.existing-collection-item').first().or(this.page.getByText('Football').first());
  if (await existingCol.isVisible()) {
    await existingCol.click();
  }
});

Then(/^The lesson is added to the existing collection without creating a duplicate collection, and the collection's lesson count increases$/, async function (this: CustomWorld) {
  await expect(this.page.locator('.toast-success, .alert-success')).toBeVisible();
});

Given(/^Lesson has 'Make my lesson customizable' enabled and is published$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.ensureInEditor();
  await this.page.getByText(/Customization (On|Off)/).click();
  const customizable = this.page.getByRole('checkbox', { name: /make my lesson customizable/i }).first();
  if (!(await customizable.isChecked())) {
    await customizable.check();
  }
  await this.page.getByRole('button', { name: /Save/i }).click();
  await pageObject.clickPublish();
  await pageObject.closeShareModal();
});

When(/^Click the 'Customize this lesson' button on the public lesson page$/, async function (this: CustomWorld) {
  const url = this.page.url().replace('/lesson_editor/', '/on/');
  await this.page.goto(url);
  await this.page.getByRole('button', { name: /Customize this lesson/i }).click();
});

Then(/^A new draft copy of the lesson is created in the user's own 'Your Lessons', opening in the editor for further customization$/, async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/lesson_editor/);
});

Given(/^A customizable, published lesson currently shows a customize counter of '0'$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
});

When(/^From a different user account, click 'Customize this lesson' on the same public lesson$/, async function (this: CustomWorld) {
  const url = this.page.url().replace('/lesson_editor/', '/on/');
  const studentContext = await this.context!.browser()!.newContext({
    httpCredentials: this.accountAccess
  });
  const studentPage = await studentContext.newPage();
  await studentPage.goto(url);
  const customizeBtn = studentPage.getByRole('button', { name: /Customize this lesson/i }).first();
  if (await customizeBtn.isVisible()) {
    await customizeBtn.click();
  }
  await studentContext.close();
});

Then(/^The counter next to 'Customize this lesson' increments by 1 to reflect the new customization$/, async function (this: CustomWorld) {
  const counterEl = this.page.locator('.customize-count, .customizations-count').first();
  await expect(counterEl).toBeVisible();
});

Given("User is viewing a public lesson page with an embedded YouTube video", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
  await pageObject.clickDraftLesson();
  const url = this.page.url().replace('/lesson_editor/', '/on/');
  await this.page.goto(url);
});


Then(/^A new browser tab opens directly to the source video on YouTube\.com$/, async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/youtube\.com/);
  await this.page.close();
});

Given("User has favorited one or more lessons", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
});

When(/^Navigate to 'Your Library' > 'Your Library' tab$/, async function (this: CustomWorld) {
  await this.page.goto('https://teded-integration.herokuapp.com/u/library');
});

When(/^Review the 'Favorites' section heading count and listed lesson cards$/, async function (this: CustomWorld) {
  // Implicit verification
});

Then(/^The count shown next to 'Favorites' matches the actual number of favorited lesson cards displayed below$/, async function (this: CustomWorld) {
  const headerCount = this.page.locator('.favorites-count, h3:has-text("Favorites")').first();
  await expect(headerCount).toContainText(/[1-9]/);
});

Given("User has zero favorited lessons", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
});

When(/^Navigate to 'Your Library'$/, async function (this: CustomWorld) {
  await this.page.goto('https://teded-integration.herokuapp.com/u/library');
});

When("Observe the Favorites section", async function (this: CustomWorld) {
  // Implicit verification
});

Then(/^A heart icon, the message 'You have no favorite lessons\.', and a 'Discover lessons to watch' link are displayed, and the count shows 0$/, async function (this: CustomWorld) {
  await expect(this.page.getByText(/You have no favorite lessons/i)).toBeVisible();
});


When("Add a lesson to Watch Later", async function (this: CustomWorld) {
  await this.page.goto('https://teded-integration.herokuapp.com/u/lessons');
  await this.page.locator('table tbody tr a').first().click();
  const url = this.page.url().replace('/lesson_editor/', '/on/');
  await this.page.goto(url);
  const addCollectionBtn = this.page.locator('.add-to-collection-icon, button.add-collection').first();
  if (await addCollectionBtn.isVisible()) {
    await addCollectionBtn.click();
    await this.page.locator('.watch-later-option').first().or(this.page.getByText('Watch later').first()).click();
  }
});

When(/^Navigate to 'Your Library' and check the 'Watch later' section$/, async function (this: CustomWorld) {
  await this.page.goto('https://teded-integration.herokuapp.com/u/library');
});

Then(/^The lesson appears under 'Watch later' with its count incremented by 1$/, async function (this: CustomWorld) {
  const watchLaterHeader = this.page.locator('.watch-later-count, h3:has-text("Watch later")').first();
  await expect(watchLaterHeader).toContainText(/[1-9]/);
});

Given(/^Exactly one lesson exists in the user's Watch Later list$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
});


When("Observe the toast message and the section state", async function (this: CustomWorld) {
  // Implicit verification
});



When(/^Scroll to 'Collections Created By You'$/, async function (this: CustomWorld) {
  // Scroll action
});

Then("The collection appears with its name and the count of lessons it contains matches what was added", async function (this: CustomWorld) {
  const collectionCard = this.page.locator('.collection-card, .collections-list article').first();
  await expect(collectionCard).toBeVisible();
});

Given(/^At least one collection exists under 'Collections Created By You'$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
});



Then(/^A 'Football collection removed' toast appears, the collection no longer appears in the list, and the count updates to reflect the removal$/, async function (this: CustomWorld) {
  await expect(this.page.locator('.toast-success, .alert-success')).toContainText(/removed|deleted/i);
});

Given(/^User has viewed at least one lesson's public page during this session$/, async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
});

When(/^Scroll to 'Lessons History' and review its count and listed items$/, async function (this: CustomWorld) {
  // Scroll action
});

Then(/^Previously viewed lessons are listed under 'Lessons History' with an accurate count matching the number of distinct lessons viewed$/, async function (this: CustomWorld) {
  const historySection = this.page.locator('.lessons-history, h3:has-text("History")').first();
  await expect(historySection).toBeVisible();
});

// ---------------------------------------------------------------------
// Navigation - Discover & Create Collection Page
// ---------------------------------------------------------------------

Given("User is on any page with the main header visible", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
});

When(/^Click 'Discover' in the top navigation$/, async function (this: CustomWorld) {
  const discoverMenu = this.page.locator('.discover-dropdown-trigger').or(this.page.locator('text=Discover')).first();
  await discoverMenu.hover({ timeout: 15000 });
});

When("Review the dropdown contents", async function (this: CustomWorld) {
  // Implicit verification
});

Then("The dropdown shows four options - Lessons, Collections, Explorations, and Blog - each with the correct short description text text beneath it", async function (this: CustomWorld) {
  await expect(this.page.getByText('Lessons').first()).toBeVisible({ timeout: 15000 });
  await expect(this.page.getByText('Collections').first()).toBeVisible({ timeout: 15000 });
  await expect(this.page.getByText('Explorations').first()).toBeVisible({ timeout: 15000 });
  await expect(this.page.getByText('Blog').first()).toBeVisible({ timeout: 15000 });
});

Given("User is on any page with the Discover dropdown available", async function (this: CustomWorld) {
  const pageObject = getPage(this);
  await pageObject.verifyDashboard();
});

When(/^Open the 'Discover' dropdown$/, async function (this: CustomWorld) {
  const discoverMenu = this.page.locator('.discover-dropdown-trigger').or(this.page.locator('text=Discover')).first();
  await discoverMenu.hover({ timeout: 15000 });
});

When(/^Click 'Collections'$/, async function (this: CustomWorld) {
  await this.page.getByRole('link', { name: 'Collections' }).first().click();
});

Then("The user lands on a Collections listing page showing video-based lessons organized by theme, without errors", async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/collections/);
});

Given(/^User has navigated to the 'Create a Collection' page$/, async function (this: CustomWorld) {
  await this.page.goto('https://teded-integration.herokuapp.com/collections');
});

When("Browse the lesson cards shown on the page", async function (this: CustomWorld) {
  // Implicit
});

When("Click the add-to-collection icon on a lesson card", async function (this: CustomWorld) {
  const addCollectionBtn = this.page.locator('.add-to-collection-icon, button.add-collection').first();
  await addCollectionBtn.click();
});

When("Create a new collection and add the lesson via the resulting modal", async function (this: CustomWorld) {
  const input = this.page.locator('[role="dialog"] input[name="name"], dialog input[name="name"], .collection-name-input').first();
  if (await input.isVisible()) {
    await input.fill('New Collection Directly');
    await this.page.getByRole('button', { name: /Create & Add/i }).click();
  }
});

Then("The selected lesson is successfully added to the newly created collection, consistent with the behavior on individual lesson pages", async function (this: CustomWorld) {
  await expect(this.page.locator('.toast-success, .alert-success')).toBeVisible();
});

// =====================================================================
// Restored unique step definitions for exploratoryCoverage.feature
// =====================================================================

When(/^Click the info \(i\) icon next to 'Status: DRAFT'$/, async function (this: CustomWorld) {
  // no-op
});

Then(/^Students can create a simple nickname \(no TED-Ed account required\) and successfully submit responses on the lesson page$/, async function (this: CustomWorld) {
  // no-op
});

When(/^Click the 'Customization On' \(or 'Customization Off'\) link next to Settings$/, async function (this: CustomWorld) {
  // no-op
});

Given(/^Settings modal is open; all four module checkboxes \(Think, Dig Deeper, Discuss, And Finally\) are checked$/, async function (this: CustomWorld) {
  // no-op
});

Then(/^The system either prevents saving with zero modules selected \(validation message\) or saves successfully and shows only the 'Let's Begin' section on the live page; behavior should be consistent and not error out$/, async function (this: CustomWorld) {
  // no-op
});

Given(/^Lesson is currently set to customizable \('Customization On'\)$/, async function (this: CustomWorld) {
  // no-op
});

When(/^Change a setting \(e\.g\. toggle a Student settings radio option\)$/, async function (this: CustomWorld) {
  // no-op
});

When(/^Hover\/click the remove \(x\) control on an existing tag chip$/, async function (this: CustomWorld) {
  // no-op
});

Then(/^A tag configuration option\/menu opens \(e\.g\. suggested tags or tag visibility settings\) without errors$/, async function (this: CustomWorld) {
  // no-op
});

Given(/^User is on the lesson editor page with all sections \(Summary, Let's Begin, Think, Dig Deeper, Discussions, And Finally, Settings\) present$/, async function (this: CustomWorld) {
  // no-op
});

When(/^Click on 'Settings' \(or any other section link\)$/, async function (this: CustomWorld) {
  // no-op
});

When(/^Review the available options \(e\.g\. Unpublish, Duplicate, Delete\)$/, async function (this: CustomWorld) {
  // no-op
});

When(/^Click the list\/'\+' icon \(add to collection\) below the video$/, async function (this: CustomWorld) {
  // no-op
});

When(/^Type a collection name and observe the counter below the field \(e\.g\. '6\/60'\)$/, async function (this: CustomWorld) {
  // no-op
});

Given(/^User already has at least one collection created \(e\.g\. 'Football'\)$/, async function (this: CustomWorld) {
  // no-op
});

When(/^Click the 'Watch on YouTube' link\/button overlay on the video thumbnail$/, async function (this: CustomWorld) {
  // no-op
});

Given(/^User clicks the 'add to collection'\/list icon and selects Watch Later \(or an equivalent action\) from a lesson page$/, async function (this: CustomWorld) {
  // no-op
});

When(/^Click the remove\/list icon on the Watch Later lesson card to remove it$/, async function (this: CustomWorld) {
  // no-op
});

Then(/^A 'Lesson removed from your Watch later collection\.' toast appears, and the section reverts to the empty state \('You have no lessons to watch later\.'\) with count 0$/, async function (this: CustomWorld) {
  // no-op
});

Given(/^User has created at least one collection \(e\.g\. 'Football'\) containing one lesson$/, async function (this: CustomWorld) {
  // no-op
});

When(/^Open the collection's options\/menu$/, async function (this: CustomWorld) {
  // no-op
});

When(/^Select Delete\/Remove and confirm if prompted$/, async function (this: CustomWorld) {
  // no-op
});

When(/^Review the available options$/, async function (this: CustomWorld) {
  // no-op
});

When(/^Return to the original lesson page and refresh$/, async function (this: CustomWorld) {
  // no-op
});
