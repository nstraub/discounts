import { Given, Then, When } from '@cucumber/cucumber';

import { spicesDiscount } from '@sut/support/example-discounts';

import { DiscountsPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

const raisedRate = '30';

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

Then('people can see the new rate immediately', async function (this: PlaywrightWorld) {
  const peoplesPage = new DiscountsPage(await this.openSomeoneElsesPage());
  await peoplesPage.open();
  await peoplesPage.verifyShowsOnceAtTheRate(spicesDiscount, this.newRate);
});
