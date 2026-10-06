import { describe, expect, it } from 'vitest';

import { CouponIssued } from '@backend/discounts/application/domain/coupon-issued';
import { publishedProduceDiscount, spicesDiscount } from '@sut/support/example-discounts';

import { aServiceOverAKeptDiscount } from './a-service-over-a-kept-discount';

const setupSut = aServiceOverAKeptDiscount;

describe('class DiscountService', () => {
  describe('issuing a coupon for a discount', () => {
    it('should keep the discount named with its new coupon', async () => {
      const { repository, service } = setupSut();

      await service.issueCoupon('spices-id');

      expect(repository.save.mock.lastCall?.at(0)?.toJSON()).to.deep.include({ id: 'spices-id', coupons: [{ token: '7K3QX9M2PD', redeemed: false }] });
    });
    it('should announce CouponIssued for the coupon the discount named issues', async () => {
      const { events, service } = setupSut();

      await service.issueCoupon('spices-id');

      expect(events.publish).to.have.been.calledWith(new CouponIssued('spices-id', '7K3QX9M2PD'));
    });
    it('should answer with the coupon\'s token and the store it is for', async () => {
      const { service } = setupSut();

      const answered = await service.issueCoupon('spices-id');

      expect(answered.toJSON()).to.deep.equal({ token: '7K3QX9M2PD', storeName: spicesDiscount.storeName });
    });
    it('should answer with the token and the store of a coupon for another discount', async () => {
      const { service } = setupSut({ kept: publishedProduceDiscount, drawing: 'R4WZ0BH8NE' });

      const answered = await service.issueCoupon('produce-id');

      expect(answered.toJSON()).to.deep.equal({ token: 'R4WZ0BH8NE', storeName: publishedProduceDiscount.storeName });
    });

    describe('state', () => {
      it.todo('should report that there is no such discount when no discount has that id, issuing nothing');
    });

    describe('dependency failure', () => {
      it.todo('should report that the coupon could not be got when it cannot be kept, issuing nothing');
    });
  });
});
