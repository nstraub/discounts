import type { Discount } from './discount.js';

export class DiscountPublished {
  readonly name = 'discount.published';

  constructor(readonly discount: ReturnType<Discount['toJSON']>) {}
}
