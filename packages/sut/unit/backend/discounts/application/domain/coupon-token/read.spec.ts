import { describe, expect, it } from 'vitest';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';

describe('class CouponToken', () => {
  describe('reading a code typed at the till', () => {
    it('should read a code typed as it was drawn as its token', () => {
      expect(CouponToken.read('7K3QX9M2PD').toJSON()).to.equal('7K3QX9M2PD');
    });
    it('should read a code typed in lower case as its token', () => {
      expect(CouponToken.read('7k3qx9m2pd').toJSON()).to.equal('7K3QX9M2PD');
    });
    it.todo('should read a letter O typed for a zero as a zero');
    it.todo('should read a letter I or a letter L typed for a one as a one');
    it.todo('should read a code typed in two groups, with a space or a hyphen between them, as its token');
    it.todo('should read a code typed with spaces around it as its token');

    describe('combination', () => {
      it.todo('should read a lower-case o, i and l as a zero, a one and a one');
    });

    describe('property', () => {
      it.todo('should read any drawn token back from the way the page shows it, in upper or lower case');
    });
  });
});
