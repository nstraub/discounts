import type { Discount } from '@backend/discounts/application/domain/discount';
import type { DiscountRepository } from '@backend/discounts/application/domain/discount-repository';

export class InMemoryDiscountRepository implements DiscountRepository {
  private readonly kept: Discount[] = [];

  async save(discount: Discount): Promise<void> {
    this.kept.push(discount);
  }

  async all(): Promise<Discount[]> {
    return [...this.kept];
  }

  async withId(id: string): Promise<Discount | undefined> {
    return this.kept.find((discount) => discount.toJSON().id === id);
  }
}
