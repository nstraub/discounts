import { fileURLToPath } from 'node:url';

import { createNodeResolver } from 'eslint-plugin-import-x';

const backend = 'packages/backend/src';
const application = `${backend}/*/application`;

const frameworkPackages = {
  group: ['@nestjs/*', 'eventemitter2'],
  message: 'application/ stays framework-free, types included: the context module in infra/ builds every provider with new.',
};
const databasePackages = {
  group: ['drizzle-orm', 'drizzle-orm/*', 'pg'],
  message: 'application/ makes no database calls; persistence lives in infra/.',
};

/** The layer boundaries of AGENTS.md §1, §4 and §5, enforced on every import. */
export const boundaries = [
  {
    files: ['**/*.{js,ts,vue}'],
    settings: {
      'import-x/resolver-next': [
        createNodeResolver({
          tsconfig: { configFile: fileURLToPath(new URL('tsconfig/paths.json', import.meta.url)) },
          extensions: ['.ts', '.vue', '.js', '.mjs', '.json'],
          extensionAlias: { '.js': ['.ts', '.js'] },
        }),
      ],
    },
    rules: {
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            { target: `${application}/**`, from: `${backend}/*/infra/**`, message: 'application/ never imports infra/.' },
            { target: 'packages/frontend/**', from: 'packages/backend/**', message: 'The frontend never imports the backend.' },
            { target: 'packages/backend/**', from: 'packages/frontend/**', message: 'The backend never imports the frontend.' },
            { target: 'packages/!(sut)/**', from: 'packages/sut/**', message: 'Only the system under test imports from sut.' },
          ],
        },
      ],
    },
  },
  {
    files: [`${application}/**/*.ts`],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        { patterns: [frameworkPackages, databasePackages] },
      ],
    },
  },
];
