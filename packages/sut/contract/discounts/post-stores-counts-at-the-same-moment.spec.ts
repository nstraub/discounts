import { describe, expect, it } from 'vitest';

import { oneRaceAfterAnother } from '../support/at-the-same-moment';
import { countTheStoreOf } from '../support/counts';
import { redeemAtTheStoreOf, setupSutWithACouponForEachRace } from '../support/redemptions';

describe('POST /stores/counts', () => {
  describe('A4 concurrency', () => {
    it('should count each redeemed coupon once between two counts of a store arriving at the same moment', async () => {
      const { http, codes } = await setupSutWithACouponForEachRace();

      const salesCountedByEachPair = await oneRaceAfterAnother(codes, async (code) => {
        await redeemAtTheStoreOf(http, code);
        const pair = await Promise.all([countTheStoreOf(http), countTheStoreOf(http)]);
        return pair.reduce((sales, response) => sales + response.body[0].discountedSales, 0);
      });

      expect(salesCountedByEachPair, 'the sales two counts at once counted for one coupon redeemed').to.deep.equal(codes.map(() => 1));
    });
    it('should count a coupon redeemed during a count once, in that count or the next', async () => {
      const { http, codes } = await setupSutWithACouponForEachRace();

      const salesCountedForEachCoupon = await oneRaceAfterAnother(codes, async (code) => {
        const [, during] = await Promise.all([redeemAtTheStoreOf(http, code), countTheStoreOf(http)]);
        const next = await countTheStoreOf(http);
        return during.body[0].discountedSales + next.body[0].discountedSales;
      });

      expect(salesCountedForEachCoupon, 'the sales a count during its redemption and the next counted').to.deep.equal(codes.map(() => 1));
    });
  });
});
