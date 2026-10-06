import type { DiscountDetails } from './discount-details.js';

export class CountedSales {
  constructor(
    private readonly id: string,
    private readonly details: DiscountDetails,
    private readonly discountedSales: number,
  ) {}

  toJSON(): { id: string; item: string; rate: string; discountedSales: number } {
    return { id: '', item: '', rate: '', discountedSales: this.discountedSales };
  }
}
