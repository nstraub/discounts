import { describe, expect, it } from 'vitest';

import { produceDiscount, spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/discount-repository';

describe('a discount found by its id in PostgreSQL', () => {
  it('should find the kept discount with that id among several', async () => {
    const { keep, repository } = await setupSut();
    await keep(spicesDiscount);
    const produce = await keep(produceDiscount);

    const found = await repository.withId(produce.toJSON().id);

    expect(found?.toJSON()).to.deep.equal(produce.toJSON());
  });
  it('should find nothing for an id no kept discount has', async () => {
    const { keep, repository } = await setupSut();
    await keep(spicesDiscount);

    const found = await repository.withId('an-id-no-discount-has');

    expect(found).to.equal(undefined);
  });
});
