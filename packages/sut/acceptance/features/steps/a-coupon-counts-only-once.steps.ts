import { Given, Then, When } from '@cucumber/cucumber';

import { stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { openSomeoneElsesDiscountsPage, publishFromSomeoneElsesPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';
import { openTheTillOnADeviceOfItsOwn } from '../../support/till-page';

Given("Sue has used her coupon at Stephanie's store", async function (this: PlaywrightWorld) {
  await publishFromSomeoneElsesPage(this, stephaniesProduceDiscount);
  const suesPage = await openSomeoneElsesDiscountsPage(this);
  this.couponCode = await suesPage.getACouponFor(this.publishedDiscount);
  this.till = await openTheTillOnADeviceOfItsOwn(this);
  await this.till.redeemAt(this.publishedDiscount, this.couponCode);
  await this.till.verifyTellsTheDiscountAppliesTo(this.publishedDiscount);
});

When('Sue tries to use it again', async function (this: PlaywrightWorld) {
  await this.till.redeemAt(this.publishedDiscount, this.couponCode);
});

Then('Stephanie is told it has already been used', async function (this: PlaywrightWorld) {
  await this.till.verifyTellsTheCouponHasAlreadyBeenUsed();
});
