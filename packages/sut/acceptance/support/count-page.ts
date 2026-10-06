import assert from 'node:assert/strict';

import type { Page } from 'playwright';

import { discountTexts } from '@frontend/discounts/texts';
import type { stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { pickTheStoreOf } from './a-store-picker';
import type { PlaywrightWorld } from './playwright-world';

type ExampleDiscount = typeof stephaniesProduceDiscount;

export class CountPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/#/count');
  }

  async countTheStoreOf(discount: ExampleDiscount): Promise<void> {
    await pickTheStoreOf(this.page, discountTexts.store, discount, 'the count');
    const answered = this.page.waitForResponse((response) => response.url().endsWith('/stores/counts'));
    await this.page.getByRole('button', { name: discountTexts.countDiscountedSales }).click();
    await answered;
    await this.page.getByTestId('counted-discount').first().waitFor();
  }

  async verifyShowsTheSalesCountedFor(discount: ExampleDiscount, sales: number): Promise<void> {
    const item = this.page.getByTestId('counted-item').filter({ hasText: discount.item });
    const counted = this.page.getByTestId('counted-discount').filter({ has: item });
    await counted.first().waitFor().catch(() => assert.fail(`the count shows no discounted sales for the discount on ${discount.item}`));
    assert.equal(await counted.getByTestId('counted-sales').textContent(), String(sales), `the count of the discount on ${discount.item}`);
  }
}

export const ownCountPage = (world: PlaywrightWorld): CountPage => new CountPage(world.page);
