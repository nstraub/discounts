import type { RandomSource } from '@backend/discounts/application/domain/random-source';

const crockfordBase32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export const aSourceDrawing =
  (token: string): RandomSource =>
  (values) => {
    values.set([...token].map((character) => crockfordBase32.indexOf(character)));
    return values;
  };
