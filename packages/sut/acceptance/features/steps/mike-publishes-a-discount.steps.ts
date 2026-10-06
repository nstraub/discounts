import { Then, When } from '@cucumber/cucumber';

import { spicesDiscount } from '@sut/support/example-discounts';

import { DiscountsPage, openSomeoneElsesDiscountsPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

const publishAsMike = async (world: PlaywrightWorld, discount: typeof spicesDiscount): Promise<void> => {
  const mikesPage = new DiscountsPage(world.page);
  await mikesPage.open();
  await mikesPage.publish(discount);
  world.publishedDiscount = discount;
};

When('Mike publishes a discount on an item', async function (this: PlaywrightWorld) {
  await publishAsMike(this, spicesDiscount);
});

When('Mike publishes a discount of {word} on an item', async function (this: PlaywrightWorld, rateWithItsSign: string) {
  await publishAsMike(this, { ...spicesDiscount, rate: rateWithItsSign.replace(/%$/, '') });
});

Then('people can see it immediately', async function (this: PlaywrightWorld) {
  const peoplesPage = await openSomeoneElsesDiscountsPage(this);
  await peoplesPage.verifyShows(this.publishedDiscount);
});
