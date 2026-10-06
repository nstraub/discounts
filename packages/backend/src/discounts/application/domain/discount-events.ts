import { CouponIssued } from './coupon-issued.js';
import { CouponRedemptionRejected } from './coupon-redemption-rejected.js';
import type { Discount } from './discount.js';
import { DiscountedSalesCounted } from './discounted-sales-counted.js';
import { DiscountPublicationRejected } from './discount-publication-rejected.js';
import { DiscountPublished } from './discount-published.js';
import { DiscountRateChanged } from './discount-rate-changed.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';

export class DiscountEvents {
  constructor(private readonly events: DomainEventPublisher) {}

  published(discount: ReturnType<Discount['toJSON']>): void {
    this.events.publish(new DiscountPublished(discount));
  }

  publicationRejected(rate: string, reason: string, pieces: readonly string[]): void {
    this.events.publish(new DiscountPublicationRejected(rate, reason, pieces));
  }

  rateChanged(discountId: string, rate: string): void {
    this.events.publish(new DiscountRateChanged(discountId, rate));
  }

  couponIssued(discountId: string, token: string): void {
    this.events.publish(new CouponIssued(discountId, token));
  }

  salesCounted(discountId: string, discountedSales: number): void {
    this.events.publish(new DiscountedSalesCounted(discountId, discountedSales));
  }

  redemptionRejected(discountId: string, token: string, reason: string): void {
    this.events.publish(new CouponRedemptionRejected(discountId, token, reason));
  }
}
