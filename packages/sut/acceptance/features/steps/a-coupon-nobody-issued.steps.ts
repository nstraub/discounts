import { Given, Then, When } from '@cucumber/cucumber';

import { stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { publishFromSomeoneElsesPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';
import { openTheTillOnADeviceOfItsOwn } from '../../support/till-page';

Given('Stephanie is taking a coupon at the till', async function (this: PlaywrightWorld) {
  await publishFromSomeoneElsesPage(this, stephaniesProduceDiscount);
  this.till = await openTheTillOnADeviceOfItsOwn(this);
});

When('the coupon was never issued', async function (this: PlaywrightWorld) {
  await this.till.redeemACodeNobodyIssuedAt(this.publishedDiscount);
});

Then('Stephanie is told it is not valid', async function (this: PlaywrightWorld) {
  await this.till.verifyTellsTheCouponIsNotValid();
});
