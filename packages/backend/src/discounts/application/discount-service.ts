import { DiscountChanges } from './discount-changes.js';
import type { CountedSales } from './domain/counted-sales.js';
import { CouponToken } from './domain/coupon-token.js';
import type { Discount } from './domain/discount.js';
import type { DiscountDetails } from './domain/discount-details.js';
import type { DiscountFactory } from './domain/discount-factory.js';
import type { DiscountRepository } from './domain/discount-repository.js';
import type { IssuedCoupon } from './domain/issued-coupon.js';
import type { RandomSource } from './domain/random-source.js';
import type { RedeemedCoupon } from './domain/redeemed-coupon.js';

export class DiscountService {
  private readonly changes: DiscountChanges;

  constructor(
    private readonly factory: DiscountFactory,
    private readonly repository: DiscountRepository,
    private readonly random: RandomSource,
  ) {
    this.changes = new DiscountChanges(repository);
  }

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
    await this.changes.keptAfter(discount, (found) => found.changeRate(rate));
  }

  async issueCoupon(id: string): Promise<IssuedCoupon> {
    return this.changes.toTheOneWithId(id, (found) => found.issueCoupon(CouponToken.drawnFrom(this.random)));
  }

  async redeemCoupon(code: string): Promise<RedeemedCoupon> {
    const token = CouponToken.read(code);
    return this.changes.toTheOneThatIssued(token, (found) => found.redeemCoupon(token));
  }

  async count(store: Parameters<DiscountRepository['ofStore']>[0]): Promise<CountedSales[]> {
    return this.changes.toEachOfTheStore(store, (found) => found.count());
  }

  async published(): Promise<Discount[]> {
    return this.repository.all();
  }
}
