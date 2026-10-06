import { describe, it } from 'vitest';

describe('the migration that lets a coupon be redeemed', () => {
  it.todo('should migrate forward from empty, the redeemed-coupon round-trip lines passing on the result');
  it.todo('should run backward to coupons that cannot be redeemed, their lines passing, and forward again, the redemption lines passing: lossy, every use is lost');
  it.todo('should read back unused, through the repository, a coupon issued before the migration');
  it.todo('should keep and load back, as the deployed version does, a discount with its coupons on the migrated schema');
});
