@regression @discussForums
Feature: Discuss Interactive Forums Module
  As a creator of a TED-Ed lesson
  I want to create discussion prompts in the Discuss section
  So that I can foster interactive student discussions

  Background:
    Given I navigate to the TED-Ed homepage with basic auth credentials
    And I am logged in and on the dashboard
    And I am on the lesson editor screen

  @case40
  Scenario: Case 40: Launch Forum Creation Form Panel
    When I click the Discuss section button
    And I click the Add discussion option
    Then the discussion prompt modal should display
    And the discussion prompt fields should render correctly

  @case41
  Scenario: Case 41: Formulate Discussion Prompt Entries
    Given I have opened the Discussion dialog
    When I type "football" into the discussion prompt field
    Then the discussion prompt field should contain the text "football"

  @case42
  Scenario: Case 42: Populate Optional Forum Details Field Elements
    Given I have opened the Discussion dialog
    When I type "football" into the discussion description field
    Then the discussion description field should contain the text "football"

  @case43
  Scenario: Case 43: Commit Forum Topic Configuration Entries
    Given I have opened the Discussion dialog
    And I have typed "football" into the prompt field
    And I have typed "football" into the description field
    When I click the Save discussion button
    Then a confirmation message "Discussion was successfully created" should appear

  @case44
  Scenario: Case 44: Forum Row Data Verification Check
    Given I have saved a Discussion with prompt "football"
    Then the discussion list in the Discuss section should display the prompt "football"
