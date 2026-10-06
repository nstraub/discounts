import { eq } from 'drizzle-orm';

import type { Coupon } from '../application/domain/coupon.js';

import type { Database } from './database.module.js';
import { coupons } from './schema.js';

type KeptCoupon = ReturnType<Coupon['toJSON']>;

const theColumnsOfACoupon = { token: coupons.token, redeemed: coupons.redeemed };

export const couponsIssuedBy = (database: Database, discountId: string): Promise<KeptCoupon[]> =>
  database.select(theColumnsOfACoupon).from(coupons).where(eq(coupons.discountId, discountId)).orderBy(coupons.id);

export const couponsIssuedByEachDiscount = async (database: Database): Promise<Map<string, KeptCoupon[]>> => {
  const rows = await database.select({ ...theColumnsOfACoupon, discountId: coupons.discountId }).from(coupons).orderBy(coupons.id);
  const byDiscount = Map.groupBy(rows, (row) => row.discountId);
  return new Map(byDiscount.entries().map(([discountId, issued]) => [discountId, issued.map(({ token, redeemed }) => ({ token, redeemed }))]));
};

export const idsOfTheDiscountsThatIssued = async (database: Database, token: string): Promise<string[]> => {
  const rows = await database.select({ discountId: coupons.discountId }).from(coupons).where(eq(coupons.token, token));
  return rows.map((row) => row.discountId);
};

export const keepTheNewlyIssued = async (database: Database, discountId: string, issued: KeptCoupon[]): Promise<void> => {
  const kept = (await couponsIssuedBy(database, discountId)).map(({ token }) => token);
  const newlyIssued = issued.filter(({ token }) => !kept.includes(token));
  if (newlyIssued.length > 0) {
    await database.insert(coupons).values(newlyIssued.map((coupon) => ({ ...coupon, discountId })));
  }
};
