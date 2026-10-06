import { describe, it } from 'vitest';

describe('the migration that adds the coupons table', () => {
  it.todo('should migrate forward from empty, the coupon round-trip and constraint lines passing on the result');
  it.todo('should run backward to discounts without coupons, their lines passing, and forward again, the coupon lines passing: lossy, every coupon is lost');
  it.todo('should read back, through the repository, a discount kept before the migration, with no coupon');
  it.todo('should keep and load back, as the deployed version does, a discount on the migrated schema');
});
