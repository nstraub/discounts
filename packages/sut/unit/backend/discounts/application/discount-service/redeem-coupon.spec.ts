import { describe, it } from 'vitest';

describe('class DiscountService', () => {
  describe('redeeming a coupon', () => {
    it.todo('should keep the discount that owns the coupon with the coupon redeemed');
    it.todo('should announce CouponRedeemed once the redemption is kept');
    it.todo('should answer with the item of the discount the coupon is for');

    describe('combination', () => {
      it.todo('should redeem the coupon whose code is typed in lower case, in two groups');
    });

    describe('dependency failure', () => {
      it.todo('should report that the coupon could not be checked when its discount cannot be loaded or kept, the coupon staying unused');
    });
  });
});
