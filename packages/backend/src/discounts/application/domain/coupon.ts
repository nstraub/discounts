import { CouponRedeemed } from './coupon-redeemed.js';
import type { CouponToken } from './coupon-token.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';

export class Coupon {
  constructor(
    private readonly token: CouponToken,
    private redeemed: boolean,
    private readonly events: DomainEventPublisher,
  ) {}

  redeem(discountId: string): void {
    this.events.publish(new CouponRedeemed(discountId, this.token.toJSON()));
  }

  toJSON(): { token: string; redeemed: boolean } {
    return { token: this.token.toJSON(), redeemed: true };
  }
}
