import type { CouponToken } from './coupon-token.js';
import type { Discount } from './discount.js';
import type { Store } from './store.js';

export interface DiscountRepository {
  save(discount: Discount): Promise<void>;
  all(): Promise<Discount[]>;
  withId(id: string): Promise<Discount | undefined>;
  withCouponToken(token: CouponToken): Promise<Discount | undefined>;
  ofStore(store: Store): Promise<Discount[]>;
  changing<Answer>(work: (repository: DiscountRepository) => Promise<Answer>): Promise<Answer>;
}
