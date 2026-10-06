export class CouponIssued {
  readonly name = 'coupon.issued';

  constructor(
    readonly id: string,
    readonly token: string,
  ) {}
}
