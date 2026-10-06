import { describe, expect, it } from 'vitest';

import { spicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { setupSut } from './discounts-store-of-an-app';

describe('Store discounts', () => {
  describe('counting the discounted sales', () => {
    it('should hand the store picked over to be counted', async () => {
      const { restApi, discounts } = setupSut();
      const theSpicesStore = { storeName: spicesDiscount.storeName, storeAddress: spicesDiscount.storeAddress };

      await discounts.countDiscountedSales(theSpicesStore);

      expect(restApi.post).to.have.been.calledWith('/stores/counts', theSpicesStore);
    });
    it('should hand another store over when given another', async () => {
      const { restApi, discounts } = setupSut();
      const stephaniesMarket = { storeName: stephaniesProduceDiscount.storeName, storeAddress: stephaniesProduceDiscount.storeAddress };

      await discounts.countDiscountedSales(stephaniesMarket);

      expect(restApi.post).to.have.been.calledWith('/stores/counts', stephaniesMarket);
    });
    it.todo('should hold what the count answers once it is made');

    describe('dependency failure', () => {
      it.todo('should hold that the sales could not be counted when they cannot be');
    });
  });
});
