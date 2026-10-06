import { describe, expect, it } from 'vitest';

import { setupSut } from '../support/discount-repository';
import { constraintsAndColumnsOfTheDiscountsTable, insertADiscountWithout } from '../support/discounts-table';

describe('the discounts table refusing what Discount refuses', () => {
  it('should refuse a discount without an item: 23502, NOT NULL mirrors "a discount has an item"', async () => {
    const { client } = await setupSut();

    const outcome = await insertADiscountWithout(client, 'item');

    expect(outcome).to.equal('23502');
  });
  it('should refuse a discount without a rate: 23502, NOT NULL mirrors "a discount has a rate"', async () => {
    const { client } = await setupSut();

    const outcome = await insertADiscountWithout(client, 'rate');

    expect(outcome).to.equal('23502');
  });
  it('should refuse a discount without a store name: 23502, NOT NULL mirrors "a discount names its store"', async () => {
    const { client } = await setupSut();

    const outcome = await insertADiscountWithout(client, 'store_name');

    expect(outcome).to.equal('23502');
  });
  it('should refuse a discount without a store address: 23502, NOT NULL mirrors "a discount names its store\'s address"', async () => {
    const { client } = await setupSut();

    const outcome = await insertADiscountWithout(client, 'store_address');

    expect(outcome).to.equal('23502');
  });
  it('should trace every constraint to a rule of Discount: no length cap on text, no CHECK on the rate', async () => {
    const { client } = await setupSut();

    const { constraints, columns } = await constraintsAndColumnsOfTheDiscountsTable(client);

    expect(constraints, 'only the primary key, for the identity each discount has').to.deep.equal([{ kind: 'p' }]);
    expect(columns, 'unbounded text, the rate as written included, each NOT NULL').to.have.deep.members([
      { name: 'id', type: 'text', nullable: 'NO' },
      { name: 'item', type: 'text', nullable: 'NO' },
      { name: 'rate', type: 'text', nullable: 'NO' },
      { name: 'store_name', type: 'text', nullable: 'NO' },
      { name: 'store_address', type: 'text', nullable: 'NO' },
    ]);
  });
});
