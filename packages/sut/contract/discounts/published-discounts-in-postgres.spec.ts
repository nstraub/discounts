import { describe, expect, it } from 'vitest';

import { InMemoryDiscountRepository } from '@backend/app/mocks/in-memory-discount-repository';
import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import { produceDiscount, spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/discount-repository';

describe('the published discounts read from PostgreSQL', () => {
  it('should list no discount when none is kept', async () => {
    const { repository } = await setupSut();

    const kept = await repository.all();

    expect(kept).to.deep.equal([]);
  });
  it('should list every kept discount, as the in-memory repository does', async () => {
    const { factory, repository } = await setupSut();
    const inMemory = new InMemoryDiscountRepository();
    for (const details of [spicesDiscount, produceDiscount]) {
      const discount = factory.create(new DiscountDetails(details));
      await repository.save(discount);
      await inMemory.save(discount);
    }

    const kept = await repository.all();

    const keptInMemory = await inMemory.all();
    expect(kept.map((discount) => discount.toJSON())).to.have.deep.members(keptInMemory.map((discount) => discount.toJSON()));
  });
});
