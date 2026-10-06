import { describe, expect, it } from 'vitest';

import { CouponIssued } from '@backend/discounts/application/domain/coupon-issued';
import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import { produceDiscount } from '@sut/support/example-discounts';

import { aSpicesDiscountWithItsEvents } from './a-spices-discount';

const setupSut = aSpicesDiscountWithItsEvents;

describe('class Discount', () => {
  describe('issuing a coupon', () => {
    describe('the coupon issued', () => {
      it('should hold the coupon it issues, with the token it is given', () => {
        const { discount } = setupSut();

        discount.issueCoupon(CouponToken.keptAs('7K3QX9M2PD'));

        expect(discount.toJSON().coupons).to.deep.equal([{ token: '7K3QX9M2PD', redeemed: false }]);
      });
      it('should raise CouponIssued carrying its id and the coupon\'s token', () => {
        const { events, discount } = setupSut();

        discount.issueCoupon(CouponToken.keptAs('7K3QX9M2PD'));

        const [raised] = events.publish.mock.lastCall ?? [];
        expect(raised).to.be.instanceOf(CouponIssued);
        expect(raised).to.deep.include({ id: 'test-uuid', token: '7K3QX9M2PD' });
      });
      it('should raise CouponIssued carrying the id of another discount and the token of its coupon', () => {
        const { events, factory } = setupSut();
        const discount = factory.reconstitute({ id: 'produce-id', ...produceDiscount, coupons: [] });

        discount.issueCoupon(CouponToken.keptAs('R4WZ0BH8NE'));

        expect(events.publish.mock.lastCall?.at(0)).to.deep.include({ id: 'produce-id', token: 'R4WZ0BH8NE' });
      });
    });

    describe('state', () => {
      it('should hold the coupons it issued before beside the one it issues', () => {
        const { discount } = setupSut();
        discount.issueCoupon(CouponToken.keptAs('7K3QX9M2PD'));

        discount.issueCoupon(CouponToken.keptAs('R4WZ0BH8NE'));

        expect(discount.toJSON().coupons.map(({ token }) => token)).to.deep.equal(['7K3QX9M2PD', 'R4WZ0BH8NE']);
      });
      it.todo('should issue a second coupon with a token of its own when tried twice, holding both');
    });
  });
});
