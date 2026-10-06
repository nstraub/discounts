import assert from 'node:assert/strict';

import type { Locator, Page } from 'playwright';

import { discountTexts } from '@frontend/discounts/texts';

import type { PlaywrightWorld } from './playwright-world';

type ExampleDiscount = { item: string; rate: string; storeName: string; storeAddress: string };

const twoGroupsOfFiveCrockfordCharacters = /^[0-9A-HJKMNP-TV-Z]{5} [0-9A-HJKMNP-TV-Z]{5}$/;

export class DiscountsPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async publish(discount: ExampleDiscount): Promise<void> {
    await this.page.getByTestId('discount-item').fill(discount.item);
    await this.page.getByTestId('discount-rate').fill(discount.rate);
    await this.page.getByTestId('discount-store-name').fill(discount.storeName);
    await this.page.getByTestId('discount-store-address').fill(discount.storeAddress);
    await this.page.getByTestId('publish-discount').click();
    await this.untilTheDiscountIsKeptAndTheFormCleared();
  }

  async publishWithItsHook(discount: ExampleDiscount, hook: string): Promise<void> {
    await this.page.getByTestId('discount-hook').fill(hook);
    await this.publish(discount);
  }

  private async untilTheDiscountIsKeptAndTheFormCleared(): Promise<void> {
    const item = await this.page.getByTestId('discount-item').elementHandle();
    await this.page.waitForFunction((input) => (input as HTMLInputElement | null)?.value === '', item);
  }

  async changeTheRateOf(discount: ExampleDiscount, newRate: string): Promise<void> {
    const entry = await this.publishedEntryOn(discount);
    await entry.getByTestId('new-rate').fill(newRate);
    await entry.getByTestId('change-rate').click();
    await this.untilTheEntryShowsTheRate(entry, newRate);
  }

  private async untilTheEntryShowsTheRate(entry: Locator, rate: string): Promise<void> {
    await entry.getByTestId('published-rate').filter({ hasText: `${rate}%` }).first().waitFor();
  }

  async decideToTry(discount: ExampleDiscount): Promise<void> {
    const entry = await this.publishedEntryOn(discount);
    await entry.getByRole('button', { name: discountTexts.getCoupon }).click();
  }

  async verifyShowsACouponToUseAt(discount: ExampleDiscount): Promise<void> {
    const coupon = this.page.getByTestId('issued-coupon');
    await coupon.waitFor().catch(() => assert.fail(`Sue's page shows no coupon to use at ${discount.storeName}`));
    assert.match(await coupon.getByTestId('coupon-code').innerText(), twoGroupsOfFiveCrockfordCharacters);
    const store = await coupon.getByTestId('coupon-store').innerText();
    assert.ok(store.endsWith(discount.storeName), `Sue's coupon is not to use at ${discount.storeName}: "${store}"`);
  }

  async couponCodeShown(): Promise<string> {
    return this.page.getByTestId('issued-coupon').getByTestId('coupon-code').innerText();
  }

  async verifyShows(discount: ExampleDiscount): Promise<void> {
    await this.verifyShowsTheDiscount(discount);
    await this.verifyShowsTheStoreOf(discount);
    await this.verifyShowsWhereTheStoreIs(discount);
  }

  async verifyShowsTheStoreOf(discount: ExampleDiscount): Promise<void> {
    const shown = await this.publishedEntryOn(discount);
    assert.equal(await shown.getByTestId('published-store-name').textContent(), discount.storeName);
  }

  async verifyShowsWhereTheStoreIs(discount: ExampleDiscount): Promise<void> {
    const shown = await this.publishedEntryOn(discount);
    assert.equal(await shown.getByTestId('published-store-address').textContent(), discount.storeAddress);
  }

  async verifyShowsTheDiscount(discount: ExampleDiscount): Promise<void> {
    const shown = await this.publishedEntryOn(discount);
    assert.equal(await shown.getByTestId('published-item').textContent(), discount.item);
    assert.equal(await shown.getByTestId('published-rate').textContent(), `${discount.rate}%`);
  }

  async verifyShowsTheDiscountOnItsStoresEntry(discount: ExampleDiscount): Promise<void> {
    await this.verifyShowsTheStoreOf(discount);
    await this.verifyShowsTheDiscount(discount);
  }

  async verifyShowsWhatIsNew(discount: ExampleDiscount, whatIsNew: string): Promise<void> {
    const shown = await this.publishedEntryOn(discount);
    const hooks = await shown.getByTestId('published-hook').allTextContents();
    assert.deepEqual(hooks, [whatIsNew], `the discount on ${discount.item} does not say what is new about it`);
  }

  async verifyShowsOnceAtTheRate(discount: ExampleDiscount, rate: string): Promise<void> {
    const shown = await this.publishedEntryOn(discount);
    assert.equal(await shown.count(), 1, `the page shows the discount on ${discount.item} more than once`);
    assert.equal(await shown.getByTestId('published-rate').textContent(), `${rate}%`, `the discount on ${discount.item} is not shown at its new rate`);
  }

  private async publishedEntryOn(discount: ExampleDiscount): Promise<Locator> {
    const text = this.page.getByTestId('published-discount-text').filter({ hasText: discount.item });
    const shown = this.page.getByTestId('published-discount').filter({ has: text });
    await shown.first().waitFor().catch(() => assert.fail(`the page shows no published discount on ${discount.item}`));
    return shown;
  }
}

export const openSomeoneElsesDiscountsPage = async (world: PlaywrightWorld): Promise<DiscountsPage> => {
  const discountsPage = new DiscountsPage(await world.openSomeoneElsesPage());
  await discountsPage.open();
  return discountsPage;
};

export const publishFromSomeoneElsesPage = async (world: PlaywrightWorld, discount: ExampleDiscount): Promise<void> => {
  const theirPage = await openSomeoneElsesDiscountsPage(world);
  await theirPage.publish(discount);
  world.publishedDiscount = discount;
};

export const ownDiscountsPage = (world: PlaywrightWorld): DiscountsPage => new DiscountsPage(world.page);

export const publishFromOwnPage = async (world: PlaywrightWorld, discount: ExampleDiscount): Promise<void> => {
  const ownPage = ownDiscountsPage(world);
  await ownPage.open();
  await ownPage.publish(discount);
  world.publishedDiscount = discount;
};
