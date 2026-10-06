import type { CouponToken } from './domain/coupon-token.js';
import type { Discount } from './domain/discount.js';
import type { DiscountRepository } from './domain/discount-repository.js';
import type { Store } from './domain/store.js';

type Change<Answer> = (discount: Discount) => Answer;

export class DiscountChanges {
  constructor(private readonly repository: DiscountRepository) {}

  async toTheOneWithId<Answer>(id: string, change: Change<Answer>): Promise<Answer> {
    return this.keptAfter((await this.repository.withId(id))!, change);
  }

  async toTheOneThatIssued<Answer>(token: CouponToken, change: Change<Answer>): Promise<Answer> {
    return this.keptAfter((await this.repository.withCouponToken(token))!, change);
  }

  async toEachOfTheStore<Answer>(store: Store, change: Change<Answer>): Promise<Answer[]> {
    const [discount] = await this.repository.ofStore(store);
    return [await this.keptAfter(discount!, change)];
  }

  async keptAfter<Answer>(discount: Discount, change: Change<Answer>): Promise<Answer> {
    const answer = change(discount);
    await this.repository.save(discount);
    return answer;
  }
}
