import { describe, expect, it } from 'vitest';

import { oneRaceAfterAnother, timesTheRaceIsRun } from '../support/at-the-same-moment';
import { issueACouponFor, redeemAtTheStoreOf, setupSutWithACouponFor, setupSutWithACouponForEachRace } from '../support/redemptions';

describe('changes to one discount at the same moment', () => {
  describe('A4 concurrency', () => {
    it('should keep both a coupon issued and another coupon redeemed at the same moment', async () => {
      const { http, published, codes } = await setupSutWithACouponForEachRace();

      const keptAfterEachPair = await oneRaceAfterAnother(codes, async (code) => {
        const [, issued] = await Promise.all([redeemAtTheStoreOf(http, code), issueACouponFor(http, published)]);
        const usedAgain = await redeemAtTheStoreOf(http, code);
        const issuedUsed = await redeemAtTheStoreOf(http, issued);
        return { redemptionKept: usedAgain.status === 409, issuedKept: issuedUsed.status === 201 };
      });

      expect(keptAfterEachPair, 'the redemption and the coupon issued kept after each pair').to.deep.equal(
        codes.map(() => ({ redemptionKept: true, issuedKept: true })),
      );
    });
    it('should keep both of two coupons issued for one discount at the same moment', async () => {
      const { http, published } = await setupSutWithACouponFor();
      const races = Array.from({ length: timesTheRaceIsRun }, (_, race) => race);

      const keptOfEachPair = await oneRaceAfterAnother(races, async () => {
        const pair = await Promise.all([issueACouponFor(http, published), issueACouponFor(http, published)]);
        const used = await Promise.all(pair.map((issued) => redeemAtTheStoreOf(http, issued)));
        return used.map((response) => response.status);
      });

      expect(keptOfEachPair, 'the statuses using each coupon of a pair issued at once').to.deep.equal(races.map(() => [201, 201]));
    });
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
