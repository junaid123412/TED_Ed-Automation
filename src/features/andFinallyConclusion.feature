@regression @andFinally
Feature: And Finally Conclusion Section Module
  As a creator of a TED-Ed lesson
  I want to add closing thoughts and next steps in the And Finally section
  So that I can summarize the lesson objectives for students

  Background:
    Given I navigate to the TED-Ed homepage with basic auth credentials
    And I am logged in and on the dashboard
    And I am on the lesson editor screen

  @case45
  Scenario: Case 45: Expand Lesson Closing Form Views
    When I click the And Finally section button
    Then the conclusion modal header should identify the context as "Conclusion"
    And the character limit indicator should display (0/1000)

  @case46
  Scenario: Case 46: Populate Contextual Closing Thoughts Values
    Given I have opened the And Finally dialog
    When I enter the text "football" in the conclusion field
    And I click the Save conclusion button
    Then the lesson updated toast message should display

  @case47
  Scenario: Case 47: Verify Integration Flow Across Workspace Rows
    Given I have opened the And Finally dialog
    When I enter the text "football" in the conclusion field
    And I click the Save conclusion button
    Then the And Finally section of the editor layout should display the saved content "football"
