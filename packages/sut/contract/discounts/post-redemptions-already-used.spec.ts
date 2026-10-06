import { EventEmitter2 } from '@nestjs/event-emitter';
import { describe, expect, it } from 'vitest';

import type { CouponRedemptionRejected } from '@backend/discounts/application/domain/coupon-redemption-rejected';
import { spicesDiscount } from '@sut/support/example-discounts';

import { theDiscountsKept, theRowKeptFor } from '../support/discounts-table';
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
      expect(kept.rows, 'each coupon kept').to.have.deep.members([{ token: code, redeemed: true, counted: false }, { token: other, redeemed: false, counted: false }]);
      expect(await theDiscountsKept(client), 'the discount kept').to.deep.equal([theRowKeptFor(published, spicesDiscount)]);
    });
    it('should publish CouponRedemptionRejected on the application event emitter for the coupon already used', async () => {
      const { app, http, published, code } = await setupSutWithACouponFor();
      await redeemAtTheStoreOf(http, code);
      const rejected: unknown[] = [];
      app.get(EventEmitter2).on('coupon.redemption-rejected', ({ discountId, token, reason }: CouponRedemptionRejected) => rejected.push({ discountId, token, reason }));

      await redeemAtTheStoreOf(http, code);

      expect(rejected).to.deep.equal([{ discountId: published.id, token: code, reason: 'already used' }]);
    });
    it('should refuse a used coupon whose code is sent in lower case, in two groups, the second time', async () => {
      const { app, http, code } = await setupSutWithACouponFor();
      await redeemAtTheStoreOf(http, code);
      const refused: string[] = [];
      app.get(EventEmitter2).on('coupon.redemption-rejected', ({ token }: CouponRedemptionRejected) => refused.push(token));

      const response = await redeemAtTheStoreOf(http, `${code.slice(0, 5)} ${code.slice(5)}`.toLowerCase());

      expect(response.status).to.equal(409);
      expect(refused, 'the coupons refused').to.deep.equal([code]);
    });
  });
});
