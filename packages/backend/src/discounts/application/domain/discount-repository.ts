import type { CouponToken } from './coupon-token.js';
import type { Discount } from './discount.js';

export interface DiscountRepository {
  save(discount: Discount): Promise<void>;
  all(): Promise<Discount[]>;
  withId(id: string): Promise<Discount | undefined>;
  withCouponToken(token: CouponToken): Promise<Discount | undefined>;
  ofStore(store: { storeName: string; storeAddress: string }): Promise<Discount[]>;
}
