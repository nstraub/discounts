import { Given, Then, When } from '@cucumber/cucumber';

import { produceDiscount } from '@sut/support/example-discounts';

import { DiscountsPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

const suesPage = (world: PlaywrightWorld): DiscountsPage => new DiscountsPage(world.page);

Given('Mike has published a discount on produce', async function (this: PlaywrightWorld) {
  const mikesPage = new DiscountsPage(await this.openSomeoneElsesPage());
  await mikesPage.open();
  await mikesPage.publish(produceDiscount);
});

When('Sue looks for a new store with fresh produce', async function (this: PlaywrightWorld) {
  await suesPage(this).open();
});

Then("she finds Mike's store", async function (this: PlaywrightWorld) {
  await suesPage(this).verifyShowsTheStoreOf(produceDiscount);
});

Then('she sees the discount it offers', async function (this: PlaywrightWorld) {
  await suesPage(this).verifyShowsTheDiscount(produceDiscount);
});
