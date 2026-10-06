import { isDeepStrictEqual } from 'node:util';

import type pg from 'pg';
import { describe, expect, it } from 'vitest';

import { spicesDiscount } from '@sut/support/example-discounts';

import { discountRepositoryOn } from '../support/discount-repository';
import { constraintsAndColumnsOfTheDiscountsTable, insertADiscountWithout } from '../support/discounts-table';
import { migrateBackwardPast, setupSut, tableStatus } from '../support/migrations';

const theMigration = '0002_create_discounts';

const theMigrationsAfterIt = ['0003_rate_as_written', '0004_add_discount_hook', '0005_create_coupons', '0006_let_a_coupon_be_redeemed'];

const theDiscountLinesPassing = {
  listedWhenNoneKept: [],
  loadedBackAsKept: true,
  refusedWithoutEachPiece: ['23502', '23502', '23502', '23502'],
  constraints: [{ kind: 'p' }],
  columns: [
    { name: 'hook', type: 'text', nullable: 'YES' },
    { name: 'id', type: 'text', nullable: 'NO' },
    { name: 'item', type: 'text', nullable: 'NO' },
    { name: 'rate', type: 'text', nullable: 'NO' },
    { name: 'store_address', type: 'text', nullable: 'NO' },
    { name: 'store_name', type: 'text', nullable: 'NO' },
  ],
};

const outcomeOfTheDiscountLines = async (client: pg.Client, databaseUrl: string) => {
  const { repository, keep, loadOnItsOwnConnection } = discountRepositoryOn(client, databaseUrl);
  const listedWhenNoneKept = await repository.all();
  const kept = await keep(spicesDiscount);
  const [loaded] = await loadOnItsOwnConnection();
  const refusedWithoutEachPiece = [];
  for (const piece of ['item', 'rate', 'store_name', 'store_address'] as const) {
    refusedWithoutEachPiece.push(await insertADiscountWithout(client, piece));
  }
  const { constraints, columns } = await constraintsAndColumnsOfTheDiscountsTable(client);
  return {
    listedWhenNoneKept,
    loadedBackAsKept: isDeepStrictEqual(loaded?.toJSON(), kept.toJSON()),
    refusedWithoutEachPiece,
    constraints,
    columns: columns.toSorted((one, other) => one.name.localeCompare(other.name)),
  };
};

describe('the migration that adds the discounts table', () => {
  it('should migrate forward from empty, the discount round-trip, query and constraint lines passing on the result', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();

    await migrateForward();

    expect(await outcomeOfTheDiscountLines(client, databaseUrl)).to.deep.equal(theDiscountLinesPassing);
  });
  it('should run backward to the walking skeleton\'s schema, its greeting lines passing, and forward again, the discount lines passing: lossy, every discount is lost', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();
    await migrateForward();
    await discountRepositoryOn(client, databaseUrl).keep(spicesDiscount);

    await migrateBackwardPast(client, theMigration, theMigrationsAfterIt);

    expect(await tableStatus(client, 'app.discounts'), 'the discounts table, backward').to.equal(null);
    const greetings = await client.query('SELECT text FROM app.greetings');
    expect(greetings.rows, "the walking skeleton's greeting, backward").to.deep.equal([{ text: 'Hello from the database' }]);

    await migrateForward();

    expect(await outcomeOfTheDiscountLines(client, databaseUrl), 'forward again, every discount lost').to.deep.equal(theDiscountLinesPassing);
  });
});
