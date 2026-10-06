import type { Discount } from './discount.js';

export interface DiscountRepository {
  save(discount: Discount): Promise<void>;
  all(): Promise<Discount[]>;
  withId(id: string): Promise<Discount | undefined>;
}
