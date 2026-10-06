import { Coupon } from './coupon.js';
import { CountedSales } from './counted-sales.js';
import type { CouponToken } from './coupon-token.js';
import type { DiscountDetails } from './discount-details.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';
import { IssuedCoupon } from './issued-coupon.js';

export class Coupons {
  constructor(
    private coupons: Coupon[],
    private readonly events: DomainEventPublisher,
  ) {}

  issue(token: CouponToken, details: DiscountDetails): IssuedCoupon {
    this.coupons = [...this.coupons, new Coupon(token, false, false, this.events)];
    return new IssuedCoupon(token, details.toJSON().storeName);
  }

  redeem(token: CouponToken, discountId: string): void {
    this.coupons.filter((coupon) => coupon.isIdentifiedBy(token)).forEach((coupon) => coupon.redeem(discountId));
  }

  countSinceTheLastCount(discountId: string, details: DiscountDetails): CountedSales {
    const discountedSales = this.coupons.reduce((sales, coupon) => coupon.countInto(sales), 0);
    return new CountedSales(discountId, details, discountedSales);
  }

  toJSON(): ReturnType<Coupon['toJSON']>[] {
    return this.coupons.map((coupon) => coupon.toJSON());
  }
}
