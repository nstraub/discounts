import assert from 'node:assert/strict';

import type { Page } from 'playwright';

import { discountTexts } from '@frontend/discounts/texts';

import { pickTheStoreOf } from './a-store-picker';
import type { PlaywrightWorld } from './playwright-world';

type ExampleDiscount = { item: string; storeName: string; storeAddress: string };

export class TillPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/#/till');
  }

  async redeemAt(discount: ExampleDiscount, code: string): Promise<void> {
    await pickTheStoreOf(this.page, discountTexts.yourStore, discount, 'the till');
    await this.page.getByRole('textbox', { name: discountTexts.couponCode }).fill(code);
    await this.page.getByRole('button', { name: discountTexts.redeem }).click();
  }

  async verifyTellsTheDiscountAppliesTo(discount: ExampleDiscount): Promise<void> {
    const told = this.page.getByRole('status').filter({ hasText: `${discountTexts.theDiscountAppliesTo} ${discount.item}` });
    await told.waitFor().catch(() => assert.fail(`the till does not say the discount on ${discount.item} applies`));
  }
}

export const openTheTillOnADeviceOfItsOwn = async (world: PlaywrightWorld): Promise<TillPage> => {
  const till = new TillPage(await world.openSomeoneElsesPage());
  await till.open();
  return till;
};
