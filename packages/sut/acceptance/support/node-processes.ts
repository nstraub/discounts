import { execFileSync, spawn, type ChildProcess } from 'node:child_process';

const answerTimeout = 60_000;
const running: ChildProcess[] = [];

// NODE_OPTIONS=--import=tsx is how cucumber loads the steps; a child inheriting it would run
// under tsx, whose transpiler drops the decorator metadata NestJS injects by.
const environmentWith = (variables: Record<string, string>): NodeJS.ProcessEnv => ({
  ...process.env,
  NODE_OPTIONS: '',
  ...variables,
});

export const runNodeToCompletion = (commandLine: string[], cwd: string): void => {
  execFileSync(process.execPath, commandLine, { cwd, env: environmentWith({}), stdio: 'inherit' });
};

export const startNode = (commandLine: string[], cwd: string, variables: Record<string, string>): void => {
  running.push(spawn(process.execPath, commandLine, { cwd, env: environmentWith(variables), stdio: 'inherit' }));
};

export const stopEveryStartedNode = (): void => {
  running.forEach((child) => child.kill());
};

export const waitUntilAnswering = async (url: string): Promise<void> => {
  const deadline = Date.now() + answerTimeout;
  while (Date.now() < deadline) {
    const answered = await fetch(url).then(() => true, () => false);
    if (answered) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`${url} did not answer within ${answerTimeout} ms`);
};
