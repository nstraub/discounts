import { CouponToken } from './domain/coupon-token.js';
import type { Discount } from './domain/discount.js';
import type { DiscountDetails } from './domain/discount-details.js';
import type { DiscountFactory } from './domain/discount-factory.js';
import type { DiscountRepository } from './domain/discount-repository.js';
import type { IssuedCoupon } from './domain/issued-coupon.js';
import type { RandomSource } from './domain/random-source.js';
import type { RedeemedCoupon } from './domain/redeemed-coupon.js';

export class DiscountService {
  constructor(
    private readonly factory: DiscountFactory,
    private readonly repository: DiscountRepository,
    private readonly random: RandomSource,
  ) {}

  async publish(details: DiscountDetails): Promise<Discount> {
    const discount = this.factory.create(details);
    await this.repository.save(discount);
    discount.publish();
    return discount;
  }

  async changeRate(id: string, rate: string): Promise<void> {
    const discount = await this.repository.withId(id);
    if (!discount) {
      return;
    }
    await this.keptAfter(discount, (found) => found.changeRate(rate));
  }

  async issueCoupon(id: string): Promise<IssuedCoupon> {
    const discount = (await this.repository.withId(id))!;
    return this.keptAfter(discount, (found) => found.issueCoupon(CouponToken.drawnFrom(this.random)));
  }

  async redeemCoupon(code: string): Promise<RedeemedCoupon> {
    const token = CouponToken.read(code);
    const discount = (await this.repository.withCouponToken(token))!;
    return this.keptAfter(discount, (found) => found.redeemCoupon(token));
  }

  async published(): Promise<Discount[]> {
    return this.repository.all();
  }

  private async keptAfter<Answer>(discount: Discount, change: (discount: Discount) => Answer): Promise<Answer> {
    const answer = change(discount);
    await this.repository.save(discount);
    return answer;
  }
}
