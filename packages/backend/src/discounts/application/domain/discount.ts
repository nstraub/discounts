import { Coupon } from './coupon.js';
import { CountedSales } from './counted-sales.js';
import { CouponIssued } from './coupon-issued.js';
import type { CouponToken } from './coupon-token.js';
import type { DiscountDetails } from './discount-details.js';
import { DiscountedSalesCounted } from './discounted-sales-counted.js';
import { DiscountPublicationRejected } from './discount-publication-rejected.js';
import { DiscountPublished } from './discount-published.js';
import { DiscountRate } from './discount-rate.js';
import { DiscountRateChanged } from './discount-rate-changed.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';
import { IssuedCoupon } from './issued-coupon.js';
import { RedeemedCoupon } from './redeemed-coupon.js';

export class Discount {
  constructor(
    private readonly id: string,
    private details: DiscountDetails,
    private coupons: Coupon[],
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
    this.coupons = [...this.coupons, new Coupon(token, false, false, this.events)];
    this.events.publish(new CouponIssued(this.id, token.toJSON()));
    return new IssuedCoupon(token, this.details.toJSON().storeName);
  }

  redeemCoupon(token: CouponToken): RedeemedCoupon {
    this.coupons.filter((coupon) => coupon.isIdentifiedBy(token)).forEach((coupon) => coupon.redeem(this.id));
    return new RedeemedCoupon(this.details.toJSON().item);
  }

  count(): CountedSales {
    const discountedSales = this.coupons.reduce((sales, coupon) => coupon.countInto(sales), 0);
    this.events.publish(new DiscountedSalesCounted(this.id, discountedSales));
    return new CountedSales(this.id, this.details, discountedSales);
  }

  toJSON(): { id: string; coupons: ReturnType<Coupon['toJSON']>[] } & ReturnType<DiscountDetails['toJSON']> {
    return { id: this.id, ...this.details.toJSON(), coupons: this.coupons.map((coupon) => coupon.toJSON()) };
  }
}
