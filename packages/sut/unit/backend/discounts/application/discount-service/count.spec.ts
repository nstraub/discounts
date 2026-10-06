import { describe, expect, it } from 'vitest';

import { DiscountedSalesCounted } from '@backend/discounts/application/domain/discounted-sales-counted';
import { publishedSpicesDiscount } from '@sut/support/example-discounts';

import { aServiceOverAKeptDiscount } from './a-service-over-a-kept-discount';

const theSpicesStore = { storeName: publishedSpicesDiscount.storeName, storeAddress: publishedSpicesDiscount.storeAddress };

const setupSut = ({ coupons = [{ token: '7K3QX9M2PD', redeemed: true, counted: false }] } = {}) => aServiceOverAKeptDiscount({ coupons });

describe('class DiscountService', () => {
  describe('counting a store\'s discounted sales', () => {
    it('should keep the store\'s discount with its sales counted', async () => {
      const { repository, service } = setupSut();

      await service.count(theSpicesStore);

      expect(repository.save.mock.lastCall?.at(0)?.toJSON().coupons).to.deep.equal([{ token: '7K3QX9M2PD', redeemed: true, counted: true }]);
    });
    it('should announce DiscountedSalesCounted for the discount counted', async () => {
      const { events, service } = setupSut();

      await service.count(theSpicesStore);

      expect(events.publish).to.have.been.calledWith(new DiscountedSalesCounted(publishedSpicesDiscount.id, 1));
    });
    it('should answer with the discount\'s id, item and rate and the number of sales counted', async () => {
      const { service } = setupSut();

      const counted = await service.count(theSpicesStore);

      expect(counted.map((discount) => discount.toJSON())).to.deep.equal([
        { id: publishedSpicesDiscount.id, item: publishedSpicesDiscount.item, rate: publishedSpicesDiscount.rate, discountedSales: 1 },
      ]);
    });

    describe('not found', () => {
      it.todo('should report that no such store exists when no published discount names it, counting nothing');
    });

    describe('dependency failure', () => {
      it.todo('should report that the sales could not be counted when the store\'s discounts cannot be loaded, restarting nothing');
      it.todo('should keep counted the discounts kept before one that cannot be kept, and leave that one\'s sales for the next count');
    });
  });
});
