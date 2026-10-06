import { Given, Then, When } from '@cucumber/cucumber';

import { produceDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { ownDiscountsPage, publishFromSomeoneElsesPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

Given('Mike has published a discount on produce', async function (this: PlaywrightWorld) {
  await publishFromSomeoneElsesPage(this, produceDiscount);
});

const publishWithNoLocationAsSueJudgesTheDistanceFromTheAddress = async (world: PlaywrightWorld): Promise<void> => {
  await publishFromSomeoneElsesPage(world, produceDiscount);
};

Given("Mike's store is within walking distance of Sue's home", async function (this: PlaywrightWorld) {
  await publishWithNoLocationAsSueJudgesTheDistanceFromTheAddress(this);
});

const mikesAndStephaniesDiscounts = [produceDiscount, stephaniesProduceDiscount];

Given('Mike and Stephanie have published discounts on produce', async function (this: PlaywrightWorld) {
  for (const discount of mikesAndStephaniesDiscounts) {
    await publishFromSomeoneElsesPage(this, discount);
  }
});

When('Sue looks for a new store with fresh produce', async function (this: PlaywrightWorld) {
  await ownDiscountsPage(this).open();
});

Then("she finds Mike's store", async function (this: PlaywrightWorld) {
  await ownDiscountsPage(this).verifyShowsTheStoreOf(this.publishedDiscount);
});

Then('she sees where it is', async function (this: PlaywrightWorld) {
  await ownDiscountsPage(this).verifyShowsWhereTheStoreIs(this.publishedDiscount);
});

Then('she sees the discount it offers', async function (this: PlaywrightWorld) {
  await ownDiscountsPage(this).verifyShowsTheDiscount(this.publishedDiscount);
});

Then("she finds Mike's store and Stephanie's store", async function (this: PlaywrightWorld) {
  for (const discount of mikesAndStephaniesDiscounts) {
    await ownDiscountsPage(this).verifyShowsTheStoreOf(discount);
  }
});

Then('she sees the discount each one offers', async function (this: PlaywrightWorld) {
  for (const discount of mikesAndStephaniesDiscounts) {
    await ownDiscountsPage(this).verifyShowsTheDiscountOnItsStoresEntry(discount);
  }
});
