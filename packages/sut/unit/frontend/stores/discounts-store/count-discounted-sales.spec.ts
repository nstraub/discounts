import { describe, expect, it } from 'vitest';

import { spicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { setupSut } from './discounts-store-of-an-app';

const theStoreOf = ({ storeName, storeAddress }: typeof spicesDiscount) => ({ storeName, storeAddress });

describe('Store discounts', () => {
  describe('counting the discounted sales', () => {
    it('should hand the store picked over to be counted', async () => {
      const { restApi, discounts } = setupSut();
      const theSpicesStore = theStoreOf(spicesDiscount);

      await discounts.countDiscountedSales(theSpicesStore);

      expect(restApi.post).to.have.been.calledWith('/stores/counts', theSpicesStore);
    });
    it('should hand another store over when given another', async () => {
      const { restApi, discounts } = setupSut();
      const stephaniesMarket = theStoreOf(stephaniesProduceDiscount);

      await discounts.countDiscountedSales(stephaniesMarket);

      expect(restApi.post).to.have.been.calledWith('/stores/counts', stephaniesMarket);
    });
    it('should hold what the count answers once it is made', async () => {
      const { restApi, discounts } = setupSut();
      restApi.post.mockResolvedValue([{ id: 'spices-id', item: spicesDiscount.item, rate: spicesDiscount.rate, discountedSales: 3 }]);

      await discounts.countDiscountedSales(theStoreOf(spicesDiscount));

      expect(discounts.counted).to.deep.equal([{ id: 'spices-id', item: 'Peruvian spices', rate: '20', discountedSales: 3 }]);
    });
    it('should hold another count when the count answers another', async () => {
      const { restApi, discounts } = setupSut();
      restApi.post.mockResolvedValue([{ id: 'produce-id', item: stephaniesProduceDiscount.item, rate: stephaniesProduceDiscount.rate, discountedSales: 1 }]);

      await discounts.countDiscountedSales(theStoreOf(stephaniesProduceDiscount));

      expect(discounts.counted).to.deep.equal([{ id: 'produce-id', item: 'Organic produce', rate: '15', discountedSales: 1 }]);
    });

    describe('dependency failure', () => {
      it.todo('should hold that the sales could not be counted when they cannot be');
    });
  });
});
