@footer @redirection
Feature: Footer Section and Redirection

  Scenario: TC-220 — Navigate to Visit section from footer
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Visit" heading
    Then the page should scroll to the Visit section

  Scenario: TC-221 — Navigate to Help page from footer
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Help" link
    Then I should be redirected to the Help page
    And I return to the home lessons page

  Scenario: TC-222 — Navigate to Contact page from footer
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Contact" link
    Then I should be redirected to the Contact page
    And I return to the home lessons page

  Scenario: TC-223 — Navigate to Blog page from footer
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Blog" link
    Then I should be redirected to the Blog page
    And I return to the home lessons page

  Scenario: TC-224 — Navigate to About page from footer
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "About" link
    Then I should be redirected to the About page
    And I return to the home lessons page

  Scenario: TC-225 — Navigate to Educators page from footer
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Educators" link
    Then I should be redirected to the Educators page
    And I return to the home lessons page

  Scenario: TC-226 — Navigate to Patrons page from footer
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Patrons" link
    Then I should be redirected to the Patrons page
    And I return to the home lessons page

  @new-tab
  Scenario: TC-227 — Facebook icon opens correct external page
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Facebook" icon
    Then a new tab should open with "facebook.com" and be closed

  @new-tab
  Scenario: TC-228 — Instagram icon opens correct external page
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Instagram" icon
    Then a new tab should open with "instagram.com" and be closed

  @new-tab
  Scenario: TC-229 — X (Twitter) icon opens correct external page
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "X" icon
    Then a new tab should open and navigate to "https://x.com/TED_ED"
    And I close the popup tab

  @new-tab
  Scenario: TC-230 — LinkedIn icon opens correct external page
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "LinkedIn" icon
    Then a new tab should open with "linkedin.com" and be closed

  @new-tab
  Scenario: TC-231 — YouTube icon opens correct external page
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "YouTube" icon
    Then a new tab should open with "youtube.com" and be closed

  Scenario: TC-232 — Select Weekly frequency radio button
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Weekly" radio option
    Then the "Weekly" radio option should be checked

  Scenario: TC-233 — Select Daily frequency radio button
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Daily" radio option
    Then the "Daily" radio option should be checked

  Scenario: TC-234 — Toggle between Weekly and Daily and verify only one active
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Weekly" radio, then click "Daily" radio
    Then the "Daily" radio should be checked and "Weekly" unchecked
    And only one radio should be active at a time

  Scenario: TC-235 — Open frequency/country dropdown in newsletter block
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click the frequency and country dropdown control
    Then the dropdown options should be visible or expanded

  Scenario: TC-236 — Enter email address in newsletter field
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click the newsletter email textbox
    And I fill the newsletter email with "Junaid@gmail.com"
    Then the newsletter email field value should equal "Junaid@gmail.com"

  Scenario: TC-237 — Submit newsletter subscription with Weekly selected
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I fill the newsletter email with "Junaid@gmail.com"
    And I select the "Weekly" radio option
    And I click the newsletter "Subscribe" button
    Then the newsletter subscription confirmation or no validation error should appear

  Scenario: TC-238 — Attempt Subscribe with empty email field (negative case)
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I leave the newsletter email textbox empty
    And I click the newsletter "Subscribe" button
    Then a newsletter subscription validation error or required-field message should be shown

  Scenario: TC-239 — Newsletter block "Terms of use" link (same tab)
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Terms of use" link inside newsletter block
    Then I should be redirected to the Terms of use page
    And I return to the home lessons page

  @new-tab
  Scenario: TC-240 — Newsletter block "Privacy policy" link (new tab)
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Privacy policy (opens in new tab)" link in newsletter block
    Then a new tab should open with "privacy" and be closed

  @new-tab
  Scenario: TC-241 — Newsletter block "Terms of service" link (new tab)
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Terms of service (opens in new tab)" link in newsletter block
    Then a new tab should open with "terms" and be closed

  Scenario: TC-242 — "TED Conferences, LLC" copyright link
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "TED Conferences, LLC" link
    Then I should be redirected to the TED corporate page
    And I return to the home lessons page

  Scenario: TC-243 — Bottom bar "Terms of use" link
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click bottom bar "Terms of use" link
    Then I should be redirected to the Terms of use page
    And I return to the home lessons page

  Scenario: TC-244 — Bottom bar "Privacy policy" link
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click bottom bar "Privacy policy" link
    Then I should be redirected to the Privacy policy page
    And I return to the home lessons page

  Scenario: TC-245 — "Video usage policy" link
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Video usage policy" link
    Then I should be redirected to the Video usage policy page
    And I return to the home lessons page

  Scenario: TC-246 — "Learn more" link
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Learn more" link
    Then I should be redirected to the relevant detail page
    And I return to the home lessons page

  Scenario: TC-247 — Open Privacy preferences panel
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Privacy preferences" button
    Then the cookie preferences panel should be visible

  Scenario: TC-248 — Close Privacy preferences panel via Close Cookie Preferences button
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Privacy preferences" button
    And I click "Close Cookie Preferences" button on the cookie preferences panel
    Then the cookie preferences panel should not be visible

  Scenario: TC-249 — Footer visible after navigating from root URL (not lessons page)
    Given I navigate to the root lessons url page
    When I scroll the footer into view
    Then the footer section should be rendered and visible
    And all primary footer navigation links should be present

  Scenario: TC-250 — Footer static text block is rendered correctly
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I locate the footer static text block
    Then the footer static text block should be visible and contain the expected link labels

  Scenario: TC-251 — Re-verify footer after page reload
    Given I navigate to the entry lessons page
    When I reload the page
    And I scroll the footer into view
    Then the footer section and all primary links should be visible

  Scenario: TC-252 — Navigate footer link, then browser-back returns to lessons page
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "About" link
    And I click the browser back button
    Then the page URL should return to the lessons page

  Scenario: TC-253 — Verify Help link opens without leaving footer scroll position on return
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click "Help" link
    And I return to the home lessons page
    Then the footer should be scrollable back into view again

  Scenario: TC-254 — Verify all 5 social icons are visible together before interaction
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    Then Facebook, Instagram, X, LinkedIn, and YouTube icons should all be visible
    And each social icon should be enabled and clickable

  Scenario: TC-255 — Verify no duplicate/orphaned tabs remain after visiting all social icons sequentially
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I click each social icon in sequence and close each popup
    Then only the main page should remain open

  Scenario: TC-256 — Verify Subscribe button is disabled/enabled based on radio selection state
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I fill the newsletter email with "Junaid@gmail.com"
    And I leave the newsletter frequency radio selection empty
    And I click the newsletter "Subscribe" button
    Then the expected frequency selection validation error should occur

  Scenario: TC-257 — Verify Terms of use bottom link differs in destination from newsletter block Terms of use link
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I check the newsletter "Terms of use" destination URL
    And I check the bottom bar "Terms of use" destination URL
    Then both Terms of use links should point to the same Terms page

  @new-tab
  Scenario: TC-258 — Verify Privacy policy consistency across newsletter and bottom bar links
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I check the newsletter "Privacy policy (opens in new tab)" destination URL on new tab
    And I check the bottom bar "Privacy policy" destination URL
    Then both Privacy policy links should point to the same Privacy page

  Scenario: TC-259 — Full footer smoke pass: verify all footer sections load without console errors
    Given I navigate to the entry lessons page
    And I scroll the footer into view
    When I attach page error and console listeners
    And I interact with one representative element from each footer subsection
    Then no console errors or failed network requests should be logged during the smoke pass
