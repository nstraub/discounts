import type { CouponToken } from './domain/coupon-token.js';
import type { Discount } from './domain/discount.js';
import type { DiscountRepository } from './domain/discount-repository.js';
import type { Store } from './domain/store.js';

type Change<Answer> = (discount: Discount) => Answer;

export class DiscountChanges {
  constructor(private readonly repository: DiscountRepository) {}

  async toTheOneWithId<Answer>(id: string, change: Change<Answer>): Promise<Answer> {
    return this.repository.changing(async (repository) => this.keptThrough(repository, (await repository.withId(id))!, change));
  }

  async toTheOneThatIssued<Answer>(token: CouponToken, change: Change<Answer>): Promise<Answer> {
    return this.repository.changing(async (repository) => this.keptThrough(repository, (await repository.withCouponToken(token))!, change));
  }

  async toEachOfTheStore<Answer>(store: Store, change: Change<Answer>): Promise<Answer[]> {
    const [discount] = await this.repository.ofStore(store);
    return [await this.repository.changing(async (repository) => this.keptThrough(repository, (await repository.withId(discount!.toJSON().id))!, change))];
  }

  async keptAfter<Answer>(discount: Discount, change: Change<Answer>): Promise<Answer> {
    return this.keptThrough(this.repository, discount, change);
  }

  private async keptThrough<Answer>(repository: DiscountRepository, discount: Discount, change: Change<Answer>): Promise<Answer> {
    const answer = change(discount);
    await repository.save(discount);
    return answer;
  }
}
