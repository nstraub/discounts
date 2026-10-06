import type pg from 'pg';

import { discountRepositoryOn } from './discount-repository';

const aDiscountRow = { id: "'constraint-id'", item: "'Peruvian spices'", rate: "'20'", store_name: "'Mike''s Groceries'", store_address: "'12 Market Street'", hook: "'Our spices now come from a new supplier'" };

export const insertADiscountWithout = (client: pg.Client, missing: keyof typeof aDiscountRow): Promise<string> => {
  const given = Object.entries(aDiscountRow).filter(([column]) => column !== missing);
  const columns = given.map(([column]) => column).join(', ');
  const values = given.map(([, value]) => value).join(', ');
  return client.query(`INSERT INTO app.discounts (${columns}) VALUES (${values})`).then(
    () => 'accepted',
    (refusal: { code: string }) => refusal.code,
  );
};

export const constraintsAndColumnsOfTheDiscountsTable = async (client: pg.Client) => {
  const constraints = await client.query("SELECT contype AS kind FROM pg_constraint WHERE conrelid = 'app.discounts'::regclass");
  const columns = await client.query(
    "SELECT column_name AS name, data_type AS type, is_nullable AS nullable FROM information_schema.columns WHERE table_schema = 'app' AND table_name = 'discounts'",
  );
  return { constraints: constraints.rows, columns: columns.rows };
};

export const aDiscountKeptBefore = { id: 'kept-before', item: 'Saffron', rate: '12.5', storeName: 'Corner Grocery', storeAddress: '3 Hill Road' };

const insertADiscountKeptBefore = async (client: pg.Client): Promise<void> => {
  const { id, item, rate, storeName, storeAddress } = aDiscountKeptBefore;
  await client.query('INSERT INTO app.discounts (id, item, rate, store_name, store_address) VALUES ($1, $2, $3, $4, $5)', [id, item, rate, storeName, storeAddress]);
};

export const aDiscountKeptBeforeAsReadAfterMigratingForward = async (sut: { client: pg.Client; databaseUrl: string; migrateForward: () => Promise<void> }) => {
  await insertADiscountKeptBefore(sut.client);
  await sut.migrateForward();
  const [loaded] = await discountRepositoryOn(sut.client, sut.databaseUrl).loadOnItsOwnConnection();
  return loaded?.toJSON();
};
