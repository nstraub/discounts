import { After, AfterAll, Before, BeforeAll, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';

import { acceptancePort } from './apps-under-test';

// Below cucumber's 5 s step timeout, so a missing element fails with Playwright's message naming it.
const pageTimeout = 4_000;

let browser: Browser;

export class PlaywrightWorld extends World {
  context!: BrowserContext;
  page!: Page;

  /**
   * Opens a fresh browser context and page for one scenario, aimed at the app under test.
   * @returns resolves once the page is ready for the scenario's steps.
   */
  async openPage(): Promise<void> {
    this.context = await browser.newContext({ baseURL: `http://localhost:${acceptancePort}` });
    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(pageTimeout);
  }

  /**
   * Closes the scenario's browser context, so no state leaks into the next scenario.
   * @returns resolves once the context is closed.
   */
  async closePage(): Promise<void> {
    await this.context.close();
  }
}

setWorldConstructor(PlaywrightWorld);

BeforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

Before(async function (this: PlaywrightWorld) {
  await this.openPage();
});

After(async function (this: PlaywrightWorld) {
  await this.closePage();
});

AfterAll(async () => {
  await browser.close();
});
