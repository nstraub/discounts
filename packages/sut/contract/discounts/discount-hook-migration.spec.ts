import { describe, expect, it } from 'vitest';

import { spicesDiscount, spicesDiscountWithItsHook } from '@sut/support/example-discounts';

import { discountRepositoryOn } from '../support/discount-repository';
import { aDiscountKeptBefore, aDiscountKeptBeforeAsReadAfterMigratingForward, constraintsAndColumnsOfTheDiscountsTable } from '../support/discounts-table';
import { migrateBackward, setupSut } from '../support/migrations';

const theMigration = '0004_add_discount_hook';

describe('the migration that adds the hook to discounts', () => {
  it('should migrate forward from empty, a discount with a hook kept and loaded back', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();

    await migrateForward();

    const { keep, loadOnItsOwnConnection } = discountRepositoryOn(client, databaseUrl);
    const kept = await keep(spicesDiscountWithItsHook);
    const [loaded] = await loadOnItsOwnConnection();
    expect(loaded?.toJSON()).to.deep.equal(kept.toJSON());
  });
  it('should run backward to discounts without a hook, their lines passing, and forward again, a hook kept: lossy, every hook is lost', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();
    await migrateForward();
    const { keep, loadOnItsOwnConnection } = discountRepositoryOn(client, databaseUrl);
    const keptBefore = await keep(spicesDiscountWithItsHook);

    await migrateBackward(client, theMigration);

    const { columns } = await constraintsAndColumnsOfTheDiscountsTable(client);
    expect(columns.map((column) => column.name), 'the columns, backward').to.not.include('hook');
    const backward = await client.query('SELECT item FROM app.discounts');
    expect(backward.rows, 'the discount, backward').to.deep.equal([{ item: spicesDiscount.item }]);

    await migrateForward();

    const keptAgain = await keep(spicesDiscountWithItsHook);
    const loaded = await loadOnItsOwnConnection();
    expect(loaded.map((discount) => discount.toJSON()), 'forward again, the first hook lost').to.have.deep.members([
      { id: keptBefore.toJSON().id, ...spicesDiscount },
      keptAgain.toJSON(),
    ]);
  });
  it('should read back with no hook, through the repository, a discount kept before the migration', async () => {
    const sut = await setupSut();
    await sut.migrateForward();
    await migrateBackward(sut.client, theMigration);

    const readBack = await aDiscountKeptBeforeAsReadAfterMigratingForward(sut);

    expect(readBack).to.deep.equal(aDiscountKeptBefore);
  });
  it('should keep and load back, as the deployed version does, a discount without a hook on the migrated table', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();
    await migrateForward();
    const { keep, loadOnItsOwnConnection } = discountRepositoryOn(client, databaseUrl);
    const kept = await keep(spicesDiscount);

    const [loaded] = await loadOnItsOwnConnection();

    expect(loaded?.toJSON()).to.deep.equal(kept.toJSON());
  });
});
