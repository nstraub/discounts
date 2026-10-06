import { After, AfterAll, Before, BeforeAll, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';

import { produceDiscount } from '@sut/support/example-discounts';

import { acceptancePort } from './apps-under-test';

// Below cucumber's 5 s step timeout, so a missing element fails with Playwright's message naming it.
const pageTimeout = 4_000;

let browser: Browser;

export class PlaywrightWorld extends World {
  context!: BrowserContext;
  page!: Page;
  someoneElsesContext?: BrowserContext;
  publishedDiscount!: typeof produceDiscount;

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
   * Opens a page in a browser context of its own, as someone else on another device would.
   * @returns that page, aimed at the app under test.
   */
  async openSomeoneElsesPage(): Promise<Page> {
    this.someoneElsesContext = await browser.newContext({ baseURL: `http://localhost:${acceptancePort}` });
    const page = await this.someoneElsesContext.newPage();
    page.setDefaultTimeout(pageTimeout);
    return page;
  }

  /**
   * Closes the scenario's browser contexts, so no state leaks into the next scenario.
   * @returns resolves once the contexts are closed.
   */
  async closePage(): Promise<void> {
    await this.context.close();
    await this.someoneElsesContext?.close();
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
