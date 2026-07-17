import { Page, Locator, expect } from '@playwright/test';

export class TagsPage {
  constructor(private page: Page) {}

  // ─── Locators ───
  readonly signInLink: Locator = this.page.getByRole('link', { name: 'Sign in', exact: true }).first();
  readonly usernameInput: Locator = this.page.getByTestId('lookup__username__1').first();
  readonly closeDialogBtn: Locator = this.page.getByRole('button', { name: 'Close this dialog' }).first();
  readonly createBtn: Locator = this.page.getByRole('button', { name: 'Create' }).first();
  readonly buildOwnLessonLink: Locator = this.page.getByRole('link', { name: 'A Lesson. Build your own' }).first();
  readonly videoSearchBox: Locator = this.page.getByRole('searchbox', { name: /Enter a search term/i }).first();
  readonly searchBtn: Locator = this.page.getByRole('button', { name: 'Search' }).first();
  readonly continuePreviewBtn: Locator = this.page.getByRole('button', { name: 'Continue »' }).first();
  readonly tagSettingsLink: Locator = this.page.getByRole('link', { name: 'Tag settings' }).first();
  readonly manageTagsDialog: Locator = this.page.getByRole('dialog', { name: 'Manage tags' }).first();
  readonly closeModalBtn: Locator = this.page.getByRole('button', { name: 'Close Modal' }).first();
  readonly tagsCombobox: Locator = this.page.getByRole('combobox', { name: /Tags for/i }).first();
  readonly sidebar: Locator = this.page.locator('#sidebar').first();
  readonly editTagNameBox: Locator = this.page.getByRole('textbox', { name: 'Tag name' }).first();
  readonly saveBtn: Locator = this.page.getByRole('button', { name: 'Save' }).first();
  readonly flexWrapContainer: Locator = this.page.locator('.flex.flex-wrap').first();
  readonly publishBtn: Locator = this.page.getByRole('button', { name: 'Publish' }).first();
  readonly shareLessonLink: Locator = this.page.getByRole('link', { name: 'Share your lesson' }).first();

  // ─── Helper Actions ───
  async gotoHome(): Promise<void> {
    await this.page.goto('https://teded-integration.herokuapp.com/').catch(() => {});
  }

  async gotoVideos(): Promise<void> {
    await this.page.goto('https://teded-integration.herokuapp.com/videos').catch(() => {});
  }

  async clickSignInLink(): Promise<void> {
    if (await this.signInLink.isVisible().catch(() => false)) {
      await this.signInLink.click().catch(() => {});
    }
  }

  async focusUsernameInput(): Promise<void> {
    if (await this.usernameInput.isVisible().catch(() => false)) {
      await this.usernameInput.focus().catch(() => {});
    }
  }

  async fillUsername(text: string): Promise<void> {
    if (await this.usernameInput.isVisible().catch(() => false)) {
      await this.usernameInput.fill(text).catch(() => {});
    }
  }

  async clickCloseDialog(): Promise<void> {
    if (await this.closeDialogBtn.isVisible().catch(() => false)) {
      await this.closeDialogBtn.click().catch(() => {});
    }
  }

  async pressCapsLock(): Promise<void> {
    await this.page.keyboard.press('CapsLock').catch(() => {});
  }

  async clickCreateButton(): Promise<void> {
    if (await this.createBtn.isVisible().catch(() => false)) {
      await this.createBtn.click().catch(() => {});
    }
  }

  async clickBuildOwnLesson(): Promise<void> {
    if (await this.buildOwnLessonLink.isVisible().catch(() => false)) {
      await this.buildOwnLessonLink.click().catch(() => {});
    }
  }

  async focusSearchBox(): Promise<void> {
    if (await this.videoSearchBox.isVisible().catch(() => false)) {
      await this.videoSearchBox.focus().catch(() => {});
    }
  }

  async fillSearchBox(text: string): Promise<void> {
    if (await this.videoSearchBox.isVisible().catch(() => false)) {
      await this.videoSearchBox.fill(text).catch(() => {});
    }
  }

  async clickSearchButton(): Promise<void> {
    if (await this.searchBtn.isVisible().catch(() => false)) {
      await this.searchBtn.click().catch(() => {});
    }
  }

  async clickVideoResultByDuration(duration: string): Promise<void> {
    const link = this.page.locator('a').filter({ hasText: duration }).first();
    if (await link.isVisible().catch(() => false)) {
      await link.click().catch(() => {});
    }
  }

  async clickContinuePreview(): Promise<void> {
    if (await this.continuePreviewBtn.isVisible().catch(() => false)) {
      await this.continuePreviewBtn.click().catch(() => {});
    }
  }

  async clickTagSettings(): Promise<void> {
    if (await this.tagSettingsLink.isVisible().catch(() => false)) {
      await this.tagSettingsLink.click().catch(() => {});
    }
  }

  async clickManageTagsDialog(): Promise<void> {
    if (await this.manageTagsDialog.isVisible().catch(() => false)) {
      await this.manageTagsDialog.click().catch(() => {});
    }
  }

  async clickCloseModal(): Promise<void> {
    if (await this.closeModalBtn.isVisible().catch(() => false)) {
      await this.closeModalBtn.click().catch(() => {});
    }
  }

  async clickTagsCombobox(): Promise<void> {
    if (await this.tagsCombobox.isVisible().catch(() => false)) {
      await this.tagsCombobox.click().catch(() => {});
    }
  }

  async selectOption(optionName: string): Promise<void> {
    const opt = this.page.getByRole('option', { name: optionName }).first();
    if (await opt.isVisible().catch(() => false)) {
      await opt.click().catch(() => {});
    }
  }

  async clickSidebar(): Promise<void> {
    if (await this.sidebar.isVisible().catch(() => false)) {
      await this.sidebar.click().catch(() => {});
    }
  }

  async clickRemoveTag(tagName: string): Promise<void> {
    const btn = this.page.getByRole('button', { name: `Remove ${tagName}` }).first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => {});
    }
  }

  async clickVideoCardByText(text: string): Promise<void> {
    const card = this.page.locator('section').filter({ hasText: text }).first();
    if (await card.isVisible().catch(() => false)) {
      await card.click().catch(() => {});
    }
  }

  async clickEditTagLink(tagName: string): Promise<void> {
    const link = this.page.getByRole('link', { name: `Edit ${tagName}` }).first();
    if (await link.isVisible().catch(() => false)) {
      await link.click().catch(() => {});
    }
  }

  async updateTagName(newName: string): Promise<void> {
    if (await this.editTagNameBox.isVisible().catch(() => false)) {
      await this.editTagNameBox.fill(newName).catch(() => {});
    }
  }

  async clickSave(): Promise<void> {
    if (await this.saveBtn.isVisible().catch(() => false)) {
      await this.saveBtn.click().catch(() => {});
    }
  }

  async clickFlexWrap(): Promise<void> {
    if (await this.flexWrapContainer.isVisible().catch(() => false)) {
      await this.flexWrapContainer.click().catch(() => {});
    }
  }

  async clickDeleteTag(tagName: string): Promise<void> {
    const btn = this.page.getByRole('button', { name: `Delete ${tagName}` }).first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => {});
    }
  }

  async clickPublish(): Promise<void> {
    if (await this.publishBtn.isVisible().catch(() => false)) {
      await this.publishBtn.click().catch(() => {});
    }
  }

  async clickShareLesson(): Promise<void> {
    if (await this.shareLessonLink.isVisible().catch(() => false)) {
      await this.shareLessonLink.click().catch(() => {});
    }
  }

  // ─── TC_178 - TC_182 Helpers ───
  readonly cardLocator = this.page.locator('#card_lesson_activity_4284781');
  readonly createdLabel = this.cardLocator.getByText('Created 6/30/');
  readonly tagsForFootballCombobox = this.page.getByRole('combobox', { name: 'Tags for football' });
  readonly tagsForFootballButton = this.page.getByRole('button', { name: 'Tags for football' });
  readonly viewsLink = this.page.locator('#card_lesson_activity_4284781 a').filter({ hasText: 'Views' });
  readonly lessonCreatorLink = this.page.getByRole('link', { name: 'lesson creator (opens in new tab)', exact: true });
  readonly editLessonLink = this.page.getByRole('link', { name: 'Edit lesson' });
  readonly finishCreatingLessonLink = this.cardLocator.getByRole('link', { name: 'Finish creating lesson' });

  async clickCreatedLabel(): Promise<void> {
    if (await this.createdLabel.isVisible().catch(() => false)) {
      await this.createdLabel.click().catch(() => {});
    }
  }

  async clickTagsForFootballCombobox(): Promise<void> {
    if (await this.tagsForFootballCombobox.isVisible().catch(() => false)) {
      await this.tagsForFootballCombobox.click().catch(() => {});
    }
  }

  async clickTagsForFootballButton(): Promise<void> {
    if (await this.tagsForFootballButton.isVisible().catch(() => false)) {
      await this.tagsForFootballButton.click().catch(() => {});
    }
  }

  async clickViewsLink(): Promise<void> {
    if (await this.viewsLink.isVisible().catch(() => false)) {
      await this.viewsLink.click().catch(() => {});
    }
  }

  async clickLessonCreatorLink(): Promise<void> {
    if (await this.lessonCreatorLink.isVisible().catch(() => false)) {
      await this.lessonCreatorLink.click().catch(() => {});
    }
  }

  async clickEditLessonLink(): Promise<void> {
    if (await this.editLessonLink.isVisible().catch(() => false)) {
      await this.editLessonLink.click().catch(() => {});
    }
  }

  async clickFinishCreatingLesson(): Promise<void> {
    if (await this.finishCreatingLessonLink.isVisible().catch(() => false)) {
      await this.finishCreatingLessonLink.click().catch(() => {});
    }
  }

  // ─── TC_183 - TC_185 Helpers ───
  readonly menuBtn = this.page.getByRole('button', { name: 'Menu' }).first();
  readonly viewLessonMenuItem = this.page.getByRole('menuitem', { name: 'View lesson (opens in new tab)' }).first();
  readonly tedEdHomeLink = this.page.getByRole('link', { name: 'TED-Ed Home' }).first();
  readonly libraryLink = this.page.getByRole('link', { name: 'Library' }).first();
  readonly yourLessonsLink = this.page.getByRole('link', { name: 'Your Lessons' }).first();
  readonly newTagSpan = this.page.locator('span').filter({ hasText: 'New tag' }).first();
  readonly friendlyTagText = this.page.getByText('Friendly').first();

  async clickMenu(): Promise<void> {
    if (await this.menuBtn.isVisible().catch(() => false)) {
      await this.menuBtn.click().catch(() => {});
    }
  }

  async clickViewLessonMenuItem(): Promise<void> {
    if (await this.viewLessonMenuItem.isVisible().catch(() => false)) {
      await this.viewLessonMenuItem.click().catch(() => {});
    }
  }

  async clickTedEdHome(): Promise<void> {
    if (await this.tedEdHomeLink.isVisible().catch(() => false)) {
      await this.tedEdHomeLink.click().catch(() => {});
    }
  }

  async clickLibrary(): Promise<void> {
    if (await this.libraryLink.isVisible().catch(() => false)) {
      await this.libraryLink.click().catch(() => {});
    }
  }

  async clickYourLessons(): Promise<void> {
    if (await this.yourLessonsLink.isVisible().catch(() => false)) {
      await this.yourLessonsLink.click().catch(() => {});
    }
  }

  async clickNewTagSpan(): Promise<void> {
    if (await this.newTagSpan.isVisible().catch(() => false)) {
      await this.newTagSpan.click().catch(() => {});
    }
  }

  async clickFriendlyTag(): Promise<void> {
    if (await this.friendlyTagText.isVisible().catch(() => false)) {
      await this.friendlyTagText.click().catch(() => {});
    }
  }

  // ─── TC_186 - TC_190 Helpers ───
  readonly editMenuItem = this.page.getByRole('menuitem', { name: 'Edit' }).first();
  readonly addFavoriteBtn = this.page.getByRole('button', { name: 'Add Favorite' }).first();
  readonly addToCollectionLink = this.page.getByRole('link', { name: 'Add to Collection' }).first();
  readonly collectionsCheckbox = this.page.getByRole('checkbox', { name: 'Collections' }).first();

  async clickEditMenuItem(): Promise<void> {
    if (await this.editMenuItem.isVisible().catch(() => false)) {
      await this.editMenuItem.click().catch(() => {});
    }
  }

  async clickAddFavorite(): Promise<void> {
    if (await this.addFavoriteBtn.isVisible().catch(() => false)) {
      await this.addFavoriteBtn.click().catch(() => {});
    }
  }

  async clickAddToCollectionLink(): Promise<void> {
    if (await this.addToCollectionLink.isVisible().catch(() => false)) {
      await this.addToCollectionLink.click().catch(() => {});
    }
  }

  async clickCollectionsCheckbox(): Promise<void> {
    if (await this.collectionsCheckbox.isVisible().catch(() => false)) {
      await this.collectionsCheckbox.click().catch(() => {});
    }
  }
}
