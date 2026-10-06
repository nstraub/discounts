import { describe, expect, it } from 'vitest';

import { aServiceOverTheKeptSpicesDiscount } from './a-service-over-the-kept-spices-discount';

const setupSut = aServiceOverTheKeptSpicesDiscount;

describe('class DiscountService', () => {
  describe('issuing a coupon for a discount', () => {
    it('should keep the discount named with its new coupon', async () => {
      const { repository, service } = setupSut();

      await service.issueCoupon('spices-id');

      expect(repository.save.mock.lastCall?.at(0)?.toJSON()).to.deep.include({ id: 'spices-id', coupons: ['7K3QX9M2PD'] });
    });
    it.todo('should announce CouponIssued once the coupon is kept');
    it.todo('should answer with the coupon\'s token and the store it is for');

    describe('state', () => {
      it.todo('should report that there is no such discount when no discount has that id, issuing nothing');
    });

    describe('dependency failure', () => {
      it.todo('should report that the coupon could not be got when it cannot be kept, issuing nothing');
    });
  });
});
