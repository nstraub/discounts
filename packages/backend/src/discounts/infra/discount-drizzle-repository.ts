import { eq } from 'drizzle-orm';

import type { Discount } from '../application/domain/discount.js';
import type { DiscountFactory } from '../application/domain/discount-factory.js';
import type { DiscountRepository } from '../application/domain/discount-repository.js';

import { keepTheNewlyIssued, tokensIssuedBy, tokensIssuedByEachDiscount } from './coupon-rows.js';
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
    const { coupons, ...state } = discount.toJSON();
    await this.database.insert(discounts).values(state).onConflictDoUpdate({ target: discounts.id, set: state });
    await keepTheNewlyIssued(this.database, state.id, coupons.map((coupon) => coupon.token));
  }

  async all(): Promise<Discount[]> {
    const rows = await this.database.select(theColumnsOfADiscount).from(discounts);
    const issued = await tokensIssuedByEachDiscount(this.database);
    return rows.map((row) => this.rebuilt(row, issued.get(row.id) ?? []));
  }

  async withId(id: string): Promise<Discount | undefined> {
    const rows = await this.database.select(theColumnsOfADiscount).from(discounts).where(eq(discounts.id, id));
    const issued = await tokensIssuedBy(this.database, id);
    return rows.map((row) => this.rebuilt(row, issued)).at(0);
  }

  async withCouponToken(): Promise<Discount | undefined> {
    return undefined;
  }

  private rebuilt(row: typeof discounts.$inferSelect, issued: string[]): Discount {
    return this.factory.reconstitute({ ...withNoHookWhenNoneIsKept({ ...row, rate: String(row.rate) }), coupons: issued.map((token) => ({ token, redeemed: false })) });
  }
}
