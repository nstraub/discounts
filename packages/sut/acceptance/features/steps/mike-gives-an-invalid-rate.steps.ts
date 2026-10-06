import { Given, Then, When } from '@cucumber/cucumber';

import { spicesDiscount } from '@sut/support/example-discounts';

import { openSomeoneElsesDiscountsPage, ownDiscountsPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

Given('Mike tries to publish a discount', async function (this: PlaywrightWorld) {
  await ownDiscountsPage(this).open();
  await ownDiscountsPage(this).startToPublish(spicesDiscount);
});

When('he gives a rate of {word}', async function (this: PlaywrightWorld, rateWithItsSign: string) {
  await ownDiscountsPage(this).publishAtTheRate(rateWithItsSign.replace(/%$/, ''));
});

Then('he is told the rate is not valid', async function (this: PlaywrightWorld) {
  await ownDiscountsPage(this).verifyTellsTheRateIsNotValid();
});

Then('the discount is not published', async function (this: PlaywrightWorld) {
  const peoplesPage = await openSomeoneElsesDiscountsPage(this);
  await peoplesPage.verifyDoesNotShow(spicesDiscount);
});
