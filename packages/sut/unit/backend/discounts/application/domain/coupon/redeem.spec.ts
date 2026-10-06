import { describe, it } from 'vitest';

describe('class Coupon', () => {
  describe('being redeemed', () => {
    describe('the coupon redeemed', () => {
      it.todo('should count as used once it is redeemed');
      it.todo('should raise CouponRedeemed carrying its discount\'s id and its token');
    });

    describe('state', () => {
      it.todo('should count as unused from its issue until it is redeemed');
    });
  });
});
