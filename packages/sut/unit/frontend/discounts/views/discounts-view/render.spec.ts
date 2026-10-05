import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { DiscountResponse } from '@app/types/discounts';
import type { RestApi } from '@app/types/rest-api';
import PublishDiscountForm from '@frontend/discounts/components/PublishDiscountForm.vue';
import DiscountsView from '@frontend/discounts/views/DiscountsView.vue';
import { restApiKey } from '@frontend/rest-api-key';

const openThePageWhenPublished = async (published: DiscountResponse[]) => {
  const restApi = mock<RestApi>();
  restApi.get.mockResolvedValue(published);
  const view = mount(DiscountsView, {
    global: { plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })], provide: { [restApiKey]: restApi } },
  });
  await flushPromises();
  return view;
};

describe('View DiscountsView', () => {
  describe('opening the page', () => {
    it('should show the published discounts when the page opens', async () => {
      const view = await openThePageWhenPublished([
        { id: 'spices-id', item: 'Peruvian spices', rate: 20, storeName: "Mike's Groceries", storeAddress: '12 Market Street' },
      ]);

      expect(view.findAll('[data-testid="published-item"]').map((item) => item.text())).to.deep.equal(['Peruvian spices']);
    });
    it('should show other published discounts when others are published', async () => {
      const view = await openThePageWhenPublished([
        { id: 'produce-id', item: 'Fresh produce', rate: 10, storeName: 'Corner Grocery', storeAddress: '3 Hill Road' },
        { id: 'herbs-id', item: 'Andean herbs', rate: 15, storeName: 'Corner Grocery', storeAddress: '3 Hill Road' },
      ]);

      expect(view.findAll('[data-testid="published-item"]').map((item) => item.text())).to.deep.equal(['Fresh produce', 'Andean herbs']);
    });
    it('should offer the form to publish a discount beside them', async () => {
      const view = await openThePageWhenPublished([]);

      expect(view.findComponent(PublishDiscountForm).exists()).to.equal(true);
    });
  });
});
