import { eq } from 'drizzle-orm';

import type { Discount } from '../application/domain/discount.js';
import type { DiscountFactory } from '../application/domain/discount-factory.js';
import type { DiscountRepository } from '../application/domain/discount-repository.js';

import type { Database } from './database.module.js';
import { discounts } from './schema.js';

const theColumnsOfADiscount = {
  id: discounts.id,
  item: discounts.item,
  rate: discounts.rate,
  storeName: discounts.storeName,
  storeAddress: discounts.storeAddress,
  hook: discounts.hook,
};

const withNoHookWhenNoneIsKept = <Row extends { hook: string | null }>({ hook, ...row }: Row) => (hook === null ? row : { ...row, hook });

export class DiscountDrizzleRepository implements DiscountRepository {
  constructor(
    private readonly database: Database,
    private readonly factory: DiscountFactory,
  ) {}

  async save(discount: Discount): Promise<void> {
    const state = discount.toJSON();
    await this.database.insert(discounts).values(state).onConflictDoUpdate({ target: discounts.id, set: state });
  }

  async all(): Promise<Discount[]> {
    const rows = await this.database.select(theColumnsOfADiscount).from(discounts);
    return rows.map((row) => this.factory.reconstitute(withNoHookWhenNoneIsKept({ ...row, rate: String(row.rate) })));
  }

  async withId(id: string): Promise<Discount | undefined> {
    const rows = await this.database.select(theColumnsOfADiscount).from(discounts).where(eq(discounts.id, id));
    return rows.map((row) => this.factory.reconstitute(withNoHookWhenNoneIsKept({ ...row, rate: String(row.rate) }))).at(0);
  }
}
