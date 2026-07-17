@regression @letsBegin
Feature: Lets Begin Narrative Section Module
  As a creator of a TED-Ed lesson
  I want to expand and customize the lesson introduction text
  So that I can outline the core narrative and objectives for students

  Background:
    Given I navigate to the TED-Ed homepage with basic auth credentials
    And I am logged in and on the dashboard
    And I am on the lesson editor screen

  @case15
  Scenario: Case 15: Introduction Framework Node Expansion
    When I click the workflow stage anchor point Let's Begin
    Then the modal header should identify the context as "Introduction"
    And the active formatting toolbar options should render clearly

  @case16
  Scenario: Case 16: Formatted String Insertion Routine
    Given I have opened the Let's Begin dialog
    When I enter the text "football" in the introduction field
    And I select the text "football" inside the editor
    And I click the bold formatting toolbar button
    Then the text should be formatted as bold

  @case17
  Scenario: Case 17: Apply Text Decoration Underline Styles
    Given I have opened the Let's Begin dialog
    When I enter the text "football" in the introduction field
    And I select the text "football" inside the editor
    And I click the underline formatting toolbar button
    Then the text should be formatted as underlined

  @case18
  Scenario: Case 18: Embed Hyperlinks Context Links
    Given I have opened the Let's Begin dialog
    When I enter the text "football" in the introduction field
    And I select the text "football" inside the editor
    And I click the link formatting toolbar button
    And I enter the link address "http://football.com" in the link prompt
    And I confirm the link prompt action
    Then the hyperlink should be embedded in the text

  @case19
  Scenario: Case 19: Clear Text Decoration Parameters
    Given I have opened the Let's Begin dialog
    And I have entered and formatted the text "football" in the introduction field
    When I select the text "football" inside the editor
    And I click the formatting clear toolbar button
    Then the text styling should be cleared

  @case20
  Scenario: Case 20: Persist Workspace Introduction Content Blocks
    Given I have opened the Let's Begin dialog
    When I enter the text "football" in the introduction field
    And I click the Save introduction button
    Then the lesson updated toast message should display

  @case21
  Scenario: Case 21: Verify Core Page Layout Refreshes
    Given I have opened the Let's Begin dialog
    When I enter the text "football" in the introduction field
    And I click the Save introduction button
    Then the introduction section of the editor layout should display the saved content "football"
