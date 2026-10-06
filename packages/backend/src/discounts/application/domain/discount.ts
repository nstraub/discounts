import { CouponIssued } from './coupon-issued.js';
import type { CouponToken } from './coupon-token.js';
import type { DiscountDetails } from './discount-details.js';
import { DiscountPublished } from './discount-published.js';
import { DiscountRateChanged } from './discount-rate-changed.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';

export class Discount {
  constructor(
    private readonly id: string,
    private details: DiscountDetails,
    private coupons: CouponToken[],
    private readonly events: DomainEventPublisher,
  ) {}

  publish(): void {
    this.events.publish(new DiscountPublished(this.toJSON()));
  }

  changeRate(rate: string): void {
    this.details = this.details.withRate(rate);
    this.events.publish(new DiscountRateChanged(this.id, rate));
  }

  issueCoupon(token: CouponToken): void {
    this.coupons = [...this.coupons, token];
    this.events.publish(new CouponIssued(this.id, token.toJSON()));
  }

  toJSON(): { id: string; coupons: string[] } & ReturnType<DiscountDetails['toJSON']> {
    return { id: this.id, ...this.details.toJSON(), coupons: this.coupons.map((coupon) => coupon.toJSON()) };
  }
}
