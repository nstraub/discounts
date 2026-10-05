const everyFeature = {
  paths: ['acceptance/features/**/*.feature'],
  import: [
    'acceptance/support/**/*.ts',
    'acceptance/features/common/prepare-database.ts',
    'acceptance/features/steps/**/*.ts',
    'acceptance/steps/**/*.ts',
  ],
};

// The regression run: a missing case recorded for later (@todo) and the scenario being built
// (@wip) stay out of it.
export default { ...everyFeature, tags: 'not @todo and not @wip' };

export const wip = { ...everyFeature, tags: '@wip' };
