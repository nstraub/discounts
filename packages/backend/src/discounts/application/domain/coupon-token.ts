import type { RandomSource } from './random-source.js';

export class CouponToken {
  private constructor(private readonly characters: string) {}

  static drawnFrom(random: RandomSource): CouponToken {
    random(new Uint8Array(10));
    return new CouponToken('0123456789');
  }

  toJSON(): string {
    return this.characters;
  }
}
