import type pg from 'pg';
import { describe, expect, it } from 'vitest';

import { setupSutThatTheTestShutsDown } from '../../../support/app';

const otherConnectionsToTheTestDatabase = async (client: pg.Client): Promise<number> => {
  const { rows } = await client.query(
    'SELECT count(*)::int AS connections FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid()',
  );
  return rows.at(0).connections;
};

describe('DatabaseModule', () => {
  describe('shutdown', () => {
    it('should leave no connection open once the application has shut down', async () => {
      const { app, client, http } = await setupSutThatTheTestShutsDown();
      await http.get('/greeting');

      await app.close();

      expect(await otherConnectionsToTheTestDatabase(client)).to.equal(0);
    });
  });
});
