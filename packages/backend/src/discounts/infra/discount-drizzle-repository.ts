import { and, eq } from 'drizzle-orm';

import type { CouponToken } from '../application/domain/coupon-token.js';
import type { Discount } from '../application/domain/discount.js';
import type { DiscountFactory } from '../application/domain/discount-factory.js';
import type { DiscountRepository } from '../application/domain/discount-repository.js';
import type { Store } from '../application/domain/store.js';

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
    return this.rebuiltWithTheirCoupons(await this.keptDiscounts());
  }

  async withId(id: string): Promise<Discount | undefined> {
    const rows = await this.keptDiscounts().where(eq(discounts.id, id));
    const issued = await couponsIssuedBy(this.database, id);
    return rows.map((row) => this.rebuilt(row, issued)).at(0);
  }

  async withCouponToken(token: CouponToken): Promise<Discount | undefined> {
    const [owner] = await idsOfTheDiscountsThatIssued(this.database, token.toJSON());
    return owner === undefined ? undefined : this.withId(owner);
  }

  async ofStore(store: Store): Promise<Discount[]> {
    const { storeName, storeAddress } = store.toJSON();
    const atTheStore = and(eq(discounts.storeName, storeName), eq(discounts.storeAddress, storeAddress));
    return this.rebuiltWithTheirCoupons(await this.keptDiscounts().where(atTheStore).orderBy(discounts.id));
  }

  private keptDiscounts() {
    return this.database.select(theColumnsOfADiscount).from(discounts);
  }

  private async rebuiltWithTheirCoupons(rows: (typeof discounts.$inferSelect)[]): Promise<Discount[]> {
    const issued = await couponsIssuedByEachDiscount(this.database, rows.map((row) => row.id));
    return rows.map((row) => this.rebuilt(row, issued.get(row.id) ?? []));
  }

  private rebuilt(row: typeof discounts.$inferSelect, issued: ReturnType<Discount['toJSON']>['coupons']): Discount {
    return this.factory.reconstitute({ ...withNoHookWhenNoneIsKept({ ...row, rate: String(row.rate) }), coupons: issued });
  }
}
