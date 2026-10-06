import { describe, expect, it } from 'vitest';

import { DiscountRateChanged } from '@backend/discounts/application/domain/discount-rate-changed';
import { spicesDiscount } from '@sut/support/example-discounts';

import { aServiceOverAKeptDiscount } from './a-service-over-a-kept-discount';

const setupSut = aServiceOverAKeptDiscount;

describe('class DiscountService', () => {
  describe('changing the rate of a discount', () => {
    it('should keep the discount named at its new rate', async () => {
      const { repository, service } = setupSut();

      await service.changeRate('spices-id', '25');

      expect(repository.save.mock.lastCall?.at(0)?.toJSON()).to.deep.equal({ id: 'spices-id', ...spicesDiscount, rate: '25', coupons: [] });
    });
    it('should announce DiscountRateChanged when the rate is changed', async () => {
      const { events, service } = setupSut();

      await service.changeRate('spices-id', '25');

      expect(events.publish).to.have.been.calledWith(new DiscountRateChanged('spices-id', '25'));
    });

    describe('state', () => {
      it.todo('should report that there is no such discount when no discount has that id, changing nothing');
    });

    describe('dependency failure', () => {
      it.todo('should report that the rate could not be changed when the change cannot be kept');
    });
  });
});
