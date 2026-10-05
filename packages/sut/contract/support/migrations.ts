import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type pg from 'pg';
import { onTestFinished } from 'vitest';

import { migrateTestDatabase, migrationsFolder } from '@sut/support/test-database';

import { connectToTestDatabase } from './test-database';

const dropSchemas = 'DROP SCHEMA IF EXISTS app CASCADE; DROP SCHEMA IF EXISTS drizzle CASCADE;';

// A migration test leaves the schema half-migrated, with or without the journal that records it: it
// drops both when it finishes, so the next spec file migrates from nothing.
export const setupSut = async () => {
  const client = await connectToTestDatabase();
  await client.query(dropSchemas);
  onTestFinished(async () => {
    await client.query(dropSchemas);
  });
  return { client, migrateForward: () => migrateTestDatabase(client) };
};

export const runMigrationFile = async (client: pg.Client, file: string): Promise<void> => {
  await client.query(await readFile(join(migrationsFolder, file), 'utf8'));
};

/**
 * Whether a table exists.
 * @param client the test database client.
 * @param table the schema-qualified table name, as in `app.my_table`.
 * @returns the table's name when it exists, null otherwise.
 */
export const tableStatus = async (client: pg.Client, table: string) => {
  const { rows } = await client.query(`SELECT to_regclass($1)::text AS "table"`, [table]);
  return rows.at(0).table as string | null;
};
