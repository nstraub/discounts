import { describe, expect, it } from 'vitest';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import type { RandomSource } from '@backend/discounts/application/domain/random-source';

const aSourceGiving =
  (...given: number[]): RandomSource =>
  (values) => {
    values.set(given.slice(0, values.length));
    return values;
  };

describe('class CouponToken', () => {
  describe('drawing a token from a random source', () => {
    it('should draw ten upper-case characters with no separator', () => {
      const token = CouponToken.drawnFrom(aSourceGiving(0, 1, 2, 3, 4, 5, 6, 7, 8, 9));

      expect(token.toJSON()).to.match(/^[0-9A-Z]{10}$/);
    });
    it.todo('should draw only from Crockford base32, never I, L, O or U');
    it.todo('should favour no character over many draws from an even source');
    it('should draw another token from other random values', () => {
      const token = CouponToken.drawnFrom(aSourceGiving(10, 11, 12, 13, 14, 15, 16, 17, 18, 19));

      expect(token.toJSON()).to.equal('ABCDEFGHJK');
    });
  });
});
