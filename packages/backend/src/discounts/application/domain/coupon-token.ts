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

  static read(typed: string): CouponToken {
    return new CouponToken(typed.toUpperCase().replaceAll(/[\s-]/g, '').replaceAll('O', '0').replaceAll(/[IL]/g, '1'));
  }

  toJSON(): string {
    return this.characters;
  }
}
