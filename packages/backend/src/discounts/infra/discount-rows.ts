import type { Discount } from '../application/domain/discount.js';
import type { DiscountFactory } from '../application/domain/discount-factory.js';

import { discounts } from './schema.js';

export const theColumnsOfADiscount = {
  id: discounts.id,
  item: discounts.item,
  rate: discounts.rate,
  storeName: discounts.storeName,
  storeAddress: discounts.storeAddress,
  hook: discounts.hook,
};

const withNoHookWhenNoneIsKept = <Row extends { hook: string | null }>({ hook, ...row }: Row) => (hook === null ? row : { ...row, hook });

export const rebuiltFrom = (factory: DiscountFactory, row: typeof discounts.$inferSelect, issued: ReturnType<Discount['toJSON']>['coupons']): Discount =>
  factory.reconstitute({ ...withNoHookWhenNoneIsKept({ ...row, rate: String(row.rate) }), coupons: issued });
