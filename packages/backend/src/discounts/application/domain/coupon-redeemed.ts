export class CouponRedeemed {
  readonly name = 'coupon.redeemed';

  constructor(
    readonly discountId: string,
    readonly token: string,
  ) {}
}
