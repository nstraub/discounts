import type { Discount } from '../application/domain/discount.js';
import type { DiscountFactory } from '../application/domain/discount-factory.js';
import type { DiscountRepository } from '../application/domain/discount-repository.js';

import type { Database } from './database.module.js';

export class DiscountDrizzleRepository implements DiscountRepository {
  constructor(
    private readonly database: Database,
    private readonly factory: DiscountFactory,
  ) {}

  async save(): Promise<void> {
    throw new Error('not implemented: DiscountDrizzleRepository.save');
  }

  async all(): Promise<Discount[]> {
    return [];
  }
}
