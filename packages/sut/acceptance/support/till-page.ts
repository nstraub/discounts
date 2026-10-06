import assert from 'node:assert/strict';

import type { Page } from 'playwright';

import { discountTexts } from '@frontend/discounts/texts';

import { pickTheStoreOf } from './a-store-picker';
import type { PlaywrightWorld } from './playwright-world';

type ExampleDiscount = { item: string; storeName: string; storeAddress: string };

const aCodeNobodyIssued = 'ZZZZZZZZZZ';

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

  async redeemACodeNobodyIssuedAt(discount: ExampleDiscount): Promise<void> {
    await this.redeemAt(discount, aCodeNobodyIssued);
  }

  async verifyTellsTheDiscountAppliesTo(discount: ExampleDiscount): Promise<void> {
    const told = this.page.getByRole('status').filter({ hasText: `${discountTexts.theDiscountAppliesTo} ${discount.item}` });
    await told.waitFor().catch(() => assert.fail(`the till does not say the discount on ${discount.item} applies`));
  }

  async verifyTellsTheCouponHasAlreadyBeenUsed(): Promise<void> {
    const told = this.page.getByRole('status').filter({ hasText: discountTexts.couponAlreadyUsed });
    await told.waitFor().catch(() => assert.fail('the till does not say the coupon has already been used'));
  }

  async verifyTellsTheCouponIsNotForItsStore(): Promise<void> {
    const told = this.page.getByRole('status').filter({ hasText: discountTexts.couponNotForYourStore });
    await told.waitFor().catch(() => assert.fail('the till does not say the coupon is not for its store'));
  }

  async verifyTellsTheCouponIsNotValid(): Promise<void> {
    const told = this.page.getByRole('status').filter({ hasText: discountTexts.couponNotValid });
    await told.waitFor().catch(() => assert.fail('the till does not say the coupon is not valid'));
  }
}

export const openTheTillOnADeviceOfItsOwn = async (world: PlaywrightWorld): Promise<TillPage> => {
  const till = new TillPage(await world.openSomeoneElsesPage());
  await till.open();
  return till;
};
