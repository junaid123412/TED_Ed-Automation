@regression @tagFilters
Feature: Tag Filters and Duplicate Tag Lesson

  Background:
    Given I open the homepage as a logged in user

  @TC_192 @navigation
  Scenario: Test Case 192 – Navigate to Library and Your Lessons
    Given Verify user is on the homepage/dashboard after login
    When Click on "Library" navigation link
    And Click on "Your Lessons" link
    Then Verify "Your Lessons" page has loaded successfully

  @TC_193 @lessonAccess
  Scenario: Test Case 193 – Open Lesson via "Finish Creating Lesson"
    Given Verify lesson card is visible on "Your Lessons" page
    When Click "Finish creating lesson" link for the specific lesson card
    Then Verify lesson editor page opens
    And Verify lesson title/editor field is visible

  @TC_194 @tagRemoval
  Scenario: Test Case 194 – Remove "Earth School" Tag from Lesson
    Given Verify "Earth School" tag is visible on the lesson
    When Click "Remove Earth School tag" button
    Then Verify tag is removed/no longer visible
    And Click "Remove Earth School tag" button again to validate repeat action/state

  @TC_195 @navigation
  Scenario: Test Case 195 – Direct Navigation to Lessons Listing Page
    Given Navigate directly to the lessons URL
    Then Verify page loads with correct URL
    And Verify lessons list/grid is visible on the page
    And Verify page title or header is displayed correctly

  @TC_196 @sharing
  Scenario: Test Case 196 – Share Lesson and Close Modal
    Given Verify "Share your lesson" link is visible
    When Click "Share your lesson" link
    Then Verify share modal appears
    And Click "Close Modal" button

  @TC_197 @summary
  Scenario: Test Case 197 – View Published Lessons Summary
    Given Verify "Published Lessons" section is visible
    When Click "Published Lessons 99+ See all" text block
    Then Verify published lessons count is displayed
    And Verify "See all" link is clickable/enabled

  @TC_198 @navigation
  Scenario: Test Case 198 – Navigate to Full Published Lessons List
    Given Verify "Published" section is visible on page
    When Click "See all" link within Published section
    Then Verify navigation to full published lessons list page
    And Verify list of published lessons is rendered

  @TC_199 @tagFilter
  Scenario: Test Case 199 – Toggle "Earth School" Filter Tag
    Given Verify "Earth School" filter button is visible
    When Click "Earth School" filter button (enable)
    Then Verify filtered results update to show only "Earth School" tagged lessons
    And Click "Earth School" filter button again (disable/toggle off)

  @TC_200 @tagFilter
  Scenario: Test Case 200 – Toggle "Educator Talks" Filter Tag
    Given Verify "Educator Talks" filter button is visible
    When Click "Educator Talks" filter button (enable)
    Then Verify filtered results update to show only "Educator Talks" tagged lessons
    And Click "Educator Talks" filter button again (disable/toggle off)

  @TC_201 @titleFilter
  Scenario: Test Case 201 – Filter Lessons by Title
    Given Click "Filter by title" textbox
    When Enter search term "ted"
    And Press Enter to apply filter
    Then Verify filtered lesson list contains only titles matching "ted"

  @TC_202 @resetFilter
  Scenario: Test Case 202 – Reset Applied Filter
    Given Verify "Reset filter" button is visible after a filter is applied
    When Click "Reset filter" button
    Then Verify filter textbox is cleared
    And Verify full lesson list is restored

  @TC_203 @viewToggle
  Scenario: Test Case 203 – Switch to Grid View
    Given Verify "Grid" view toggle link is visible
    When Click "Grid" view toggle link
    Then Verify lessons are displayed in grid layout
    And Verify "Grid" link is now marked as active/selected

  @TC_204 @viewToggle
  Scenario: Test Case 204 – Switch to List View
    Given Verify "List" view toggle link is visible
    When Click "List" view toggle link
    Then Verify lessons are displayed in list layout
    And Verify "List" link is now marked as active/selected

  @TC_205 @rowActions
  Scenario: Test Case 205 – Open "More Actions" Menu for Lesson Row
    Given Verify "MAHODAND LAKE" lesson row is visible in list view
    When Click "More actions" icon for the "MAHODAND LAKE" lesson row
    Then Verify dropdown menu appears with available actions
    And Verify "Duplicate" menu item is visible in the dropdown

  @TC_206 @duplication
  Scenario: Test Case 206 – Duplicate Lesson via More Actions Menu
    Given Click "More actions" icon for the lesson row
    When Set up dialog handler to dismiss confirmation
    And Click "Duplicate" menu item
    Then Verify a duplicated lesson entry appears in the lessons list

  @TC_207 @publishing
  Scenario: Test Case 207 – Publish Duplicated Lesson with Review Settings
    Given Click "Publish" button on the duplicated lesson
    When Select "Don't require students to use..." radio option
    And Handle confirmation dialog (dismiss)
    And Click "Review student work" button for duplicated lesson card
    Then Verify lesson status updates to "Published"
