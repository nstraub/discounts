import { Coupon } from './coupon.js';
import type { CouponToken } from './coupon-token.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';

export class Coupons {
  constructor(
    private coupons: Coupon[],
    private readonly events: DomainEventPublisher,
  ) {}

  issue(token: CouponToken): void {
    this.coupons = [...this.coupons, new Coupon(token, false, false, this.events)];
  }

  redeem(token: CouponToken, discountId: string): void {
    this.coupons.filter((coupon) => coupon.isIdentifiedBy(token)).forEach((coupon) => coupon.redeem(discountId));
  }

  countSinceTheLastCount(): number {
    return this.coupons.reduce((sales, coupon) => coupon.countInto(sales), 0);
  }

  toJSON(): ReturnType<Coupon['toJSON']>[] {
    return this.coupons.map((coupon) => coupon.toJSON());
  }
}
