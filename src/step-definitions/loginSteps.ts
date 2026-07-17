import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { TedEdLessonPage } from '../pages/TedEdLessonPage';

function getLoginPage(world: CustomWorld): TedEdLessonPage {
  if (!world.loginPage) {
    world.loginPage = new TedEdLessonPage(world.page);
  }
  return world.loginPage;
}

// ─── Given I open the TED-Ed homepage ────────────────────────────────────────
Given('I open the TED-Ed homepage', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await loginPage.navigateToHome();           // → POM: navigateToHome()
});

Given('I am on the TED-Ed homepage', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  const currentUrl = this.page.url();
  const isLessonOrEditor = currentUrl.includes('/u/lessons') || currentUrl.includes('/lesson_editor');
  if (isLessonOrEditor || !currentUrl.includes('teded-integration.herokuapp.com')) {
    await loginPage.navigateToHome();
  }
});

// ─── When I click the Sign In link ───────────────────────────────────────────
When('I click the Sign In link', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await loginPage.clickSignIn();              // → POM: clickSignIn()
});

When('I click the email input field', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await loginPage.clickEmailInputField();
});

// ─── And I enter my email address ────────────────────────────────────────────
When('I enter my email address', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await loginPage.enterEmail(this.credentials.email);  // → POM: enterEmail()
});

// ─── And I click the Continue button on the email screen ─────────────────────
When('I click the Continue button on the email screen', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await loginPage.clickEmailContinue();       // → POM: clickEmailContinue()
});

When('I click the password input field', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await loginPage.clickPasswordInputField();
});

// ─── And I enter my password ─────────────────────────────────────────────────
When('I enter my password', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await loginPage.enterPassword(this.credentials.password);  // → POM: enterPassword()
});

// ─── And I click the Continue button on the password screen ──────────────────
When('I click the Continue button on the password screen', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await loginPage.clickPasswordContinue();    // → POM: clickPasswordContinue()
});

When('I click the Continue button on the consent screen', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await loginPage.clickContinueOnConsentScreen();
});

// ─── And I accept the consent screen if it appears ───────────────────────────
When('I accept the consent screen if it appears', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await loginPage.acceptConsentIfVisible();   // → POM: acceptConsentIfVisible()
});

// ─── Then I should be redirected to the TED-Ed dashboard ─────────────────────
Then('I should be redirected to the TED-Ed dashboard', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await loginPage.verifyDashboardURL();       // → POM: verifyDashboardURL()
});

// ─── And I should not see an access denied message ──────────────────────────
Then('I should not see an access denied message', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await loginPage.verifyNoAccessDenied();     // → POM: verifyNoAccessDenied()
});
