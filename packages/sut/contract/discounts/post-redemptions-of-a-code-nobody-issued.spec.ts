import { describe, expect, it } from 'vitest';

import { setupSut } from '../support/app';
import { bodiesNotMatchingTheErrorSchema } from '../support/error-schema';
import { redeemAtTheStoreOf } from '../support/redemptions';

const aCodeNobodyIssued = 'ZZZZZZZZZZ';

describe('POST /redemptions', () => {
  describe('a code nobody issued', () => {
    it('should answer 404 with a body matching the error schema for a well-formed code nobody issued', async () => {
      const { http } = await setupSut();

      const response = await redeemAtTheStoreOf(http, aCodeNobodyIssued);

      expect(response.status).to.equal(404);
      expect(bodiesNotMatchingTheErrorSchema([response])).to.deep.equal([]);
    });
    it.todo('should keep every discount and coupon as it was when the code was never issued');
    it.todo('should publish nothing on the application event emitter for a code nobody issued');
  });

  describe('empty', () => {
    it.todo('should answer 400 naming the code when it is empty or only blank space');
  });

  describe('A2 injection', () => {
    it.todo('should answer a code written as SQL as for a code nobody issued, every discount and coupon left as it was');
  });

  describe('A3 handle guessing (no accounts)', () => {
    it.todo('should answer 404 for a code one character away from an issued coupon\'s, that coupon staying unused');
  });
});
