import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type pg from 'pg';
import { onTestFinished } from 'vitest';

import { migrateTestDatabase, migrationsFolder, testDatabaseUrl } from '@sut/support/test-database';

import { connectToTestDatabase } from './test-database';

const databaseOfItsOwn = 'app_migration_test';

const urlOfADatabaseBesideTheTestDatabase = (database: string): string => {
  const url = new URL(testDatabaseUrl);
  url.pathname = `/${database}`;
  return url.toString();
};

// A migration test runs the schema backward and forward again, losing data on the way: it gets a
// database of its own, created empty and dropped when the test finishes, so no other spec sees it.
export const setupSut = async () => {
  const testDatabase = await connectToTestDatabase();
  await testDatabase.query(`DROP DATABASE IF EXISTS ${databaseOfItsOwn} WITH (FORCE)`);
  await testDatabase.query(`CREATE DATABASE ${databaseOfItsOwn}`);
  onTestFinished(async () => {
    await testDatabase.query(`DROP DATABASE ${databaseOfItsOwn} WITH (FORCE)`);
  });
  const databaseUrl = urlOfADatabaseBesideTheTestDatabase(databaseOfItsOwn);
  const client = await connectToTestDatabase(databaseUrl);
  return { client, databaseUrl, migrateForward: () => migrateTestDatabase(client) };
};

const runMigrationFile = async (client: pg.Client, file: string): Promise<void> => {
  await client.query(await readFile(join(migrationsFolder, file), 'utf8'));
};

// The migrator skips every migration whose journal date is not later than the last one it recorded,
// so running one backward also deletes its record, and the next forward run applies it again.
export const migrateBackward = async (client: pg.Client, tag: string): Promise<void> => {
  await runMigrationFile(client, `drizzle-down/${tag}.sql`);
  const journal = JSON.parse(await readFile(join(migrationsFolder, 'meta/_journal.json'), 'utf8')) as { entries: { tag: string; when: number }[] };
  const migration = journal.entries.find((entry) => entry.tag === tag);
  await client.query('DELETE FROM drizzle.__drizzle_migrations WHERE created_at = $1', [migration?.when]);
};

export const migrateBackwardPast = async (client: pg.Client, migration: string, migrationsAfterIt: string[]): Promise<void> => {
  for (const later of migrationsAfterIt.toReversed()) {
    await migrateBackward(client, later);
  }
  await migrateBackward(client, migration);
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
