import type { RandomSource } from './random-source.js';

const crockfordBase32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const charactersInAToken = 10;

export class CouponToken {
  private constructor(private readonly characters: string) {}

  static drawnFrom(random: RandomSource): CouponToken {
    const drawn = random(new Uint8Array(charactersInAToken));
    return new CouponToken([...drawn].map((value) => crockfordBase32.charAt(value % crockfordBase32.length)).join(''));
  }

  static keptAs(characters: string): CouponToken {
    return new CouponToken(characters);
  }

  toJSON(): string {
    return this.characters;
  }
}
