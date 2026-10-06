import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { DiscountResponse } from '@app/types/discounts';
import type { RestApi } from '@app/types/rest-api';
import RedeemCouponForm from '@frontend/discounts/components/RedeemCouponForm.vue';
import TillView from '@frontend/discounts/views/TillView.vue';
import { restApiKey } from '@frontend/rest-api-key';
import { publishedProduceDiscount, publishedSpicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

const openTheTillWhenPublished = async (published: DiscountResponse[]) => {
  const restApi = mock<RestApi>();
  restApi.get.mockResolvedValue(published);
  const view = mount(TillView, {
    global: { plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })], provide: { [restApiKey]: restApi } },
  });
  await flushPromises();
  return view;
};

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
