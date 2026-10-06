export class DiscountRateChanged {
  readonly name = 'discount.rate-changed';

  constructor(
    readonly id: string,
    readonly rate: string,
  ) {}
}
