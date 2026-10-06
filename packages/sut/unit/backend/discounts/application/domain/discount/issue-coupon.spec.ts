import { describe, expect, it } from 'vitest';

import { tokenDrawnAs } from '@backend/app/mocks/coupon-tokens';
import { CouponIssued } from '@backend/discounts/application/domain/coupon-issued';

import { aSpicesDiscountWithItsEvents } from './a-spices-discount';

const setupSut = aSpicesDiscountWithItsEvents;

describe('class Discount', () => {
  describe('issuing a coupon', () => {
    describe('the coupon issued', () => {
      it('should hold the coupon it issues, with the token it is given', () => {
        const { discount } = setupSut();

        discount.issueCoupon(tokenDrawnAs('7K3QX9M2PD'));

        expect(discount.toJSON().coupons).to.deep.equal(['7K3QX9M2PD']);
      });
      it('should raise CouponIssued carrying its id and the coupon\'s token', () => {
        const { events, discount } = setupSut();

        discount.issueCoupon(tokenDrawnAs('7K3QX9M2PD'));

        const [raised] = events.publish.mock.lastCall ?? [];
        expect(raised).to.be.instanceOf(CouponIssued);
        expect(raised).to.deep.include({ id: 'test-uuid', token: '7K3QX9M2PD' });
      });
    });

    describe('state', () => {
      it.todo('should issue a second coupon with a token of its own when tried twice, holding both');
    });
  });
});
