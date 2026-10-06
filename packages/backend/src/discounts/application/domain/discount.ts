import { CountedSales } from './counted-sales.js';
import { CouponNotForThisStoreException } from './coupon-not-for-this-store-exception.js';
import type { CouponToken } from './coupon-token.js';
import type { Coupons } from './coupons.js';
import type { DiscountDetails } from './discount-details.js';
import type { DiscountEvents } from './discount-events.js';
import { DiscountRate } from './discount-rate.js';
import { IssuedCoupon } from './issued-coupon.js';
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
    const publishAtAValidRate = () => new DiscountRate(this.details.toJSON().rate).whenValid(async () => {
      await keep(this);
      this.events.published(this.toJSON());
    }, (rate) => this.events.publicationRejected(rate, 'not valid', ['rate']));
    await this.details.whenComplete(publishAtAValidRate, (rate, missing) => this.events.publicationRejected(rate, 'missing', missing));
  }

  changeRate(rate: string): void {
    this.details = this.details.withRate(rate);
    this.events.rateChanged(this.id, rate);
  }

  issueCoupon(token: CouponToken): IssuedCoupon {
    this.coupons.issue(token);
    this.events.couponIssued(this.id, token.toJSON());
    return new IssuedCoupon(token, this.details.toJSON().storeName);
  }

  redeemCoupon(token: CouponToken, store: Store): RedeemedCoupon {
    if (!store.equals(this.details.store())) {
      this.events.redemptionRejected(this.id, token.toJSON(), 'not for this store');
      throw new CouponNotForThisStoreException();
    }
    this.coupons.redeem(token, this.id);
    return new RedeemedCoupon(this.details.toJSON().item);
  }

  count(): CountedSales {
    const discountedSales = this.coupons.countSinceTheLastCount();
    this.events.salesCounted(this.id, discountedSales);
    return new CountedSales(this.id, this.details, discountedSales);
  }

  toJSON(): { id: string; coupons: ReturnType<Coupons['toJSON']> } & ReturnType<DiscountDetails['toJSON']> {
    return { id: this.id, ...this.details.toJSON(), coupons: this.coupons.toJSON() };
  }
}
