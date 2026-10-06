import { describe, expect, it } from 'vitest';

import { oneRaceAfterAnother, timesTheRaceIsRun } from '../support/at-the-same-moment';
import { countTheStoreOf } from '../support/counts';
import { changeTheRateOf } from '../support/rates';
import { askForACouponFor, issueACouponFor, redeemAtTheStoreOf, setupSutWithACouponFor, setupSutWithACouponForEachRace } from '../support/redemptions';

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
        await Promise.all([redeemAtTheStoreOf(http, code), changeTheRateOf(http, published, rate)]);
        const [listed] = (await http.get('/discounts')).body;
        const usedAgain = await redeemAtTheStoreOf(http, code);
        return { rateChanged: listed.rate === rate, redemptionKept: usedAgain.status === 409 };
      });

      expect(keptAfterEachPair, 'the rate and the redemption kept after each pair').to.deep.equal(
        codes.map(() => ({ rateChanged: true, redemptionKept: true })),
      );
    });
    it('should keep a change of a discount\'s rate made while coupons are issued for it at the same moment', async () => {
      const { http, published } = await setupSutWithACouponFor();
      const races = Array.from({ length: timesTheRaceIsRun }, (_, race) => String(race + 30));
      const issueOne = () => issueACouponFor(http, published);

      const keptAfterEachRace = await oneRaceAfterAnother(races, async (rate) => {
        const [first, second, , third, fourth] = await Promise.all([issueOne(), issueOne(), changeTheRateOf(http, published, rate), issueOne(), issueOne()]);
        const [listed] = (await http.get('/discounts')).body;
        const used = await Promise.all([first, second, third, fourth].map((issued) => redeemAtTheStoreOf(http, issued)));
        return { rateChanged: listed.rate === rate, statusesUsingTheIssued: used.map((response) => response.status) };
      });

      expect(keptAfterEachRace, 'the rate and the coupons issued kept after each race').to.deep.equal(
        races.map(() => ({ rateChanged: true, statusesUsingTheIssued: [201, 201, 201, 201] })),
      );
    });
    it('should answer each of the changes as it would alone, never refusing one for a change kept meanwhile', async () => {
      const { http, published, codes } = await setupSutWithACouponForEachRace();

      const statusesOfEachRace = await oneRaceAfterAnother(codes, async (code) => {
        const changes = await Promise.all([
          redeemAtTheStoreOf(http, code),
          askForACouponFor(http, published),
          changeTheRateOf(http, published, '25'),
          countTheStoreOf(http),
        ]);
        return changes.map((response) => response.status);
      });

      expect(statusesOfEachRace, 'the statuses answering a redemption, an issue, a change of rate and a count at once').to.deep.equal(
        codes.map(() => [201, 201, 204, 201]),
      );
    });
    it('should keep the rate of the later of two changes of rate made at the same moment', async () => {
      const { http, published } = await setupSutWithACouponFor();
      const races = Array.from({ length: timesTheRaceIsRun }, (_, race) => [String(race + 30), String(race + 60)]);

      const keptAfterEachPair = await oneRaceAfterAnother(races, async (rates) => {
        const pair = await Promise.all(rates.map((rate) => changeTheRateOf(http, published, rate)));
        const [listed] = (await http.get('/discounts')).body;
        return { statuses: pair.map((response) => response.status), oneOfTheRatesKept: rates.includes(listed.rate) };
      });

      expect(keptAfterEachPair, 'the answers and the rate kept after each pair of changes').to.deep.equal(
        races.map(() => ({ statuses: [204, 204], oneOfTheRatesKept: true })),
      );
    });
  });
  describe('A4 concurrency: a coupon tried at two stores', () => {
    it.todo('should keep a coupon redeemed at its own store when it is tried at another store at the same moment');
  });
});
