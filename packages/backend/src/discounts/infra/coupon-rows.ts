import { eq } from 'drizzle-orm';

import type { Database } from './database.module.js';
import { coupons } from './schema.js';

export const tokensIssuedBy = async (database: Database, discountId: string): Promise<string[]> => {
  const rows = await database.select({ token: coupons.token }).from(coupons).where(eq(coupons.discountId, discountId)).orderBy(coupons.id);
  return rows.map((row) => row.token);
};

export const tokensIssuedByEachDiscount = async (database: Database): Promise<Map<string, string[]>> => {
  const rows = await database.select({ token: coupons.token, discountId: coupons.discountId }).from(coupons).orderBy(coupons.id);
  const byDiscount = Map.groupBy(rows, (row) => row.discountId);
  return new Map(byDiscount.entries().map(([discountId, issued]) => [discountId, issued.map((row) => row.token)]));
};

export const keepTheNewlyIssued = async (database: Database, discountId: string, tokens: string[]): Promise<void> => {
  const kept = await tokensIssuedBy(database, discountId);
  const newlyIssued = tokens.filter((token) => !kept.includes(token));
  if (newlyIssued.length > 0) {
    await database.insert(coupons).values(newlyIssued.map((token) => ({ token, discountId })));
  }
};
