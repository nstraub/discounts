import { Before } from '@cucumber/cucumber';
import pg from 'pg';

import { resetTestDatabase, testDatabaseUrl } from '@sut/support/test-database';

// Each scenario starts from nothing: the sut test database, migrated and emptied.
export const prepareDatabase = async (): Promise<void> => {
  const client = new pg.Client({ connectionString: testDatabaseUrl });
  await client.connect();
  try {
    await resetTestDatabase(client);
  } finally {
    await client.end();
  }
};

Before(prepareDatabase);
