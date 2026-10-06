export class CouponRedeemed {
  readonly name = 'coupon.redeemed';

  constructor(
    readonly id: string,
    readonly token: string,
  ) {}
}
