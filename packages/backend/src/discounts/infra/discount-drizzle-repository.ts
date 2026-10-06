import { eq } from 'drizzle-orm';

import type { CouponToken } from '../application/domain/coupon-token.js';
import type { Discount } from '../application/domain/discount.js';
import type { DiscountFactory } from '../application/domain/discount-factory.js';
import type { DiscountRepository } from '../application/domain/discount-repository.js';

import { couponsIssuedBy, couponsIssuedByEachDiscount, idsOfTheDiscountsThatIssued, keepTheCouponsIssued } from './coupon-rows.js';
import type { Database } from './database.module.js';
import { theColumnsOfADiscount, withNoHookWhenNoneIsKept } from './discount-rows.js';
import { discounts } from './schema.js';

export class DiscountDrizzleRepository implements DiscountRepository {
  constructor(
    private readonly database: Database,
    private readonly factory: DiscountFactory,
  ) {}

  async save(discount: Discount): Promise<void> {
    const { coupons, ...state } = discount.toJSON();
    await this.database.insert(discounts).values(state).onConflictDoUpdate({ target: discounts.id, set: state });
    await keepTheCouponsIssued(this.database, state.id, coupons);
  }

  async all(): Promise<Discount[]> {
    const rows = await this.database.select(theColumnsOfADiscount).from(discounts);
    const issued = await couponsIssuedByEachDiscount(this.database);
    return rows.map((row) => this.rebuilt(row, issued.get(row.id) ?? []));
  }

  async withId(id: string): Promise<Discount | undefined> {
    const rows = await this.database.select(theColumnsOfADiscount).from(discounts).where(eq(discounts.id, id));
    const issued = await couponsIssuedBy(this.database, id);
    return rows.map((row) => this.rebuilt(row, issued)).at(0);
  }

  async withCouponToken(token: CouponToken): Promise<Discount | undefined> {
    const [owner] = await idsOfTheDiscountsThatIssued(this.database, token.toJSON());
    return owner === undefined ? undefined : this.withId(owner);
  }

  async ofStore({ storeName }: Parameters<DiscountRepository['ofStore']>[0]): Promise<Discount[]> {
    const rows = await this.database.select(theColumnsOfADiscount).from(discounts).where(eq(discounts.storeName, storeName));
    return rows.map((row) => this.rebuilt(row, []));
  }

  private rebuilt(row: typeof discounts.$inferSelect, issued: ReturnType<Discount['toJSON']>['coupons']): Discount {
    return this.factory.reconstitute({ ...withNoHookWhenNoneIsKept({ ...row, rate: String(row.rate) }), coupons: issued });
  }
}
