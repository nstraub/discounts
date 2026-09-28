import pg from 'pg';
import { onTestFinished } from 'vitest';

import { testDatabaseUrl } from '@sut/support/test-database';

export const connectToTestDatabase = async (): Promise<pg.Client> => {
  const client = new pg.Client({ connectionString: testDatabaseUrl });
  await client.connect();
  onTestFinished(() => client.end());
  return client;
};
