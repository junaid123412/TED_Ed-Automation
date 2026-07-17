@regression @publishingState
Feature: Publishing and State Transitions Module
  As a creator of a TED-Ed lesson
  I want to publish my draft lesson
  So that it becomes visible on the dashboard and shared with students

  Background:
    Given I navigate to the TED-Ed homepage with basic auth credentials
    And I am logged in and on the dashboard
    And I am on the lesson editor screen

  @case48
  Scenario: Case 48: Examine Preliminary Status Flags Metadata
    When I focus on the top right sidebar status indicator
    Then I click the info circle icon to confirm the draft status tooltip details

  @case49
  Scenario: Case 49: Execute Lesson Publishing Commands Flow
    When I click the primary red Publish button
    Then the lesson published confirmation dialog should appear with share options

  @case50
  Scenario: Case 50: Dashboard Status Verification Routines
    Given I have clicked the primary red Publish button
    When I close the share lesson confirmation modal
    And I navigate to the lessons dashboard
    Then the dashboard should list the published lesson
    And the status label for the lesson should read "Published"
