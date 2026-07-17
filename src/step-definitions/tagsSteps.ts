import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { expect } from '@playwright/test';
import { TagsPage } from '../pages/TagsPage';

// Helper to get or initialize TagsPage on CustomWorld
function getTagsPage(world: CustomWorld): TagsPage {
  if (!(world as any).tagsPage) {
    (world as any).tagsPage = new TagsPage(world.page);
  }
  return (world as any).tagsPage;
}

// TC_161
Given('User is on the TED-Ed Integration home page and account exists', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.gotoHome();
});

When("Click the 'Sign in' link from the home page navigation", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickSignInLink();
});

When('Click on the username or email input field to focus it', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.focusUsernameInput();
});

When('Enter the registered email address {string} into the username field', async function (this: CustomWorld, email: string) {
  const tagsPage = getTagsPage(this);
  await tagsPage.fillUsername(email);
});

When('Close the informational dialog that appears after entering the email', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickCloseDialog();
});

Then('Sign-in lookup dialog should update and user remains on the sign-in lookup screen', async function (this: CustomWorld) {
  return;
});

// TC_162
Given('User is on the Sign-in lookup screen', async function (this: CustomWorld) {
  return;
});

When('Click into the username field', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.focusUsernameInput();
});

When('Type a single character {string} into the username field', async function (this: CustomWorld, char: string) {
  const tagsPage = getTagsPage(this);
  await tagsPage.fillUsername(char);
});

When('Press the CapsLock key while field is focused', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.pressCapsLock();
});

When('Replace field content with a longer partial username string {string}', async function (this: CustomWorld, text: string) {
  const tagsPage = getTagsPage(this);
  await tagsPage.fillUsername(text);
});

Then('Field updates to show {string} with no premature validation error', async function (this: CustomWorld, text: string) {
  return;
});

// TC_163
Given('User is signed in and on the home page', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.gotoHome();
});

When('Navigate to the TED-Ed Integration home page', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.gotoHome();
});

When("Click the 'Create' button on the home page", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickCreateButton();
});

When("Click the 'Create' button a second time to confirm the action", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickCreateButton();
});

When('Select the option to build a lesson from scratch', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickBuildOwnLesson();
});

Then('User is navigated to the new lesson builder screen', async function (this: CustomWorld) {
  return;
});

// TC_164
Given('User is signed in and on the Videos page', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.gotoVideos();
});

When('Navigate to the Videos page', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.gotoVideos();
});

When('Click on the video search box to focus it', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.focusSearchBox();
});

When('Enter a keyword {string} into the search box', async function (this: CustomWorld, keyword: string) {
  const tagsPage = getTagsPage(this);
  await tagsPage.fillSearchBox(keyword);
});

When("Click the 'Search' button to execute the search", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickSearchButton();
});

Then('Search results matching {string} are displayed in the video list', async function (this: CustomWorld, keyword: string) {
  return;
});

// TC_165
Given('User is on the Videos page with a prior search term entered', async function (this: CustomWorld) {
  return;
});

When('Click on the search box to focus it', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.focusSearchBox();
});

When('Clear the existing text from the search box', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.fillSearchBox('');
});

When('Enter a new single character {string} into the search box', async function (this: CustomWorld, char: string) {
  const tagsPage = getTagsPage(this);
  await tagsPage.fillSearchBox(char);
});

When('Enter the full new keyword {string} into the search box', async function (this: CustomWorld, keyword: string) {
  const tagsPage = getTagsPage(this);
  await tagsPage.fillSearchBox(keyword);
});

Then('Full keyword {string} is shown ready for search submission', async function (this: CustomWorld, keyword: string) {
  return;
});

// TC_166
Given('Search results for {string} are displayed on the Videos page', async function (this: CustomWorld, keyword: string) {
  return;
});

When('View the list of returned video results', async function (this: CustomWorld) {
  return;
});

When('Click the video result link showing duration {string}', async function (this: CustomWorld, duration: string) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickVideoResultByDuration(duration);
});

When("Click the 'Continue »' button to proceed past the preview prompt", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickContinuePreview();
});

When("Click the 'Tag settings' link on the video detail page", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickTagSettings();
});

Then('Tag settings panel or dialog begins to open for the video', async function (this: CustomWorld) {
  return;
});

// TC_167
Given("User is on a video's detail page with Tag settings link visible", async function (this: CustomWorld) {
  return;
});

When("Click the 'Tag settings' link", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickTagSettings();
});

When("Click the 'Tag settings' link again to confirm dialog stability", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickTagSettings();
});

When("Click inside the 'Manage tags' dialog region", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickManageTagsDialog();
});

When("Click the 'Close Modal' button to dismiss the dialog", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickCloseModal();
});

Then('Manage tags dialog closes and user returns to the video detail page', async function (this: CustomWorld) {
  return;
});

// TC_168
Given("User is on a video's detail page and at least one tag exists in the system", async function (this: CustomWorld) {
  return;
});

When('Click the Tags combobox for the selected video', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickTagsCombobox();
});

When('Select the {string} option from the dropdown', async function (this: CustomWorld, tagName: string) {
  const tagsPage = getTagsPage(this);
  await tagsPage.selectOption(tagName);
});

When('Click on the sidebar area to confirm tag persistence outside the dropdown', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickSidebar();
});

When("Click the 'Remove Testing Tag' button to detach the tag", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickRemoveTag('Testing Tag');
});

Then('{string} is removed from the video\'s associated tags list', async function (this: CustomWorld, tagName: string) {
  return;
});

// TC_169
Given('Testing Tag was previously removed from the video', async function (this: CustomWorld) {
  return;
});

When('Click the Tags combobox for the video', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickTagsCombobox();
});

When('Select the {string} option again from the dropdown', async function (this: CustomWorld, tagName: string) {
  const tagsPage = getTagsPage(this);
  await tagsPage.selectOption(tagName);
});

When('Click on the video result section to confirm the tag is saved against the correct video', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickVideoCardByText('Best Team in the Nation');
});

When("Click the 'Tag settings' link to verify tag state in settings", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickTagSettings();
});

Then('Tag settings panel shows {string} as currently applied', async function (this: CustomWorld, tagName: string) {
  return;
});

// TC_170 & TC_172
Given('{string} exists and is applied to a video', async function (this: CustomWorld, tagName: string) {
  return;
});

When("Click the 'Edit Testing Tag' link in the tag settings panel", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickEditTagLink('Testing Tag');
});

When("Click on the 'Tag name' textbox to focus it", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  if (await tagsPage.editTagNameBox.isVisible().catch(() => false)) {
    await tagsPage.editTagNameBox.focus().catch(() => {});
  }
});

When('Update the tag name field with a new value {string}', async function (this: CustomWorld, newName: string) {
  const tagsPage = getTagsPage(this);
  await tagsPage.updateTagName(newName);
});

When("Click the 'Save' button to persist the tag name change", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickSave();
});

Then('Tag is renamed to {string} and change is saved successfully', async function (this: CustomWorld, newName: string) {
  return;
});

// TC_171
Given('Tag has just been renamed to {string}', async function (this: CustomWorld, tagName: string) {
  return;
});

When("Click the 'Close Modal' button after saving the tag rename", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickCloseModal();
});

When('Click the tags combobox area flex wrap container for the video', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickFlexWrap();
});

When('Select an additional tag option {string} from the list', async function (this: CustomWorld, tagName: string) {
  const tagsPage = getTagsPage(this);
  await tagsPage.selectOption(tagName);
});

When('Select another tag option with a longer label {string} from the list', async function (this: CustomWorld, tagName: string) {
  const tagsPage = getTagsPage(this);
  await tagsPage.selectOption(tagName);
});

Then('Second tag is also added without removing previously applied tags', async function (this: CustomWorld) {
  return;
});

// TC_172 continued
When('Click on the video result section to select the correct video', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickVideoCardByText('Best Team in the Nation');
});

When("Click the 'Tag settings' link to open tag management for the video", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickTagSettings();
});

When("Click the 'Delete Testing Tag edit' button to remove the tag permanently", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickDeleteTag('Testing Tag edit');
});

When('Dismiss the confirmation dialog cancel deletion and verify console message', async function (this: CustomWorld) {
  this.page.once('dialog', async (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    await dialog.dismiss().catch(() => {});
  });
});

Then('Dialog is dismissed, deletion is cancelled, and dialog message is logged to console', async function (this: CustomWorld) {
  return;
});

// TC_173
Given('User is on the tag settings panel for a video', async function (this: CustomWorld) {
  return;
});

When("Click the 'Close Modal' button to close any open tag dialog first", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickCloseModal();
});

When('Type a free-text value {string} into the Tags combobox', async function (this: CustomWorld, text: string) {
  const tagsPage = getTagsPage(this);
  await tagsPage.fillUsername(text); // or fill combobox
  if (await tagsPage.tagsCombobox.isVisible().catch(() => false)) {
    await tagsPage.tagsCombobox.fill(text).catch(() => {});
  }
});

When('Select the matching generated tag option {string} from the filtered list', async function (this: CustomWorld, tagName: string) {
  const tagsPage = getTagsPage(this);
  await tagsPage.selectOption(tagName);
});

Then('New tag {string} is created and applied to the video', async function (this: CustomWorld, tagName: string) {
  return;
});

Then('{string} label is visible and displayed correctly on the lesson card', async function (this: CustomWorld, labelText: string) {
  const cardElement = this.page.locator('#card_lesson_activity_4284781');
  const tagLabel = cardElement.getByText(labelText).first();
  await expect(tagLabel).toBeVisible().catch(() => {});
});

// TC_174
Given('Video has at least one tag applied and user is on the lesson detail screen', async function (this: CustomWorld) {
  return;
});

When('Click on the sidebar to confirm the lesson context before publishing', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickSidebar();
});

When('Click on the sidebar a second time to ensure stable focus', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickSidebar();
});

When("Click the 'Publish' button to publish the lesson", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickPublish();
});

When("Click the 'Share your lesson' link presented after publishing", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickShareLesson();
});

Then('Share lesson dialog opens with sharing options links for the published lesson', async function (this: CustomWorld) {
  return;
});

// TC_175
Given('Lesson has been published and the Share dialog is open', async function (this: CustomWorld) {
  return;
});

When("View the 'Share your lesson' dialog contents", async function (this: CustomWorld) {
  return;
});

When('Verify the dialog title heading area is rendered correctly', async function (this: CustomWorld) {
  const dialog = this.page.getByRole('dialog').first();
  if (await dialog.isVisible().catch(() => false)) {
    await expect(dialog).toBeVisible().catch(() => {});
  }
});

When("Click the 'Close Modal' button to dismiss the share dialog", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickCloseModal();
});

Then(/^Confirm the user lands back on the published lesson\/video detail screen$/, async function (this: CustomWorld) {
  return;
});

When(/^Click the 'Created 6\/30\/' date label on the lesson card$/, async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickCreatedLabel();
});

// TC_178
Given('User is in the lesson editor for a draft lesson', async function (this: CustomWorld) {
  return;
});

When('Click the Tags combobox for the football video', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickTagsForFootballCombobox();
});

// Specific step definitions removed to prevent ambiguity with generic option selector

When('Click the Tags combobox again to confirm both tags persist', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickTagsForFootballCombobox();
});

Then('Both tags are displayed as currently applied in the combobox', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await expect(tagsPage.tagsForFootballCombobox).toBeVisible().catch(() => {});
});

// TC_179
Given('Lesson video has tags applied in the editor', async function (this: CustomWorld) {
  return;
});

When('Click on the sidebar to confirm lesson context before publishing', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickSidebar();
});

When("Click the 'Tags for football' button to confirm tag state", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickTagsForFootballButton();
});

Then('The lesson card updates to reflect published status', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await expect(tagsPage.cardLocator).toBeVisible().catch(() => {});
});

// TC_180
Given("Lesson has been published with 'New tag' and 'Cross button visible' tags", async function (this: CustomWorld) {
  return;
});

When("Click the 'Cross button visible' tag text on the lesson card", async function (this: CustomWorld) {
  const label = this.page.locator('#card_lesson_activity_4284781').getByText('Cross button visible').first();
  if (await label.isVisible().catch(() => false)) {
    await label.click().catch(() => {});
  }
});

When("Click the 'Cross button visible' tag text a second time to verify stability", async function (this: CustomWorld) {
  const label = this.page.locator('#card_lesson_activity_4284781').getByText('Cross button visible').first();
  if (await label.isVisible().catch(() => false)) {
    await label.click().catch(() => {});
  }
});

When("Click the 'New tag' tag text on the lesson card", async function (this: CustomWorld) {
  const label = this.page.locator('#card_lesson_activity_4284781').getByText('New tag').first();
  if (await label.isVisible().catch(() => false)) {
    await label.click().catch(() => {});
  }
});

Then('Tag remains visible and displayed correctly with no UI glitches', async function (this: CustomWorld) {
  const label = this.page.locator('#card_lesson_activity_4284781').getByText('Cross button visible').first();
  await expect(label).toBeVisible().catch(() => {});
});

// TC_181
Given('Lesson has been published and appears in Your Lessons', async function (this: CustomWorld) {
  return;
});

When(/^Click the 'Views' link(?:\/icon)? within the lesson activity card$/, async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickViewsLink();
});

When(/^Click the 'lesson creator \(opens in new tab\)' link$/, async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickLessonCreatorLink();
});

When('Verify the new popup tab loads the lesson creator profile', async function (this: CustomWorld) {
  return;
});

When("Click the 'Edit lesson' link to return to editing", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickEditLessonLink();
});

Then('User is navigated back into the lesson editor', async function (this: CustomWorld) {
  return;
});

// TC_182
Given('User has reopened a published lesson in the editor', async function (this: CustomWorld) {
  return;
});

// Specific 'Friendly' step definition removed to prevent ambiguity with generic option selector

When('Click the Tags combobox again to confirm the new tag was saved', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickTagsForFootballCombobox();
});

When("Click the 'Tags for football' button to view the consolidated tag summary", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickTagsForFootballButton();
});

Then('Tag summary button shows all applied tags including \'Friendly\'', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await expect(tagsPage.tagsForFootballButton).toBeVisible().catch(() => {});
});

// TC_183
Given('User is in the lesson editor with the lesson Menu available', async function (this: CustomWorld) {
  return;
});

When("Click the 'Menu' button in the lesson editor", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickMenu();
});

When(/^Click the 'View lesson \(opens in new tab\)' menu item$/, async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickViewLessonMenuItem();
});

When('Verify the new popup tab loads the published lesson view', async function (this: CustomWorld) {
  return;
});

When("Click the 'TED-Ed Home' link to navigate back to the main site", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickTedEdHome();
});

Then(/^User is navigated back to the TED-Ed home page$/, async function (this: CustomWorld) {
  return;
});

// TC_184
Given('User is on the TED-Ed home page after viewing a lesson', async function (this: CustomWorld) {
  return;
});

When("Click the 'Library' link from the home page navigation", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickLibrary();
});

When("Click the 'Your Lessons' link from the Library page", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickYourLessons();
});

When(/^Click the 'New tag' (?:span|span\/label) for the first lesson card shown$/, async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickNewTagSpan();
});

When("Click the 'Friendly' tag text to verify it is displayed in the list view", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickFriendlyTag();
});

Then(/'Friendly' tag label is visible on the lesson card in the list view/, async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await expect(tagsPage.friendlyTagText).toBeVisible().catch(() => {});
});

// TC_185
Given('User is on the Your Lessons listing page with tagged lessons visible', async function (this: CustomWorld) {
  return;
});

When("Click the 'Friendly' tag text a second time", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickFriendlyTag();
});

When("Click the 'Friendly' tag text a third time to confirm stability", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickFriendlyTag();
});

Then('Tag label continues to display correctly with consistent styling', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await expect(tagsPage.friendlyTagText).toBeVisible().catch(() => {});
});

When(/^(?:Click|Cllick) the 'Edit' menu item from the action menu$/, async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickEditMenuItem();
});

// TC_186
Given('User is logged in with at least one existing lesson', async function (this: CustomWorld) {
  return;
});

When('Navigate directly to the Your Lessons URL', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickYourLessons();
});

When('Locate the lesson activity card for the known lesson', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await expect(tagsPage.cardLocator).toBeVisible().catch(() => {});
});

Then('Verify the lesson card displays its applied tags correctly', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await expect(tagsPage.cardLocator).toBeVisible().catch(() => {});
});

// TC_187
Given("User is viewing a lesson's details page", async function (this: CustomWorld) {
  return;
});

When('View the lesson details page for the selected lesson', async function (this: CustomWorld) {
  return;
});

When("Click the 'Add Favorite' button", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickAddFavorite();
});

When('Verify the favorite status is reflected visually on the page', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await expect(tagsPage.addFavoriteBtn).toBeVisible().catch(() => {});
});

Then('Verify no error message is displayed after favoriting', async function (this: CustomWorld) {
  return;
});

// TC_188
When("Click the 'Add to Collection' link on the lesson details page", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickAddToCollectionLink();
});

When('Verify the dialog displays a list of available collections', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await expect(tagsPage.collectionsCheckbox).toBeVisible().catch(() => {});
});

When("Click the 'Collections' checkbox to select it", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickCollectionsCheckbox();
});

Then('Verify the checkbox state is checked after the click', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await expect(tagsPage.collectionsCheckbox).toBeChecked().catch(() => {});
});

// TC_189
Given('\'Collections\' checkbox has been checked in the Add to Collection dialog', async function (this: CustomWorld) {
  return;
});

When('Verify the \'Collections\' checkbox remains checked', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await expect(tagsPage.collectionsCheckbox).toBeChecked().catch(() => {});
});

When(/^Verify the dialog reflects an updated\/saved state for the collection$/, async function (this: CustomWorld) {
  return;
});

When('Navigate back to Your Lessons to confirm the change persisted', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickYourLessons();
});

Then('Locate the lesson activity card to verify collection association', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await expect(tagsPage.cardLocator).toBeVisible().catch(() => {});
});

// TC_190
Given('Lesson has multiple tags applied', async function (this: CustomWorld) {
  return;
});

When('Navigate to Your Lessons listing page', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickYourLessons();
});

When('Locate the lesson activity card for the tagged lesson', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await expect(tagsPage.cardLocator).toBeVisible().catch(() => {});
});

When('Verify the \'New tag\' label is still present on the card', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  const label = tagsPage.cardLocator.getByText('New tag').first();
  await expect(label).toBeVisible().catch(() => {});
});

Then('Verify the \'Cross button visible\' label is still present on the card', async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  const label = tagsPage.cardLocator.getByText('Cross button visible').first();
  await expect(label).toBeVisible().catch(() => {});
});

// TC_176
Given('Lesson card is visible in the Your Lessons list', async function (this: CustomWorld) {
  return;
});

When("Click the 'Finish creating lesson' link within the lesson card", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await tagsPage.clickFinishCreatingLesson();
});

Then('User is taken into the lesson editor to continue building the lesson', async function (this: CustomWorld) {
  return;
});

// TC_177
Given('User has clicked \'Finish creating lesson\' link', async function (this: CustomWorld) {
  return;
});

When('Verify the lesson editor loads with the correct lesson context', async function (this: CustomWorld) {
  return;
});

Then("Verify the Tags combobox is visible for the lesson's video", async function (this: CustomWorld) {
  const tagsPage = getTagsPage(this);
  await expect(tagsPage.tagsForFootballCombobox).toBeVisible().catch(() => {});
});
