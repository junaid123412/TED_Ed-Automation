@regression @registerAccount
Feature: Register Account
  As a new visitor to TED-Ed
  I want to create an account
  So that I can access personalized educational content

  Background:
    Given I am on the TED-Ed homepage
    And I click the "Register" link in the banner

  # TC-208
  Scenario: Navigate to Registration page
    Then the username/email lookup field should be visible

  # TC-209
  Scenario: Enter valid email in username field
    When I enter a valid unique email in the username field
    Then the username field should contain the entered email

  # TC-210
  Scenario: Email field accepts mixed-case input
    When I enter a mixed-case email address in the username field
    And I click lookup Continue
    Then no validation error should be shown
    And I should proceed past the lookup step

  # TC-211
  Scenario: Continue from lookup step to signup step
    When I enter a valid unique email in the username field
    And I click lookup Continue
    Then the signup password field should be visible

  # TC-212
  Scenario: Enter password on signup step
    When I enter a valid unique email in the username field
    And I click lookup Continue
    And I enter a valid password in the signup password field
    Then the password field should mask the input

  # TC-213
  Scenario: reCAPTCHA checkbox is displayed
    When I enter a valid unique email in the username field
    And I click lookup Continue
    And I enter a valid password in the signup password field
    Then the "I'm not a robot" reCAPTCHA checkbox should be visible

  # TC-214
  Scenario: Complete reCAPTCHA challenge
    When I enter a valid unique email in the username field
    And I click lookup Continue
    And I enter a valid password in the signup password field
    And I complete the reCAPTCHA challenge
    Then the signup "Continue" button should be visible

  # TC-215
  Scenario: Continue from signup step to personal details
    When I complete the email, password, and reCAPTCHA steps
    And I click the signup "Continue" button
    Then the "First Name" field should be visible
    And the "Last Name" field should be visible

  # TC-216
  Scenario: Enter first and last name
    When I complete the email, password, and reCAPTCHA steps
    And I click the signup "Continue" button
    And I enter "Test" as my first name
    And I enter "User" as my last name
    Then the first name field should contain "Test"
    And the last name field should contain "User"

  # TC-217
  Scenario: Accept marketing consent and create account
    When I complete the email, password, and reCAPTCHA steps
    And I click the signup "Continue" button
    And I enter my first and last name
    And I check the marketing communications consent checkbox
    Then the consent checkbox should be checked
    When I click onboarding Create Account
    Then my account should be created

  # TC-218
  Scenario: Select Educator role during onboarding
    When I complete the full signup and account creation
    And I click "Continue" on the account confirmation
    And I select "Educator" as my role
    Then the "Educator" role should be selected

  # TC-219
  Scenario: Select topics of interest and edit role in Settings
    When I complete the full signup and account creation
    And I select "Educator" as my role
    And I select the following topics of interest:
      | The Arts                  |
      | Design, Engineering &     |
      | Business & Economics      |
      | Health                    |
    And I click onboarding Continue to TED-Ed
    Then I should be redirected to the TED-Ed dashboard
    When I open the user avatar menu
    And I navigate to "Settings"
    And I click settings Edit Settings
    And I select "Educator" as my role
    Then the "Educator" role should be selected
