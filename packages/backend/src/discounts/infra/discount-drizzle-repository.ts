import type { Discount } from '../application/domain/discount.js';
import type { DiscountFactory } from '../application/domain/discount-factory.js';
import type { DiscountRepository } from '../application/domain/discount-repository.js';

import type { Database } from './database.module.js';
import { discounts } from './schema.js';

export class DiscountDrizzleRepository implements DiscountRepository {
  constructor(
    private readonly database: Database,
    private readonly factory: DiscountFactory,
  ) {}

  async save(discount: Discount): Promise<void> {
    await this.database.insert(discounts).values(discount.toJSON());
  }

  async all(): Promise<Discount[]> {
    const rows = await this.database.select().from(discounts);
    return rows.map((row) => this.factory.reconstitute({ ...row, rate: String(row.rate) }));
  }
}
