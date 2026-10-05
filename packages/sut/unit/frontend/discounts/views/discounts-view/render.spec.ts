import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { RestApi } from '@app/types/rest-api';
import DiscountsView from '@frontend/discounts/views/DiscountsView.vue';
import { restApiKey } from '@frontend/rest-api-key';

describe('View DiscountsView', () => {
  describe('opening the page', () => {
    it('should show the published discounts when the page opens', async () => {
      const restApi = mock<RestApi>();
      restApi.get.mockResolvedValue([
        { id: 'spices-id', item: 'Peruvian spices', rate: 20, storeName: "Mike's Groceries", storeAddress: '12 Market Street' },
      ]);
      const view = mount(DiscountsView, {
        global: { plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })], provide: { [restApiKey]: restApi } },
      });

      await flushPromises();

      expect(view.findAll('[data-testid="published-item"]').map((item) => item.text())).to.deep.equal(['Peruvian spices']);
    });
    it.todo('should offer the form to publish a discount beside them');
  });
});
