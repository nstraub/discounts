import { describe, expect, it } from 'vitest';

import { produceDiscount, spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/discount-repository';

const theSpicesStore = { storeName: spicesDiscount.storeName, storeAddress: spicesDiscount.storeAddress };

const theSpicesStoresDiscountsFoundBeside = async (another: typeof spicesDiscount) => {
  const { keep, repository } = await setupSut();
  const spices = await keep(spicesDiscount);
  await keep(another);
  const found = await repository.ofStore(theSpicesStore);
  return { found: found.map((discount) => discount.toJSON()), spices: spices.toJSON() };
};

describe('the discounts of a store found in PostgreSQL', () => {
  it('should find the kept discounts whose store has that name and that address, leaving out another store\'s', async () => {
    const { found, spices } = await theSpicesStoresDiscountsFoundBeside(produceDiscount);

    expect(found).to.deep.equal([spices]);
  });
  it('should leave out a discount of a store with the same name at another address', async () => {
    const { found, spices } = await theSpicesStoresDiscountsFoundBeside({ ...produceDiscount, storeName: spicesDiscount.storeName });

    expect(found).to.deep.equal([spices]);
  });
  it('should load each discount found with every one of its coupons', async () => {
    const { keepWithCouponsIssued, repository } = await setupSut();
    await keepWithCouponsIssued(spicesDiscount, ['7K3QX9M2PD', 'R4WZ0BH8NE']);

    const [found] = await repository.ofStore(theSpicesStore);

    expect(found?.toJSON().coupons.map(({ token }) => token)).to.deep.equal(['7K3QX9M2PD', 'R4WZ0BH8NE']);
  });
  it('should find nothing for a name and address no kept discount has', async () => {
    const { keep, repository } = await setupSut();
    await keep(spicesDiscount);

    const found = await repository.ofStore({ storeName: produceDiscount.storeName, storeAddress: produceDiscount.storeAddress });

    expect(found).to.deep.equal([]);
  });

  describe('A2 injection', () => {
    it.todo('should find nothing for a store name and address with quotes, semicolons and SQL keywords, every kept discount and coupon left as it was');
  });
});
