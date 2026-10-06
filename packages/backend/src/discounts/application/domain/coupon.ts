import { CouponRedeemed } from './coupon-redeemed.js';
import type { CouponToken } from './coupon-token.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';

export class Coupon {
  private counted = false;

  constructor(
    private readonly token: CouponToken,
    private redeemed: boolean,
    private readonly events: DomainEventPublisher,
  ) {}

  redeem(discountId: string): void {
    this.redeemed = true;
    this.events.publish(new CouponRedeemed(discountId, this.token.toJSON()));
  }

  countInto(salesSoFar: number): number {
    if (!this.isASaleSinceTheLastCount()) {
      return salesSoFar;
    }
    this.counted = true;
    return salesSoFar + 1;
  }

  private isASaleSinceTheLastCount(): boolean {
    return this.redeemed && !this.counted;
  }

  isIdentifiedBy(token: CouponToken): boolean {
    return this.token.toJSON() === token.toJSON();
  }

  toJSON(): { token: string; redeemed: boolean } {
    return { token: this.token.toJSON(), redeemed: this.redeemed };
  }
}
