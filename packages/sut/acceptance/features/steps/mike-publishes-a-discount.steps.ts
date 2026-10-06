import { Then, When } from '@cucumber/cucumber';

import { chiliPasteDiscount, spicesDiscount } from '@sut/support/example-discounts';

import { openSomeoneElsesDiscountsPage, publishFromOwnPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

When('Mike publishes a discount on an item', async function (this: PlaywrightWorld) {
  await publishFromOwnPage(this, spicesDiscount);
});

When('Mike publishes a discount of {word} on an item', async function (this: PlaywrightWorld, rateWithItsSign: string) {
  await publishFromOwnPage(this, { ...spicesDiscount, rate: rateWithItsSign.replace(/%$/, '') });
});

When('Mike publishes a discount on another item', async function (this: PlaywrightWorld) {
  await publishFromOwnPage(this, chiliPasteDiscount);
});

Then('people can see it immediately', async function (this: PlaywrightWorld) {
  const peoplesPage = await openSomeoneElsesDiscountsPage(this);
  await peoplesPage.verifyShows(this.publishedDiscount);
});

Then('people can see both', async function (this: PlaywrightWorld) {
  const peoplesPage = await openSomeoneElsesDiscountsPage(this);
  await peoplesPage.verifyShows(spicesDiscount);
  await peoplesPage.verifyShows(chiliPasteDiscount);
});
