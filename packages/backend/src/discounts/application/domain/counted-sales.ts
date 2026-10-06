import type { DiscountDetails } from './discount-details.js';

export class CountedSales {
  constructor(
    private readonly id: string,
    private readonly details: DiscountDetails,
    private readonly discountedSales: number,
  ) {}

  toJSON(): { id: string; item: string; rate: string; discountedSales: number } {
    const { item, rate } = this.details.toJSON();
    return { id: this.id, item, rate, discountedSales: this.discountedSales };
  }
}
