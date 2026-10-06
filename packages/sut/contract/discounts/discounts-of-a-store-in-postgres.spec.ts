import { describe, it } from 'vitest';

describe('the discounts of a store found in PostgreSQL', () => {
  it.todo('should find the kept discounts whose store has that name and that address, leaving out another store\'s');
  it.todo('should leave out a discount of a store with the same name at another address');
  it.todo('should load each discount found with every one of its coupons');
  it.todo('should find nothing for a name and address no kept discount has');

  describe('A2 injection', () => {
    it.todo('should find nothing for a store name and address with quotes, semicolons and SQL keywords, every kept discount and coupon left as it was');
  });
});
