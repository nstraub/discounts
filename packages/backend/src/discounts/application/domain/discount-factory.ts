import { v4 } from 'uuid';

import { Coupon } from './coupon.js';
import { CouponToken } from './coupon-token.js';
import { Coupons } from './coupons.js';
import { Discount } from './discount.js';
import { DiscountDetails } from './discount-details.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';

export class DiscountFactory {
  constructor(private readonly events: DomainEventPublisher) {}

  create(details: DiscountDetails): Discount {
    return new Discount(v4(), details, new Coupons([], this.events), this.events);
  }

  reconstitute({ id, coupons, ...details }: ReturnType<Discount['toJSON']>): Discount {
    return new Discount(
      id,
      new DiscountDetails(details),
      new Coupons(coupons.map(({ token, redeemed, counted }) => new Coupon(CouponToken.keptAs(token), redeemed, counted, this.events)), this.events),
      this.events,
    );
  }
}
