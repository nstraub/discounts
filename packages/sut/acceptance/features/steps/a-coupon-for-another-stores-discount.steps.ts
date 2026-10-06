import { Given, Then, When } from '@cucumber/cucumber';

import { spicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { openSomeoneElsesDiscountsPage, ownDiscountsPage, publishFromSomeoneElsesPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';
import { openTheTillOnADeviceOfItsOwn } from '../../support/till-page';

Given("Sue has a coupon for Mike's discount", async function (this: PlaywrightWorld) {
  await publishFromSomeoneElsesPage(this, spicesDiscount);
  await ownDiscountsPage(this).open();
  await ownDiscountsPage(this).decideToTry(this.publishedDiscount);
  this.couponCode = await ownDiscountsPage(this).couponCodeShown();
});

When("Sue tries to use it at Stephanie's store", async function (this: PlaywrightWorld) {
  const stephaniesPage = await openSomeoneElsesDiscountsPage(this);
  await stephaniesPage.publish(stephaniesProduceDiscount);
  this.till = await openTheTillOnADeviceOfItsOwn(this);
  await this.till.redeemAt(stephaniesProduceDiscount, this.couponCode);
});

Then('Stephanie is told it is not for her store', async function (this: PlaywrightWorld) {
  await this.till.verifyTellsTheCouponIsNotForItsStore();
});
