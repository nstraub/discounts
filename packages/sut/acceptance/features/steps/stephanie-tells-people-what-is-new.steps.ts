import { Given, Then } from '@cucumber/cucumber';

import { DiscountsPage, openSomeoneElsesDiscountsPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

const stephaniesProduceDiscount = { item: 'Organic produce', rate: '15', storeName: "Stephanie's Market", storeAddress: '8 Orchard Lane' };

const newSupplier = 'Our produce now comes from a new supplier';

Given('Stephanie has published a discount on produce', async function (this: PlaywrightWorld) {
  const stephaniesPage = await openSomeoneElsesDiscountsPage(this);
  await stephaniesPage.publishWithItsHook(stephaniesProduceDiscount, newSupplier);
  this.publishedDiscount = stephaniesProduceDiscount;
});

Given('her discount says the produce comes from a new supplier', function (this: PlaywrightWorld) {
  this.whatIsNew = newSupplier;
});

Then("she finds Stephanie's store", async function (this: PlaywrightWorld) {
  await new DiscountsPage(this.page).verifyShowsTheStoreOf(this.publishedDiscount);
});

Then('she sees what is new about its produce', async function (this: PlaywrightWorld) {
  await new DiscountsPage(this.page).verifyShowsWhatIsNew(this.publishedDiscount, this.whatIsNew);
});
