import { describe, it } from 'vitest';

describe('changes to one discount at the same moment', () => {
  describe('A4 concurrency', () => {
    it.todo('should keep both a coupon issued and another coupon redeemed at the same moment');
    it.todo('should keep both of two coupons issued for one discount at the same moment');
    it.todo('should keep a coupon\'s redemption and a change of its discount\'s rate made at the same moment');
    it.todo('should answer each of the changes as it would alone, never refusing one for a change kept meanwhile');
    it.todo('should keep the rate of the later of two changes of rate made at the same moment');
  });
});
