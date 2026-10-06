import { describe, expect, it } from 'vitest';

import { publishedProduceDiscount } from '@sut/support/example-discounts';

import { setupSut } from './discounts-store-of-an-app';

const publishedHerbsDiscountOfTheSameStore = { ...publishedProduceDiscount, id: 'herbs-id', item: 'Andean herbs', rate: '15' };

describe('Store discounts', () => {
  describe('the stores that publish discounts', () => {
    describe('combination', () => {
      it('should list a store once when it has published more than one discount', async () => {
        const { restApi, discounts } = setupSut();
        restApi.get.mockResolvedValue([publishedProduceDiscount, publishedHerbsDiscountOfTheSameStore]);

        await discounts.load();

        expect(discounts.stores).to.deep.equal([{ storeName: 'Corner Grocery', storeAddress: '3 Hill Road' }]);
      });
      it.todo('should list a store with the same name at another address as another store');
    });

    describe('empty', () => {
      it.todo('should list no store when no discount is published');
    });
  });
});
