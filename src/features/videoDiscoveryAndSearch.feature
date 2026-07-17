@regression @videoDiscovery
Feature: Video Discovery and Search Module
  As a user on the TED-Ed platform
  I want to search and select videos
  So that I can use them as the basis for new lessons

  Background:
    Given I navigate to the TED-Ed homepage with basic auth credentials
    And I am logged in and on the dashboard

  @case1
  Scenario: Case 1: Navigate to Lesson Creation Page
    When I hover over the Create menu item in the navbar
    And I click on A Lesson sub-option
    Then the URL should update to include /videos

  @case2
  Scenario: Case 2: Empty State Input Verification
    Given I navigate directly to /videos
    When I click inside the search input box
    And I press Enter without typing any characters
    Then I verify no loading modal appears and search does not execute

  @case3
  Scenario: Case 3: Execute Video Search Query
    Given I navigate directly to /videos
    When I click inside the search input box
    And I type the search query "football"
    And I click the search magnifier button
    Then the URL parameters should update to include ?q=football

  @case4
  Scenario: Case 4: Search Grid Result Generation
    Given I navigate directly to /videos
    When I click inside the search input box
    And I type the search query "football"
    And I click the search magnifier button
    Then the video results grid should load structural elements
    And the count of video result card elements present should be greater than zero

  @case5
  Scenario: Case 5: Target Video Selection Modal Trigger
    Given I have executed a search query for "football"
    When I click on the first available video result card preview body
    Then a loading dialog with text "Fetching..." should appear overlaying the content

  @case6
  Scenario: Case 6: Selection Dialog Cancellation
    Given I have executed a search query for "football"
    And I have clicked on the first available video result card to show the confirmation dialog
    When I click the secondary Cancel button on the modal
    Then the confirmation modal should disappear and focus should return to the search results screen

  @case7
  Scenario: Case 7: Confirm Video Selection Transition
    Given I have executed a search query for "football"
    And I have clicked on the first available video result card to show the confirmation dialog
    When I click the primary red Continue button
    Then I should be redirected to the interactive lesson editor route
