import { Given, Then, When } from '@cucumber/cucumber';

import { spicesDiscount } from '@sut/support/example-discounts';

import { DiscountsPage, openSomeoneElsesDiscountsPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

const raisedRate = '30';

const loweredRateSortingAfterThePublishedOneAsText = '5';

const mikesPage = (world: PlaywrightWorld): DiscountsPage => new DiscountsPage(world.page);

Given('Mike has published a discount on an item', async function (this: PlaywrightWorld) {
  await mikesPage(this).open();
  await mikesPage(this).publish(spicesDiscount);
});

When('he raises its rate', async function (this: PlaywrightWorld) {
  await mikesPage(this).open();
  await mikesPage(this).changeTheRateOf(spicesDiscount, raisedRate);
  this.newRate = raisedRate;
});

When('he lowers its rate', async function (this: PlaywrightWorld) {
  await mikesPage(this).open();
  await mikesPage(this).changeTheRateOf(spicesDiscount, loweredRateSortingAfterThePublishedOneAsText);
  this.newRate = loweredRateSortingAfterThePublishedOneAsText;
});

Then('people can see the new rate immediately', async function (this: PlaywrightWorld) {
  const peoplesPage = await openSomeoneElsesDiscountsPage(this);
  await peoplesPage.verifyShowsOnceAtTheRate(spicesDiscount, this.newRate);
});
