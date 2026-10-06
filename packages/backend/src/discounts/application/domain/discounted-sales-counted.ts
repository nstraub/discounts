export class DiscountedSalesCounted {
  readonly name = 'discount.sales-counted';

  constructor(
    readonly discountId: string,
    readonly discountedSales: number,
  ) {}
}
