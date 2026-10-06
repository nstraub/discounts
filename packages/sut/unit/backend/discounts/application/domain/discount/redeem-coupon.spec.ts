import { describe, expect, it } from 'vitest';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import { publishedSpicesDiscount } from '@sut/support/example-discounts';

import { aSpicesDiscountWithItsEvents } from './a-spices-discount';

describe('class Discount', () => {
  describe('redeeming one of its coupons', () => {
    it('should redeem its coupon with the token given', () => {
      const { factory } = aSpicesDiscountWithItsEvents();
      const discount = factory.reconstitute({ ...publishedSpicesDiscount, coupons: [{ token: '7K3QX9M2PD', redeemed: false }] });

      discount.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'));

      expect(discount.toJSON().coupons).to.deep.equal([{ token: '7K3QX9M2PD', redeemed: true }]);
    });

    describe('combination', () => {
      it('should leave its other coupons unused when one is redeemed', () => {
        const { factory } = aSpicesDiscountWithItsEvents();
        const coupons = [{ token: '7K3QX9M2PD', redeemed: false }, { token: 'R4WZ0BH8NE', redeemed: false }];
        const discount = factory.reconstitute({ ...publishedSpicesDiscount, coupons });

        discount.redeemCoupon(CouponToken.keptAs('R4WZ0BH8NE'));

        expect(discount.toJSON().coupons.at(0)).to.deep.equal({ token: '7K3QX9M2PD', redeemed: false });
      });
    });
  });
});
