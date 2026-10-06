import { eq } from 'drizzle-orm';

import type { Discount } from '../application/domain/discount.js';
import type { DiscountFactory } from '../application/domain/discount-factory.js';
import type { DiscountRepository } from '../application/domain/discount-repository.js';

import type { Database } from './database.module.js';
import { coupons, discounts } from './schema.js';

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
    const { coupons: tokens, ...state } = discount.toJSON();
    await this.database.insert(discounts).values(state).onConflictDoUpdate({ target: discounts.id, set: state });
    if (tokens.length > 0) {
      await this.database.insert(coupons).values(tokens.map((token) => ({ token, discountId: state.id })));
    }
  }

  async all(): Promise<Discount[]> {
    const rows = await this.database.select(theColumnsOfADiscount).from(discounts);
    const issued = await this.database.select({ token: coupons.token, discountId: coupons.discountId }).from(coupons).orderBy(coupons.id);
    return rows.map((row) => this.rebuilt(row, issued.filter((coupon) => coupon.discountId === row.id).map((coupon) => coupon.token)));
  }

  async withId(id: string): Promise<Discount | undefined> {
    const rows = await this.database.select(theColumnsOfADiscount).from(discounts).where(eq(discounts.id, id));
    const issued = await this.database.select({ token: coupons.token }).from(coupons).where(eq(coupons.discountId, id)).orderBy(coupons.id);
    return rows.map((row) => this.rebuilt(row, issued.map((coupon) => coupon.token))).at(0);
  }

  private rebuilt(row: typeof discounts.$inferSelect, issued: string[]): Discount {
    return this.factory.reconstitute({ ...withNoHookWhenNoneIsKept({ ...row, rate: String(row.rate) }), coupons: issued });
  }
}
