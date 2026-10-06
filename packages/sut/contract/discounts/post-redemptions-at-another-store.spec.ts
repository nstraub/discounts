import { describe, expect, it } from 'vitest';

import { spicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { theDiscountsKept, theRowKeptFor } from '../support/discounts-table';
import { bodiesNotMatchingTheErrorSchema } from '../support/error-schema';
import { redeemAtTheStoreOf, setupSutWithACouponFor } from '../support/redemptions';

describe('POST /redemptions at a store the coupon is not for', () => {
  describe('a coupon for another store', () => {
    it('should answer 422 with a body matching the error schema when the coupon is not for the store given', async () => {
      const { http, code } = await setupSutWithACouponFor();

      const response = await redeemAtTheStoreOf(http, code, stephaniesProduceDiscount);

      expect(response.status).to.equal(422);
      expect(bodiesNotMatchingTheErrorSchema([response])).to.deep.equal([]);
    });
    it('should keep the coupon unused and its discount as it was when the coupon is not for the store given', async () => {
      const { client, http, published, code } = await setupSutWithACouponFor();

      await redeemAtTheStoreOf(http, code, stephaniesProduceDiscount);

      const kept = await client.query('SELECT redeemed, counted FROM app.coupons');
      expect(kept.rows, 'the coupon kept').to.deep.equal([{ redeemed: false, counted: false }]);
      expect(await theDiscountsKept(client), 'the discount kept').to.deep.equal([theRowKeptFor(published, spicesDiscount)]);
    });
    it.todo('should publish CouponRedemptionRejected on the application event emitter for the coupon refused at another store');
    it.todo('should refuse a coupon at a store with the same name as its own at another address');
  });

  describe('no store given', () => {
    it.todo('should answer 400 naming the store\'s name and address when they are missing or not text, the coupon staying unused, never a 500');
    it.todo('should answer 400 naming the store\'s name and address when each is empty or only blank space, the coupon staying unused');
  });

  describe('A1 input boundary', () => {
    it.todo('should refuse a coupon at a store whose name is 10 000 characters long as not for that store, never a 500');
  });
});
