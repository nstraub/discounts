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
    it('should read a letter O typed for a zero as a zero', () => {
      expect(CouponToken.read('R4WZOBH8NE').toJSON()).to.equal('R4WZ0BH8NE');
    });
    it('should read a letter I or a letter L typed for a one as a one', () => {
      expect(CouponToken.read('IK3QX9M2PL').toJSON()).to.equal('1K3QX9M2P1');
    });
    it('should read a code typed in two groups, with a space or a hyphen between them, as its token', () => {
      expect(CouponToken.read('7K3QX 9M2PD').toJSON(), 'with a space').to.equal('7K3QX9M2PD');
      expect(CouponToken.read('7K3QX-9M2PD').toJSON(), 'with a hyphen').to.equal('7K3QX9M2PD');
    });
    it.todo('should read a code typed with spaces around it as its token');

    describe('combination', () => {
      it.todo('should read a lower-case o, i and l as a zero, a one and a one');
    });

    describe('property', () => {
      it.todo('should read any drawn token back from the way the page shows it, in upper or lower case');
    });
  });
});
