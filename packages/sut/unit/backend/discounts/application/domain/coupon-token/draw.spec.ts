import { describe, it } from 'vitest';

describe('class CouponToken', () => {
  describe('drawing a token from a random source', () => {
    it.todo('should draw ten upper-case characters with no separator');
    it.todo('should draw only from Crockford base32, never I, L, O or U');
    it.todo('should favour no character over many draws from an even source');
    it.todo('should draw another token from other random values');
  });
});
