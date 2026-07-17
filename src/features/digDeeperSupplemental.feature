@regression @digDeeper
Feature: Dig Deeper Supplemental Learning Framework
  As a creator of a TED-Ed lesson
  I want to add supplemental resources and text in the Dig Deeper section
  So that students can explore more topics related to the video

  Background:
    Given I navigate to the TED-Ed homepage with basic auth credentials
    And I am logged in and on the dashboard
    And I am on the lesson editor screen

  @case34
  Scenario: Case 34: Initialize Knowledge Extension Interface
    When I click the timeline step Dig Deeper
    Then the supplemental dialog header should identify the context as "Supplemental info"
    And the content input area should render clearly

  @case35
  Scenario: Case 35: Payload Bulk Injection Routines
    Given I have opened the Dig Deeper dialog
    When I enter the text "football" in the supplemental field
    Then the supplemental field should display "football"

  @case36
  Scenario: Case 36: Partial String Selection Automation
    Given I have opened the Dig Deeper dialog
    When I enter the text "football" in the supplemental field
    And I select the text "football" inside the supplemental editor
    And I click the bold formatting toolbar button
    Then the supplemental text should display as bold

  @case37
  Scenario: Case 37: System Dialog Interaction Verification
    Given I have opened the Dig Deeper dialog
    When I click the link toolbar option in the supplemental editor
    And I click the cancel button on the link input popup
    Then the supplemental editor should restore focus and remain unchanged

  @case38
  Scenario: Case 38: Confirm Material Additions Saving Routines
    Given I have opened the Dig Deeper dialog
    When I enter the text "football" in the supplemental field
    And I click the Save supplemental button
    Then the lesson updated toast message should display

  @case39
  Scenario: Case 39: Validate Parent Board Layout Displays Data
    Given I have opened the Dig Deeper dialog
    When I enter the text "football" in the supplemental field
    And I click the Save supplemental button
    Then the Dig Deeper section of the editor layout should display the saved content "football"
