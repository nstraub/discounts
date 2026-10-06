import { describe, it } from 'vitest';

describe('the migration that adds the hook to discounts', () => {
  it.todo('should migrate forward from empty, a discount with a hook kept and loaded back');
  it.todo('should run backward to discounts without a hook, their lines passing, and forward again, a hook kept: lossy, every hook is lost');
  it.todo('should read back with no hook, through the repository, a discount kept before the migration');
  it.todo('should keep and load back, as the deployed version does, a discount without a hook on the migrated table');
});
