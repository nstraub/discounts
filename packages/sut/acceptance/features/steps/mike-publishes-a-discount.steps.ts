import { Then, When } from '@cucumber/cucumber';

import { DiscountsPage, openSomeoneElsesDiscountsPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

const spicesDiscount = {
  item: 'Peruvian spices',
  rate: '20',
  storeName: "Mike's Groceries",
  storeAddress: '12 Market Street',
};

When('Mike publishes a discount on an item', async function (this: PlaywrightWorld) {
  const mikesPage = new DiscountsPage(this.page);
  await mikesPage.open();
  await mikesPage.publish(spicesDiscount);
});

Then('people can see it immediately', async function (this: PlaywrightWorld) {
  const peoplesPage = await openSomeoneElsesDiscountsPage(this);
  await peoplesPage.verifyShows(spicesDiscount);
});
