import { describe, expect, it } from 'vitest';

import { publishedProduceDiscount, publishedSpicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from './discounts-store-of-an-app';

describe('Store discounts', () => {
  describe('changing the rate of a discount', () => {
    it('should hand the discount and its new rate over to be changed', async () => {
      const { restApi, discounts } = setupSut();

      await discounts.changeRate('spices-id', { rate: '30' });

      expect(restApi.patch).to.have.been.calledWith('/discounts/spices-id', { rate: '30' });
    });
    it('should hand another discount and its new rate over to be changed', async () => {
      const { restApi, discounts } = setupSut();

      await discounts.changeRate('produce-id', { rate: '15' });

      expect(restApi.patch).to.have.been.calledWith('/discounts/produce-id', { rate: '15' });
    });
    it('should hold the discount at its new rate once the change succeeds', async () => {
      const { restApi, discounts } = setupSut();
      restApi.get.mockResolvedValue([{ ...publishedSpicesDiscount, rate: '30' }]);

      await discounts.changeRate('spices-id', { rate: '30' });

      expect(discounts.published).to.deep.equal([{ ...publishedSpicesDiscount, rate: '30' }]);
    });
    it('should hold the discounts as listed once the change succeeds', async () => {
      const { restApi, discounts } = setupSut();
      restApi.get.mockResolvedValue([{ ...publishedSpicesDiscount, rate: '30' }, publishedProduceDiscount]);

      await discounts.changeRate('spices-id', { rate: '30' });

      expect(discounts.published).to.deep.equal([{ ...publishedSpicesDiscount, rate: '30' }, publishedProduceDiscount]);
    });

    describe('dependency failure', () => {
      it.todo('should hold that the rate could not be changed when the change fails, the discount keeping its rate');
    });
  });
});
