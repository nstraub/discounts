import type { CouponToken } from './domain/coupon-token.js';
import type { Discount } from './domain/discount.js';
import type { DiscountRepository } from './domain/discount-repository.js';
import { NoCouponHasTheCodeException } from './domain/no-coupon-has-the-code-exception.js';
import { NoSuchDiscountException } from './domain/no-such-discount-exception.js';
import type { Store } from './domain/store.js';

type Change<Answer> = (discount: Discount) => Answer;

type Lookup = (repository: DiscountRepository) => Promise<Discount | undefined>;

type FoundOrRefused = (repository: DiscountRepository) => Promise<Discount>;

const found = (find: Lookup, Refusal: new () => Error): FoundOrRefused => async (repository) => {
  const discount = await find(repository);
  if (!discount) {
    throw new Refusal();
  }
  return discount;
};

export const theOneWithId = (id: string): FoundOrRefused => found((repository) => repository.withId(id), NoSuchDiscountException);

const theOneThatIssued = (token: CouponToken): FoundOrRefused => found((repository) => repository.withCouponToken(token), NoCouponHasTheCodeException);

export class DiscountChanges {
  constructor(private readonly repository: DiscountRepository) {}

  async toTheOneWithId<Answer>(id: string, change: Change<Answer>): Promise<Answer> {
    return this.toTheOneFound(theOneWithId(id), change);
  }

  async toTheOneThatIssued<Answer>(token: CouponToken, change: Change<Answer>): Promise<Answer> {
    return this.toTheOneFound(theOneThatIssued(token), change);
  }

  async toEachOfTheStore<Answer>(store: Store, change: Change<Answer>): Promise<Answer[]> {
    const [discount] = await this.repository.ofStore(store);
    return [await this.toTheOneFound((repository) => repository.withId(discount!.toJSON().id), change)];
  }

  async keptAfter<Answer>(discount: Discount, change: Change<Answer>): Promise<Answer> {
    return this.keptThrough(this.repository, discount, change);
  }

  private toTheOneFound<Answer>(lookup: Lookup, change: Change<Answer>): Promise<Answer> {
    return this.repository.changing(async (repository) => this.keptThrough(repository, (await lookup(repository))!, change));
  }

  private async keptThrough<Answer>(repository: DiscountRepository, discount: Discount, change: Change<Answer>): Promise<Answer> {
    const answer = change(discount);
    await repository.save(discount);
    return answer;
  }
}
