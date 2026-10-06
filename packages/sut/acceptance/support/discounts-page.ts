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

  private async publishedEntryOn(discount: ExampleDiscount): Promise<Locator> {
    const shown = this.page.getByTestId('published-discount').filter({ hasText: discount.item });
    await shown.waitFor().catch(() => assert.fail(`the page shows no published discount on ${discount.item}`));
    return shown;
  }
}
