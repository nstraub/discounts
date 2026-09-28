import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

const fromSut = (path: string): string => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  // SWC 1.16 rejects the tsconfig's es2025 target; esnext leaves syntax as written, which Node 26 runs.
  plugins: [vue(), swc.vite({ jsc: { target: 'esnext' } })],
  resolve: {
    alias: [
      { find: '@backend/app/mocks', replacement: fromSut('./unit/backend/app/mocks') },
      { find: '@backend', replacement: fromSut('../backend/src') },
      { find: '@frontend', replacement: fromSut('../frontend/src') },
      { find: '@sut', replacement: fromSut('.') },
    ],
  },
  test: {
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['unit/**/*.spec.ts'],
          environment: 'jsdom',
          setupFiles: ['unit/setup.ts'],
        },
      },
      {
        extends: true,
        // Every contract test shares the one test database, so contract files run one at a time.
        test: { name: 'contract', include: ['contract/**/*.spec.ts'], environment: 'node', fileParallelism: false },
      },
    ],
  },
});
