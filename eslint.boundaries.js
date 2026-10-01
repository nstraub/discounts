import { fileURLToPath } from 'node:url';

import { createNodeResolver } from 'eslint-plugin-import-x';

/** The package boundaries, enforced on every import. */
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
            { target: 'packages/frontend/**', from: 'packages/backend/**', message: 'The frontend never imports the backend.' },
            { target: 'packages/backend/**', from: 'packages/frontend/**', message: 'The backend never imports the frontend.' },
            { target: 'packages/!(sut)/**', from: 'packages/sut/**', message: 'Only the system under test imports from sut.' },
          ],
        },
      ],
    },
  },
];
