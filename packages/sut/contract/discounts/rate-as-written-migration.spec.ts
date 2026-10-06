import { describe, expect, it } from 'vitest';

import { spicesDiscount } from '@sut/support/example-discounts';

import { discountRepositoryOn } from '../support/discount-repository';
import { constraintsAndColumnsOfTheDiscountsTable } from '../support/discounts-table';
import { migrateBackward, setupSut } from '../support/migrations';

const theMigration = '0003_rate_as_written';

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
  it('should run backward to the rate kept as a number, a rate that is a number kept, and forward again, back as text', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();
    await migrateForward();
    const { keep, loadOnItsOwnConnection } = discountRepositoryOn(client, databaseUrl);
    await keep(spicesDiscount);

    await migrateBackward(client, theMigration);

    const backward = await client.query('SELECT rate FROM app.discounts');
    expect(backward.rows, 'the rate, backward').to.deep.equal([{ rate: 20 }]);

    await migrateForward();

    const [loaded] = await loadOnItsOwnConnection();
    expect(loaded?.toJSON(), 'the discount, forward again').to.deep.include(spicesDiscount);
  });
  it('should refuse to run backward while a rate is not a number: lossy, a rate such as 12,5 cannot go back', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();
    await migrateForward();
    await discountRepositoryOn(client, databaseUrl).keep(aRateWrittenWithAComma);

    const refusal = await migrateBackward(client, theMigration).then(
      () => 'went back',
      (error: { code: string }) => error.code,
    );

    expect(refusal, 'invalid text representation of a number').to.equal('22P02');
  });
  it('should read back as text, through the repository, the rate of a discount kept before the migration', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();
    await migrateForward();
    await migrateBackward(client, theMigration);
    await client.query("INSERT INTO app.discounts (id, item, rate, store_name, store_address) VALUES ('kept-before', 'Saffron', 12.5, 'Corner Grocery', '3 Hill Road')");

    await migrateForward();

    const [loaded] = await discountRepositoryOn(client, databaseUrl).loadOnItsOwnConnection();
    expect(loaded?.toJSON()).to.deep.equal({ id: 'kept-before', item: 'Saffron', rate: '12.5', storeName: 'Corner Grocery', storeAddress: '3 Hill Road' });
  });
});
