@regression @thinkOpenAnswer
Feature: Think Assessment Builder - Open Answer Questions
  As a creator of a TED-Ed lesson
  I want to build open answer questions in the Think section
  So that I can prompt students for written responses

  Background:
    Given I navigate to the TED-Ed homepage with basic auth credentials
    And I am logged in and on the dashboard
    And I am on the lesson editor screen

  @case31
  Scenario: Case 31: Open Answer Dialog Setup Context Launch
    When I click on the Think section button
    And I click the Open Answer Question option
    Then the open answer question editor form should mount to the UI
    And the input field should be empty by default

  @case32
  Scenario: Case 32: Populate Open Text Requirements Matrix
    Given I have opened the Open Answer Question editor
    When I type the question text "football"
    And I click the Save question button
    Then a confirmation message "Question was successfully created" should appear

  @case33
  Scenario: Case 33: Verify List Component Assembly Updates
    Given I have saved an Open Answer Question with text "football"
    Then the question list in the Think section should display the question text "football"
    And the question icon should match the open-ended text design form
