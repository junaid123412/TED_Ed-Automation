import { IWorldOptions, setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';
import { TedEdLessonPage } from '../pages/TedEdLessonPage';
import { envConfig } from '@utils/envConfig';

setDefaultTimeout(120000);

export class CustomWorld extends World {
  page!: Page;
  context!: BrowserContext;
  loginPage!: TedEdLessonPage;
  createLessonPage!: TedEdLessonPage;

  // HTTP Basic Auth — used before the app loads
  accountAccess = {
    username: envConfig.basicAuthUsername,
    password: envConfig.basicAuthPassword,
  };

  // TED-Ed login credentials — used on the auth.ted.com screen
  credentials = {
    email: envConfig.tedLoginEmail,
    password: envConfig.tedLoginPassword,
  };

  baseUrl = envConfig.baseUrl;

  // Dynamic credentials tracked from memory table
  registrationEmail?: string;
  registrationPassword?: string;
  registrationCounter?: number;

  // Track tags created dynamically during a test scenario for post-run cleanup
  createdTestTags: string[] = [];

  // Track pre-existing tags inspected during a test scenario
  preExistingTestTags: string[] = [];

  currentScenario?: any;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
