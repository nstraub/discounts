import { Coupon } from './coupon.js';
import { CouponIssued } from './coupon-issued.js';
import type { CouponToken } from './coupon-token.js';
import { DiscountedSalesCounted } from './discounted-sales-counted.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';

export class Coupons {
  constructor(
    private coupons: Coupon[],
    private readonly events: DomainEventPublisher,
  ) {}

  issue(token: CouponToken, discountId: string): void {
    this.coupons = [...this.coupons, new Coupon(token, false, false, this.events)];
    this.events.publish(new CouponIssued(discountId, token.toJSON()));
  }

  redeem(token: CouponToken, discountId: string): void {
    this.coupons.filter((coupon) => coupon.isIdentifiedBy(token)).forEach((coupon) => coupon.redeem(discountId));
  }

  countSinceTheLastCount(discountId: string): number {
    const discountedSales = this.coupons.reduce((sales, coupon) => coupon.countInto(sales), 0);
    this.events.publish(new DiscountedSalesCounted(discountId, discountedSales));
    return discountedSales;
  }

  toJSON(): ReturnType<Coupon['toJSON']>[] {
    return this.coupons.map((coupon) => coupon.toJSON());
  }
}
