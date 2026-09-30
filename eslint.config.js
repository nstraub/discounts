import importX from 'eslint-plugin-import-x';
import unusedImports from 'eslint-plugin-unused-imports';
import vue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

import { boundaries } from './eslint.boundaries.js';

export default defineConfig(
  { ignores: ['**/node_modules/', '**/dist/', '.yarn/', '.claude/'] },
  {
    files: ['**/*.{ts,vue}'],
    extends: [tseslint.configs.recommended],
    rules: { '@typescript-eslint/no-unused-vars': 'off' },
  },
  {
    files: ['**/*.vue'],
    extends: [vue.configs['flat/recommended']],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    files: ['**/*.{js,ts,vue}'],
    plugins: { 'import-x': importX, 'unused-imports': unusedImports },
    settings: { 'import-x/internal-regex': '^@(backend|frontend|sut|app/types)/' },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['error', { vars: 'all', args: 'after-used' }],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ImportNamespaceSpecifier',
          message: 'Use named imports; the import line says exactly what the file depends on.',
        },
        {
          selector: 'ExportAllDeclaration[exported]',
          message: 'Use named re-exports; the export line says exactly what the file exposes.',
        },
      ],
      'max-lines': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['packages/sut/**', '**/*.{spec,test}.*'],
    rules: { 'max-lines': 'off' },
  },
  boundaries,
);
