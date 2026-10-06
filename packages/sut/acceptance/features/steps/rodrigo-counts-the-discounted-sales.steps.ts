import { Given, Then, When } from '@cucumber/cucumber';

import { stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { ownCountPage } from '../../support/count-page';
import { openSomeoneElsesDiscountsPage, publishFromSomeoneElsesPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';
import { openTheTillOnADeviceOfItsOwn } from '../../support/till-page';

const sueUsesACouponForThePublishedDiscount = async (world: PlaywrightWorld): Promise<void> => {
  const suesPage = await openSomeoneElsesDiscountsPage(world);
  const code = await suesPage.getACouponFor(world.publishedDiscount);
  const till = await openTheTillOnADeviceOfItsOwn(world);
  await till.redeemAt(world.publishedDiscount, code);
  await till.verifyTellsTheDiscountAppliesTo(world.publishedDiscount);
};

const rodrigoCounts = async (world: PlaywrightWorld): Promise<void> => {
  await ownCountPage(world).open();
  await ownCountPage(world).countTheStoreOf(world.publishedDiscount);
};

Given("Rodrigo has counted Stephanie's discounted sales before", async function (this: PlaywrightWorld) {
  await publishFromSomeoneElsesPage(this, stephaniesProduceDiscount);
  await sueUsesACouponForThePublishedDiscount(this);
  await rodrigoCounts(this);
});

Given("Sue has used {int} coupons for Stephanie's discount since then", async function (this: PlaywrightWorld, coupons: number) {
  for (let used = 0; used < coupons; used += 1) {
    await sueUsesACouponForThePublishedDiscount(this);
  }
});

When('Rodrigo counts the discounted sales', async function (this: PlaywrightWorld) {
  await rodrigoCounts(this);
});

Then('he sees {int} discounted sales for that discount', async function (this: PlaywrightWorld, sales: number) {
  await ownCountPage(this).verifyShowsTheSalesCountedFor(this.publishedDiscount, sales);
});
