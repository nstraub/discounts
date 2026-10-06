import { NoCouponHasTheCodeException } from './no-coupon-has-the-code-exception.js';
import type { RandomSource } from './random-source.js';

const crockfordBase32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const charactersInAToken = 10;
const separatorsTypedBetweenOrAroundTheGroups = /[\s-]/g;
const theLetterTypedForAZero = 'O';
const theLettersTypedForAOne = /[IL]/g;

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
    const withoutSeparators = typed.toUpperCase().replaceAll(separatorsTypedBetweenOrAroundTheGroups, '');
    if (withoutSeparators.length !== charactersInAToken) {
      throw new NoCouponHasTheCodeException();
    }
    return new CouponToken(withoutSeparators.replaceAll(theLetterTypedForAZero, '0').replaceAll(theLettersTypedForAOne, '1'));
  }

  toJSON(): string {
    return this.characters;
  }
}
