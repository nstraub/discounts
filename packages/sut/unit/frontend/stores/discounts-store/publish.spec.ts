import { createPinia } from 'pinia';
import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { createApp } from 'vue';

import type { RestApi } from '@app/types/rest-api';
import { restApiKey } from '@frontend/rest-api-key';
import { useDiscountsStore } from '@frontend/stores/discounts-store';

const setupSut = () => {
  const restApi = mock<RestApi>();
  const pinia = createPinia();
  createApp({}).provide(restApiKey, restApi).use(pinia);
  return { restApi, discounts: useDiscountsStore(pinia) };
};

describe('Store discounts', () => {
  describe('publishing a discount', () => {
    it('should hand the item, rate, store name and store address over to be published', async () => {
      const { restApi, discounts } = setupSut();
      const spicesDiscount = { item: 'Peruvian spices', rate: 20, storeName: "Mike's Groceries", storeAddress: '12 Market Street' };

      await discounts.publish(spicesDiscount);

      expect(restApi.post).to.have.been.calledWith('/discounts', spicesDiscount);
    });
    it('should hand other pieces over when given others', async () => {
      const { restApi, discounts } = setupSut();
      const produceDiscount = { item: 'Fresh produce', rate: 10, storeName: 'Corner Grocery', storeAddress: '3 Hill Road' };

      await discounts.publish(produceDiscount);

      expect(restApi.post).to.have.been.calledWith('/discounts', produceDiscount);
    });
    it.todo('should hold the discount just published without loading the page again');
  });
});
