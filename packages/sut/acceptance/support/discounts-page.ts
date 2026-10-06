import assert from 'node:assert/strict';

import type { Locator, Page } from 'playwright';

type ExampleDiscount = { item: string; rate: string; storeName: string; storeAddress: string };

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

  async verifyShows(discount: ExampleDiscount): Promise<void> {
    const shown = await this.publishedEntryOn(discount);
    assert.equal(await shown.getByTestId('published-item').textContent(), discount.item);
    assert.equal(await shown.getByTestId('published-rate').textContent(), `${discount.rate}%`);
    assert.equal(await shown.getByTestId('published-store-name').textContent(), discount.storeName);
    assert.equal(await shown.getByTestId('published-store-address').textContent(), discount.storeAddress);
  }

  async verifyShowsTheStoreOf(discount: ExampleDiscount): Promise<void> {
    const shown = await this.publishedEntryOn(discount);
    assert.equal(await shown.getByTestId('published-store-name').textContent(), discount.storeName);
  }

  async verifyShowsTheDiscount(discount: ExampleDiscount): Promise<void> {
    const shown = await this.publishedEntryOn(discount);
    assert.equal(await shown.getByTestId('published-item').textContent(), discount.item);
    assert.equal(await shown.getByTestId('published-rate').textContent(), `${discount.rate}%`);
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
