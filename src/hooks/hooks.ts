
import { After, AfterAll, Before, BeforeAll, Status } from '@cucumber/cucumber';
import { chromium, Browser } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { envConfig } from '@utils/envConfig';
import { TedEdLessonPage } from '../pages/TedEdLessonPage';

// 1. Intercept step definitions at library finalization to ignore failures and continue to next steps
// Disabled: skip the failed steps, do not complete the case, and fail immediately.
/*
const cucumber = require('@cucumber/cucumber');
const proto = Object.getPrototypeOf(cucumber.supportCodeLibraryBuilder);
const origFinalize = proto.finalize;

proto.finalize = function (canonicalIds: any) {
  const library = origFinalize.call(this, canonicalIds);
  
  library.stepDefinitions.forEach((stepDef: any) => {
    const origCode = stepDef.code;
    const wrappedCode = async function (this: any, ...args: any[]) {
      try {
        await origCode.apply(this, args);
      } catch (err: any) {
        console.log(`\n[CONTINUE-ON-FAILURE] Step failed: "${stepDef.expression.source}" -> Error: ${err.message}\n`);
      }
    };
    Object.defineProperty(wrappedCode, 'length', { value: origCode.length });
    stepDef.code = wrappedCode;
  });
  
  return library;
};
*/

// 2. Global interception of expect to cap timeouts to 5000ms
const playwrightTest = require('@playwright/test');
const originalExpect = playwrightTest.expect;

const customExpect = function(actual: any, messageOrOptions?: any) {
  const matchers = originalExpect(actual, messageOrOptions);
  return new Proxy(matchers, {
    get(target, prop, receiver) {
      const originalMatcher = Reflect.get(target, prop, receiver);
      if (typeof originalMatcher === 'function') {
        return function(this: any, ...args: any[]) {
          const lastArg = args[args.length - 1];
          if (lastArg && typeof lastArg === 'object') {
            if ('timeout' in lastArg && typeof lastArg.timeout === 'number') {
              lastArg.timeout = Math.min(lastArg.timeout, 5000);
            } else {
              lastArg.timeout = 5000;
            }
          } else {
            args.push({ timeout: 5000 });
          }
          return originalMatcher.apply(target, args);
        };
      }
      return originalMatcher;
    }
  });
};
Object.assign(customExpect, originalExpect);

customExpect.soft = function(actual: any, messageOrOptions?: any) {
  const matchers = originalExpect.soft(actual, messageOrOptions);
  return new Proxy(matchers, {
    get(target, prop, receiver) {
      const originalMatcher = Reflect.get(target, prop, receiver);
      if (typeof originalMatcher === 'function') {
        return function(this: any, ...args: any[]) {
          const lastArg = args[args.length - 1];
          if (lastArg && typeof lastArg === 'object') {
            if ('timeout' in lastArg && typeof lastArg.timeout === 'number') {
              lastArg.timeout = Math.min(lastArg.timeout, 5000);
            } else {
              lastArg.timeout = 5000;
            }
          } else {
            args.push({ timeout: 5000 });
          }
          return originalMatcher.apply(target, args);
        };
      }
      return originalMatcher;
    }
  });
};

playwrightTest.expect = customExpect;

// Helper to patch prototype of Page/Locator to cap action/wait timeouts
function patchPrototype(prototypeObj: any) {
  for (const key of Object.getOwnPropertyNames(prototypeObj)) {
    if (key === 'constructor') continue;
    try {
      const desc = Object.getOwnPropertyDescriptor(prototypeObj, key);
      if (!desc || typeof desc.value !== 'function') continue;

      const originalMethod = desc.value;
      if ((originalMethod as any).__patched) continue;

      const patchedMethod = function(this: any, ...args: any[]) {
        if (key === 'waitFor') {
          return originalMethod.apply(this, args);
        }
        const lastArg = args[args.length - 1];
        if (lastArg && typeof lastArg === 'object') {
          if ('timeout' in lastArg && typeof lastArg.timeout === 'number') {
            lastArg.timeout = Math.min(lastArg.timeout, 5000);
          }
        }
        return originalMethod.apply(this, args);
      };
      (patchedMethod as any).__patched = true;
      Object.defineProperty(prototypeObj, key, {
        ...desc,
        value: patchedMethod,
      });
    } catch (e) {
      // Ignore non-configurable properties
    }
  }
}

// Patch Page prototype to handle 429 rate limiting dynamically on navigate/goto
function patchPagePrototype(pagePrototype: any) {
  const originalGoto = pagePrototype.goto;
  if (originalGoto && !(originalGoto as any).__patched) {
    const patchedGoto = async function(this: any, url: string, options: any) {
      const attempts = 3;
      const patchedOptions = { ...options, timeout: Math.min(options?.timeout || 45000, 45000) };
      for (let i = 0; i < attempts; i++) {
        try {
          const response = await originalGoto.call(this, url, patchedOptions);
          const currentUrl = this.url();
          const status = response ? response.status() : 200;
          if (currentUrl.includes('/429') || status === 429) {
            console.log(`\n[Rate Limit] Hit 429 navigating to ${url}. Waiting ${3000 * (i + 1)}ms before retry...\n`);
            await new Promise(resolve => setTimeout(resolve, 3000 * (i + 1)));
            continue;
          }
          return response;
        } catch (err: any) {
          if (i === attempts - 1) throw err;
          console.log(`\n[Navigation Error] ${err.message}. Retrying in 2s...\n`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    };
    (patchedGoto as any).__patched = true;
    pagePrototype.goto = patchedGoto;
  }
}

let browser: Browser;
let sharedContext: any;
let isFirstScenario = true;

BeforeAll(async () => {
  browser = await chromium.launch({ headless: envConfig.headless });

  // Create a SHARED context that persists across all scenarios
  sharedContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    httpCredentials: {
      username: envConfig.basicAuthUsername,
      password: envConfig.basicAuthPassword,
    },
  });

  // Instantly patch prototypes by spawning a temporary page
  const tempPage = await sharedContext.newPage();
  patchPrototype(Object.getPrototypeOf(tempPage.locator('body')));
  patchPagePrototype(Object.getPrototypeOf(tempPage));
  await tempPage.close();
});

Before(async function (this: CustomWorld) {
  let attempts = 3;
  for (let i = 0; i < attempts; i++) {
    try {
      this.context = sharedContext;
      this.page = await this.context.newPage();
      this.page.setDefaultTimeout(15000);
      this.page.setDefaultNavigationTimeout(90000);
      break; // successfully created page!
    } catch (err: any) {
      console.log(`\n[CRASH-RECOVERY] Failed to open page: ${err.message}. Re-initializing browser and context (Attempt ${i + 1}/${attempts})...\n`);
      try {
        if (sharedContext) await sharedContext.close().catch(() => {});
        if (browser) await browser.close().catch(() => {});
      } catch (e) {}
      
      // Spawn new browser and context
      browser = await chromium.launch({ headless: envConfig.headless });
      sharedContext = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        httpCredentials: {
          username: envConfig.basicAuthUsername,
          password: envConfig.basicAuthPassword,
        },
      });
      
      // Patch prototypes again
      const tempPage = await sharedContext.newPage();
      patchPrototype(Object.getPrototypeOf(tempPage.locator('body')));
      patchPagePrototype(Object.getPrototypeOf(tempPage));
      await tempPage.close();
      
      // Log in again in the new context
      const loginPage = await sharedContext.newPage();
      const pom = new TedEdLessonPage(loginPage);
      try {
        console.log(`\n[CRASH-RECOVERY] Re-authenticating in new browser context...\n`);
        await pom.navigateToHome();
        await pom.clickSignIn();
        await pom.enterEmail(this.credentials.email);
        await pom.clickEmailContinue();
        await pom.enterPassword(this.credentials.password);
        await pom.clickPasswordContinue();
        await pom.acceptConsentIfVisible();
        await pom.verifyDashboardURL();
        console.log(`\n[CRASH-RECOVERY] Re-authentication successful!\n`);
      } catch (loginErr: any) {
        console.error(`\n[CRASH-RECOVERY] Re-authentication failed: ${loginErr.message}\n`);
      } finally {
        await loginPage.close().catch(() => {});
      }
    }
  }
});

Before({ tags: '@setup' }, async function (this: CustomWorld) {
  // Tag-based setup placeholder for scenarios that require explicit authenticated setup.
});

After(async function (this: CustomWorld, scenario: any) {
  if (scenario.result?.status === Status.FAILED) {
    try {
      const screenshotPath = `test-results/screenshots/${scenario.pickle.name.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Saved failure screenshot: ${screenshotPath}`);
    } catch (err) {
      // ignore screenshot errors
    }
  }
  // Close the page to start clean for the next scenario
  if (this.page) {
    await this.page.close().catch(() => {});
  }
});

AfterAll(async () => {
  // Close shared context and browser only at the very end
  if (sharedContext) {
    await sharedContext.close();
  }
  await browser.close();
});

