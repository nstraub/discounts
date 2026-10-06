import type { CountedSales } from './counted-sales.js';
import { CouponIssued } from './coupon-issued.js';
import type { CouponToken } from './coupon-token.js';
import type { Coupons } from './coupons.js';
import type { DiscountDetails } from './discount-details.js';
import { DiscountedSalesCounted } from './discounted-sales-counted.js';
import { DiscountPublicationRejected } from './discount-publication-rejected.js';
import { DiscountPublished } from './discount-published.js';
import { DiscountRate } from './discount-rate.js';
import { DiscountRateChanged } from './discount-rate-changed.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';
import type { IssuedCoupon } from './issued-coupon.js';
import { RedeemedCoupon } from './redeemed-coupon.js';

export class Discount {
  constructor(
    private readonly id: string,
    private details: DiscountDetails,
    private readonly coupons: Coupons,
    private readonly events: DomainEventPublisher,
  ) {}

  async publish(keep: (discount: Discount) => Promise<void>): Promise<void> {
    await new DiscountRate(this.details.toJSON().rate).whenValid(async () => {
      await keep(this);
      this.events.publish(new DiscountPublished(this.toJSON()));
    }, (rate) => this.events.publish(new DiscountPublicationRejected(rate, 'not valid')));
  }

  changeRate(rate: string): void {
    this.details = this.details.withRate(rate);
    this.events.publish(new DiscountRateChanged(this.id, rate));
  }

  issueCoupon(token: CouponToken): IssuedCoupon {
    const issued = this.coupons.issue(token, this.details);
    this.events.publish(new CouponIssued(this.id, token.toJSON()));
    return issued;
  }

  redeemCoupon(token: CouponToken): RedeemedCoupon {
    this.coupons.redeem(token, this.id);
    return new RedeemedCoupon(this.details.toJSON().item);
  }

  count(): CountedSales {
    const counted = this.coupons.countSinceTheLastCount(this.id, this.details);
    this.events.publish(new DiscountedSalesCounted(this.id, counted.toJSON().discountedSales));
    return counted;
  }

  toJSON(): { id: string; coupons: ReturnType<Coupons['toJSON']> } & ReturnType<DiscountDetails['toJSON']> {
    return { id: this.id, ...this.details.toJSON(), coupons: this.coupons.toJSON() };
  }
}
