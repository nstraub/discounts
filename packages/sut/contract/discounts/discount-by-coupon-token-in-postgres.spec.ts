import { describe, it } from 'vitest';

describe('a discount found by one of its coupons\' tokens in PostgreSQL', () => {
  it.todo('should find the kept discount that owns the coupon with that token among several discounts with coupons');
  it.todo('should load the discount found with every one of its coupons, not only the one with that token');
  it.todo('should find nothing for a token no kept coupon has');

  describe('A2 injection', () => {
    it.todo('should find nothing for a token with quotes, semicolons and SQL keywords, every kept discount and coupon left as it was');
  });
});
