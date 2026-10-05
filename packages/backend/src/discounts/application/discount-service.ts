import type { Discount } from './domain/discount.js';
import type { DiscountDetails } from './domain/discount-details.js';
import type { DiscountFactory } from './domain/discount-factory.js';
import type { DiscountRepository } from './domain/discount-repository.js';

export class DiscountService {
  constructor(
    private readonly factory: DiscountFactory,
    private readonly repository: DiscountRepository,
  ) {}

  async publish(details: DiscountDetails): Promise<Discount> {
    const discount = this.factory.create(details);
    await this.repository.save(discount);
    discount.publish();
    return discount;
  }

  async published(): Promise<Discount[]> {
    throw new Error('not implemented: DiscountService.published');
  }
}
