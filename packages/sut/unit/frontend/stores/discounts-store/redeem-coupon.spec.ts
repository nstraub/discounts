import { describe, expect, it } from 'vitest';

import { spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from './discounts-store-of-an-app';

describe('Store discounts', () => {
  describe('redeeming a coupon', () => {
    it('should hand the code as typed and the store picked over to be redeemed', async () => {
      const { restApi, discounts } = setupSut();
      const atTheSpicesStore = { code: '7k3qx 9m2pd', storeName: spicesDiscount.storeName, storeAddress: spicesDiscount.storeAddress };

      await discounts.redeemCoupon(atTheSpicesStore);

      expect(restApi.post).to.have.been.calledWith('/redemptions', atTheSpicesStore);
    });
    it.todo('should hold what the redemption answers once the coupon is redeemed');

    describe('dependency failure', () => {
      it.todo('should hold that the coupon could not be checked when it cannot be');
    });
  });
});
