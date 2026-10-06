import { CouponToken } from './domain/coupon-token.js';
import type { Discount } from './domain/discount.js';
import type { DiscountDetails } from './domain/discount-details.js';
import type { DiscountFactory } from './domain/discount-factory.js';
import type { DiscountRepository } from './domain/discount-repository.js';
import type { RandomSource } from './domain/random-source.js';

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
    discount.changeRate(rate);
    await this.repository.save(discount);
  }

  async issueCoupon(id: string): Promise<{ token: string; storeName: string }> {
    const discount = (await this.repository.withId(id))!;
    const token = CouponToken.drawnFrom(this.random);
    discount.issueCoupon(token);
    await this.repository.save(discount);
    return { token: token.toJSON(), storeName: discount.toJSON().storeName };
  }

  async published(): Promise<Discount[]> {
    return this.repository.all();
  }
}
