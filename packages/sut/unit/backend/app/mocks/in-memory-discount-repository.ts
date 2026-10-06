import type { Discount } from '@backend/discounts/application/domain/discount';
import type { DiscountRepository } from '@backend/discounts/application/domain/discount-repository';

export class InMemoryDiscountRepository implements DiscountRepository {
  private readonly kept = new Map<string, Discount>();

  async save(discount: Discount): Promise<void> {
    this.kept.set(discount.toJSON().id, discount);
  }

  async all(): Promise<Discount[]> {
    return [...this.kept.values()];
  }

  async withId(id: string): Promise<Discount | undefined> {
    return this.kept.get(id);
  }
}
