export default {
  paths: ['acceptance/features/**/*.feature'],
  import: [
    'acceptance/support/**/*.ts',
    'acceptance/features/common/prepare-database.ts',
    'acceptance/features/steps/**/*.ts',
    'acceptance/steps/**/*.ts',
  ],
};
