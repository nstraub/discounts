import type { CountedSales } from './counted-sales.js';
import { CouponNotForThisStoreException } from './coupon-not-for-this-store-exception.js';
import type { CouponToken } from './coupon-token.js';
import type { Coupons } from './coupons.js';
import type { DiscountDetails } from './discount-details.js';
import type { DiscountEvents } from './discount-events.js';
import { DiscountRate } from './discount-rate.js';
import type { IssuedCoupon } from './issued-coupon.js';
import { RedeemedCoupon } from './redeemed-coupon.js';
import type { Store } from './store.js';

export class Discount {
  constructor(
    private readonly id: string,
    private details: DiscountDetails,
    private readonly coupons: Coupons,
    private readonly events: DiscountEvents,
  ) {}

  async publish(keep: (discount: Discount) => Promise<void>): Promise<void> {
    await new DiscountRate(this.details.toJSON().rate).whenValid(async () => {
      await keep(this);
      this.events.published(this.toJSON());
    }, (rate) => this.events.publicationRejected(rate, 'not valid'));
  }

  changeRate(rate: string): void {
    this.details = this.details.withRate(rate);
    this.events.rateChanged(this.id, rate);
  }

  issueCoupon(token: CouponToken): IssuedCoupon {
    const issued = this.coupons.issue(token, this.details);
    this.events.couponIssued(this.id, token.toJSON());
    return issued;
  }

  redeemCoupon(token: CouponToken, store: Store): RedeemedCoupon {
    if (store.toJSON().storeName !== this.details.toJSON().storeName) {
      this.events.redemptionRejected(this.id, token.toJSON(), 'not for this store');
      throw new CouponNotForThisStoreException();
    }
    this.coupons.redeem(token, this.id);
    return new RedeemedCoupon(this.details.toJSON().item);
  }

  count(): CountedSales {
    const counted = this.coupons.countSinceTheLastCount(this.id, this.details);
    this.events.salesCounted(this.id, counted.toJSON().discountedSales);
    return counted;
  }

  toJSON(): { id: string; coupons: ReturnType<Coupons['toJSON']> } & ReturnType<DiscountDetails['toJSON']> {
    return { id: this.id, ...this.details.toJSON(), coupons: this.coupons.toJSON() };
  }
}
