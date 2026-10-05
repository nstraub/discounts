import type pg from 'pg';
import { describe, expect, it } from 'vitest';

import { spicesDiscount } from '@sut/support/example-discounts';

import { discountRepositoryOn } from '../support/discount-repository';
import { insertADiscountWithout } from '../support/discounts-table';
import { migrateBackward, setupSut, tableStatus } from '../support/migrations';

const theMigration = '0002_create_discounts';

const theDiscountLinesPassing = {
  listedWhenNoneKept: [],
  loadedBackAsKept: true,
  refusedWithoutEachPiece: ['23502', '23502', '23502', '23502'],
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
  return {
    listedWhenNoneKept,
    loadedBackAsKept: JSON.stringify(loaded?.toJSON()) === JSON.stringify(kept.toJSON()),
    refusedWithoutEachPiece,
  };
};

describe('the migration that adds the discounts table', () => {
  it.todo('should migrate forward from empty, the discount round-trip, query and constraint lines passing on the result');
  it('should run backward to the walking skeleton\'s schema, its greeting lines passing, and forward again, the discount lines passing: lossy, every discount is lost', async () => {
    const { client, databaseUrl, migrateForward } = await setupSut();
    await migrateForward();
    await discountRepositoryOn(client, databaseUrl).keep(spicesDiscount);

    await migrateBackward(client, theMigration);

    expect(await tableStatus(client, 'app.discounts'), 'the discounts table, backward').to.equal(null);
    const greetings = await client.query('SELECT text FROM app.greetings');
    expect(greetings.rows, "the walking skeleton's greeting, backward").to.deep.equal([{ text: 'Hello from the database' }]);

    await migrateForward();

    expect(await outcomeOfTheDiscountLines(client, databaseUrl), 'forward again, every discount lost').to.deep.equal(theDiscountLinesPassing);
  });
});
