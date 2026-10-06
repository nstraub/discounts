import { describe, expect, it } from 'vitest';

import type { DiscountResponse } from '@app/types/discounts';
import RedeemCouponForm from '@frontend/discounts/components/RedeemCouponForm.vue';
import TillView from '@frontend/discounts/views/TillView.vue';
import { publishedProduceDiscount, publishedSpicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { aViewOpenedWhenPublished } from '../a-view-opened-when-published';

const openTheTillWhenPublished = (published: DiscountResponse[]) => aViewOpenedWhenPublished(TillView, published);

describe('View TillView', () => {
  describe('opening the till', () => {
    it('should load the published discounts when the till opens, to offer their stores', async () => {
      const view = await openTheTillWhenPublished([publishedProduceDiscount]);

      expect(view.getComponent(RedeemCouponForm).props('stores'), 'the stores the form offers').to.deep.equal([{ storeName: 'Corner Grocery', storeAddress: '3 Hill Road' }]);
    });
    it('should offer the stores of other discounts published when the till opens', async () => {
      const view = await openTheTillWhenPublished([publishedSpicesDiscount, { id: 'stephanies-id', ...stephaniesProduceDiscount }]);

      expect(view.getComponent(RedeemCouponForm).props('stores'), 'the stores the form offers').to.deep.equal([
        { storeName: "Mike's Groceries", storeAddress: '12 Market Street' },
        { storeName: "Stephanie's Market", storeAddress: '8 Orchard Lane' },
      ]);
    });
    it('should offer the form to redeem a coupon', async () => {
      const view = await openTheTillWhenPublished([]);

      expect(view.findComponent(RedeemCouponForm).exists(), 'the form to redeem a coupon').to.equal(true);
    });
  });
});
