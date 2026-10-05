import type pg from 'pg';
import { describe, expect, it } from 'vitest';

import { setupSut } from '../support/discount-repository';

const aDiscountRow = { id: "'constraint-id'", item: "'Peruvian spices'", rate: '20', store_name: "'Mike''s Groceries'", store_address: "'12 Market Street'" };

const insertADiscountWithout = (client: pg.Client, missing: keyof typeof aDiscountRow): Promise<string> => {
  const given = Object.entries(aDiscountRow).filter(([column]) => column !== missing);
  const columns = given.map(([column]) => column).join(', ');
  const values = given.map(([, value]) => value).join(', ');
  return client.query(`INSERT INTO app.discounts (${columns}) VALUES (${values})`).then(
    () => 'accepted',
    (refusal: { code: string }) => refusal.code,
  );
};

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
  it.todo('should refuse a discount without a store address: 23502, NOT NULL mirrors "a discount names its store\'s address"');
  it.todo('should trace every constraint to a rule of Discount: no length cap on text, no CHECK on the rate');
});
