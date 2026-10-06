import { Given, Then, When } from '@cucumber/cucumber';

import { stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { ownDiscountsPage, publishFromSomeoneElsesPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';
import { openTheTillOnADeviceOfItsOwn } from '../../support/till-page';

Given("Sue has a coupon for Stephanie's discount", async function (this: PlaywrightWorld) {
  await publishFromSomeoneElsesPage(this, stephaniesProduceDiscount);
  await ownDiscountsPage(this).open();
  await ownDiscountsPage(this).decideToTry(this.publishedDiscount);
  this.couponCode = await ownDiscountsPage(this).couponCodeShown();
});

When("Sue uses it at Stephanie's store", async function (this: PlaywrightWorld) {
  this.till = await openTheTillOnADeviceOfItsOwn(this);
  await this.till.redeemAt(this.publishedDiscount, this.couponCode);
});

Then('Stephanie is told the discount applies', async function (this: PlaywrightWorld) {
  await this.till.verifyTellsTheDiscountAppliesTo(this.publishedDiscount);
});
