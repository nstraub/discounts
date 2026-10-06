import type pg from 'pg';
import { describe, expect, it } from 'vitest';

import { spicesDiscount } from '@sut/support/example-discounts';

import { discountRepositoryOn } from '../support/discount-repository';
import { aDiscountKeptBefore, aDiscountKeptBeforeAsReadAfterMigratingForward, constraintsAndColumnsOfTheDiscountsTable } from '../support/discounts-table';
import { migrateBackward, migrateBackwardPast, setupSut } from '../support/migrations';

const theMigration = '0003_rate_as_written';

const theMigrationsAfterIt = ['0004_add_discount_hook', '0005_create_coupons'];

const migrateBackwardPastIt = (client: pg.Client): Promise<void> => migrateBackwardPast(client, theMigration, theMigrationsAfterIt);

const setupSutMigratedForward = async () => {
  const sut = await setupSut();
  await sut.migrateForward();
  return sut;
};

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
    const { client, databaseUrl, migrateForward } = await setupSutMigratedForward();
    const { keep, loadOnItsOwnConnection } = discountRepositoryOn(client, databaseUrl);
    await keep(spicesDiscount);

    await migrateBackwardPastIt(client);

    const backward = await client.query('SELECT rate FROM app.discounts');
    expect(backward.rows, 'the rate, backward').to.deep.equal([{ rate: 20 }]);

    await migrateForward();

    const [loaded] = await loadOnItsOwnConnection();
    expect(loaded?.toJSON(), 'the discount, forward again').to.deep.include(spicesDiscount);
  });
  it('should refuse to run backward while a rate is not a number: lossy, a rate such as 12,5 cannot go back', async () => {
    const { client, databaseUrl } = await setupSutMigratedForward();
    await discountRepositoryOn(client, databaseUrl).keep(aRateWrittenWithAComma);

    const refusal = await migrateBackward(client, theMigration).then(
      () => 'went back',
      (error: { code: string }) => error.code,
    );

    expect(refusal, 'invalid text representation of a number').to.equal('22P02');
  });
  it('should read back as text, through the repository, the rate of a discount kept before the migration', async () => {
    const sut = await setupSutMigratedForward();
    await migrateBackwardPastIt(sut.client);

    const readBack = await aDiscountKeptBeforeAsReadAfterMigratingForward(sut);

    expect(readBack).to.deep.equal({ ...aDiscountKeptBefore, coupons: [] });
  });
  it('should keep and load back a rate that is a number on the schema before the migration, as on the one after it', async () => {
    const { client, databaseUrl } = await setupSutMigratedForward();
    await migrateBackward(client, theMigration);
    const { keep, loadOnItsOwnConnection } = discountRepositoryOn(client, databaseUrl);
    await keep(spicesDiscount);

    const [loaded] = await loadOnItsOwnConnection();

    expect(loaded?.toJSON()).to.deep.include(spicesDiscount);
  });
});
