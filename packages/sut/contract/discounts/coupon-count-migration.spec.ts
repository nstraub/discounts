import { describe, it } from 'vitest';

describe('the migration that lets a discount\'s sales be counted', () => {
  it.todo('should migrate forward from empty, the counted-sales round-trip lines passing on the result');
  it.todo('should run backward to sales that cannot be counted, their lines passing, and forward again, the count lines passing: lossy, every count is lost and the sales counted before count again');
  it.todo('should count, in the first count after the migration, the coupons redeemed before it');
  it.todo('should keep and load back, as the deployed version does, a discount with a redeemed coupon on the migrated schema');
});
