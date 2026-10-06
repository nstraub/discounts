export class CouponRedemptionRejected {
  readonly name = 'coupon.redemption-rejected';

  constructor(
    readonly discountId: string,
    readonly token: string,
    readonly reason: string,
  ) {}
}
