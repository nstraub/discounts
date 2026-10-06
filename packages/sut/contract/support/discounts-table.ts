import type pg from 'pg';

import { spicesDiscount } from '@sut/support/example-discounts';

import { discountRepositoryOn } from './discount-repository';
import { migrateBackwardPast } from './migrations';

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

export const insertACoupon = (client: pg.Client, coupon: { token?: string; discount_id?: string; redeemed?: boolean }): Promise<string> => {
  const given = Object.entries(coupon);
  const columns = given.map(([column]) => column).join(', ');
  const placeholders = given.map((_, index) => `$${index + 1}`).join(', ');
  return client.query(`INSERT INTO app.coupons (${columns}) VALUES (${placeholders})`, given.map(([, value]) => value)).then(
    () => 'accepted',
    (refusal: { code: string }) => refusal.code,
  );
};

export const theDiscountsKept = async (client: pg.Client) => (await client.query('SELECT id, item, rate, store_name, store_address FROM app.discounts')).rows;

export const theCouponsKept = async (client: pg.Client) =>
  (await client.query('SELECT token, redeemed, counted FROM app.coupons ORDER BY token COLLATE "C"')).rows;

export const keptUnused = (token: string) => ({ token, redeemed: false, counted: false });

export const theDiscountsAndCouponsKept = async (client: pg.Client) => ({ discounts: await theDiscountsKept(client), coupons: await theCouponsKept(client) });

export const theRowKeptFor = (published: { id: string }, discount: typeof spicesDiscount) => ({
  id: published.id,
  item: discount.item,
  rate: discount.rate,
  store_name: discount.storeName,
  store_address: discount.storeAddress,
});

export const keptAsIssued = ({ published, code, other }: { published: { id: string }; code: string; other: string }) => ({
  discounts: [theRowKeptFor(published, spicesDiscount)],
  coupons: [code, other].sort().map(keptUnused),
});

export const constraintsAndColumnsOfTheDiscountsTable = async (client: pg.Client) => {
  const constraints = await client.query("SELECT contype AS kind FROM pg_constraint WHERE conrelid = 'app.discounts'::regclass");
  const columns = await client.query(
    "SELECT column_name AS name, data_type AS type, is_nullable AS nullable FROM information_schema.columns WHERE table_schema = 'app' AND table_name = 'discounts'",
  );
  return { constraints: constraints.rows, columns: columns.rows };
};

export const aDiscountKeptBefore = { id: 'kept-before', item: 'Saffron', rate: '12.5', storeName: 'Corner Grocery', storeAddress: '3 Hill Road' };

export const insertADiscountRow = async (client: pg.Client, discount: typeof aDiscountKeptBefore): Promise<void> => {
  const { id, item, rate, storeName, storeAddress } = discount;
  await client.query('INSERT INTO app.discounts (id, item, rate, store_name, store_address) VALUES ($1, $2, $3, $4, $5)', [id, item, rate, storeName, storeAddress]);
};

export const aDiscountKeptAndLoadedBackAfterMigratingForward = async (sut: { client: pg.Client; databaseUrl: string; migrateForward: () => Promise<void> }) => {
  await sut.migrateForward();
  const { keep, loadOnItsOwnConnection } = discountRepositoryOn(sut.client, sut.databaseUrl);
  const kept = await keep(spicesDiscount);
  const [loaded] = await loadOnItsOwnConnection();
  return { kept: kept.toJSON(), loaded: loaded?.toJSON() };
};

export const aDiscountKeptBeforeAsReadAfterMigratingForward = async (sut: { client: pg.Client; databaseUrl: string; migrateForward: () => Promise<void> }) => {
  await insertADiscountRow(sut.client, aDiscountKeptBefore);
  await sut.migrateForward();
  const [loaded] = await discountRepositoryOn(sut.client, sut.databaseUrl).loadOnItsOwnConnection();
  return loaded?.toJSON();
};

export const aDiscountKeptBeforeTheMigrationAsReadAfterIt = async (
  sut: { client: pg.Client; databaseUrl: string; migrateForward: () => Promise<void> },
  migration: string,
  migrationsAfterIt: string[],
) => {
  await sut.migrateForward();
  await migrateBackwardPast(sut.client, migration, migrationsAfterIt);
  return aDiscountKeptBeforeAsReadAfterMigratingForward(sut);
};
