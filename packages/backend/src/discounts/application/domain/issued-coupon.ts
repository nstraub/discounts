import type { CouponToken } from './coupon-token.js';

export class IssuedCoupon {
  constructor(
    private readonly token: CouponToken,
    private readonly storeName: string,
  ) {}

  toJSON(): { token: string; storeName: string } {
    return { token: this.token.toJSON(), storeName: this.storeName };
  }
}
