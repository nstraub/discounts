import { describe, it } from 'vitest';

describe('class DiscountService', () => {
  describe('issuing a coupon for a discount', () => {
    it.todo('should keep the discount named with its new coupon');
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
