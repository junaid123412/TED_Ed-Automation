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
// BACKGROUND STEPS
// ─────────────────────────────────────────────────────────────────────────────

// Steps moved to common_steps.ts:
// - Given I navigate to the TED-Ed homepage with basic auth credentials
// - Given I am logged in and on the dashboard
// - Given I am on the lesson editor screen
// - Given I have created a new lesson based on "football" video search
// - When I hover over the Create menu item in the navbar
// - When I click on A Lesson sub-option
// - Then the URL should update to include {string}
// - Given I navigate directly to {string}
// - When I click inside the search input box
// - When I press Enter without typing any characters
// - Then I verify no loading modal appears and search does not execute
// - When I type the search query {string}
// - When I click the search magnifier button
// - Then the URL parameters should update to include {string}
// - Then the video results grid should load structural elements
// - Then the count of video result card elements present should be greater than zero
// - Given I have executed a search query for {string}
// - When I click on the first available video result card preview body
// - Then a loading dialog with text {string} should appear overlaying the content
// - Given I have clicked on the first available video result card to show the confirmation dialog
// - When I click the secondary Cancel button on the modal
// - Then the confirmation modal should disappear and focus should return to the search results screen
// - When I click the primary red Continue button
// - Then I should be redirected to the interactive lesson editor route
// - Then the embedded video should match the source asset selection
// - Then the lesson status indicator should read {string}
// - Then the customized elements should remain toggled off by default
// - When I click on the lesson title edit trigger
// - Then a dialogue box overlay titled {string} should present text inputs
// - Then the existing lesson title value should load accurately inside the field
// - When I select all characters inside the title text input
// - When I press Backspace to clear the input
// - Then the title input field should be empty


// Steps moved to common_steps.ts:
// - When I clear the title input field
// - When I type the lesson title {string}
// - When I click the Save title button
// - Then the title input field dialog should close
// - Then a toast feedback message "Lesson updated" should be visible
// - Then the main workspace header should display the title {string}
// - When I click the Cancel title button (mapped to common_clickCancel)
// - Then the main workspace header title should remain unchanged
// - When I type a long lesson title exceeding one hundred characters using {string}
// - Then the title input should enforce a limit or validation warning
// - When I escape the title prompt dialog resetting default state


// ─────────────────────────────────────────────────────────────────────────────
// MODULE 3: "LET'S BEGIN" NARRATIVE SECTION
// ─────────────────────────────────────────────────────────────────────────────

// Steps moved to common_steps.ts:
// - When I click the workflow stage anchor point Let's Begin
// - Then the modal header should identify the context as {string}
// - Then the active formatting toolbar options should render clearly
// - Given I have opened the Let's Begin dialog
// - When I enter the text {string} in the introduction field
// - When I select the text {string} inside the editor
// - When I click the bold formatting toolbar button
// - Then the text should be formatted as bold
// - When I click the underline formatting toolbar button
// - Then the text should be formatted as underlined
// - When I click the link formatting toolbar button
// - When I enter the link address {string} in the link prompt
// - When I confirm the link prompt action
// - Then the hyperlink should be embedded in the text
// - Given I have entered and formatted the text {string} in the introduction field
// - When I click the formatting clear toolbar button
// - Then the text styling should be cleared
// - When I click the Save introduction button
// - Then the lesson updated toast message should display (reused common_verifyLessonUpdatedToast)
// - Then the introduction section of the editor layout should display the saved content {string}


// ─────────────────────────────────────────────────────────────────────────────
// MODULE 4: "THINK" ASSESSMENT BUILDER (MULTIPLE CHOICE)
// ─────────────────────────────────────────────────────────────────────────────

// Steps moved to common_steps.ts:
// - When I click on the Think section button
// - When I click the Multiple Choice Question option
// - Then the multiple choice question editor form should mount to the UI

// Steps moved to common_steps.ts:
// - Given I have opened the Multiple Choice Question editor
// - When I type the question text {string}
// - Then the question text field should display the text {string}
// - When I type {string} into answer option {word}
// - Then answer option {word} should display the text {string}
// - Then answer option {word} should display {string}
// - When I click the Add another answer button
// - Then an additional answer option field {word} should register dynamically
// - Given I have clicked the Add another answer button to add option E
// - When I click the delete trashcan icon next to option {word}
// - Then option {word} should be removed from the form
// - When I clear the video hint field
// - When I type the timestamp {string} into the video hint field
// - Then the video hint field should display {string}
// - Given I have filled the question text with {string}
// - Given I have filled answer options A, B, C, and D with {string}
// - When I click the Save question button
// - Then a confirmation message {string} should appear
// - Given I have saved a Multiple Choice Question with text {string}
// - Then the question list in the Think section should display the question text {string}
// - Then the question number counter should calculate the sequence accurately


// ─────────────────────────────────────────────────────────────────────────────
// MODULE 5: "THINK" ASSESSMENT BUILDER (OPEN ANSWER)
// ─────────────────────────────────────────────────────────────────────────────

// Steps moved to common_steps.ts:
// - When I click the Open Answer Question option
// - Then the open answer question editor form should mount to the UI
// - Then the input field should be empty by default
// - Given I have opened the Open Answer Question editor
// - Given I have saved an Open Answer Question with text {string}
// - Then the question icon should match the open-ended text design form
// - When I click the timeline step Dig Deeper
// - Then the supplemental dialog header should identify the context as "Supplemental info" (reused common_verifyModalHeader)
// - Then the content input area should render clearly
// - Given I have opened the Dig Deeper dialog
// - When I enter the text {string} in the supplemental field
// - Then the supplemental field should display {string}
// - When I select the text {string} inside the supplemental editor
// - Then the supplemental text should display as bold
// - When I click the link toolbar option in the supplemental editor
// - When I click the cancel button on the link input popup
// - Then the supplemental editor should restore focus and remain unchanged
// - When I click the Save supplemental button
// - Then the Dig Deeper section of the editor layout should display the saved content {string}


// ─────────────────────────────────────────────────────────────────────────────
// MODULE 7: "DISCUSS" INTERACTIVE FORUMS
// ─────────────────────────────────────────────────────────────────────────────

// Steps moved to common_steps.ts:
// - When I click the Discuss section button
// - When I click the Add discussion option
// - Then the discussion prompt modal should display
// - Then the discussion prompt fields should render correctly
// - Given I have opened the Discussion dialog
// - Given I have typed {string} into the prompt field
// - Given I have typed {string} into the description field
// - When I type {string} into the discussion prompt field
// - Then the discussion prompt field should contain the text {string}
// - When I type {string} into the discussion description field
// - Then the discussion description field should contain the text {string}
// - When I click the Save discussion button
// - Then a confirmation message "Discussion was successfully created" should appear
// - Then the discussion list in the Discuss section should display the prompt {string}
// - Given I have saved a Discussion with prompt {string}
// - When I click the And Finally section button
// - Then the conclusion modal header should identify the context as "Conclusion" (reused common_verifyModalHeader)
// - Then the character limit indicator should display (0/1000)
// - Given I have opened the And Finally dialog
// - When I enter the text {string} in the conclusion field
// - When I click the Save conclusion button
// - Then the And Finally section of the editor layout should display the saved content {string}


// ─────────────────────────────────────────────────────────────────────────────
// MODULE 9: PUBLISHING WORKFLOW STATE TRANSITIONS
// ─────────────────────────────────────────────────────────────────────────────

// Steps moved to common_steps.ts:
// - When I focus on the top right sidebar status indicator
// - Then I click the info circle icon to confirm the draft status tooltip details
// - When I click the primary red Publish button
// - Then the lesson published confirmation dialog should appear with share options
// - Given I have clicked the primary red Publish button
// - When I close the share lesson confirmation modal
// - When I navigate to the lessons dashboard
// - Then the dashboard should list the published lesson
// - Then the status label for the lesson should read "Published" (reused common_verifyLessonStatus)

