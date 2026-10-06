import { CouponToken } from '@backend/discounts/application/domain/coupon-token';

const crockfordBase32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export const tokenDrawnAs = (characters: string): CouponToken =>
  CouponToken.drawnFrom((values) => {
    values.set([...characters].map((character) => crockfordBase32.indexOf(character)));
    return values;
  });
