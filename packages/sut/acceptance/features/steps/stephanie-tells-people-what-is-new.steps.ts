import { Given, Then } from '@cucumber/cucumber';

import { stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { openSomeoneElsesDiscountsPage, suesPage } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

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
  await suesPage(this).verifyShowsTheStoreOf(this.publishedDiscount);
});

Then('she sees what is new about its produce', async function (this: PlaywrightWorld) {
  await suesPage(this).verifyShowsWhatIsNew(this.publishedDiscount, this.whatIsNew);
});
