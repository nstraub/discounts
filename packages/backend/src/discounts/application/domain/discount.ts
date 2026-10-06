import { CountedSales } from './counted-sales.js';
import { CouponNotForThisStoreException } from './coupon-not-for-this-store-exception.js';
import { CouponRedemptionRejected } from './coupon-redemption-rejected.js';
import type { CouponToken } from './coupon-token.js';
import type { Coupons } from './coupons.js';
import type { DiscountDetails } from './discount-details.js';
import { DiscountPublicationRejected } from './discount-publication-rejected.js';
import { DiscountPublished } from './discount-published.js';
import { DiscountRateChanged } from './discount-rate-changed.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';
import { IssuedCoupon } from './issued-coupon.js';
import { RedeemedCoupon } from './redeemed-coupon.js';
import type { Store } from './store.js';

export class Discount {
  constructor(
    private readonly id: string,
    private details: DiscountDetails,
    private readonly coupons: Coupons,
    private readonly events: DomainEventPublisher,
  ) {}

  async publish(keep: (discount: Discount) => Promise<void>): Promise<void> {
    await this.details.whenPublishable(async () => {
      await keep(this);
      this.events.publish(new DiscountPublished(this.toJSON()));
    }, (rate, reason, pieces) => this.events.publish(new DiscountPublicationRejected(rate, reason, pieces)));
  }

  changeRate(rate: string): void {
    this.details = this.details.withRate(rate);
    this.events.publish(new DiscountRateChanged(this.id, rate));
  }

  issueCoupon(token: CouponToken): IssuedCoupon {
    this.coupons.issue(token, this.id);
    return new IssuedCoupon(token, this.details.toJSON().storeName);
  }

  redeemCoupon(token: CouponToken, store: Store): RedeemedCoupon {
    if (!store.equals(this.details.store())) {
      this.events.publish(new CouponRedemptionRejected(this.id, token.toJSON(), 'not for this store'));
      throw new CouponNotForThisStoreException();
    }
    this.coupons.redeem(token, this.id);
    return new RedeemedCoupon(this.details.toJSON().item);
  }

  count(): CountedSales {
    return new CountedSales(this.id, this.details, this.coupons.countSinceTheLastCount(this.id));
  }

  toJSON(): { id: string; coupons: ReturnType<Coupons['toJSON']> } & ReturnType<DiscountDetails['toJSON']> {
    return { id: this.id, ...this.details.toJSON(), coupons: this.coupons.toJSON() };
  }
}
