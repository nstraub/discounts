import { Then, When } from '@cucumber/cucumber';

import { spicesDiscount } from '@sut/support/example-discounts';

import { openSomeoneElsesDiscountsPage, publishFromOwnPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

When('Mike publishes a discount on an item', async function (this: PlaywrightWorld) {
  await publishFromOwnPage(this, spicesDiscount);
});

When('Mike publishes a discount of {word} on an item', async function (this: PlaywrightWorld, rateWithItsSign: string) {
  await publishFromOwnPage(this, { ...spicesDiscount, rate: rateWithItsSign.replace(/%$/, '') });
});

Then('people can see it immediately', async function (this: PlaywrightWorld) {
  const peoplesPage = await openSomeoneElsesDiscountsPage(this);
  await peoplesPage.verifyShows(this.publishedDiscount);
});
