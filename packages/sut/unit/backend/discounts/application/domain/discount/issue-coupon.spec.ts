import { describe, it } from 'vitest';

describe('class Discount', () => {
  describe('issuing a coupon', () => {
    describe('the coupon issued', () => {
      it.todo('should hold the coupon it issues, with the token it is given');
      it.todo('should raise CouponIssued carrying its id and the coupon\'s token');
    });

    describe('state', () => {
      it.todo('should issue a second coupon with a token of its own when tried twice, holding both');
    });
  });
});
