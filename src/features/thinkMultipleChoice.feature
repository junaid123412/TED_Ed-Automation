@regression @thinkMultipleChoice
Feature: Think Assessment Builder - Multiple Choice Questions
  As a creator of a TED-Ed lesson
  I want to build multiple choice questions in the Think section
  So that I can assess student comprehension of the video content

  Background:
    Given I navigate to the TED-Ed homepage with basic auth credentials
    And I am logged in and on the dashboard
    And I am on the lesson editor screen

  @case22
  Scenario: Case 22: Open Question Management Matrix
    When I click on the Think section button
    And I click the Multiple Choice Question option
    Then the multiple choice question editor form should mount to the UI

  @case23
  Scenario: Case 23: Insert Dynamic Automated Source Data Into Fields
    Given I have opened the Multiple Choice Question editor
    When I type the question text "football"
    Then the question text field should display the text "football"

  @case24
  Scenario: Case 24: Add First Answer Response Option Variant
    Given I have opened the Multiple Choice Question editor
    When I type "football" into answer option A
    Then answer option A should display the text "football"

  @case25
  Scenario: Case 25: Populate Alternate Variable Option Elements
    Given I have opened the Multiple Choice Question editor
    When I type "football" into answer option B
    And I type "football" into answer option C
    Then answer option B should display "football"
    And answer option C should display "football"

  @case26
  Scenario: Case 26: Expand Option Range Context Limits
    Given I have opened the Multiple Choice Question editor
    When I click the Add another answer button
    Then an additional answer option field E should register dynamically

  @case27
  Scenario: Case 27: Prune Extraneous Option Content Paths
    Given I have opened the Multiple Choice Question editor
    And I have clicked the Add another answer button to add option E
    When I click the delete trashcan icon next to option E
    Then option E should be removed from the form

  @case28
  Scenario: Case 28: Configure Video Hint Timecodes
    Given I have opened the Multiple Choice Question editor
    When I clear the video hint field
    And I type the timestamp "00:52" into the video hint field
    Then the video hint field should display "00:52"

  @case29
  Scenario: Case 29: Persist Multiple Choice Configuration Definitions
    Given I have opened the Multiple Choice Question editor
    And I have filled the question text with "football"
    And I have filled answer options A, B, C, and D with "football"
    When I click the Save question button
    Then a confirmation message "Question was successfully created" should appear

  @case30
  Scenario: Case 30: Assert Question Array Render List Structures
    Given I have saved a Multiple Choice Question with text "football"
    Then the question list in the Think section should display the question text "football"
    And the question number counter should calculate the sequence accurately
