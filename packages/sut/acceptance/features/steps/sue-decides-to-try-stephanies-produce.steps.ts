import { Given, Then, When } from '@cucumber/cucumber';

import { stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { openSomeoneElsesDiscountsPage, suesPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

Given("Sue has found Stephanie's discount on produce", async function (this: PlaywrightWorld) {
  const stephaniesPage = await openSomeoneElsesDiscountsPage(this);
  await stephaniesPage.publish(stephaniesProduceDiscount);
  this.publishedDiscount = stephaniesProduceDiscount;
  await suesPage(this).open();
});

When('Sue decides to try it', async function (this: PlaywrightWorld) {
  await suesPage(this).decideToTry(this.publishedDiscount);
});

Then("she gets a coupon to use at Stephanie's till", async function (this: PlaywrightWorld) {
  await suesPage(this).verifyShowsACouponToUseAt(this.publishedDiscount);
});
