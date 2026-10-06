import { describe, expect, it } from 'vitest';

import { spicesDiscount } from '@sut/support/example-discounts';

import { bodiesNotMatchingTheErrorSchema } from '../support/error-schema';
import { redeemAtTheStoreOf, setupSutWithACouponFor, setupSutWithAnotherCouponOfTheSameDiscount } from '../support/redemptions';

describe('POST /redemptions', () => {
  describe('a coupon already used', () => {
    it('should answer 409 with a body matching the error schema when the coupon has already been used', async () => {
      const { http, code } = await setupSutWithACouponFor();
      await redeemAtTheStoreOf(http, code);

      const response = await redeemAtTheStoreOf(http, code);

      expect(response.status).to.equal(409);
      expect(bodiesNotMatchingTheErrorSchema([response])).to.deep.equal([]);
    });
    it('should keep the coupon used once, its discount and its other coupons as they were', async () => {
      const { client, http, published, code, other } = await setupSutWithAnotherCouponOfTheSameDiscount();
      await redeemAtTheStoreOf(http, code);

      await redeemAtTheStoreOf(http, code);

      const kept = await client.query('SELECT token, redeemed, counted FROM app.coupons');
      const discountKept = await client.query('SELECT id, item, rate, store_name, store_address FROM app.discounts');
      expect(kept.rows, 'each coupon kept').to.have.deep.members([{ token: code, redeemed: true, counted: false }, { token: other, redeemed: false, counted: false }]);
      expect(discountKept.rows, 'the discount kept').to.deep.equal([
        { id: published.id, item: spicesDiscount.item, rate: spicesDiscount.rate, store_name: spicesDiscount.storeName, store_address: spicesDiscount.storeAddress },
      ]);
    });
    it.todo('should publish CouponRedemptionRejected on the application event emitter for the coupon already used');
    it.todo('should refuse a used coupon whose code is sent in lower case, in two groups, the second time');
  });
});
