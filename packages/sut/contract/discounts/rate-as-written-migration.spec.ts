import { describe, expect, it } from 'vitest';

import { spicesDiscount } from '@sut/support/example-discounts';

import { discountRepositoryOn } from '../support/discount-repository';
import { constraintsAndColumnsOfTheDiscountsTable } from '../support/discounts-table';
import { setupSut } from '../support/migrations';

const aRateWrittenWithAComma = { ...spicesDiscount, rate: '12,5' };

describe('the migration that keeps the rate as written', () => {
  it('should migrate forward from empty, the rate column holding text and a rate written as 12,5 kept and loaded back', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();

    await migrateForward();

    const { columns } = await constraintsAndColumnsOfTheDiscountsTable(client);
    expect(columns.find((column) => column.name === 'rate')).to.deep.equal({ name: 'rate', type: 'text', nullable: 'NO' });
    const { keep, loadOnItsOwnConnection } = discountRepositoryOn(client, databaseUrl);
    await keep(aRateWrittenWithAComma);
    const [loaded] = await loadOnItsOwnConnection();
    expect(loaded?.toJSON()).to.deep.include(aRateWrittenWithAComma);
  });
});
