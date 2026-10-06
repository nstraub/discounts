import { describe, expect, it } from 'vitest';

import type { DiscountResponse } from '@app/types/discounts';
import CountDiscountedSalesForm from '@frontend/discounts/components/CountDiscountedSalesForm.vue';
import CountView from '@frontend/discounts/views/CountView.vue';

import { aViewOpenedWhenPublished } from '../a-view-opened-when-published';

const openTheCountWhenPublished = (published: DiscountResponse[]) => aViewOpenedWhenPublished(CountView, published);

describe('View CountView', () => {
  describe('opening the count', () => {
    it.todo('should load the published discounts when the count opens, to offer their stores');
    it('should offer the form to count the discounted sales', async () => {
      const view = await openTheCountWhenPublished([]);

      expect(view.findComponent(CountDiscountedSalesForm).exists(), 'the form to count the discounted sales').to.equal(true);
    });
  });
});
