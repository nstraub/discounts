import { Given, Then, When } from '@cucumber/cucumber';

import { produceDiscount } from '@sut/support/example-discounts';

import { DiscountsPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

Given('Mike has published a discount on produce', async function (this: PlaywrightWorld) {
  const mikesPage = new DiscountsPage(await this.openSomeoneElsesPage());
  await mikesPage.open();
  await mikesPage.publish(produceDiscount);
});

When('Sue looks for a new store with fresh produce', async function (this: PlaywrightWorld) {
  await new DiscountsPage(this.page).open();
});

Then("she finds Mike's store", async function (this: PlaywrightWorld) {
  await new DiscountsPage(this.page).verifyShowsTheStoreOf(produceDiscount);
});

Then('she sees the discount it offers', async function (this: PlaywrightWorld) {
  await new DiscountsPage(this.page).verifyShowsTheDiscount(produceDiscount);
});
