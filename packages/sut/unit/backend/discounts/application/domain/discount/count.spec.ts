import { describe, it } from 'vitest';

describe('class Discount', () => {
  describe('counting its discounted sales', () => {
    describe('the count', () => {
      it.todo('should count three sales when three of its coupons were redeemed since its last count');
      it.todo('should raise DiscountedSalesCounted carrying its id and the number of sales counted');
    });

    describe('state', () => {
      it.todo('should leave out of a count the coupons redeemed before its last count');
      it.todo('should count a coupon issued before its last count and redeemed after it');
      it.todo('should not count a coupon issued and not yet redeemed');
    });

    describe('boundary', () => {
      it.todo('should count every coupon redeemed since it was published when it has never been counted');
    });
  });
});
