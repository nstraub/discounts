import { fileURLToPath } from 'node:url';

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import type pg from 'pg';

process.loadEnvFile(fileURLToPath(new URL('../.env', import.meta.url)));

const databaseUrlFromEnv = (): string => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('packages/sut/.env names no DATABASE_URL for the test database');
  }
  return url;
};

/** The sut test database (app_test), from packages/sut/.env. */
export const testDatabaseUrl = databaseUrlFromEnv();

export const migrationsFolder = fileURLToPath(
  new URL('../../backend/src/app/infra/migrations', import.meta.url),
);

// Names no table, so it holds from before the first migration on. CASCADE because Postgres refuses to
// truncate a table another table's foreign key refers to unless that table is emptied too.
const emptyEveryTableOfTheAppSchema = `DO $$
DECLARE tables text;
BEGIN
  SELECT string_agg(format('%I.%I', schemaname, tablename), ', ') INTO tables
    FROM pg_tables WHERE schemaname = 'app';
  IF tables IS NOT NULL THEN
    EXECUTE 'TRUNCATE ' || tables || ' CASCADE';
  END IF;
END $$`;

export const migrateTestDatabase = (client: pg.Client): Promise<void> => migrate(drizzle(client), { migrationsFolder });

/** Brings the test database to the latest schema and empties every table of its app schema. */
export const resetTestDatabase = async (client: pg.Client): Promise<void> => {
  await migrateTestDatabase(client);
  await client.query(emptyEveryTableOfTheAppSchema);
};
