import { describe, expect, it } from 'vitest';

import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import { spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/discount-repository';

describe('a discount kept in PostgreSQL', () => {
  it('should save a discount and load it back equal, in a separate transaction, its events excepted (not persisted)', async () => {
    const { factory, repository, repositoryOnItsOwnConnection } = await setupSut();
    const discount = factory.create(new DiscountDetails(spicesDiscount));
    await repository.save(discount);

    const [loaded] = await (await repositoryOnItsOwnConnection()).all();

    expect(loaded?.toJSON()).to.deep.equal(discount.toJSON());
  });
  it.todo('should keep an item, store name and store address with quotes, semicolons and SQL keywords verbatim');
  it.todo('should keep an item, store name and store address with accents, apostrophes and emoji verbatim');
});
