import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AfterAll, BeforeAll } from '@cucumber/cucumber';

import { testDatabaseUrl } from '@sut/support/test-database';

import { runNodeToCompletion, startNode, stopEveryStartedNode, waitUntilAnswering } from './node-processes.js';

export const acceptancePort = 5180;

export const backendAcceptancePort = 3180;

const packages = fileURLToPath(new URL('../../../', import.meta.url));
const modules = fileURLToPath(new URL('../../../../node_modules/', import.meta.url));
const startupTimeout = 120_000;

// Its own output directory: `yarn build` may write the backend's dist/ while the scenarios run (pre-push),
// and inside the repository, so Node resolves the backend's packages from node_modules.
const buildBackendOutsideItsDist = (): string => {
  const outDir = join(packages, 'sut/dist/acceptance-backend');
  rmSync(outDir, { recursive: true, force: true });
  runNodeToCompletion(
    [join(modules, 'typescript/bin/tsc'), '-p', 'tsconfig.build.json', '--outDir', outDir],
    join(packages, 'backend'),
  );
  return outDir;
};

BeforeAll({ timeout: startupTimeout }, async () => {
  const frontendUrl = `http://localhost:${acceptancePort}`;
  const backendUrl = `http://localhost:${backendAcceptancePort}`;
  startNode([join(buildBackendOutsideItsDist(), 'main.js')], join(packages, 'backend'), {
    PORT: String(backendAcceptancePort),
    FRONTEND_URL: frontendUrl,
    DATABASE_URL: testDatabaseUrl,
  });
  startNode(
    [join(modules, 'vite/bin/vite.js'), '--port', String(acceptancePort)],
    join(packages, 'frontend'),
    { VITE_API_URL: backendUrl },
  );
  await Promise.all([waitUntilAnswering(backendUrl), waitUntilAnswering(frontendUrl)]);
});

AfterAll(stopEveryStartedNode);
