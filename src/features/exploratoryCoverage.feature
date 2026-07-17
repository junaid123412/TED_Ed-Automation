@regression @exploratory
Feature: TED-Ed Lesson Editor — exploratory coverage (TC-051 to TC-100)
  As a QA engineer
  I want the lesson editor, publishing, settings, favorites/collections and library features
  to behave correctly
  So that students and teachers have a reliable lesson-creation experience

  # ---------------------------------------------------------------
  # Module: Lesson Editor - Basics
  # ---------------------------------------------------------------
  @TC-051 @lesson-editor-basics @high @positive
  Scenario: Verify Lesson Title field accepts and saves a valid title
    Given User is on the 'Create a Lesson' editor page for a draft lesson
    When Click into the Lesson Title field
    And Clear the existing text and type a new valid title "Photosynthesis Basics"
    And Click outside the field or navigate away and return
    Then The new title is saved and displayed in the Lesson Title field and on the lesson card in 'Your Lessons'

  @TC-052 @lesson-editor-basics @high @negative
  Scenario: Verify Lesson Title field behavior when left empty
    Given User is on the 'Create a Lesson' editor page
    When Click into the Lesson Title field
    And Delete all text so the field is empty
    And Click outside the field, then attempt to click Publish
    Then The system either restores the source video title as default or blocks Publish with a validation message; an empty title is not allowed to be published

  # ---------------------------------------------------------------
  # Module: Lesson Editor - Video
  # ---------------------------------------------------------------
  @TC-053 @lesson-editor-video @high @positive
  Scenario: Verify 'Change video' replaces the embedded lesson video
    Given User is on the lesson editor with an existing video attached
    When Click 'Change video' under the video thumbnail
    And Paste a new valid YouTube/TED-Ed video URL
    And Confirm/save the change
    Then The lesson's embedded video is replaced with the new video, and the new thumbnail/title appears in the editor

  @TC-054 @lesson-editor-video @medium @positive
  Scenario: Verify 'Crop video' opens a crop tool and applies trim points
    Given User is on the lesson editor with an existing video attached
    When Click 'Crop video' under the video thumbnail
    And Set a start time and end time shorter than the full video length
    And Save the crop
    Then The crop tool opens with start/end controls; after saving, the lesson plays only the cropped segment

  # ---------------------------------------------------------------
  # Module: Lesson Editor - Status
  # ---------------------------------------------------------------
  @TC-055 @lesson-editor-status @medium @positive
  Scenario: Verify Status info icon opens the Status modal with correct draft explanation
    Given Lesson status is 'DRAFT'
    When Click the info (i) icon next to 'Status: DRAFT'
    And Read the modal content
    Then A 'Status' modal opens stating the lesson is currently draft, explaining the unique URL behavior and that the page is not search-indexed

  @TC-056 @lesson-editor-status @low @positive
  Scenario: Verify Status modal closes via the X button
    Given The Status modal is open
    When Click the 'X' icon in the top-right of the Status modal
    Then The modal closes and the user returns to the underlying 'Create a Lesson' editor without any changes applied

  # ---------------------------------------------------------------
  # Module: Lesson Editor - Publish
  # ---------------------------------------------------------------
  @TC-057 @lesson-editor-publish @high @positive
  Scenario: Verify Publish button publishes a lesson with a valid title
    Given Lesson has a valid title and a video attached, status is DRAFT
    When Click the red 'Publish' button
    And Observe the confirmation modal
    Then A 'Your lesson has been published successfully' modal appears, and the Status badge updates from DRAFT to PUBLISHED

  @TC-058 @lesson-editor-publish @medium @positive
  Scenario: Verify 'See your lesson' link in the publish-success modal opens the live lesson
    Given Lesson was just published and the success modal is visible
    When Click the 'See your lesson' link inside the success modal
    Then The user is navigated to the public lesson page showing the published content

  @TC-059 @lesson-editor-publish @high @positive
  Scenario: Verify selecting 'Require students to use TED-Ed accounts' enforces login
    Given Lesson has just been published; the access-options modal is visible
    When Select the 'Require students to use TED-Ed accounts' radio option
    And Click 'Share your lesson'
    And Open the shared lesson link in an incognito/unauthenticated session and attempt to submit a response
    Then Students are prompted to log in with a TED-Ed account before they can save any responses on the lesson page

  @TC-060 @lesson-editor-publish @high @positive
  Scenario: Verify selecting 'Don't require students to use TED-Ed accounts' allows nickname access
    Given Lesson has just been published; the access-options modal is visible
    When Select the 'Don't require students to use TED-Ed accounts' radio option
    And Click 'Share your lesson'
    And Open the shared lesson link in an unauthenticated session and submit a response using a nickname
    Then Students can create a simple nickname (no TED-Ed account required) and successfully submit responses on the lesson page

  @TC-061 @lesson-editor-publish @medium @positive
  Scenario: Verify 'Share your lesson' produces a usable shareable link
    Given The publish-success/access-options modal is visible
    When Click 'Share your lesson'
    And Copy the generated link
    And Open the link in a new browser tab/session
    Then A shareable lesson link is generated/copied and correctly opens the published lesson page when visited

  # ---------------------------------------------------------------
  # Module: Lesson Editor - Settings
  # ---------------------------------------------------------------
  @TC-062 @lesson-editor-settings @high @positive
  Scenario: Verify the Settings modal opens from the 'Customization On/Off' link
    Given User is on the lesson editor page
    When Click the 'Customization On' (or 'Customization Off') link next to Settings
    Then A 'Settings' modal opens showing Module settings, Sharing settings, and Student settings sections

  @TC-063 @lesson-editor-settings @high @positive
  Scenario: Verify unchecking 'Discuss' in Module settings hides that section on the live lesson
    Given Settings modal is open for a lesson; 'Discuss' module checkbox is currently checked
    When Uncheck the 'Discuss' checkbox under Module settings
    And Click 'Save'
    And Publish or refresh the public lesson page
    Then The 'Discuss' section no longer appears on the lesson's public-facing page, while other checked modules remain visible

  @TC-064 @lesson-editor-settings @medium @edge
  Scenario: Verify behavior when all Module settings checkboxes are unchecked
    Given Settings modal is open; all four module checkboxes (Think, Dig Deeper, Discuss, And Finally) are checked
    When Uncheck Think, Dig Deeper, Discuss, and And Finally
    And Click 'Save'
    Then The system either prevents saving with zero modules selected (validation message) or saves successfully and shows only the 'Let's Begin' section on the live page; behavior should be consistent and not error out

  @TC-065 @lesson-editor-settings @medium @positive
  Scenario: Verify 'Make my lesson customizable' checkbox controls the 'Customize this lesson' button
    Given Settings modal is open; lesson is published
    When Check 'Make my lesson customizable' in Sharing settings
    And Click 'Save'
    And View the public lesson page
    Then The 'Customize this lesson' button is visible on the public lesson page, allowing other users to create a copy of the lesson

  @TC-066 @lesson-editor-settings @medium @positive
  Scenario: Verify unchecking 'Make my lesson customizable' hides the customize option
    Given Lesson is currently set to customizable ('Customization On')
    When Open Settings, uncheck 'Make my lesson customizable'
    And Click 'Save'
    And View the public lesson page
    Then The 'Customize this lesson' button no longer appears on the public lesson page, and the editor shows 'Customization Off'

  @TC-067 @lesson-editor-settings @medium @negative
  Scenario: Verify 'Cancel' in the Settings modal discards unsaved changes
    Given Settings modal is open with default checkbox states
    When Change one or more checkboxes/radio selections
    And Click 'Cancel' instead of 'Save'
    And Reopen the Settings modal
    Then All settings revert to their previous saved state; none of the unsaved changes are applied

  @TC-068 @lesson-editor-settings @high @positive
  Scenario: Verify 'Save' in the Settings modal persists changes and shows confirmation
    Given Settings modal is open
    When Change a setting (e.g. toggle a Student settings radio option)
    And Click 'Save'
    Then The modal closes, a 'Lesson settings updated' toast/snackbar appears, and the new setting persists after page refresh

  @TC-069 @lesson-editor-settings @high @positive
  Scenario: Verify switching Student settings from 'Require accounts' to 'Don't require accounts' updates existing published lesson
    Given Lesson is published with 'Require students to use TED-Ed accounts' enabled
    When Open Settings, select 'Don't require students to use TED-Ed accounts'
    And Click 'Save'
    And Visit the live lesson link as an unauthenticated user and submit a response with a nickname
    Then The response is accepted without requiring login, confirming the updated student-access setting took effect on the already-published lesson

  # ---------------------------------------------------------------
  # Module: Lesson Editor - Tags
  # ---------------------------------------------------------------
  @TC-070 @lesson-editor-tags @medium @positive
  Scenario: Verify a tag can be added via the 'Add tags...' field
    Given User is on the lesson editor; Tags section is visible
    When Click into the 'Add tags...' input
    And Type a tag name "science" and press Enter
    And Save/refresh the page
    Then The tag is added and displayed as a chip/label under the Tags section, and persists after refresh

  @TC-071 @lesson-editor-tags @low @positive
  Scenario: Verify an existing tag can be removed
    Given At least one tag has already been added to the lesson
    When Hover/click the remove (x) control on an existing tag chip
    And Confirm removal if prompted
    Then The tag is removed from the Tags list and no longer appears after refreshing the page

  @TC-072 @lesson-editor-tags @low @positive
  Scenario: Verify the Tags gear/settings icon opens tag configuration options
    Given User is on the lesson editor; Tags section is visible
    When Click the gear icon next to 'Tags'
    Then A tag configuration option/menu opens (e.g. suggested tags or tag visibility settings) without errors

  # ---------------------------------------------------------------
  # Module: Lesson Editor - Content
  # ---------------------------------------------------------------
  @TC-073 @lesson-editor-content @low @positive
  Scenario: Verify the 'Get Started! Add your content here' banner can be dismissed
    Given User is on a new/empty lesson editor where the banner is visible
    When Click the 'X' icon on the 'Get Started! Add your content here' banner
    Then The banner is dismissed and does not reappear on subsequent visits to the same lesson editor

  # ---------------------------------------------------------------
  # Module: Lesson Editor - Navigation
  # ---------------------------------------------------------------
  @TC-074 @lesson-editor-navigation @medium @positive
  Scenario: Verify the side anchor/jump menu scrolls to the correct section
    Given User is on the lesson editor page with all sections (Summary, Let's Begin, Think, Dig Deeper, Discussions, And Finally, Settings) present
    When Open the anchor/jump navigation menu
    And Click on 'Settings' (or any other section link)
    Then The page scrolls/jumps directly to the corresponding section without a full page reload

  # ---------------------------------------------------------------
  # Module: Lesson Editor - Publish Controls
  # ---------------------------------------------------------------
  @TC-075 @lesson-editor-publish-controls @medium @positive
  Scenario: Verify the '...' (more options) menu next to Publish offers relevant actions
    Given User is on the lesson editor for a draft or published lesson
    When Click the circular '...' icon next to the 'Publish' button
    And Review the available options (e.g. Unpublish, Duplicate, Delete)
    Then A dropdown/menu appears with valid lesson-management actions appropriate to the lesson's current status

  # ---------------------------------------------------------------
  # Module: Lesson Editor - Help
  # ---------------------------------------------------------------
  @TC-076 @lesson-editor-help @low @positive
  Scenario: Verify the 'Get help' link opens a relevant support resource
    Given User is on the lesson editor page
    When Click the 'Get help' link in the sidebar
    Then A help/support page or panel relevant to lesson creation opens, either in the same tab or a new tab

  # ---------------------------------------------------------------
  # Module: Your Lessons
  # ---------------------------------------------------------------
  @TC-077 @your-lessons @high @positive
  Scenario: Verify a published lesson appears correctly on the 'Your Lessons' tab
    Given At least one lesson has been published by the user
    When Navigate to 'Your Lessons' tab from the library/lessons navigation
    And Locate the published lesson card
    Then The card displays the correct thumbnail, view count, 'Created' date, title, discussion count, and a 'Review student work' link; the 'Published Lessons' count matches the number of published lessons

  @TC-078 @your-lessons @medium @positive
  Scenario: Verify the discussion count updates after a student discussion is submitted
    Given A published lesson currently shows '0 Discussions'
    When As a student/test account, open the lesson's Discuss section and submit a comment
    And Return to 'Your Lessons' as the lesson owner and refresh
    Then The discussion count on the lesson card increments to reflect the new submission

  @TC-079 @your-lessons @medium @positive
  Scenario: Verify 'Review student work' navigates to the student submissions view
    Given A published lesson has at least one student response submitted
    When Click 'Review student work' on the lesson card
    Then The user is taken to a page listing student responses/progress for that specific lesson

  @TC-080 @your-lessons @medium @positive
  Scenario: Verify the '...' menu on a lesson card provides management options
    Given A published lesson card is visible on 'Your Lessons'
    When Click the '...' icon on the lesson card
    And Review the available options
    Then A menu opens with options such as Edit, Duplicate, Unpublish, or Delete relevant to that lesson

  # ---------------------------------------------------------------
  # Module: Public Lesson Page - Favorites
  # ---------------------------------------------------------------
  @TC-081 @public-lesson-page-favorites @high @positive
  Scenario: Verify clicking the heart icon adds a lesson to Favorites
    Given User is viewing a public lesson page and the lesson is not currently favorited
    When Click the heart icon below the video
    And Observe the toast/snackbar message
    And Navigate to 'Your Library' > Favorites
    Then A 'Lesson added to your favorites collection.' toast appears, the heart icon fills/highlights, and the lesson now appears under Favorites with the count incremented

  @TC-082 @public-lesson-page-favorites @high @positive
  Scenario: Verify clicking the heart icon again removes the lesson from Favorites
    Given The lesson is currently in the user's Favorites
    When Click the filled heart icon to un-favorite the lesson
    And Navigate to 'Your Library' > Favorites
    Then The lesson is removed from Favorites, the Favorites count decrements, and an appropriate removal toast is shown

  # ---------------------------------------------------------------
  # Module: Public Lesson Page - Collections
  # ---------------------------------------------------------------
  @TC-083 @public-lesson-page-collections @high @positive
  Scenario: Verify clicking the add-to-collection icon opens the 'Create new Collection' modal
    Given User is viewing a public lesson page and has no existing collections
    When Click the list/'+' icon (add to collection) below the video
    Then A 'Create new Collection' modal opens with a 'Name' input field and a 'Create & Add' button

  @TC-084 @public-lesson-page-collections @medium @edge
  Scenario: Verify the collection Name field enforces the 60-character limit with a live counter
    Given The 'Create new Collection' modal is open
    When Type a collection name and observe the counter below the field (e.g. '6/60')
    And Continue typing until reaching 60 characters
    And Attempt to type a 61st character
    Then The character counter updates live as text is typed, and input is blocked beyond 60 characters

  @TC-085 @public-lesson-page-collections @high @positive
  Scenario: Verify creating a collection with a valid name adds the lesson successfully
    Given The 'Create new Collection' modal is open
    When Enter a valid name "Football"
    And Click 'Create & Add'
    Then The modal closes, the new collection is created containing the current lesson, and a confirmation indicator updates accordingly

  @TC-086 @public-lesson-page-collections @medium @negative
  Scenario: Verify attempting to create a collection with an empty name is blocked
    Given The 'Create new Collection' modal is open with the Name field empty
    When Leave the Name field blank
    And Click 'Create & Add'
    Then The system shows a validation message and does not create a collection with a blank name

  @TC-087 @public-lesson-page-collections @medium @positive
  Scenario: Verify a lesson can be added to an already-existing collection
    Given User already has at least one collection created (e.g. 'Football')
    When On a different lesson's public page, click the add-to-collection icon
    And Select the existing 'Football' collection instead of creating a new one
    Then The lesson is added to the existing collection without creating a duplicate collection, and the collection's lesson count increases

  # ---------------------------------------------------------------
  # Module: Public Lesson Page - Customize
  # ---------------------------------------------------------------
  @TC-088 @public-lesson-page-customize @medium @positive
  Scenario: Verify 'Customize this lesson' creates an editable copy for a customizable lesson
    Given Lesson has 'Make my lesson customizable' enabled and is published
    When Click the 'Customize this lesson' button on the public lesson page
    Then A new draft copy of the lesson is created in the user's own 'Your Lessons', opening in the editor for further customization

  @TC-089 @public-lesson-page-customize @low @positive
  Scenario: Verify the customize counter increments when a lesson is customized by other users
    Given A customizable, published lesson currently shows a customize counter of '0'
    When From a different user account, click 'Customize this lesson' on the same public lesson
    And Return to the original lesson page and refresh
    Then The counter next to 'Customize this lesson' increments by 1 to reflect the new customization

  # ---------------------------------------------------------------
  # Module: Public Lesson Page - Video
  # ---------------------------------------------------------------
  @TC-090 @public-lesson-page-video @low @positive
  Scenario: Verify 'Watch on YouTube' opens the source video on YouTube
    Given User is viewing a public lesson page with an embedded YouTube video
    When Click the 'Watch on YouTube' link/button overlay on the video thumbnail
    Then A new browser tab opens directly to the source video on YouTube.com

  # ---------------------------------------------------------------
  # Module: Your Library - Favorites
  # ---------------------------------------------------------------
  @TC-091 @your-library-favorites @medium @positive
  Scenario: Verify the Favorites tab shows the correct count and items
    Given User has favorited one or more lessons
    When Navigate to 'Your Library' > 'Your Library' tab
    And Review the 'Favorites' section heading count and listed lesson cards
    Then The count shown next to 'Favorites' matches the actual number of favorited lesson cards displayed below

  @TC-092 @your-library-favorites @medium @positive
  Scenario: Verify the empty-state message displays correctly when there are no favorites
    Given User has zero favorited lessons
    When Navigate to 'Your Library'
    And Observe the Favorites section
    Then A heart icon, the message 'You have no favorite lessons.', and a 'Discover lessons to watch' link are displayed, and the count shows 0

  # ---------------------------------------------------------------
  # Module: Your Library - Watch Later
  # ---------------------------------------------------------------
  @TC-093 @your-library-watch-later @medium @positive
  Scenario: Verify a lesson added to Watch Later appears with correct count
    Given User clicks the 'add to collection'/list icon and selects Watch Later (or an equivalent action) from a lesson page
    When Add a lesson to Watch Later
    And Navigate to 'Your Library' and check the 'Watch later' section
    Then The lesson appears under 'Watch later' with its count incremented by 1

  @TC-094 @your-library-watch-later @medium @positive
  Scenario: Verify removing a lesson from Watch Later shows confirmation and reverts to empty state
    Given Exactly one lesson exists in the user's Watch Later list
    When Click the remove/list icon on the Watch Later lesson card to remove it
    And Observe the toast message and the section state
    Then A 'Lesson removed from your Watch later collection.' toast appears, and the section reverts to the empty state ('You have no lessons to watch later.') with count 0

  # ---------------------------------------------------------------
  # Module: Your Library - Collections
  # ---------------------------------------------------------------
  @TC-095 @your-library-collections @medium @positive
  Scenario: Verify 'Collections Created By You' lists a created collection with correct lesson count
    Given User has created at least one collection (e.g. 'Football') containing one lesson
    When Navigate to 'Your Library'
    And Scroll to 'Collections Created By You'
    Then The collection appears with its name and the count of lessons it contains matches what was added

  @TC-096 @your-library-collections @medium @positive
  Scenario: Verify deleting a collection removes it and shows a confirmation toast
    Given At least one collection exists under 'Collections Created By You'
    When Open the collection's options/menu
    And Select Delete/Remove and confirm if prompted
    Then A 'Football collection removed' toast appears, the collection no longer appears in the list, and the count updates to reflect the removal

  # ---------------------------------------------------------------
  # Module: Your Library - History
  # ---------------------------------------------------------------
  @TC-097 @your-library-history @low @positive
  Scenario: Verify 'Lessons History' reflects lessons the user has viewed
    Given User has viewed at least one lesson's public page during this session
    When Navigate to 'Your Library'
    And Scroll to 'Lessons History' and review its count and listed items
    Then Previously viewed lessons are listed under 'Lessons History' with an accurate count matching the number of distinct lessons viewed

  # ---------------------------------------------------------------
  # Module: Navigation - Discover
  # ---------------------------------------------------------------
  @TC-098 @navigation-discover @medium @positive
  Scenario: Verify the Discover dropdown menu displays all expected options with descriptions
    Given User is on any page with the main header visible
    When Click 'Discover' in the top navigation
    And Review the dropdown contents
    Then The dropdown shows four options - Lessons, Collections, Explorations, and Blog - each with the correct short description text text beneath it

  @TC-099 @navigation-discover @low @positive
  Scenario: Verify navigating to Discover > Collections shows existing public collections
    Given User is on any page with the Discover dropdown available
    When Open the 'Discover' dropdown
    And Click 'Collections'
    Then The user lands on a Collections listing page showing video-based lessons organized by theme, without errors

  # ---------------------------------------------------------------
  # Module: Create a Collection Page
  # ---------------------------------------------------------------
  @TC-100 @create-a-collection-page @medium @positive
  Scenario: Verify lessons can be added to a new collection directly from the 'Create a Collection' page
    Given User has navigated to the 'Create a Collection' page
    When Browse the lesson cards shown on the page
    And Click the add-to-collection icon on a lesson card
    And Create a new collection and add the lesson via the resulting modal
    Then The selected lesson is successfully added to the newly created collection, consistent with the behavior on individual lesson pages
