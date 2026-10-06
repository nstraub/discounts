import { EventEmitter2 } from '@nestjs/event-emitter';
import { describe, expect, it } from 'vitest';

import { setupSut } from '../support/app';
import { keptAsIssued, theDiscountsAndCouponsKept } from '../support/discounts-table';
import { bodiesNotMatchingTheErrorSchema, theFieldsNamedBy } from '../support/error-schema';
import { redeemAtTheStoreOf, setupSutWithACouponFor, setupSutWithAnotherCouponOfTheSameDiscount } from '../support/redemptions';

const aCodeNobodyIssued = 'ZZZZZZZZZZ';

const oneCharacterAwayFrom = (code: string) => code.slice(0, -1) + (code.endsWith('0') ? '1' : '0');

describe('POST /redemptions', () => {
  describe('a code nobody issued', () => {
    it('should answer 404 with a body matching the error schema for a well-formed code nobody issued', async () => {
      const { http } = await setupSut();

      const response = await redeemAtTheStoreOf(http, aCodeNobodyIssued);

      expect(response.status).to.equal(404);
      expect(bodiesNotMatchingTheErrorSchema([response])).to.deep.equal([]);
    });
    it('should keep every discount and coupon as it was when the code was never issued', async () => {
      const sut = await setupSutWithAnotherCouponOfTheSameDiscount();

      await redeemAtTheStoreOf(sut.http, aCodeNobodyIssued);

      expect(await theDiscountsAndCouponsKept(sut.client)).to.deep.equal(keptAsIssued(sut));
    });
    it('should publish nothing on the application event emitter for a code nobody issued', async () => {
      const { app, http } = await setupSutWithACouponFor();
      const published: unknown[] = [];
      app.get(EventEmitter2).onAny((event) => published.push(event));

      await redeemAtTheStoreOf(http, aCodeNobodyIssued);

      expect(published, 'the events published').to.deep.equal([]);
    });
  });

  describe('empty', () => {
    it('should answer 400 naming the code when it is empty or only blank space', async () => {
      const { http } = await setupSut();

      const empty = await redeemAtTheStoreOf(http, '');
      const blank = await redeemAtTheStoreOf(http, ' \t ');

      expect([empty.status, blank.status]).to.deep.equal([400, 400]);
      expect(theFieldsNamedBy(empty, blank)).to.deep.equal([['code'], ['code']]);
    });
  });

  describe('A2 injection', () => {
    it('should answer a code written as SQL as for a code nobody issued, every discount and coupon left as it was', async () => {
      const sut = await setupSutWithAnotherCouponOfTheSameDiscount();

      const response = await redeemAtTheStoreOf(sut.http, "X' OR '1'='1");

      expect(response.status).to.equal(404);
      expect(await theDiscountsAndCouponsKept(sut.client)).to.deep.equal(keptAsIssued(sut));
    });
  });

  describe('A3 handle guessing (no accounts)', () => {
    it('should answer 404 for a code one character away from an issued coupon\'s, that coupon staying unused', async () => {
      const sut = await setupSutWithAnotherCouponOfTheSameDiscount();

      const response = await redeemAtTheStoreOf(sut.http, oneCharacterAwayFrom(sut.code));

      expect(response.status).to.equal(404);
      expect(await theDiscountsAndCouponsKept(sut.client)).to.deep.equal(keptAsIssued(sut));
    });
  });
});
