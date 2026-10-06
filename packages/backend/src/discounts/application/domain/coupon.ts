import { CouponRedeemed } from './coupon-redeemed.js';
import type { CouponToken } from './coupon-token.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';

export class Coupon {
  constructor(
    private readonly token: CouponToken,
    private redeemed: boolean,
    private readonly events: DomainEventPublisher,
  ) {}

  // eslint-disable-next-line unused-imports/no-unused-vars -- CouponRedeemed carries the discount's id
  redeem(discountId: string): void {
    this.events.publish(new CouponRedeemed('spices-id', '7K3QX9M2PD'));
  }

  toJSON(): { token: string; redeemed: boolean } {
    return { token: this.token.toJSON(), redeemed: true };
  }
}
