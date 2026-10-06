import { describe, expect, it } from 'vitest';

import type { DiscountResponse } from '@app/types/discounts';
import CountDiscountedSalesForm from '@frontend/discounts/components/CountDiscountedSalesForm.vue';
import CountView from '@frontend/discounts/views/CountView.vue';
import { publishedProduceDiscount, publishedSpicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { aViewOpenedWhenPublished } from '../a-view-opened-when-published';

const openTheCountWhenPublished = (published: DiscountResponse[]) => aViewOpenedWhenPublished(CountView, published);

describe('View CountView', () => {
  describe('opening the count', () => {
    it('should load the published discounts when the count opens, to offer their stores', async () => {
      const view = await openTheCountWhenPublished([publishedSpicesDiscount]);

      expect(view.getComponent(CountDiscountedSalesForm).props('stores'), 'the stores the form offers').to.deep.equal([{ storeName: "Mike's Groceries", storeAddress: '12 Market Street' }]);
    });
    it('should offer the stores of other discounts published when the count opens', async () => {
      const view = await openTheCountWhenPublished([publishedProduceDiscount, { id: 'stephanies-id', ...stephaniesProduceDiscount }]);

      expect(view.getComponent(CountDiscountedSalesForm).props('stores'), 'the stores the form offers').to.deep.equal([
        { storeName: 'Corner Grocery', storeAddress: '3 Hill Road' },
        { storeName: "Stephanie's Market", storeAddress: '8 Orchard Lane' },
      ]);
    });
    it('should offer the form to count the discounted sales', async () => {
      const view = await openTheCountWhenPublished([]);

      expect(view.findComponent(CountDiscountedSalesForm).exists(), 'the form to count the discounted sales').to.equal(true);
    });
  });
});
