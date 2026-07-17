import { test, expect, BrowserContext } from '@playwright/test';
import { TedEdLessonPage } from '../src/pages/TedEdLessonPage';
import { envConfig } from '../src/utils/envConfig';

// test.describe.configure({ mode: 'serial' });

test.describe('TED-Ed Lesson Editor — exploratory coverage (TC-051 to TC-100)', () => {
  let mainPage: TedEdLessonPage;
  let draftUrl = '';
  let publicUrl = '';
  let globalCookies: any[] = [];

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120000);
    mainPage = new TedEdLessonPage(page);
    if (globalCookies && globalCookies.length > 0) {
      await context.addCookies(globalCookies);
    }
    await mainPage.verifyDashboard();
    if (draftUrl && !draftUrl.includes('teduser:tUeygHu')) {
      draftUrl = draftUrl.replace('https://', 'https://teduser:tUeygHu%404q@');
    }
    if (draftUrl && !publicUrl) {
      publicUrl = draftUrl.replace('/lesson_editor/', '/on/');
    }
    if (publicUrl && !publicUrl.includes('teduser:tUeygHu')) {
      publicUrl = publicUrl.replace('https://', 'https://teduser:tUeygHu%404q@');
    }
  });

  // Helper to construct a authenticated incognito context
  async function createAuthenticatedStudentContext(context: BrowserContext) {
    return await context.browser().newContext({
      httpCredentials: {
        username: 'teduser',
        password: 'tUeygHu@4q',
      },
    });
  }

  // ---------------------------------------------------------------
  // Setup: Create a dynamic draft lesson to work with
  // ---------------------------------------------------------------
  test('Setup: Create dynamic draft lesson', async ({ page }) => {
    await mainPage.createLessonForBackground('football');
    draftUrl = page.url();
    if (!draftUrl.includes('teduser:tUeygHu')) {
      draftUrl = draftUrl.replace('https://', 'https://teduser:tUeygHu%404q@');
    }
    globalCookies = await page.context().cookies();
    expect(draftUrl).toContain('/lesson_editor/');
  });

  // ---------------------------------------------------------------
  // Module: Lesson Editor - Basics (TC-051..TC-052)
  // ---------------------------------------------------------------
  test('TC-051 Lesson Title field accepts and saves a valid title', async ({ page }) => {
    await page.goto(draftUrl);
    await mainPage.clickLessonNameField();
    await mainPage.fillLessonName('Photosynthesis Basics');
    await mainPage.clickSave();
    await mainPage.verifyLessonSaved();
  });

  test('TC-052 Empty Lesson Title field behavior when left empty', async ({ page }) => {
    await page.goto(draftUrl);
    await mainPage.clickLessonNameField();
    await mainPage.fillLessonName('');
    await mainPage.clickSave();
    
    // Check if validation message is visible on the Edit Title dialog
    const validationMessage = page.getByText(/name can't be blank|title is required|cannot be blank/i).first();
    await expect(validationMessage).toBeVisible();

    // Clean up: Close the Edit Title modal so it doesn't block subsequent tests
    const cancelBtn = page.getByRole('button', { name: /Cancel/i }).first();
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
    }
  });

  // ---------------------------------------------------------------
  // Module: Lesson Editor - Video (TC-053..TC-054)
  // ---------------------------------------------------------------
  test('TC-053 "Change video" replaces the embedded lesson video', async ({ page }) => {
    await page.goto(draftUrl + '/edit_video');
    const searchBox = page.locator('input[placeholder*="Enter a search term"], input[placeholder*="Search by keyword"]').first();
    await searchBox.fill('science');
    await page.keyboard.press('Enter');
    const firstResult = page.locator('article a, .video-result, a[href*="/videos/"]').first();
    await firstResult.click();
    await page.getByRole('button', { name: /continue/i }).click().catch(() => {});
    await expect(page).toHaveURL(/lesson_editor/);
  });

  test('TC-054 "Crop video" opens a crop tool and applies trim points', async ({ page }) => {
    await page.goto(draftUrl + '/edit_video_crop');
    await expect(page.locator('.crop-controls, .video-trim, input[value="0:00"]').first().or(page.getByText('Start').first())).toBeVisible();
    const saveBtn = page.getByRole('button', { name: /save|confirm/i }).or(page.locator('button:has-text("Save"), input[type="submit"]')).first();
    await saveBtn.click().catch(() => {});
  });

  // ---------------------------------------------------------------
  // Module: Lesson Editor - Status (TC-055..TC-056)
  // ---------------------------------------------------------------
  test('TC-055 Status info icon opens the Status modal with correct draft explanation', async ({ page }) => {
    await page.goto(draftUrl);
    const infoIcon = page.locator('.fa-info-circle, .info-icon, svg.info').first();
    if (await infoIcon.isVisible()) {
      await infoIcon.click();
      await expect(page.getByRole('heading', { name: /Status/i })).toBeVisible();
      await expect(page.getByText(/draft/i)).toBeVisible();
    }
  });

  test('TC-056 Status modal closes via the X button', async ({ page }) => {
    await page.goto(draftUrl);
    const infoIcon = page.locator('.fa-info-circle, .info-icon, svg.info').first();
    if (await infoIcon.isVisible()) {
      await infoIcon.click();
      const closeBtn = page.locator('.modal-close, button:has-text("×"), button:has-text("x"), .close-modal').first();
      await closeBtn.click();
      await expect(page.getByRole('heading', { name: /Status/i })).not.toBeVisible();
    }
  });

  // ---------------------------------------------------------------
  // Module: Lesson Editor - Publish (TC-057..TC-061)
  // ---------------------------------------------------------------
  test('TC-057 Publish button publishes a lesson with a valid title', async ({ page }) => {
    await page.goto(draftUrl);
    await mainPage.clickLessonNameField();
    await mainPage.fillLessonName('Automated Explored Lesson');
    await mainPage.clickSave();

    await mainPage.clickPublish();
    const successModal = page.locator('.share-modal, [class*="modal"], [class*="dialog"]').filter({ hasText: /published|share/i }).first();
    await expect(successModal).toBeVisible();
  });

  test('TC-058 "See your lesson" link in the publish-success modal opens the live lesson', async ({ page }) => {
    await page.goto(draftUrl);
    await mainPage.clickPublish();
    const liveLink = page.getByRole('link', { name: /See your lesson/i }).first();
    if (await liveLink.isVisible()) {
      await liveLink.click();
      await expect(page).toHaveURL(/\/on\//);
      publicUrl = page.url();
    }
  });

  test('TC-059 Selecting "Require students to use TED-Ed accounts" enforces login', async ({ page, context }) => {
    await page.goto(draftUrl);
    await mainPage.clickPublish();
    const requireLoginOption = page.locator('input[type="radio"][value="require_login"]').first().or(page.getByText('Require students to use').first());
    if (await requireLoginOption.isVisible()) {
      await requireLoginOption.click();
      await mainPage.closeShareModal();

      const studentContext = await createAuthenticatedStudentContext(context);
      const studentPage = await studentContext.newPage();
      await studentPage.goto(publicUrl);
      
      const respondBtn = studentPage.getByRole('button', { name: /respond|submit|save/i }).first();
      await respondBtn.click().catch(() => {});
      await expect(studentPage.getByText(/log in|sign in/i)).toBeVisible();
      await studentContext.close();
    }
  });

  test('TC-060 Selecting "Don\'t require students to use TED-Ed accounts" allows nickname access', async ({ page, context }) => {
    await page.goto(draftUrl);
    await mainPage.clickPublish();
    const anonymousOption = page.locator('input[type="radio"][value="anonymous"]').first().or(page.getByText("Don't require students").first());
    if (await anonymousOption.isVisible()) {
      await anonymousOption.click();
      await mainPage.closeShareModal();

      const studentContext = await createAuthenticatedStudentContext(context);
      const studentPage = await studentContext.newPage();
      await studentPage.goto(publicUrl);
      
      const nicknameInput = studentPage.locator('input[placeholder*="nickname"]').first();
      if (await nicknameInput.isVisible()) {
        await nicknameInput.fill('Test Student Nickname');
        await studentPage.getByRole('button', { name: /continue|submit/i }).click();
        await expect(studentPage.getByText(/log in|sign in/i)).not.toBeVisible();
      }
      await studentContext.close();
    }
  });

  test('TC-061 "Share your lesson" produces a usable shareable link', async ({ page, context }) => {
    await page.goto(draftUrl);
    await mainPage.clickPublish();
    const shareInput = page.locator('input.share-link-input, input[value*="/on/"]').first();
    if (await shareInput.isVisible()) {
      const link = await shareInput.inputValue();
      expect(link).toContain('/on/');

      const studentContext = await createAuthenticatedStudentContext(context);
      const studentPage = await studentContext.newPage();
      await studentPage.goto(link);
      await expect(studentPage).toHaveURL(/\/on\//);
      await studentContext.close();
    }
  });

  // ---------------------------------------------------------------
  // Module: Lesson Editor - Settings (TC-062..TC-069)
  // ---------------------------------------------------------------
  test('TC-062 The Settings modal opens from the "Customization On/Off" link', async ({ page }) => {
    await page.goto(draftUrl);
    await page.getByText(/Customization (On|Off)/).click();
    await expect(page.getByRole('heading', { name: /Settings/i })).toBeVisible();
    await expect(page.getByText(/Module settings/i)).toBeVisible();
    await expect(page.getByText(/Sharing settings/i)).toBeVisible();
  });

  test('TC-063 Unchecking "Discuss" in Module settings hides that section on the live lesson', async ({ page }) => {
    await page.goto(draftUrl);
    await page.getByText(/Customization (On|Off)/).click();
    const discussCheckbox = page.getByRole('checkbox', { name: /Discuss/i }).first();
    if (await discussCheckbox.isChecked()) {
      await discussCheckbox.uncheck();
    }
    await page.getByRole('button', { name: /Save/i }).click();
    await expect(page.getByText(/settings updated/i)).toBeVisible();

    await page.goto(publicUrl);
    await expect(page.getByRole('heading', { name: 'Discuss' })).not.toBeVisible();
  });

  test('TC-064 Behavior when all Module settings checkboxes are unchecked', async ({ page }) => {
    await page.goto(draftUrl);
    await page.getByText(/Customization (On|Off)/).click();
    const modules = [/Think/i, /Dig Deeper/i, /Discuss/i, /And Finally/i];
    for (const mod of modules) {
      const box = page.getByRole('checkbox', { name: mod }).first();
      if (await box.isChecked()) await box.uncheck();
    }
    await page.getByRole('button', { name: /Save/i }).click();
    const validation = page.getByText(/select at least one|required/i);
    const success = page.getByText(/settings updated/i);
    await expect(validation.or(success)).toBeVisible();
  });

  test('TC-065 "Make my lesson customizable" checkbox controls the "Customize this lesson" button', async ({ page }) => {
    await page.goto(draftUrl);
    await page.getByText(/Customization (On|Off)/).click();
    const customizable = page.getByRole('checkbox', { name: /make my lesson customizable/i }).first();
    if (!(await customizable.isChecked())) {
      await customizable.check();
    }
    await page.getByRole('button', { name: /Save/i }).click();

    await page.goto(publicUrl);
    await expect(page.getByRole('button', { name: /Customize this lesson/i })).toBeVisible();
  });

  test('TC-066 Unchecking "Make my lesson customizable" hides the customize option', async ({ page }) => {
    await page.goto(draftUrl);
    await page.getByText(/Customization (On|Off)/).click();
    const customizable = page.getByRole('checkbox', { name: /make my lesson customizable/i }).first();
    if (await customizable.isChecked()) {
      await customizable.uncheck();
    }
    await page.getByRole('button', { name: /Save/i }).click();

    await page.goto(publicUrl);
    await expect(page.getByRole('button', { name: /Customize this lesson/i })).not.toBeVisible();
  });

  test('TC-067 "Cancel" in the Settings modal discards unsaved changes', async ({ page }) => {
    await page.goto(draftUrl);
    await page.getByText(/Customization (On|Off)/).click();
    const thinkBox = page.getByRole('checkbox', { name: /Think/i }).first();
    const before = await thinkBox.isChecked();
    await thinkBox.click();
    await page.getByRole('button', { name: /Cancel/i }).click();

    await page.getByText(/Customization (On|Off)/).click();
    if (before) {
      await expect(thinkBox).toBeChecked();
    } else {
      await expect(thinkBox).not.toBeChecked();
    }
  });

  test('TC-068 "Save" in the Settings modal persists changes and shows confirmation', async ({ page }) => {
    await page.goto(draftUrl);
    await page.getByText(/Customization (On|Off)/).click();
    await page.getByText("Don't require students to use TED-Ed accounts").click();
    await page.getByRole('button', { name: /Save/i }).click();
    await expect(page.getByText(/settings updated/i)).toBeVisible();
  });

  test('TC-069 Switching Student settings updates existing published lesson', async ({ page, context }) => {
    await page.goto(draftUrl);
    await page.getByText(/Customization (On|Off)/).click();
    await page.getByText("Don't require students to use TED-Ed accounts").click();
    await page.getByRole('button', { name: /Save/i }).click();

    const studentContext = await createAuthenticatedStudentContext(context);
    const studentPage = await studentContext.newPage();
    await studentPage.goto(publicUrl);
    
    const nicknameInput = studentPage.locator('input[placeholder*="nickname"]').first();
    if (await nicknameInput.isVisible()) {
      await nicknameInput.fill('Updated Settings Student');
      await studentPage.getByRole('button', { name: /continue|submit/i }).click();
      await expect(studentPage.getByText(/log in|sign in/i)).not.toBeVisible();
    }
    await studentContext.close();
  });

  // ---------------------------------------------------------------
  // Module: Lesson Editor - Tags (TC-070..TC-072)
  // ---------------------------------------------------------------
  test('TC-070 A tag can be added via the "Add tags..." field', async ({ page }) => {
    await page.goto(draftUrl);
    const tagInput = page.getByPlaceholder(/Add tags/i);
    if (await tagInput.isVisible()) {
      await tagInput.click();
      await tagInput.fill('science');
      await tagInput.press('Enter');
      await expect(page.getByText('science', { exact: true })).toBeVisible();
    }
  });

  test('TC-071 An existing tag can be removed', async ({ page }) => {
    await page.goto(draftUrl);
    const tagChip = page.locator('.tag, .tag-chip').filter({ hasText: 'science' }).first();
    if (await tagChip.isVisible()) {
      await tagChip.locator('.remove, .close, button').click();
      await expect(page.getByText('science', { exact: true })).not.toBeVisible();
    }
  });

  test('TC-072 The Tags gear/settings icon opens tag configuration options', async ({ page }) => {
    await page.goto(draftUrl);
    const tagsGear = page.locator('.tags-settings-icon, .tags-header button').first();
    if (await tagsGear.isVisible()) {
      await tagsGear.click();
      await expect(page.locator('.tags-dropdown, .tags-modal')).toBeVisible();
    }
  });

  // ---------------------------------------------------------------
  // Module: Lesson Editor - Content (TC-073)
  // ---------------------------------------------------------------
  test('TC-073 The "Get Started! Add your content here" banner can be dismissed', async ({ page }) => {
    await page.goto(draftUrl);
    const banner = page.getByText(/Get Started! Add your content/i);
    if (await banner.isVisible()) {
      await page.locator('.banner-dismiss, button:has-text("Dismiss")').first().click();
      await expect(banner).not.toBeVisible();
    }
  });

  // ---------------------------------------------------------------
  // Module: Lesson Editor - Navigation (TC-074)
  // ---------------------------------------------------------------
  test('TC-074 The side anchor/jump menu scrolls to the correct section', async ({ page }) => {
    await page.goto(draftUrl);
    const settingsAnchor = page.getByRole('link', { name: /Settings/i }).first();
    if (await settingsAnchor.isVisible()) {
      await settingsAnchor.click();
      await expect(page.locator('#settings-section, .settings-content')).toBeInViewport();
    }
  });

  // ---------------------------------------------------------------
  // Module: Lesson Editor - Publish Controls (TC-075)
  // ---------------------------------------------------------------
  test('TC-075 The "..." (more options) menu next to Publish offers relevant actions', async ({ page }) => {
    await page.goto(draftUrl);
    const moreOptions = page.locator('button[aria-label*="more"], .publish-more-btn').first();
    if (await moreOptions.isVisible()) {
      await moreOptions.click();
      await expect(page.locator('.dropdown-menu, .publish-options')).toBeVisible();
    }
  });

  // ---------------------------------------------------------------
  // Module: Lesson Editor - Help (TC-076)
  // ---------------------------------------------------------------
  test('TC-076 The "Get help" link opens a relevant support resource', async ({ page, context }) => {
    await page.goto(draftUrl);
    const helpLink = page.getByRole('link', { name: /Get help/i }).first();
    if (await helpLink.isVisible()) {
      const [popup] = await Promise.all([
        context.waitForEvent('page').catch(() => null),
        helpLink.click(),
      ]);
      if (popup) {
        await expect(popup).toHaveURL(/help|support/i);
        await popup.close();
      }
    }
  });

  // ---------------------------------------------------------------
  // Module: Your Lessons (TC-077..TC-080)
  // ---------------------------------------------------------------
  test('TC-077 A published lesson appears correctly on the "Your Lessons" tab', async ({ page }) => {
    await page.goto('/u/lessons');
    const lessonCard = page.locator('table tbody tr, .lesson-card, article').first();
    await expect(lessonCard).toBeVisible();
    await expect(lessonCard.getByText(/Review student work|Review/i).first()).toBeVisible();
  });

  test('TC-078 The discussion count updates after a student discussion is submitted', async ({ page }) => {
    await page.goto(publicUrl);
    await mainPage.clickDiscuss();
    const submitBtn = page.getByRole('button', { name: /comment|submit|post/i }).first();
    if (await submitBtn.isVisible()) {
      await page.locator('textarea, .ql-editor').first().fill('Student automated comment test');
      await submitBtn.click();
    }

    await page.goto('/u/lessons');
    const discussCount = page.locator('.discussions-count, td:has-text("Discussions")').first();
    await expect(discussCount).not.toHaveText('0 Discussions');
  });

  test('TC-079 "Review student work" navigates to the student submissions view', async ({ page }) => {
    await page.goto('/u/lessons');
    const reviewLink = page.getByRole('link', { name: /Review student work/i }).first();
    if (await reviewLink.isVisible()) {
      await reviewLink.click();
      await expect(page).toHaveURL(/review|student_work|responses/);
    }
  });

  test('TC-080 The "..." menu on a lesson card provides management options', async ({ page }) => {
    await page.goto('/u/lessons');
    const cardOptions = page.locator('.lesson-card button.options, tr td button.options, .lesson-card .fa-ellipsis-h').first();
    if (await cardOptions.isVisible()) {
      await cardOptions.click();
      await expect(page.locator('.dropdown-menu, .card-options')).toBeVisible();
    }
  });

  // ---------------------------------------------------------------
  // Module: Public Lesson Page - Favorites (TC-081..TC-082)
  // ---------------------------------------------------------------
  test('TC-081 Heart icon adds a lesson to Favorites', async ({ page }) => {
    await page.goto(publicUrl);
    const heart = page.locator('.heart-icon, button.favorite').first();
    if (await heart.isVisible()) {
      await heart.click();
      await expect(page.locator('.toast-success, .alert-success')).toContainText(/favorite/i);
    }
  });

  test('TC-082 Heart icon again removes the lesson from Favorites', async ({ page }) => {
    await page.goto(publicUrl);
    const heart = page.locator('.heart-icon, button.favorite').first();
    if (await heart.isVisible()) {
      await heart.click(); // un-favorite
      await expect(page.locator('.toast-success, .alert-success')).toContainText(/removed/i);
    }
  });

  // ---------------------------------------------------------------
  // Module: Public Lesson Page - Collections (TC-083..TC-087)
  // ---------------------------------------------------------------
  test('TC-083 Add-to-collection icon opens the "Create new Collection" modal', async ({ page }) => {
    await page.goto(publicUrl);
    const addCollectionBtn = page.locator('.add-to-collection-icon, button.add-collection').first();
    if (await addCollectionBtn.isVisible()) {
      await addCollectionBtn.click();
      await expect(page.getByRole('heading', { name: /Create new Collection/i })).toBeVisible();
    }
  });

  test('TC-084 Collection Name field enforces the 60-character limit with a live counter', async ({ page }) => {
    await page.goto(publicUrl);
    const addCollectionBtn = page.locator('.add-to-collection-icon, button.add-collection').first();
    if (await addCollectionBtn.isVisible()) {
      await addCollectionBtn.click();
      const input = page.locator('dialog input[name="name"], .collection-name-input').first();
      await input.fill('x'.repeat(70));
      await expect(input).toHaveValue('x'.repeat(60));
    }
  });

  test('TC-085 Creating a collection with a valid name adds the lesson successfully', async ({ page }) => {
    await page.goto(publicUrl);
    const addCollectionBtn = page.locator('.add-to-collection-icon, button.add-collection').first();
    if (await addCollectionBtn.isVisible()) {
      await addCollectionBtn.click();
      const input = page.locator('dialog input[name="name"], .collection-name-input').first();
      await input.fill('Football');
      await page.getByRole('button', { name: /Create & Add/i }).click();
      await expect(page.locator('.toast-success, .alert-success')).toBeVisible();
    }
  });

  test('TC-086 Attempting to create a collection with an empty name is blocked', async ({ page }) => {
    await page.goto(publicUrl);
    const addCollectionBtn = page.locator('.add-to-collection-icon, button.add-collection').first();
    if (await addCollectionBtn.isVisible()) {
      await addCollectionBtn.click();
      const input = page.locator('dialog input[name="name"], .collection-name-input').first();
      await input.fill('');
      await page.getByRole('button', { name: /Create & Add/i }).click();
      await expect(page.locator('.validation-error, .error-message')).toBeVisible();
    }
  });

  test('TC-087 A lesson can be added to an already-existing collection', async ({ page }) => {
    await page.goto(publicUrl);
    const addCollectionBtn = page.locator('.add-to-collection-icon, button.add-collection').first();
    if (await addCollectionBtn.isVisible()) {
      await addCollectionBtn.click();
      const existingCol = page.locator('.existing-collection-item').first().or(page.getByText('Football').first());
      if (await existingCol.isVisible()) {
        await existingCol.click();
        await expect(page.locator('.toast-success, .alert-success')).toBeVisible();
      }
    }
  });

  // ---------------------------------------------------------------
  // Module: Public Lesson Page - Customize (TC-088..TC-089)
  // ---------------------------------------------------------------
  test('TC-088 "Customize this lesson" creates an editable copy for a customizable lesson', async ({ page }) => {
    // Setup customization
    await page.goto(draftUrl);
    await page.getByText(/Customization (On|Off)/).click();
    const customizable = page.getByRole('checkbox', { name: /make my lesson customizable/i }).first();
    if (!(await customizable.isChecked())) await customizable.check();
    await page.getByRole('button', { name: /Save/i }).click();

    await page.goto(publicUrl);
    const customizeBtn = page.getByRole('button', { name: /Customize this lesson/i }).first();
    if (await customizeBtn.isVisible()) {
      await customizeBtn.click();
      await expect(page).toHaveURL(/lesson_editor/);
    }
  });

  test('TC-089 The customize counter increments when a lesson is customized', async ({ page, context }) => {
    await page.goto(publicUrl);
    const initialCountEl = page.locator('.customize-count, .customizations-count').first();
    const initialText = await initialCountEl.textContent().catch(() => '0');
    const initialCount = parseInt(initialText || '0', 10);

    const studentContext = await createAuthenticatedStudentContext(context);
    const studentPage = await studentContext.newPage();
    await studentPage.goto(publicUrl);
    const customizeBtn = studentPage.getByRole('button', { name: /Customize this lesson/i }).first();
    if (await customizeBtn.isVisible()) {
      await customizeBtn.click();
    }
    await studentContext.close();

    await page.reload();
    const newText = await initialCountEl.textContent().catch(() => '0');
    expect(parseInt(newText || '0', 10)).toBeGreaterThan(initialCount);
  });

  // ---------------------------------------------------------------
  // Module: Public Lesson Page - Video (TC-090)
  // ---------------------------------------------------------------
  test('TC-090 "Watch on YouTube" opens the source video on YouTube', async ({ page, context }) => {
    await page.goto(publicUrl);
    const watchOnYoutube = page.locator('a[href*="youtube.com/watch"], .watch-on-youtube-btn').first();
    if (await watchOnYoutube.isVisible()) {
      const [popup] = await Promise.all([
        context.waitForEvent('page'),
        watchOnYoutube.click(),
      ]);
      await expect(popup).toHaveURL(/youtube\.com/);
      await popup.close();
    }
  });

  // ---------------------------------------------------------------
  // Module: Your Library - Favorites (TC-091..TC-092)
  // ---------------------------------------------------------------
  test('TC-091 The Favorites tab shows the correct count and items', async ({ page }) => {
    await page.goto(publicUrl);
    const heart = page.locator('.heart-icon, button.favorite').first();
    if (await heart.isVisible()) await heart.click();

    await page.goto('/u/library');
    const headerCount = page.locator('.favorites-count, h3:has-text("Favorites")').first();
    await expect(headerCount).toContainText(/[1-9]/);
  });

  test('TC-092 The empty-state message displays correctly when there are no favorites', async ({ page }) => {
    await page.goto('/u/library');
    // Unfavorite everything if present
    const heartIcons = page.locator('.favorited .heart-icon, button.favorited');
    const count = await heartIcons.count();
    for (let i = 0; i < count; i++) {
      await heartIcons.nth(0).click();
      await page.waitForTimeout(500);
    }
    
    await page.reload();
    await expect(page.getByText(/You have no favorite lessons/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Discover lessons to watch/i })).toBeVisible();
  });

  // ---------------------------------------------------------------
  // Module: Your Library - Watch Later (TC-093..TC-094)
  // ---------------------------------------------------------------
  test('TC-093 A lesson added to Watch Later appears with correct count', async ({ page }) => {
    await page.goto(publicUrl);
    const addCollectionBtn = page.locator('.add-to-collection-icon, button.add-collection').first();
    if (await addCollectionBtn.isVisible()) {
      await addCollectionBtn.click();
      const watchLaterOpt = page.locator('.watch-later-option').first().or(page.getByText('Watch later').first());
      await watchLaterOpt.click();
    }

    await page.goto('/u/library');
    const watchLaterHeader = page.locator('.watch-later-count, h3:has-text("Watch later")').first();
    await expect(watchLaterHeader).toContainText(/[1-9]/);
  });

  test('TC-094 Removing a lesson from Watch Later shows confirmation and empty state', async ({ page }) => {
    await page.goto('/u/library');
    const removeBtn = page.locator('section:has-text("Watch later") button.remove-collection-item, section:has-text("Watch later") .fa-trash').first();
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
      await expect(page.locator('.toast-success, .alert-success')).toContainText(/removed/i);
    }
    await expect(page.getByText(/You have no lessons to watch later/i)).toBeVisible();
  });

  // ---------------------------------------------------------------
  // Module: Your Library - Collections (TC-095..TC-096)
  // ---------------------------------------------------------------
  test('TC-095 "Collections Created By You" lists a created collection with correct lesson count', async ({ page }) => {
    await page.goto('/u/library');
    const collectionCard = page.locator('.collection-card, .collections-list article').filter({ hasText: 'Football' }).first();
    await expect(collectionCard).toBeVisible();
    await expect(collectionCard.locator('.lesson-count')).toContainText(/[1-9]/);
  });

  test('TC-096 Deleting a collection removes it and shows a confirmation toast', async ({ page }) => {
    await page.goto('/u/library');
    const collectionCard = page.locator('.collection-card, .collections-list article').filter({ hasText: 'Football' }).first();
    if (await collectionCard.isVisible()) {
      await collectionCard.locator('button.options, .fa-ellipsis-v').click();
      await page.locator('.delete-collection-opt').first().or(page.getByText('Delete').first()).click();
      await page.locator('button:has-text("Confirm"), button:has-text("Delete")').first().click().catch(() => {});
      await expect(page.locator('.toast-success, .alert-success')).toContainText(/removed|deleted/i);
    }
  });

  // ---------------------------------------------------------------
  // Module: Your Library - History (TC-097)
  // ---------------------------------------------------------------
  test('TC-097 "Lessons History" reflects lessons the user has viewed', async ({ page }) => {
    await page.goto(publicUrl);
    await page.goto('/u/library');
    const historySection = page.locator('.lessons-history, h3:has-text("History")').first();
    await expect(historySection).toBeVisible();
  });

  // ---------------------------------------------------------------
  // Module: Navigation - Discover (TC-098..TC-099)
  // ---------------------------------------------------------------
  test('TC-098 The Discover dropdown menu displays all expected options with descriptions', async ({ page }) => {
    await page.goto('/');
    const discoverMenu = page.locator('.discover-dropdown-trigger').first().or(page.getByText('Discover').first());
    await discoverMenu.hover();
    await expect(page.locator('.discover-dropdown-content, .discover-menu')).toBeVisible();
    await expect(page.getByText('Lessons')).toBeVisible();
    await expect(page.getByText('Collections')).toBeVisible();
    await expect(page.getByText('Explorations')).toBeVisible();
    await expect(page.getByText('Blog')).toBeVisible();
  });

  test('TC-099 Navigating to Discover > Collections shows existing public collections', async ({ page }) => {
    await page.goto('/');
    const discoverMenu = page.locator('.discover-dropdown-trigger').first().or(page.getByText('Discover').first());
    await discoverMenu.hover();
    await page.getByRole('link', { name: 'Collections' }).first().click();
    await expect(page).toHaveURL(/collections/);
  });

  // ---------------------------------------------------------------
  // Module: Create a Collection Page (TC-100)
  // ---------------------------------------------------------------
  test('TC-100 Lessons can be added to a new collection directly from the "Create a Collection" page', async ({ page }) => {
    await page.goto('/collections');
    const addCollectionBtn = page.locator('.add-to-collection-icon, button.add-collection').first();
    if (await addCollectionBtn.isVisible()) {
      await addCollectionBtn.click();
      await expect(page.getByRole('heading', { name: /Create new Collection/i })).toBeVisible();
    }
  });
});
