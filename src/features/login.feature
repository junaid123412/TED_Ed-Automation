@smoke @login
Feature: User Login
  As a registered user
  I want to sign in to the TED-Ed platform
  So that I can access my lessons and library

  Background:
    Given I open the TED-Ed homepage

  @positive
  Scenario: Successful login with valid credentials
    When I click the Sign In link
    And I enter my email address
    And I click the Continue button on the email screen
    And I enter my password
    And I click the Continue button on the password screen
    And I accept the consent screen if it appears
    Then I should be redirected to the TED-Ed dashboard
    And I should not see an access denied message
