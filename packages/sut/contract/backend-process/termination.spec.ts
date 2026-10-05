import type pg from 'pg';
import { describe, expect, it } from 'vitest';

import { resetTestDatabase } from '@sut/support/test-database';

import { startBackendAsTheImageDoes } from '../support/backend-process';
import { connectToTestDatabase } from '../support/test-database';

const backendPort = 3190;
const wellInsideDockersTenSecondGrace = 5_000;

const otherConnectionsToTheTestDatabase = async (client: pg.Client): Promise<number> => {
  const { rows } = await client.query(
    'SELECT count(*)::int AS connections FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid()',
  );
  return rows.at(0).connections;
};

describe('the backend process', () => {
  it('should close its connections and exit when it is told to terminate', { timeout: 60_000 }, async () => {
    const client = await connectToTestDatabase();
    await resetTestDatabase(client);
    const backend = await startBackendAsTheImageDoes(backendPort);
    await fetch(`${backend.url}/greeting`);

    backend.signal('SIGTERM');

    expect(await backend.outcomeWithin(wellInsideDockersTenSecondGrace)).to.equal('exited');
    expect(await otherConnectionsToTheTestDatabase(client)).to.equal(0);
  });
});
