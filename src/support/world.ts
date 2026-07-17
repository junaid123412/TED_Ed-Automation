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
    username: 'teduser',
    password: 'tUeygHu@4q',
  };

  // TED-Ed login credentials — used on the auth.ted.com screen
  credentials = {
    email: 'junaid.hussain+1@kualitatem.com',
    password: 'test@112233',
  };

  baseUrl = envConfig.baseUrl;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
