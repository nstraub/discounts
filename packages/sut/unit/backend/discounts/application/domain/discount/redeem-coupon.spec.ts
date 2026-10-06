import { describe, expect, it } from 'vitest';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import { publishedProduceDiscount, publishedSpicesDiscount } from '@sut/support/example-discounts';

import { aSpicesDiscountWithItsEvents } from './a-spices-discount';

const setupSut = ({ kept = publishedSpicesDiscount, coupons = [{ token: '7K3QX9M2PD', redeemed: false, counted: false }] } = {}) =>
  aSpicesDiscountWithItsEvents().factory.reconstitute({ ...kept, coupons });

describe('class Discount', () => {
  describe('redeeming one of its coupons', () => {
    it('should redeem its coupon with the token given', () => {
      const discount = setupSut();

      discount.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'));

      expect(discount.toJSON().coupons).to.deep.equal([{ token: '7K3QX9M2PD', redeemed: true, counted: false }]);
    });

    it('should answer with the item of the discount the coupon redeemed is for', () => {
      const discount = setupSut();

      const redeemed = discount.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'));

      expect(redeemed.toJSON()).to.deep.equal({ item: publishedSpicesDiscount.item });
    });
    it('should answer with the item of another discount when one of its coupons is redeemed', () => {
      const discount = setupSut({ kept: publishedProduceDiscount });

      const redeemed = discount.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'));

      expect(redeemed.toJSON()).to.deep.equal({ item: publishedProduceDiscount.item });
    });

    describe('combination', () => {
      it('should leave its other coupons unused when one is redeemed', () => {
        const discount = setupSut({ coupons: [{ token: '7K3QX9M2PD', redeemed: false, counted: false }, { token: 'R4WZ0BH8NE', redeemed: false, counted: false }] });

        discount.redeemCoupon(CouponToken.keptAs('R4WZ0BH8NE'));

        expect(discount.toJSON().coupons.at(0)).to.deep.equal({ token: '7K3QX9M2PD', redeemed: false, counted: false });
      });
    });
  });
  describe('redeeming a coupon already used', () => {
    it.todo('should refuse the used coupon, leaving its other coupons as they were');
  });
});
