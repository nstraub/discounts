import { describe, expect, it } from 'vitest';

import { oneRaceAfterAnother } from '../support/at-the-same-moment';
import { redeemAtTheStoreOf, setupSutWithACouponForEachRace } from '../support/redemptions';

describe('changes to one discount at the same moment', () => {
  describe('A4 concurrency', () => {
    it.todo('should keep both a coupon issued and another coupon redeemed at the same moment');
    it.todo('should keep both of two coupons issued for one discount at the same moment');
    it('should keep a coupon\'s redemption and a change of its discount\'s rate made at the same moment', async () => {
      const { http, published, codes } = await setupSutWithACouponForEachRace();

      const keptAfterEachPair = await oneRaceAfterAnother(codes, async (code) => {
        const rate = String(codes.indexOf(code) + 30);
        await Promise.all([redeemAtTheStoreOf(http, code), http.patch(`/discounts/${published.id}`).send({ rate })]);
        const [listed] = (await http.get('/discounts')).body;
        const usedAgain = await redeemAtTheStoreOf(http, code);
        return { rateChanged: listed.rate === rate, redemptionKept: usedAgain.status === 409 };
      });

      expect(keptAfterEachPair, 'the rate and the redemption kept after each pair').to.deep.equal(
        codes.map(() => ({ rateChanged: true, redemptionKept: true })),
      );
    });
    it.todo('should answer each of the changes as it would alone, never refusing one for a change kept meanwhile');
    it.todo('should keep the rate of the later of two changes of rate made at the same moment');
  });
});
