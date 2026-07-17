@tags @regression
Feature: See Tags in Your Lesson (176-190)

  As a user on the TED-Ed platform
  I want to view tags, analytics, and collections in Your Lessons
  So that I can verify that tag visibility, details, and navigation work correctly

  @TC_176 @tagManagement
  Scenario: TC_176 - Verify user can resume editing a draft lesson from the listing card
    Given Lesson card is visible in the Your Lessons list
    When Click the 'Finish creating lesson' link within the lesson card
    Then User is taken into the lesson editor to continue building the lesson

  @TC_177 @tagManagement
  Scenario: TC_177 - Verify the lesson editor loads with correct context and Tags combobox
    Given User has clicked 'Finish creating lesson' link
    When Verify the lesson editor loads with the correct lesson context
    Then Verify the Tags combobox is visible for the lesson's video

  @TC_178 @tagManagement
  Scenario: TC_178 - Verify user can add a new tag to a lesson video
    Given User is in the lesson editor for a draft lesson
    When Click the Tags combobox for the football video
    And Select the 'New tag' option from the dropdown
    And Select the 'Cross button visible' option from the dropdown
    And Click the Tags combobox again to confirm both tags persist
    Then Both tags are displayed as currently applied in the combobox

  @TC_179 @lessonPublishing
  Scenario: TC_179 - Verify user can publish a lesson after tagging
    Given Lesson video has tags applied in the editor
    When Click on the sidebar to confirm lesson context before publishing
    And Click the 'Tags for football' button to confirm tag state
    And Click the 'Publish' button to publish the lesson
    Then The lesson card updates to reflect published status

  @TC_180 @tagVisibility
  Scenario: TC_180 - Verify applied tags are visible on the lesson card after publishing
    Given Lesson has been published with 'New tag' and 'Cross button visible' tags
    When Click the 'Cross button visible' tag text on the lesson card
    And Click the 'Cross button visible' tag text a second time to verify stability
    And Click the 'New tag' tag text on the lesson card
    And Click the 'Created 6/30/' date label on the lesson card
    Then Tag remains visible and displayed correctly with no UI glitches

  @TC_181 @lessonViews
  Scenario: TC_181 - Verify user can access lesson view/analytics from the lesson card
    Given Lesson has been published and appears in Your Lessons
    When Click the 'Views' link/icon within the lesson activity card
    And Click the 'lesson creator (opens in new tab)' link
    And Verify the new popup tab loads the lesson creator profile
    And Click the 'Edit lesson' link to return to editing
    Then User is navigated back into the lesson editor

  @TC_182 @tagManagement
  Scenario: TC_182 - Verify user can add an additional tag while editing a published lesson
    Given User has reopened a published lesson in the editor
    When Click the Tags combobox for the football video
    And Select the 'Friendly' option from the dropdown
    And Click the Tags combobox again to confirm the new tag was saved
    And Click the 'Tags for football' button to view the consolidated tag summary
    Then Tag summary button shows all applied tags including 'Friendly'

  @TC_183 @lessonMenuActions
  Scenario: TC_183 - Verify user can view a lesson via the lesson Menu option
    Given User is in the lesson editor with the lesson Menu available
    When Click the 'Menu' button in the lesson editor
    And Click the 'View lesson (opens in new tab)' menu item
    And Verify the new popup tab loads the published lesson view
    And Click the 'TED-Ed Home' link to navigate back to the main site
    Then User is navigated back to the TED-Ed home page

  @TC_184 @libraryNavigation
  Scenario: TC_184 - Verify user can navigate back to Your Lessons from home
    Given User is on the TED-Ed home page after viewing a lesson
    When Click the 'Library' link from the home page navigation
    And Click the 'Your Lessons' link from the Library page
    And Click the 'New tag' span/label for the first lesson card shown
    And Click the 'Friendly' tag text to verify it is displayed in the list view
    Then 'Friendly' tag label is visible on the lesson card in the list view

  @TC_185 @tagVisibility
  Scenario: TC_185 - Verify tag labels remain consistent across repeated interactions in list view
    Given User is on the Your Lessons listing page with tagged lessons visible
    When Click the 'Friendly' tag text a second time
    And Click the 'Friendly' tag text a third time to confirm stability
    And Cllick the 'Edit' menu item from the action menu
    Then Tag label continues to display correctly with consistent styling

  @TC_186 @libraryNavigation
  Scenario: TC_186 - Verify user can return to Your Lessons listing directly via URL
    Given User is logged in with at least one existing lesson
    When Navigate directly to the Your Lessons URL
    And Locate the lesson activity card for the known lesson
    And Click the 'Views' link/icon within the lesson activity card
    Then Verify the lesson card displays its applied tags correctly

  @TC_187 @favorites
  Scenario: TC_187 - Verify user can add a lesson to Favorites
    Given User is viewing a lesson's details page
    When View the lesson details page for the selected lesson
    And Click the 'Add Favorite' button
    And Verify the favorite status is reflected visually on the page
    Then Verify no error message is displayed after favoriting

  @TC_188 @collections
  Scenario: TC_188 - Verify user can open the Add to Collection dialog
    Given User is viewing a lesson's details page
    When Click the 'Add to Collection' link on the lesson details page
    And Verify the dialog displays a list of available collections
    And Click the 'Collections' checkbox to select it
    Then Verify the checkbox state is checked after the click

  @TC_189 @collections
  Scenario: TC_189 - Verify the lesson is successfully added to the selected collection
    Given 'Collections' checkbox has been checked in the Add to Collection dialog
    When Verify the 'Collections' checkbox remains checked
    And Verify the dialog reflects an updated/saved state for the collection
    And Navigate back to Your Lessons to confirm the change persisted
    Then Locate the lesson activity card to verify collection association

  @TC_190 @tagVisibility
  Scenario: TC_190 - Verify all applied tags remain visible after navigating away and back
    Given Lesson has multiple tags applied
    When Navigate to Your Lessons listing page
    And Locate the lesson activity card for the tagged lesson
    And Verify the 'New tag' label is still present on the card
    Then Verify the 'Cross button visible' label is still present on the card
