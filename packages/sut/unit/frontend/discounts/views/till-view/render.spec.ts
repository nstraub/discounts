import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { DiscountResponse } from '@app/types/discounts';
import type { RestApi } from '@app/types/rest-api';
import RedeemCouponForm from '@frontend/discounts/components/RedeemCouponForm.vue';
import TillView from '@frontend/discounts/views/TillView.vue';
import { restApiKey } from '@frontend/rest-api-key';

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
    it.todo('should load the published discounts when the till opens, to offer their stores');
    it('should offer the form to redeem a coupon', async () => {
      const view = await openTheTillWhenPublished([]);

      expect(view.findComponent(RedeemCouponForm).exists(), 'the form to redeem a coupon').to.equal(true);
    });
  });
});
