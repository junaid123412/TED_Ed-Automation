@tags @regression
Feature: Tags Module and Extended Scenarios (161-175)

  As a user on the TED-Ed platform
  I want to manage tags, search videos, and publish lessons
  So that I can organize content and make lessons accessible

  @TC_161 @authentication
  Scenario: TC_161 - Verify user can log in with a valid registered email
    Given User is on the TED-Ed Integration home page and account exists
    When Click the 'Sign in' link from the home page navigation
    And Click on the username or email input field to focus it
    And Enter the registered email address "Junaid.hussain+1@kualitatem.com" into the username field
    And Close the informational dialog that appears after entering the email
    Then Sign-in lookup dialog should update and user remains on the sign-in lookup screen

  @TC_162 @authentication
  Scenario: TC_162 - Verify partial username input triggers no premature validation
    Given User is on the Sign-in lookup screen
    When Click into the username field
    And Type a single character "J" into the username field
    And Press the CapsLock key while field is focused
    And Replace field content with a longer partial username string "Junaid.h"
    Then Field updates to show "Junaid.h" with no premature validation error

  @TC_163 @lessonCreation
  Scenario: TC_163 - Verify user can initiate lesson creation from home page
    Given User is signed in and on the home page
    When Navigate to the TED-Ed Integration home page
    And Click the 'Create' button on the home page
    And Click the 'Create' button a second time to confirm the action
    And Select the option to build a lesson from scratch
    Then User is navigated to the new lesson builder screen

  @TC_164 @videoSearch
  Scenario: TC_164 - Verify user can search for videos using a keyword
    Given User is signed in and on the Videos page
    When Navigate to the Videos page
    And Click on the video search box to focus it
    And Enter a keyword "Football" into the search box
    And Click the 'Search' button to execute the search
    Then Search results matching "Football" are displayed in the video list

  @TC_165 @videoSearch
  Scenario: TC_165 - Verify clearing the search box allows re-entry of a new keyword
    Given User is on the Videos page with a prior search term entered
    When Click on the search box to focus it
    And Clear the existing text from the search box
    And Enter a new single character "F" into the search box
    And Enter the full new keyword "Football" into the search box
    Then Full keyword "Football" is shown ready for search submission

  @TC_166 @videoSearch
  Scenario: TC_166 - Verify user can open a video from search results
    Given Search results for "Football" are displayed on the Videos page
    When View the list of returned video results
    And Click the video result link showing duration ":53"
    And Click the 'Continue »' button to proceed past the preview prompt
    And Click the 'Tag settings' link on the video detail page
    Then Tag settings panel or dialog begins to open for the video

  @TC_167 @tagManagement
  Scenario: TC_167 - Verify the Manage Tags dialog opens and can be closed
    Given User is on a video's detail page with Tag settings link visible
    When Click the 'Tag settings' link
    And Click the 'Tag settings' link again to confirm dialog stability
    And Click inside the 'Manage tags' dialog region
    And Click the 'Close Modal' button to dismiss the dialog
    Then Manage tags dialog closes and user returns to the video detail page

  @TC_168 @tagManagement
  Scenario: TC_168 - Verify user can add an existing tag to a video
    Given User is on a video's detail page and at least one tag exists in the system
    When Click the Tags combobox for the selected video
    And Select the "Testing Tag" option from the dropdown
    And Click on the sidebar area to confirm tag persistence outside the dropdown
    And Click the 'Remove Testing Tag' button to detach the tag
    Then "Testing Tag" is removed from the video's associated tags list

  @TC_169 @tagManagement
  Scenario: TC_169 - Verify a removed tag can be re-added from the dropdown
    Given Testing Tag was previously removed from the video
    When Click the Tags combobox for the video
    And Select the "Testing Tag" option again from the dropdown
    And Click on the video result section to confirm the tag is saved against the correct video
    And Click the 'Tag settings' link to verify tag state in settings
    Then Tag settings panel shows "Testing Tag" as currently applied

  @TC_170 @tagManagement
  Scenario: TC_170 - Verify user can edit an existing tag's name
    Given "Testing Tag" exists and is applied to a video
    When Click the 'Edit Testing Tag' link in the tag settings panel
    And Click on the 'Tag name' textbox to focus it
    And Update the tag name field with a new value "Testing Tag edit"
    And Click the 'Save' button to persist the tag name change
    Then Tag is renamed to "Testing Tag edit" and change is saved successfully

  @TC_171 @tagManagement
  Scenario: TC_171 - Verify the edited tag name reflects correctly after closing the dialog
    Given Tag has just been renamed to "Testing Tag edit"
    When Click the 'Close Modal' button after saving the tag rename
    And Click the tags combobox area flex wrap container for the video
    And Select an additional tag option "ddd" from the list
    And Select another tag option with a longer label "QQQ EEE EEEE EEEEEE EEE" from the list
    Then Second tag is also added without removing previously applied tags

  @TC_172 @tagManagement
  Scenario: TC_172 - Verify user can delete a tag and dismiss the confirmation dialog
    Given "Testing Tag edit" exists and is applied to a video
    When Click on the video result section to select the correct video
    And Click the 'Tag settings' link to open tag management for the video
    And Click the 'Delete Testing Tag edit' button to remove the tag permanently
    And Dismiss the confirmation dialog cancel deletion and verify console message
    Then Dialog is dismissed, deletion is cancelled, and dialog message is logged to console

  @TC_173 @tagManagement
  Scenario: TC_173 - Verify user can add a new free-text tag via the combobox
    Given User is on the tag settings panel for a video
    When Click the 'Close Modal' button to close any open tag dialog first
    And Click the Tags combobox for the video
    And Type a free-text value "fds" into the Tags combobox
    And Select the matching generated tag option "fdsfdsfdsfsddfsfdsfdsfsf" from the filtered list
    Then New tag "fdsfdsfdsfsddfsfdsfdsfsf" is created and applied to the video
    And "New tag" label is visible and displayed correctly on the lesson card

  @TC_174 @lessonPublishing
  Scenario: TC_174 - Verify user can publish a lesson after tagging is complete
    Given Video has at least one tag applied and user is on the lesson detail screen
    When Click on the sidebar to confirm the lesson context before publishing
    And Click on the sidebar a second time to ensure stable focus
    And Click the 'Publish' button to publish the lesson
    And Click the 'Share your lesson' link presented after publishing
    Then Share lesson dialog opens with sharing options links for the published lesson

  @TC_175 @lessonPublishing
  Scenario: TC_175 - Verify the share lesson dialog can be closed after publishing
    Given Lesson has been published and the Share dialog is open
    When View the 'Share your lesson' dialog contents
    And Verify the dialog title heading area is rendered correctly
    And Click the 'Close Modal' button to dismiss the share dialog
    Then Confirm the user lands back on the published lesson/video detail screen
    And Click the 'Created 6/30/' date label on the lesson card
