import { describe, expect, it } from 'vitest';

import type { DiscountResponse } from '@app/types/discounts';
import { publishedProduceDiscount } from '@sut/support/example-discounts';

import { setupSut } from './discounts-store-of-an-app';

const theStoresOnceLoaded = async (published: DiscountResponse[]) => {
  const { restApi, discounts } = setupSut();
  restApi.get.mockResolvedValue(published);
  await discounts.load();
  return discounts.stores;
};

const publishedHerbsDiscountOfTheSameStore = { ...publishedProduceDiscount, id: 'herbs-id', item: 'Andean herbs', rate: '15' };

describe('Store discounts', () => {
  describe('the stores that publish discounts', () => {
    describe('combination', () => {
      it('should list a store once when it has published more than one discount', async () => {
        const stores = await theStoresOnceLoaded([publishedProduceDiscount, publishedHerbsDiscountOfTheSameStore]);

        expect(stores).to.deep.equal([{ storeName: 'Corner Grocery', storeAddress: '3 Hill Road' }]);
      });
      it('should list a store with the same name at another address as another store', async () => {
        const atAnotherAddress = { ...publishedHerbsDiscountOfTheSameStore, storeAddress: '9 River Street' };

        const stores = await theStoresOnceLoaded([publishedProduceDiscount, atAnotherAddress]);

        expect(stores).to.deep.equal([
          { storeName: 'Corner Grocery', storeAddress: '3 Hill Road' },
          { storeName: 'Corner Grocery', storeAddress: '9 River Street' },
        ]);
      });
    });

    describe('empty', () => {
      it('should list no store when no discount is published', async () => {
        expect(await theStoresOnceLoaded([])).to.deep.equal([]);
      });
    });
  });
  describe('the stores as the till names them', () => {
    it.todo('should list each store with its name and address exactly as published, spaces around them included');
  });
});
