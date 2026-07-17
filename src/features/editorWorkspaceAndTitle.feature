@regression @editorWorkspace
Feature: Editor Workspace Initialization and Title Blocks
  As a creator of a TED-Ed lesson
  I want to configure the workspace and edit the lesson title
  So that I can customize the lesson identification details

  Background:
    Given I navigate to the TED-Ed homepage with basic auth credentials
    And I am logged in and on the dashboard
    And I have created a new lesson based on "football" video search

  @case8
  Scenario: Case 8: Workspace Default State
    Then the embedded video should match the source asset selection
    And the lesson status indicator should read "Status: DRAFT"
    And the customized elements should remain toggled off by default

  @case9
  Scenario: Case 9: Launch Title Modifications
    When I click on the lesson title edit trigger
    Then a dialogue box overlay titled "Edit title" should present text inputs
    And the existing lesson title value should load accurately inside the field

  @case10
  Scenario: Case 10: Clear Existing Title Value
    When I click on the lesson title edit trigger
    And I select all characters inside the title text input
    And I press Backspace to clear the input
    Then the title input field should be empty

  @case11
  Scenario: Case 11: Populate Custom Draft Title
    When I click on the lesson title edit trigger
    And I clear the title input field
    And I type the lesson title "football"
    And I click the Save title button
    Then the title input field dialog should close

  @case12
  Scenario: Case 12: Validate Persistent Title Rendering
    When I click on the lesson title edit trigger
    And I clear the title input field
    And I type the lesson title "football"
    And I click the Save title button
    Then a toast feedback message "Lesson updated" should be visible
    And the main workspace header should display the title "football"

  @case13
  Scenario: Case 13: Absolute Title Cancel Action Routine
    When I click on the lesson title edit trigger
    And I clear the title input field
    And I type the lesson title "football"
    And I click the Cancel title button
    Then the main workspace header title should remain unchanged

  @case14
  Scenario: Case 14: Title Maximum Boundaries Character Limit Tracking
    When I click on the lesson title edit trigger
    And I clear the title input field
    And I type a long lesson title exceeding one hundred characters using "football"
    Then the title input should enforce a limit or validation warning
    And I escape the title prompt dialog resetting default state
