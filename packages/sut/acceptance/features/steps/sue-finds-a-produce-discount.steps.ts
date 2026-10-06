import { Given, Then, When } from '@cucumber/cucumber';

import { produceDiscount } from '@sut/support/example-discounts';

import { openSomeoneElsesDiscountsPage, suesPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

Given('Mike has published a discount on produce', async function (this: PlaywrightWorld) {
  const mikesPage = await openSomeoneElsesDiscountsPage(this);
  await mikesPage.publish(produceDiscount);
  this.publishedDiscount = produceDiscount;
});

const publishWithNoLocationAsSueJudgesTheDistanceFromTheAddress = async (world: PlaywrightWorld): Promise<void> => {
  const mikesPage = await openSomeoneElsesDiscountsPage(world);
  await mikesPage.publish(produceDiscount);
  world.publishedDiscount = produceDiscount;
};

Given("Mike's store is within walking distance of Sue's home", async function (this: PlaywrightWorld) {
  await publishWithNoLocationAsSueJudgesTheDistanceFromTheAddress(this);
});

When('Sue looks for a new store with fresh produce', async function (this: PlaywrightWorld) {
  await suesPage(this).open();
});

Then("she finds Mike's store", async function (this: PlaywrightWorld) {
  await suesPage(this).verifyShowsTheStoreOf(this.publishedDiscount);
});

Then('she sees where it is', async function (this: PlaywrightWorld) {
  await suesPage(this).verifyShowsWhereTheStoreIs(this.publishedDiscount);
});

Then('she sees the discount it offers', async function (this: PlaywrightWorld) {
  await suesPage(this).verifyShowsTheDiscount(this.publishedDiscount);
});
