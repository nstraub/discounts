import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import { NoCouponHasTheCodeException } from '@backend/discounts/application/domain/no-coupon-has-the-code-exception';

const charactersInAGroup = 5;
const asThePageShows = (token: string) => `${token.slice(0, charactersInAGroup)} ${token.slice(charactersInAGroup)}`;
const anyDrawnToken = fc
  .uint8Array({ minLength: 10, maxLength: 10 })
  .map((bytes) =>
    CouponToken.drawnFrom((values) => {
      values.set(bytes);
      return values;
    }).toJSON(),
  );

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
    it('should read a code typed with spaces around it as its token', () => {
      expect(CouponToken.read('  7K3QX9M2PD ').toJSON()).to.equal('7K3QX9M2PD');
    });

    describe('combination', () => {
      it('should read a lower-case o, i and l as a zero, a one and a one', () => {
        expect(CouponToken.read('r4wzobh8ni').toJSON()).to.equal('R4WZ0BH8N1');
        expect(CouponToken.read('lk3qx9m2pd').toJSON()).to.equal('1K3QX9M2PD');
      });
    });

    describe('property', () => {
      it('should read any drawn token back from the way the page shows it, in upper or lower case', () => {
        fc.assert(
          fc.property(anyDrawnToken, fc.boolean(), (drawn, typedInLowerCase) => {
            const shown = asThePageShows(drawn);
            const typed = typedInLowerCase ? shown.toLowerCase() : shown;
            expect(CouponToken.read(typed).toJSON()).to.equal(drawn);
          }),
        );
      });
    });
  });
  describe('reading a code that cannot be a token', () => {
    describe('boundary', () => {
      it('should read no token from a code of nine characters', () => {
        expect(() => CouponToken.read('7K3QX9M2P')).to.throw(NoCouponHasTheCodeException);
      });
      it.todo('should read no token from a code of eleven characters');
    });

    describe('type', () => {
      it.todo('should read no token from a code with a letter U, which no token has');
      it.todo('should read no token from a code with a symbol, an accented letter or an emoji');
    });
  });
});
