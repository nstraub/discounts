import { describe, expect, it } from 'vitest';

import { produceDiscount, spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/discount-repository';

const theSpicesStore = { storeName: spicesDiscount.storeName, storeAddress: spicesDiscount.storeAddress };

describe('the discounts of a store found in PostgreSQL', () => {
  it('should find the kept discounts whose store has that name and that address, leaving out another store\'s', async () => {
    const { keep, repository } = await setupSut();
    const spices = await keep(spicesDiscount);
    await keep(produceDiscount);

    const found = await repository.ofStore(theSpicesStore);

    expect(found.map((discount) => discount.toJSON())).to.deep.equal([spices.toJSON()]);
  });
  it('should leave out a discount of a store with the same name at another address', async () => {
    const { keep, repository } = await setupSut();
    const spices = await keep(spicesDiscount);
    await keep({ ...produceDiscount, storeName: spicesDiscount.storeName });

    const found = await repository.ofStore(theSpicesStore);

    expect(found.map((discount) => discount.toJSON())).to.deep.equal([spices.toJSON()]);
  });
  it.todo('should load each discount found with every one of its coupons');
  it.todo('should find nothing for a name and address no kept discount has');

  describe('A2 injection', () => {
    it.todo('should find nothing for a store name and address with quotes, semicolons and SQL keywords, every kept discount and coupon left as it was');
  });
});
