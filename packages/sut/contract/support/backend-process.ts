import { execFileSync, spawn, type ChildProcess } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { onTestFinished } from 'vitest';

import { testDatabaseUrl } from '@sut/support/test-database';

import { waitUntilAnswering } from '../../acceptance/support/node-processes';

const packages = fileURLToPath(new URL('../../../', import.meta.url));
const modules = fileURLToPath(new URL('../../../../node_modules/', import.meta.url));

const buildBackendWhereNoOtherBuildWrites = (): string => {
  const outDir = join(packages, 'sut/dist/contract-backend');
  rmSync(outDir, { recursive: true, force: true });
  execFileSync(process.execPath, [join(modules, 'typescript/bin/tsc'), '-p', 'tsconfig.build.json', '--outDir', outDir], {
    cwd: join(packages, 'backend'),
  });
  return outDir;
};

const asProcessOneOfItsOwnPidNamespaceLikeInTheImage = (commandLine: string[]): string[] => [
  '--user',
  '--map-root-user',
  '--pid',
  '--fork',
  '--kill-child',
  ...commandLine,
];

const childOf = (parent: ChildProcess): number =>
  Number(execFileSync('pgrep', ['--parent', String(parent.pid)], { encoding: 'utf8' }).trim());

export const startBackendAsTheImageDoes = async (port: number) => {
  const backend = spawn('unshare', asProcessOneOfItsOwnPidNamespaceLikeInTheImage([process.execPath, join(buildBackendWhereNoOtherBuildWrites(), 'main.js')]), {
    cwd: join(packages, 'backend'),
    env: { ...process.env, NODE_OPTIONS: '', PORT: String(port), DATABASE_URL: testDatabaseUrl },
    stdio: 'inherit',
  });
  onTestFinished(() => {
    backend.kill('SIGKILL');
  });
  const url = `http://localhost:${port}`;
  await waitUntilAnswering(url);
  return {
    url,
    signal: (signal: NodeJS.Signals) => process.kill(childOf(backend), signal),
    outcomeWithin: (milliseconds: number) =>
      new Promise<string>((resolve) => {
        backend.once('exit', () => resolve('exited'));
        setTimeout(() => resolve('still running'), milliseconds);
      }),
  };
};
